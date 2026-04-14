import { decodeEntryValue, decodeValueMap, ensureObjectPath } from './modelCodec'
import { normalizeProtocolMessage } from './protocolNormalizer'

export function createTurn(userText, mode = 'default') {
  return {
    id: `turn-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userText,
    mode,
    streamPreviewText: '',
    surfaces: {},
    dataModels: {},
    streaming: false,
  }
}

function ensureSurface(turn, surfaceId) {
  if (!turn.surfaces[surfaceId]) {
    turn.surfaces[surfaceId] = {
      id: surfaceId,
      root: null,
      componentsById: {},
      ready: false,
    }
  }
  return turn.surfaces[surfaceId]
}

function ensureSurfaceDataModel(turn, surfaceId) {
  if (!turn.dataModels[surfaceId] || typeof turn.dataModels[surfaceId] !== 'object') {
    turn.dataModels[surfaceId] = {}
  }
  return turn.dataModels[surfaceId]
}

export function applyMessage(turn, rawPayload, { onChanged } = {}) {
  const payload = normalizeProtocolMessage(rawPayload)
  const type = payload.type || payload.messageType

  if (type === 'createSurface') {
    const sid = payload.surfaceId || payload.surface?.id
    if (!sid) return
    const surface = ensureSurface(turn, sid)
    surface.root = payload.root || payload.surface?.root || surface.root
    surface.ready = true

    if (Array.isArray(payload.components)) {
      for (const item of payload.components) {
        if (!item?.id) continue
        surface.componentsById[item.id] = item
      }
    }

    turn.surfaces = { ...turn.surfaces }
    onChanged?.()
    return
  }

  if (type === 'surfaceUpdate' || type === 'updateComponents') {
    const sid = payload.surfaceId || payload.surface?.id
    if (!sid) return
    const surface = ensureSurface(turn, sid)
    const list = payload.components || payload.patch || []

    if (Array.isArray(list)) {
      for (const item of list) {
        if (!item?.id) continue
        surface.componentsById[item.id] = item
      }
    }

    turn.surfaces = { ...turn.surfaces }
    onChanged?.()
    return
  }

  if (type === 'dataModelUpdate' || type === 'updateDataModel') {
    const sid = payload.surfaceId || payload.surface?.id || 'main'
    const surfaceModel = ensureSurfaceDataModel(turn, sid)

    if (Array.isArray(payload.contents)) {
      if (!payload.path) {
        turn.dataModels[sid] = decodeValueMap(payload.contents)
      } else {
        const pathRoot = ensureObjectPath(surfaceModel, payload.path)
        for (const entry of payload.contents) {
          const key = entry.key
          if (!key) continue
          const value = decodeEntryValue(entry)
          if (value !== undefined) pathRoot[key] = value
        }
      }
      turn.dataModels = { ...turn.dataModels }
      onChanged?.()
      return
    }

    const update = payload.data || payload.dataModel || payload.patch || {}
    Object.assign(surfaceModel, update)
    turn.dataModels = { ...turn.dataModels }
    onChanged?.()
  }
}
