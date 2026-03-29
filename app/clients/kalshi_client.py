"""
Kalshi Client for Pelican AI

Market data endpoints are PUBLIC — no authentication required.
Auth (RSA-PSS) only needed for trading/portfolio (not implemented here).

Base URL: https://api.elections.kalshi.com/trade-api/v2
NOTE: Despite "elections" subdomain, this covers ALL Kalshi markets
(economics, climate, tech, crypto, politics, etc.)

Provides:
- Event and market listings with current odds
- Orderbook data (depth, spread)
- Series metadata (categories, resolution rules)
- Market search and filtering

Used by:
- Universe Engine (daily refresh: prediction market odds alongside token data)
- Arb Tracker (Polymarket vs Kalshi spread detection)
- Conversational AI ("what does Kalshi say about Fed rate cuts?")
- Strategy Farm (prediction-to-token templates, convergence trades)

Usage:
    from app.clients.kalshi_client import get_kalshi_client

    client = get_kalshi_client()
    markets = client.get_all_active_markets()               # All active markets
    fed = client.search_markets("fed rate")                  # Search by keyword
    arb = client.build_arb_opportunities(polymarket_markets) # Cross-platform spreads
"""

import os
import time
import logging
import requests
from typing import Optional, Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)

ENABLE_KALSHI = os.getenv("ENABLE_KALSHI", "true").lower() == "true"

# Public API — no auth for market data
BASE_URL = "https://api.elections.kalshi.com/trade-api/v2"

# Categories we track for the Universe Engine
TRACKED_CATEGORIES = [
    "Economics",     # Fed rates, CPI, GDP, unemployment
    "Climate",       # Temperature, weather events
    "Crypto",        # BTC price targets, ETH milestones
    "Politics",      # Elections, policy, tariffs
    "Tech",          # AI, company events
    "Finance",       # Market levels, VIX, earnings
]

# Series we specifically track for cross-referencing with tokens/equities
TRACKED_SERIES = [
    "KXFEDRATE",     # Fed rate decisions
    "KXCPI",         # CPI readings
    "KXGDP",         # GDP
    "KXBTC",         # Bitcoin price milestones
    "KXETH",         # Ethereum price milestones
    "KXINX",         # S&P 500 levels
    "KXRECESSION",   # US recession
    "KXUNEMPLOY",    # Unemployment rate
]


