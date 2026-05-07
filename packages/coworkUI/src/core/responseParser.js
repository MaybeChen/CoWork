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

function snapshot(turn, rawPayload) {
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

function applySingle(turn, payload) {
  if (!payload || typeof payload !== 'object') return false

  if (payload.surface?.root && payload.surface?.id) {
    const surface = ensureSurface(turn, payload.surface.id)
    surface.root = payload.surface.root
    surface.ready = true
    surface.componentsById = payload.surface.componentsById || surface.componentsById || {}
    if (payload.dataModel && typeof payload.dataModel === 'object') {
      turn.dataModels[payload.surface.id] = payload.dataModel
    }
    return true
  }

  const type = payload.type || payload.messageType
  if (type === 'createSurface') {
    const sid = payload.surfaceId || payload.surface?.id
    if (!sid) return false
    const surface = ensureSurface(turn, sid)
    surface.root = payload.root || payload.surface?.root || surface.root
    surface.ready = true
    for (const item of payload.components || []) if (item?.id) surface.componentsById[item.id] = item
    return true
  }
  if (type === 'surfaceUpdate' || type === 'updateComponents') {
    const sid = payload.surfaceId || payload.surface?.id
    if (!sid) return false
    const surface = ensureSurface(turn, sid)
    for (const item of payload.components || payload.patch || []) if (item?.id) surface.componentsById[item.id] = item
    return true
  }
  if (type === 'dataModelUpdate' || type === 'updateDataModel') {
    const sid = payload.surfaceId || payload.surface?.id || 'main'
    if (!turn.dataModels[sid]) turn.dataModels[sid] = {}
    Object.assign(turn.dataModels[sid], payload.data || payload.dataModel || payload.patch || {})
    return true
  }
  return false
}

export function applyRendererPayloadToTurn(turn, rawPayload) {
  const parsed = toObject(rawPayload)
  if (!parsed) return null

  let changed = false
  if (Array.isArray(parsed)) {
    for (const item of parsed) changed = applySingle(turn, toObject(item) || item) || changed
  } else if (Array.isArray(parsed.objects)) {
    for (const item of parsed.objects) changed = applySingle(turn, toObject(item) || item) || changed
  } else {
    changed = applySingle(turn, parsed)
  }

  if (!changed) return null
  return snapshot(turn, rawPayload)
}
