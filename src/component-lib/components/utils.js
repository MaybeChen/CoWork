export function readPath(dataModel, path) {
  if (!path || typeof path !== 'string') return undefined
  const normalized = path.replace(/^\//, '')
  if (!normalized) return dataModel
  return normalized
    .split('/')
    .filter(Boolean)
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), dataModel)
}

export function resolveValue(dataModel, value) {
  if (value == null) return undefined
  if (typeof value !== 'object') return value
  if (typeof value.literalString === 'string') return value.literalString
  if (typeof value.valueString === 'string') return value.valueString
  if (typeof value.literalNumber === 'number') return value.literalNumber
  if (typeof value.valueNumber === 'number') return value.valueNumber
  if (typeof value.literalBool === 'boolean') return value.literalBool
  if (typeof value.valueBool === 'boolean') return value.valueBool
  if (typeof value.path === 'string') return readPath(dataModel, value.path)
  return undefined
}

export function resolveText(dataModel, value) {
  const result = resolveValue(dataModel, value)
  return result == null ? '' : String(result)
}
