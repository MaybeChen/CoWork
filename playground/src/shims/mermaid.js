const mermaidShim = {
  initialize() {},
  async render(id, source) {
    const safeId = String(id || 'mermaid-shim')
    const text = String(source || '')
    const escaped = text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')

    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 120" role="img" aria-label="Mermaid placeholder"><rect x="0" y="0" width="560" height="120" rx="10" fill="#0f172a" stroke="#334155"/><text x="16" y="28" fill="#93c5fd" font-size="14" font-family="sans-serif">mermaid (shim)</text><text x="16" y="52" fill="#cbd5e1" font-size="12" font-family="monospace">id: ${safeId}</text><text x="16" y="76" fill="#94a3b8" font-size="12" font-family="monospace">${escaped.slice(0, 80)}</text></svg>`,
    }
  },
}

export default mermaidShim
