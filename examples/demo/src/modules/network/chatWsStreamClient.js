import { extractJsonObjects } from './streamObjectExtractor'

const PREVIEW_CHARS_PER_FRAME = 2

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
    let previewRafId = null
    let syncTimerId = null

    const cleanup = () => {
      if (previewRafId != null) {
        window.cancelAnimationFrame(previewRafId)
        previewRafId = null
      }
      if (syncTimerId != null) {
        clearInterval(syncTimerId)
        syncTimerId = null
      }
    }

    const finishPreview = () => {
      if (previewDone) return
      previewDone = true
      cleanup()
      safeSend(ws, { type: 'sendMessage', message: previewText, final: true })
    }

    const collectFrameMessages = (rawObjects) => {
      const frameMessages = []
      for (const rawObject of rawObjects) {
        try {
          const parsed = JSON.parse(rawObject)
          if (parsed?.type !== 'a2ui_frame' || !Array.isArray(parsed.frame)) continue
          for (const frame of parsed.frame) {
            if (!frame) continue
            frameMessages.push(JSON.stringify(frame))
          }
        } catch {
          // skip malformed object
        }
      }
      return frameMessages
    }

    const runPreviewByRaf = () => {
      if (previewDone) return
      if (previewText.length >= question.length) {
        finishPreview()
        return
      }

      previewText += question.slice(previewText.length, previewText.length + PREVIEW_CHARS_PER_FRAME)
      onPreview?.(previewText)

      previewRafId = window.requestAnimationFrame(runPreviewByRaf)
    }

    ws.onopen = () => {
      safeSend(ws, { type: 'sendMessage', ...payload })
      previewRafId = window.requestAnimationFrame(runPreviewByRaf)
      syncTimerId = window.setInterval(() => {
        if (previewDone) return
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
      if (objects.length) {
        const frameMessages = collectFrameMessages(objects)
        if (frameMessages.length) await onObjects?.(frameMessages)
      }
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
        if (objects.length) {
          const frameMessages = collectFrameMessages(objects)
          if (frameMessages.length) await onObjects?.(frameMessages)
        }
      }
      resolve()
    }
  })
}
