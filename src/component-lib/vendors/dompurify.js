// Lightweight local fallback with DOMPurify-like API surface: DOMPurify.sanitize(html)
function sanitize(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(String(html ?? ''), 'text/html')
  const allowedTags = new Set([
    'A', 'ABBR', 'B', 'BLOCKQUOTE', 'BR', 'CODE', 'DEL', 'DIV', 'EM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'HR', 'I', 'LI', 'OL', 'P', 'PRE', 'S', 'SPAN', 'STRONG', 'SUB', 'SUP', 'U', 'UL',
  ])
  const allowedAttrs = new Set(['href', 'title', 'target', 'rel', 'class'])

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT)
  const toRemove = []
  while (walker.nextNode()) {
    const el = walker.currentNode
    if (!allowedTags.has(el.tagName)) {
      toRemove.push(el)
      continue
    }

    for (const attr of [...el.attributes]) {
      if (!allowedAttrs.has(attr.name.toLowerCase())) {
        el.removeAttribute(attr.name)
      }
    }

    if (el.tagName === 'A') {
      const href = el.getAttribute('href') || ''
      if (!/^https?:\/\//i.test(href)) {
        el.removeAttribute('href')
      } else {
        el.setAttribute('target', '_blank')
        el.setAttribute('rel', 'noopener noreferrer')
      }
    }
  }

  for (const el of toRemove) {
    el.replaceWith(...el.childNodes)
  }
  return doc.body.innerHTML
}

const DOMPurify = { sanitize }
export default DOMPurify
export { sanitize }
