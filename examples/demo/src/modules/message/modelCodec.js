export function ensureObjectPath(root, rawPath) {
  const normalized = (rawPath || '/').replace(/^\//, '')
  if (!normalized) return root
  const segments = normalized.split('/').filter(Boolean)
  let cursor = root
  for (const seg of segments) {
    if (!cursor[seg] || typeof cursor[seg] !== 'object') cursor[seg] = {}
    cursor = cursor[seg]
  }
  return cursor
}

export function decodeValueMap(entries) {
  const out = {}
  if (!Array.isArray(entries)) return out
  for (const item of entries) {
    if (!item?.key) continue
    const value = decodeEntryValue(item)
    if (value !== undefined) out[item.key] = value
  }
  return out
}

export function decodeEntryValue(entry) {
  if ('valueString' in entry) return entry.valueString
  if ('valueNumber' in entry) return entry.valueNumber
  if ('valueBool' in entry) return entry.valueBool
  if ('valueJson' in entry) return entry.valueJson
  if ('valueBoolean' in entry) return entry.valueBoolean
  if ('valueMap' in entry) return decodeValueMap(entry.valueMap)

  if (entry.value && typeof entry.value === 'object') {
    if ('stringData' in entry.value) return entry.value.stringData
    if ('numberData' in entry.value) return entry.value.numberData
    if ('boolData' in entry.value) return entry.value.boolData
    if ('jsonData' in entry.value) return entry.value.jsonData
  }

  if (entry.literal && typeof entry.literal === 'object') {
    if ('stringData' in entry.literal) return entry.literal.stringData
    if ('numberData' in entry.literal) return entry.literal.numberData
    if ('boolData' in entry.literal) return entry.literal.boolData
    if ('jsonData' in entry.literal) return entry.literal.jsonData
  }

  return undefined
}
