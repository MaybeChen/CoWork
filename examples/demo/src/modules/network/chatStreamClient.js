import { extractJsonObjects } from './streamObjectExtractor'

export async function streamChat({ endpoint, payload, onObjects, onError, signal }) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    if (!res.body) throw new Error('Response body is empty')

    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const { objects, remainder } = extractJsonObjects(buffer)
      buffer = remainder

      if (objects.length) await onObjects(objects)
    }

    if (buffer.trim()) {
      const { objects } = extractJsonObjects(buffer)
      if (objects.length) await onObjects(objects)
    }
  } catch (e) {
    if (e?.name === 'AbortError') return
    onError?.(e)
  }
}
