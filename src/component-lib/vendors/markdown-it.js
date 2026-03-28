// Lightweight local fallback with markdown-it-compatible API surface: new MarkdownIt().render(text)
function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function parseInline(md) {
  let text = escapeHtml(md)
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>')
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  return text
}

function renderMarkdown(mdText) {
  const lines = String(mdText).replace(/\r\n/g, '\n').split('\n')
  const html = []
  let inUl = false
  let inOl = false
  let inCodeBlock = false
  const closeLists = () => {
    if (inUl) {
      html.push('</ul>')
      inUl = false
    }
    if (inOl) {
      html.push('</ol>')
      inOl = false
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    if (line.startsWith('```')) {
      closeLists()
      if (!inCodeBlock) {
        inCodeBlock = true
        html.push('<pre><code>')
      } else {
        inCodeBlock = false
        html.push('</code></pre>')
      }
      continue
    }

    if (inCodeBlock) {
      html.push(`${escapeHtml(rawLine)}\n`)
      continue
    }

    if (!line) {
      closeLists()
      continue
    }

    if (/^---+$/.test(line) || /^\*\*\*+$/.test(line)) {
      closeLists()
      html.push('<hr />')
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      closeLists()
      const level = heading[1].length
      html.push(`<h${level}>${parseInline(heading[2])}</h${level}>`)
      continue
    }

    const quote = line.match(/^>\s?(.*)$/)
    if (quote) {
      closeLists()
      html.push(`<blockquote>${parseInline(quote[1])}</blockquote>`)
      continue
    }

    const ol = line.match(/^(\d+)\.\s+(.*)$/)
    if (ol) {
      if (!inOl) {
        closeLists()
        inOl = true
        html.push('<ol>')
      }
      html.push(`<li>${parseInline(ol[2])}</li>`)
      continue
    }

    const ul = line.match(/^[-*+]\s+(.*)$/)
    if (ul) {
      if (!inUl) {
        closeLists()
        inUl = true
        html.push('<ul>')
      }
      html.push(`<li>${parseInline(ul[1])}</li>`)
      continue
    }

    closeLists()
    html.push(`<p>${parseInline(line)}</p>`)
  }

  if (inCodeBlock) html.push('</code></pre>')
  closeLists()
  return html.join('')
}

export default class MarkdownIt {
  render(input = '') {
    return renderMarkdown(input)
  }
}
