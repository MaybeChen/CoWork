import { extractJsonObjects } from './streamObjectExtractor'

function buildWsUrl(pathname) {
  const { host, protocol } = window.location
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
  return `${wsProtocol}//${host}${pathname}`
}

function safeSend(ws, payload) {
  if (ws.readyState !== WebSocket.OPEN) return
  ws.send(JSON.stringify(payload))
}

export async function streamChatByWs({
  endpoint,
  payload,
  onPreview,
  onObjects,
  onError,
}) {
  const question = payload?.message || ''
  const url = buildWsUrl(endpoint)

  return new Promise((resolve) => {
    const ws = new WebSocket(url)
    let receiveBuffer = ''
    let previewText = ''
    let previewDone = false
    let lastSentText = ''
    let typingTimer = null
    let syncTimer = null

    const cleanup = () => {
      if (typingTimer) clearInterval(typingTimer)
      if (syncTimer) clearInterval(syncTimer)
    }

    const finishPreview = () => {
      if (previewDone) return
      previewDone = true
      cleanup()
      safeSend(ws, { type: 'sendMessage', message: previewText, final: true })
      if (ws.readyState === WebSocket.OPEN) ws.close()
    }

    ws.onopen = () => {
      safeSend(ws, { type: 'sendMessage', ...payload })

      typingTimer = window.setInterval(() => {
        if (previewText.length >= question.length) {
          finishPreview()
          return
        }
        previewText += question.slice(previewText.length, previewText.length + 6)
        onPreview?.(previewText)
      }, 100)

      syncTimer = window.setInterval(() => {
        if (previewText !== lastSentText) {
          lastSentText = previewText
          safeSend(ws, { type: 'sendMessage', message: previewText, final: false })
        }
      }, 1000)
    }

    ws.onmessage = async (event) => {
      receiveBuffer += `${event.data || ''}`
      const { objects, remainder } = extractJsonObjects(receiveBuffer)
      receiveBuffer = remainder
      if (objects.length) await onObjects?.(objects)
    }

    ws.onerror = () => {
      onError?.(new Error('WebSocket stream failed'))
      cleanup()
      resolve()
    }

    ws.onclose = async () => {
      cleanup()
      if (!previewDone) {
        previewDone = true
        onPreview?.(question)
      }

      if (receiveBuffer.trim()) {
        const { objects } = extractJsonObjects(receiveBuffer)
        if (objects.length) await onObjects?.(objects)
      }
      resolve()
    }
  })
}