class KalshiClient:
    """
    Client for Kalshi's public market data API.

    All market data endpoints are unauthenticated.
    Auth would only be needed for trading (not implemented).
    """

    def __init__(self, timeout: int = 30):
        self.base_url = BASE_URL
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/json",
            "User-Agent": "PelicanAI/1.0"
        })
        self._cache: Dict[str, tuple] = {}

        logger.info("KalshiClient initialized (base_url=%s, public/no-auth)", self.base_url)

    def _get(self, endpoint: str, params: dict = None, cache_ttl: int = 0) -> Optional[Any]:
        """
        GET request to Kalshi API with optional caching.

        Args:
            endpoint: API path (e.g., '/markets')
            params: Query parameters
            cache_ttl: Cache duration in seconds. 0 = no cache.
        """
        cache_key = f"{endpoint}:{str(params)}"
        if cache_ttl > 0 and cache_key in self._cache:
            data, expiry = self._cache[cache_key]
            if time.time() < expiry:
                return data

        url = f"{self.base_url}{endpoint}"

        try:
            response = self.session.get(url, params=params, timeout=self.timeout)

            if response.status_code == 429:
                logger.warning("Kalshi rate limited on %s, waiting 5s", endpoint)
                time.sleep(5)
                response = self.session.get(url, params=params, timeout=self.timeout)

            if response.status_code != 200:
                logger.error("Kalshi API error %d on %s", response.status_code, endpoint)
                return None

            data = response.json()

            if cache_ttl > 0:
                self._cache[cache_key] = (data, time.time() + cache_ttl)

            return data

        except requests.exceptions.Timeout:
            logger.error("Kalshi timeout on %s", endpoint)
            return None
        except requests.exceptions.ConnectionError:
            logger.error("Kalshi connection error on %s", endpoint)
            return None
        except Exception as e:
            logger.error("Kalshi error on %s: %s", endpoint, e)
            return None

    def clear_cache(self):
        """Clear all cached data."""
        self._cache.clear()

    # ---------------------------------------------------------
    # MARKETS
    # ---------------------------------------------------------

    def get_markets(self, status: str = "open", series_ticker: str = None,
                    event_ticker: str = None, limit: int = 200, cursor: str = None) -> Optional[Dict]:
        """
        Get markets with optional filters.

        Args:
            status: 'open', 'closed', 'settled', or omit for all
            series_ticker: Filter by series (e.g., 'KXFEDRATE')
            event_ticker: Filter by event
            limit: Results per page (max 200)
            cursor: Pagination cursor

        Returns:
            {'markets': [...], 'cursor': '...'} or None
        """
        params = {"limit": limit}
        if status:
            params["status"] = status
        if series_ticker:
            params["series_ticker"] = series_ticker
        if event_ticker:
            params["event_ticker"] = event_ticker
        if cursor:
            params["cursor"] = cursor

        return self._get("/markets", params=params, cache_ttl=300)

    def get_market(self, ticker: str) -> Optional[Dict]:
        """
        Get details for a specific market.

        Args:
            ticker: Market ticker (e.g., 'KXFEDRATE-26JUN-T4.25')

        Returns:
            {'market': {...}} with title, yes_bid, volume, etc.
        """
        data = self._get(f"/markets/{ticker}", cache_ttl=120)
        if data and 'market' in data:
            return data['market']
        return data

    def get_all_active_markets(self) -> List[Dict]:
        """
        Get ALL active/open markets (handles pagination).

        Returns:
            Full list of all open markets
        """
        all_markets = []
        cursor = None

        while True:
            data = self.get_markets(status="open", limit=200, cursor=cursor)
            if not data or 'markets' not in data:
                break

            markets = data['markets']
            if not markets:
                break

            all_markets.extend(markets)
            cursor = data.get('cursor')

            if not cursor:
                break

            time.sleep(0.2)  # Be polite

        logger.info("Kalshi: fetched %d active markets", len(all_markets))
        return all_markets

    # ---------------------------------------------------------
    # EVENTS & SERIES
    # ---------------------------------------------------------

    def get_event(self, event_ticker: str) -> Optional[Dict]:
        """Get details for a specific event."""
        data = self._get(f"/events/{event_ticker}", cache_ttl=300)
        if data and 'event' in data:
            return data['event']
        return data

    def get_series(self, series_ticker: str) -> Optional[Dict]:
        """Get series metadata."""
        data = self._get(f"/series/{series_ticker}", cache_ttl=3600)
        if data and 'series' in data:
            return data['series']
        return data

    # ---------------------------------------------------------
    # ORDERBOOK
    # ---------------------------------------------------------

    def get_orderbook(self, ticker: str) -> Optional[Dict]:
        """
        Get orderbook for a market.

        Returns:
            {'orderbook_fp': {'yes_dollars': [[price, qty], ...], 'no_dollars': [[price, qty], ...]}}

        Note: Kalshi only returns bids. In binary markets, a YES bid at $0.65
        is equivalent to a NO ask at $0.35. The orderbook is reciprocal.
        """
        return self._get(f"/markets/{ticker}/orderbook", cache_ttl=30)

    # ---------------------------------------------------------
    # SEARCH & FILTER
    # ---------------------------------------------------------

    def search_markets(self, query: str, status: str = "open") -> List[Dict]:
        """
        Search markets by keyword in title.

        Args:
            query: Search term (e.g., "fed rate", "bitcoin", "recession")
            status: Market status filter

        Returns:
            List of matching markets
        """
        all_markets = self.get_all_active_markets()
        query_lower = query.lower()

        return [
            m for m in all_markets
            if query_lower in (m.get('title', '') or '').lower()
            or query_lower in (m.get('subtitle', '') or '').lower()
            or query_lower in (m.get('event_ticker', '') or '').lower()
            or query_lower in (m.get('series_ticker', '') or '').lower()
        ]

    def get_markets_by_category(self, category: str) -> List[Dict]:
        """
        Get active markets filtered by category.

        Args:
            category: Category name (e.g., 'Economics', 'Crypto', 'Politics')
        """
        all_markets = self.get_all_active_markets()
        cat_lower = category.lower()

        return [
            m for m in all_markets
            if cat_lower in (m.get('category', '') or '').lower()
        ]

    # ---------------------------------------------------------
    # UNIVERSE ENGINE HELPERS
    # ---------------------------------------------------------

    def get_prediction_snapshot(self) -> Dict[str, Any]:
        """
        Pull all data needed for the Universe Engine prediction market snapshot.

        Returns structured data ready for the compute layer:
        - All active markets with odds, volume, category
        - Tracked series with current pricing
        """
        result = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'errors': [],
        }

        # Get all active markets
        markets = self.get_all_active_markets()
        if markets:
            result['markets'] = markets
            result['market_count'] = len(markets)

            # Extract simplified market data for Universe Engine
            result['market_summary'] = [
                {
                    'ticker': m.get('ticker'),
                    'title': m.get('title'),
                    'subtitle': m.get('subtitle'),
                    'category': m.get('category', ''),
                    'event_ticker': m.get('event_ticker'),
                    'series_ticker': m.get('series_ticker', ''),
                    'yes_bid': m.get('yes_bid_dollars') or m.get('yes_bid'),
                    'yes_ask': m.get('yes_ask_dollars') or m.get('yes_ask'),
                    'last_price': m.get('last_price_dollars') or m.get('last_price'),
                    'volume': m.get('volume_fp') or m.get('volume', 0),
                    'open_interest': m.get('open_interest_fp') or m.get('open_interest', 0),
                    'close_time': m.get('close_time'),
                    'expiration_time': m.get('expiration_time'),
                }
                for m in markets
            ]
        else:
            result['markets'] = []
            result['market_count'] = 0
            result['market_summary'] = []
            result['errors'].append('markets: no data returned')

        # Get tracked series details
        tracked = {}
        for series_ticker in TRACKED_SERIES:
            try:
                series = self.get_series(series_ticker)
                if series:
                    tracked[series_ticker] = series
            except Exception as e:
                result['errors'].append(f"series {series_ticker}: {e}")

        result['tracked_series'] = tracked
        result['success'] = len(result['errors']) == 0

        logger.info("Kalshi snapshot: %d markets, %d tracked series, %d errors",
                    result['market_count'], len(tracked), len(result['errors']))

        return result

    def get_market_for_comparison(self, question_keywords: List[str]) -> List[Dict]:
        """
        Find Kalshi markets that match a Polymarket question for arb comparison.

        Args:
            question_keywords: Keywords from a Polymarket question
                             (e.g., ["fed", "rate", "cut", "june"])

        Returns:
            List of matching Kalshi markets with pricing
        """
        all_markets = self.get_all_active_markets()

        matches = []
        for market in all_markets:
            title = (market.get('title', '') + ' ' + market.get('subtitle', '')).lower()

            # Count keyword matches
            match_count = sum(1 for kw in question_keywords if kw.lower() in title)

            if match_count >= 2:  # At least 2 keywords must match
                matches.append({
                    'ticker': market.get('ticker'),
                    'title': market.get('title'),
                    'subtitle': market.get('subtitle'),
                    'kalshi_yes_price': market.get('yes_bid_dollars') or market.get('last_price_dollars'),
                    'volume': market.get('volume_fp') or market.get('volume', 0),
                    'category': market.get('category'),
                    'keyword_matches': match_count,
                })

        # Sort by keyword match count
        matches.sort(key=lambda x: x['keyword_matches'], reverse=True)
        return matches[:5]  # Top 5 matches

    def build_arb_opportunities(self, polymarket_markets: List[Dict],
                                 min_spread: float = 0.05) -> List[Dict]:
        """
        Compare Polymarket and Kalshi odds to find arbitrage opportunities.

        Args:
            polymarket_markets: List of Polymarket markets with 'question' and 'price' fields
            min_spread: Minimum spread (as decimal, e.g., 0.05 = 5%) to flag

        Returns:
            List of arb opportunities with both platform prices and spread
        """
        opportunities = []

        for poly_market in polymarket_markets:
            question = poly_market.get('question', '')
            poly_price = poly_market.get('price', 0)  # 0-1 probability

            if not question or not poly_price:
                continue

            # Extract keywords for matching
            stop_words = {'will', 'the', 'be', 'in', 'a', 'an', 'of', 'to', 'by', 'on', 'for', 'is', 'it', 'at', 'this', 'that', 'or', 'and', 'if'}
            keywords = [w for w in question.lower().split() if w not in stop_words and len(w) > 2]

            # Find matching Kalshi markets
            kalshi_matches = self.get_market_for_comparison(keywords)

            for match in kalshi_matches:
                kalshi_price = match.get('kalshi_yes_price')
                if kalshi_price is None:
                    continue

                # Normalize to 0-1 if Kalshi returns in dollars (0.01-0.99)
                if isinstance(kalshi_price, (int, float)) and kalshi_price > 1:
                    kalshi_price = kalshi_price / 100

                spread = abs(poly_price - kalshi_price)

                if spread >= min_spread:
                    opportunities.append({
                        'polymarket_question': question,
                        'polymarket_price': round(poly_price * 100, 1),
                        'kalshi_title': match.get('title'),
                        'kalshi_ticker': match.get('ticker'),
                        'kalshi_price': round(kalshi_price * 100, 1),
                        'spread_pct': round(spread * 100, 1),
                        'direction': 'Poly higher' if poly_price > kalshi_price else 'Kalshi higher',
                        'poly_volume': poly_market.get('volume', 0),
                        'kalshi_volume': match.get('volume', 0),
                        'category': match.get('category', ''),
                    })

        # Sort by spread descending
        opportunities.sort(key=lambda x: x['spread_pct'], reverse=True)

        logger.info("Arb tracker: %d opportunities found (>%.0f%% spread)",
                    len(opportunities), min_spread * 100)

        return opportunities


# ---------------------------------------------------------
# Singleton
# ---------------------------------------------------------

_client_instance: Optional[KalshiClient] = None


def get_kalshi_client() -> KalshiClient:
    """Get or create the Kalshi client singleton."""
    global _client_instance
    if _client_instance is None:
        _client_instance = KalshiClient()
    return _client_instance
