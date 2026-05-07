function toObject(raw) {
  if (raw == null) return null
  if (typeof raw === 'object') return raw
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return null }
  }
  return null
}

function ensureSurface(turn, sid) {
  if (!turn.surfaces[sid]) turn.surfaces[sid] = { id: sid, root: null, componentsById: {}, ready: false }
  return turn.surfaces[sid]
}

export function createRenderTurnState() {
  return { surfaces: {}, dataModels: {} }
}

export function applyRendererPayloadToTurn(turn, rawPayload) {
  const payload = toObject(rawPayload)
  if (!payload) return null
  const type = payload.type || payload.messageType

  if (type === 'createSurface') {
    const sid = payload.surfaceId || payload.surface?.id
    if (!sid) return null
    const surface = ensureSurface(turn, sid)
    surface.root = payload.root || payload.surface?.root || surface.root
    surface.ready = true
    for (const item of payload.components || []) {
      if (item?.id) surface.componentsById[item.id] = item
    }
  }

  if (type === 'surfaceUpdate' || type === 'updateComponents') {
    const sid = payload.surfaceId || payload.surface?.id
    if (!sid) return null
    const surface = ensureSurface(turn, sid)
    for (const item of payload.components || payload.patch || []) {
      if (item?.id) surface.componentsById[item.id] = item
    }
  }

  if (type === 'dataModelUpdate' || type === 'updateDataModel') {
    const sid = payload.surfaceId || payload.surface?.id || 'main'
    if (!turn.dataModels[sid]) turn.dataModels[sid] = {}
    Object.assign(turn.dataModels[sid], payload.data || payload.dataModel || payload.patch || {})
  }

  const first = Object.values(turn.surfaces).find((s) => s.ready) || Object.values(turn.surfaces)[0]
  const rawLine = typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload)
  return {
    surface: first || null,
    dataModel: first ? (turn.dataModels[first.id] || {}) : {},
    raw: rawPayload,
    rawLine,
    parsedText: rawLine,
  }
}
