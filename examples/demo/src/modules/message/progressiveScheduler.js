import { nextTick } from 'vue'
import { normalizeProtocolMessage, unwrapProtocolMessages } from './protocolNormalizer'

export async function flushToFrame() {
  await nextTick()
  if (typeof requestAnimationFrame === 'function') {
    await new Promise((resolve) => requestAnimationFrame(() => resolve()))
  }
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function applyMessageProgressively(turn, parsed, { applyMessageFn }) {
  const chunks = unwrapProtocolMessages(parsed)
  if (chunks.length > 1 || (chunks.length === 1 && chunks[0] !== parsed)) {
    for (const chunk of chunks) {
      await applyMessageProgressively(turn, chunk, { applyMessageFn })
    }
    return
  }

  const normalized = normalizeProtocolMessage(parsed)
  const type = normalized.type || normalized.messageType

  if ((type === 'surfaceUpdate' || type === 'updateComponents') && Array.isArray(normalized.components) && normalized.components.length > 1) {
    for (const component of normalized.components) {
      applyMessageFn(turn, {
        type,
        surfaceId: normalized.surfaceId,
        components: [component],
      })
      await flushToFrame()
      await sleep(12)
    }
    return
  }

  if ((type === 'dataModelUpdate' || type === 'updateDataModel') && Array.isArray(normalized.contents) && normalized.contents.length > 1) {
    for (const entry of normalized.contents) {
      applyMessageFn(turn, {
        type,
        surfaceId: normalized.surfaceId,
        path: normalized.path,
        contents: [entry],
      })
      await flushToFrame()
      await sleep(12)
    }
    return
  }

  applyMessageFn(turn, parsed)
  await flushToFrame()
  await sleep(8)
}

export async function applyObjectsProgressively(turn, objectList, { applyMessageFn }) {
  for (const raw of objectList) {
    try {
      const parsed = JSON.parse(raw)
      await applyMessageProgressively(turn, parsed, { applyMessageFn })
    } catch {
      // skip malformed object in stream
    }
  }
}
