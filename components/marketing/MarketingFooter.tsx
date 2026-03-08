'use client';

import Link from 'next/link';
export default function MarketingFooter() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-logo">
          <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-white text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #1DA1C4, #178BA8)' }}>CA</div>
          <span>Crypto Analytix</span>
        </div>
        <div className="footer-links">
          <Link href="/terms">Terms of Use</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="#pricing">Pricing</Link>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Crypto Analytix. All rights reserved.
        </div>
      </div>
      <div className="footer-trust">
        Powered by Pelican AI + ForexAnalytix. Data encrypted at rest (AES-256) and in transit (TLS). Not financial advice. Trading involves risk.
      </div>
    </footer>
  );
}
