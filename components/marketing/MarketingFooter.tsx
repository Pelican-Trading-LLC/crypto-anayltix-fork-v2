'use client';

import Link from 'next/link';
import { useT } from '@/lib/providers/translation-provider';

export default function MarketingFooter() {
  const t = useT();

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
        </div>
        <div className="footer-copy">
          {t.marketing.footer.copyright}
        </div>
      </div>
      <div className="footer-trust">
        Data encrypted at rest (AES-256) and in transit (TLS). Pelican is not a financial advisor. Not investment advice.
      </div>
    </footer>
  );
}
