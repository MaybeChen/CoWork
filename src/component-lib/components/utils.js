export function readPath(dataModel, path) {
  if (!path || typeof path !== 'string') return undefined
  const normalized = path.replace(/^\$?\/?/, '')
  if (!normalized) return dataModel
  return normalized
    .split(/[/.]/)
    .filter(Boolean)
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), dataModel)
}

function readLiteralObject(value) {
  if (!value || typeof value !== 'object') return undefined
  if ('stringData' in value) return value.stringData
  if ('numberData' in value) return value.numberData
  if ('boolData' in value) return value.boolData
  if ('jsonData' in value) return value.jsonData
  return undefined
}

export function resolveValue(dataModel, value) {
  if (value == null) return undefined
  if (typeof value !== 'object') return value

  if (typeof value.path === 'string') return readPath(dataModel, value.path)
  if (typeof value.pathData === 'string') return readPath(dataModel, value.pathData)

  const directKeys = [
    'literalString',
    'valueString',
    'stringData',
    'literalNumber',
    'valueNumber',
    'numberData',
    'literalBool',
    'valueBool',
    'boolData',
    'valueJson',
    'jsonData',
  ]
  for (const key of directKeys) {
    if (key in value) return value[key]
  }

  if ('literal' in value) {
    const resolved = readLiteralObject(value.literal)
    if (resolved !== undefined) return resolved
  }
  if ('value' in value) {
    const resolved = readLiteralObject(value.value)
    if (resolved !== undefined) return resolved
  }

  return undefined
}

export function resolveText(dataModel, value) {
  const result = resolveValue(dataModel, value)
  return result == null ? '' : String(result)
}

export function normalizePayload(payload) {
  if (!payload || typeof payload !== 'object') return {}
  return payload.properties && typeof payload.properties === 'object' ? payload.properties : payload
}

export function normalizeChildren(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw.explicitList)) return raw.explicitList
  if (Array.isArray(raw.implicitList)) return raw.implicitList
  return []
}

export function extractChildIds(raw) {
  const children = normalizeChildren(raw)
  return children
    .map((child) => {
      if (typeof child === 'string') return child
      if (child && typeof child === 'object') {
        if (typeof child.id === 'string') return child.id
        if (typeof child.componentId === 'string') return child.componentId
      }
      return null
    })
    .filter(Boolean)
}
