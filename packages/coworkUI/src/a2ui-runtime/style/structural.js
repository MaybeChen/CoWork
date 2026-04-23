/**
 * Structural utilities and base tokens for A2UI surface styling.
 */
export const structuralStyles = `
.a2ui-surface {
  --a2ui-font: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-family: var(--a2ui-font);
  color: var(--n-90, #0f172a);
}

.a2ui-surface .a2ui-hidden {
  display: none !important;
}

.a2ui-surface .layout-w-100 { width: 100%; }
.a2ui-surface .layout-h-100 { height: 100%; }
.a2ui-surface .layout-d-flex { display: flex; }
.a2ui-surface .layout-d-block { display: block; }
.a2ui-surface .layout-fd-row { flex-direction: row; }
.a2ui-surface .layout-fd-column { flex-direction: column; }
.a2ui-surface .layout-ai-center { align-items: center; }
.a2ui-surface .layout-jc-center { justify-content: center; }
.a2ui-surface .layout-gap-2 { gap: 8px; }
.a2ui-surface .layout-gap-3 { gap: 12px; }

.a2ui-surface .typography-body { font-size: 14px; line-height: 1.6; }
.a2ui-surface .typography-h1 { font-size: 28px; line-height: 1.25; font-weight: 700; }
.a2ui-surface .typography-h2 { font-size: 22px; line-height: 1.3; font-weight: 650; }

.a2ui-surface .color-c-n100 { color: var(--n-90, #0f172a); }
.a2ui-surface .color-c-warning { color: #facc15; }
.a2ui-surface .color-bgc-n10 { background-color: var(--n-10, #f8fafc); }
.a2ui-surface .color-bgc-p30 { background-color: var(--p-30, #2563eb); }

.a2ui-surface .border-br-8 { border-radius: 8px; }
.a2ui-surface .border-br-12 { border-radius: 12px; }
.a2ui-surface .border-bw-1 { border-width: 1px; border-style: solid; }

.a2ui-surface .a2-vw-6 {
  background: #B91C1C;
  color: #FFFFFF;
}
.a2ui-surface .a2-vw-5 {
  background: #F87171;
  color: #450A0A;
}
.a2ui-surface .a2-vw-4 {
  background: #D97706;
  color: #FFFFFF;
}
.a2ui-surface .a2-vw-3 {
  background: #FBBF24;
  color: #451A03;
}
.a2ui-surface .a2-vw-2 {
  background: #15803D;
  color: #FFFFFF;
}
.a2ui-surface .a2-vw-1 {
  background: #4ADE80;
  color: #064E3B;
}
`
