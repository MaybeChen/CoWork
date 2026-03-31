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

export function resolveNumber(dataModel, value, fallback = 0) {
  const resolved = resolveValue(dataModel, value)
  if (resolved == null || resolved === '') return fallback
  const n = Number(resolved)
  return Number.isFinite(n) ? n : fallback
}

export function resolveBool(dataModel, value, fallback = false) {
  const resolved = resolveValue(dataModel, value)
  if (typeof resolved === 'boolean') return resolved
  if (typeof resolved === 'string') {
    if (resolved.toLowerCase() === 'true') return true
    if (resolved.toLowerCase() === 'false') return false
  }
  return fallback
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
  if (Array.isArray(raw.items)) return raw.items
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

export function classMapToString(value) {
  if (!value) return ''
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return value.map(classMapToString).filter(Boolean).join(' ')
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([key]) => key)
      .join(' ')
  }
  return ''
}

export function stylesToObject(input) {
  if (!input) return {}
  if (typeof input === 'object') return input
  if (typeof input !== 'string') return {}

  return input
    .split(';')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .reduce((acc, pair) => {
      const idx = pair.indexOf(':')
      if (idx === -1) return acc
      const key = pair.slice(0, idx).trim()
      const value = pair.slice(idx + 1).trim()
      if (!key) return acc
      acc[key] = value
      return acc
    }, {})
}

export function hostStyleFromNode(node, payload = {}, usageHint = 'default') {
  const style = {
    ...stylesToObject(payload.style),
    ...stylesToObject(payload.styles),
    ...resolveComponentStyles(payload, usageHint),
  }
  if (node?.weight !== undefined && node?.weight !== null) {
    style['--weight'] = node.weight
    style.flex = `${Number(node.weight) || 0} 1 0%`
  }
  return style
}

export function isHidden(dataModel, payload = {}) {
  return resolveBool(dataModel, payload.hidden ?? payload.isHidden, false)
}

export function resolveActionName(action, fallback) {
  return action?.name || action?.actionName || fallback
}


export function mergeClassMaps(...maps) {
  const merged = {}
  for (const map of maps) {
    if (!map || typeof map !== 'object') continue
    for (const [k, v] of Object.entries(map)) merged[k] = Boolean(v)
  }
  return merged
}

function isHintedStyleMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return 'all' in value || 'default' in value || Object.values(value).some((v) => v && typeof v === 'object')
}

export function resolveComponentClasses(payload = {}, usageHint = 'default') {
  const className = payload?.className
  const classMap = payload?.classMap
  const themeMap = payload?.__themeClassMap

  const classNameText = classMapToString(className)

  const resolveMap = (map) => {
    if (!map || typeof map !== 'object' || Array.isArray(map)) return classMapToString(map)
    if (!isHintedStyleMap(map)) return classMapToString(map)
    return classMapToString(mergeClassMaps(map.all, map.default, map[usageHint]))
  }

  const mergedClassMap = mergeClassMaps(
    isHintedStyleMap(themeMap) ? mergeClassMaps(themeMap.all, themeMap.default, themeMap[usageHint]) : themeMap,
    isHintedStyleMap(classMap) ? mergeClassMaps(classMap.all, classMap.default, classMap[usageHint]) : classMap,
  )

  return [resolveMap(mergedClassMap), classNameText].filter(Boolean).join(' ').trim()
}

export function resolveComponentStyles(payload = {}, usageHint = 'default') {
  const styles = payload?.additionalStyles
  const themeStyles = payload?.__themeAdditionalStyles

  const resolve = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return stylesToObject(value)
    if (!isHintedStyleMap(value)) return stylesToObject(value)
    return {
      ...stylesToObject(value.all),
      ...stylesToObject(value.default),
      ...stylesToObject(value[usageHint]),
    }
  }

  return {
    ...resolve(themeStyles),
    ...resolve(styles),
  }
}
