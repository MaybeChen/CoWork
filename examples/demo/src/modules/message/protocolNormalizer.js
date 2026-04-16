export function unwrapProtocolMessages(raw) {
  if (raw?.type === 'a2ui_frames' && Array.isArray(raw.frames)) {
    return raw.frames.filter(Boolean)
  }
  return [raw]
}

export function normalizeProtocolMessage(raw) {
  if (raw.beginRendering) {
    return {
      type: 'createSurface',
      surfaceId: raw.beginRendering.surfaceId,
      root: raw.beginRendering.root,
    }
  }

  if (raw.surfaceUpdate) {
    return {
      type: 'surfaceUpdate',
      surfaceId: raw.surfaceUpdate.surfaceId,
      components: raw.surfaceUpdate.components ?? [],
    }
  }

  if (raw.dataModelUpdate) {
    return {
      type: 'dataModelUpdate',
      surfaceId: raw.dataModelUpdate.surfaceId,
      path: raw.dataModelUpdate.path,
      contents: raw.dataModelUpdate.contents ?? [],
    }
  }

  return raw
}
