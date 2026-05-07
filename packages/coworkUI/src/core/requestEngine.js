function toPayload(input, options = {}) {
  const payload = { message: input == null ? "" : String(input) }
  if (options && typeof options === "object" && options.model) payload.model = options.model
  return payload
}

export function createRequestEngine() {
  let abortController = null
  let ws = null

  const stop = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    if (ws) {
      ws.close()
      ws = null
    }
  }

  const requestOnce = async ({ url, input, options, onData, onDone, onError }) => {
    try {
      if (!url) throw new Error('url is required for non-stream request')
      if (abortController) abortController.abort()
      abortController = new AbortController()
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(input, options)),
        signal: abortController.signal,
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      onData?.(data)
      onDone?.({ mode: 'http' })
    } catch (error) {
      if (error?.name === 'AbortError') return
      onError?.(error)
    }
  }

  const ensureWs = ({ wsUrl, onData, onDone, onError }) => {
    if (ws && ws.readyState <= 1) return ws
    if (!wsUrl) throw new Error('wsUrl is required for stream request')
    ws = new WebSocket(wsUrl)
    ws.onmessage = (evt) => {
      try {
        const parsed = typeof evt.data === 'string' ? JSON.parse(evt.data) : evt.data
        onData?.(parsed)
      } catch {
        onData?.({ raw: evt.data })
      }
    }
    ws.onerror = () => onError?.(new Error('WebSocket error'))
    ws.onclose = () => onDone?.({ mode: 'ws' })
    return ws
  }

  const sendMessage = ({ wsUrl, input, options, onData, onDone, onError }) => {
    try {
      const socket = ensureWs({ wsUrl, onData, onDone, onError })
      const payload = JSON.stringify(toPayload(input, options))
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload)
      } else {
        socket.addEventListener('open', () => socket.send(payload), { once: true })
      }
    } catch (error) {
      onError?.(error)
    }
  }

  return { stop, requestOnce, sendMessage }
}
