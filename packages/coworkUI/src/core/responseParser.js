export function normalizeRendererPayload(payload) {
  if (!payload || typeof payload !== 'object') return { raw: payload }
  if (payload.surface || payload.dataModel) return payload
  if (payload.turn && (payload.turn.surfaces || payload.turn.dataModels)) {
    const surfaces = payload.turn.surfaces || {}
    const first = Object.values(surfaces).find((s) => s?.ready) || Object.values(surfaces)[0]
    return {
      surface: first ? { id: first.id, root: first.root, componentsById: first.componentsById } : null,
      dataModel: payload.turn.dataModels?.[first?.id] || {},
      raw: payload,
    }
  }
  return { raw: payload }
}
