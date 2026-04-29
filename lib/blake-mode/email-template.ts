export function renderBriefingEmail(headline: string, body: string, setups: Array<{ ticker: string; bias: string; level: number }>): string {
  const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<!DOCTYPE html>
<html><head><style>
  body { font-family: Inter, -apple-system, sans-serif; background: #0B1220; color: #F3F4F6; padding: 32px; }
  h1 { color: #2DD4D4; font-size: 28px; line-height: 1.2; margin: 0 0 16px; }
  .body { font-size: 16px; line-height: 1.6; color: #E5E7EB; }
  .body p { margin: 0 0 16px; }
  .setups { margin-top: 24px; padding: 16px; background: rgba(255,255,255,0.04); border-left: 3px solid #2DD4D4; }
  .setup-row { display: flex; justify-content: space-between; padding: 8px 0; font-family: JetBrains Mono, monospace; font-size: 14px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #9CA3AF; }
</style></head>
<body>
  <h1>${escapeHtml(headline)}</h1>
  <div class="body">${body.split('\n\n').map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>
  <div class="setups">
    <div style="font-size: 14px; color: #9CA3AF; margin-bottom: 8px;">SETUPS WATCHING TODAY</div>
    ${setups.map((setup) => `<div class="setup-row"><span>${escapeHtml(setup.ticker)} (${escapeHtml(setup.bias)})</span><span>${setup.level}</span></div>`).join('')}
  </div>
  <div class="footer">Token Analytix Daily Briefing, powered by Blake Morrow's analysis layer.</div>
</body></html>`
}
