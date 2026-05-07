function stringifyRaw(raw) {
  if (raw == null) return ''
  if (typeof raw === 'string') return raw
  try { return JSON.stringify(raw) } catch { return String(raw) }
}

export function normalizeRendererPayload(payload) {
  if (!payload || typeof payload !== 'object') return { raw: payload, rawLine: stringifyRaw(payload), parsedText: stringifyRaw(payload) }

  if (payload.surface || payload.dataModel) {
    const line = stringifyRaw(payload.raw ?? payload)
    return { ...payload, rawLine: line, parsedText: line }
  }

  if (payload.turn && (payload.turn.surfaces || payload.turn.dataModels)) {
    const surfaces = payload.turn.surfaces || {}
    const first = Object.values(surfaces).find((s) => s?.ready) || Object.values(surfaces)[0]
    const line = stringifyRaw(payload)
    return {
      surface: first ? { id: first.id, root: first.root, componentsById: first.componentsById } : null,
      dataModel: payload.turn.dataModels?.[first?.id] || {},
      raw: payload,
      rawLine: line,
      parsedText: line,
    }
  }

  const line = stringifyRaw(payload)
  return { raw: payload, rawLine: line, parsedText: line }
}
