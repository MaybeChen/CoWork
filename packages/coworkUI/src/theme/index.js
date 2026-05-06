import { computed, ref } from 'vue'

export const COWORKUI_THEME_EVENT = 'coworkui:theme-change'
const DEFAULT_THEME = 'light'

function getStorage() {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

function readStoredTheme(storageKey, fallback) {
  try {
    const storage = getStorage()
    return storage?.getItem(storageKey) || fallback
  } catch {
    return fallback
  }
}

function writeStoredTheme(storageKey, theme) {
  try {
    getStorage()?.setItem(storageKey, theme)
  } catch {
    // ignore
  }
}

function applyThemeScope(target, themeName, attrName = 'data-theme') {
  if (!target || typeof target.setAttribute !== 'function') return
  target.setAttribute(attrName, themeName)
}

export function createThemeStore(options = {}) {
  const themes = options.themes || ['light', 'dark']
  const fallbackTheme = themes[0] || DEFAULT_THEME
  const storageKey = options.storageKey || 'coworkui:theme'
  const scope = options.scope || (typeof document !== 'undefined' ? document.documentElement : null)
  const attrName = options.attrName || 'data-theme'

  const themeName = ref(readStoredTheme(storageKey, options.themeName || fallbackTheme))
  const followExternal = ref(options.followExternal !== false)
  const isValidTheme = (name) => themes.includes(name)

  const setTheme = (name, source = 'local') => {
    const next = isValidTheme(name) ? name : fallbackTheme
    themeName.value = next
    applyThemeScope(scope, next, attrName)
    writeStoredTheme(storageKey, next)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(COWORKUI_THEME_EVENT, { detail: { theme: next, source } }))
    }
  }

  const toggleTheme = () => setTheme(themeName.value === 'dark' ? 'light' : 'dark')
  const syncFromExternal = (name, source = 'external') => {
    if (!followExternal.value) return
    setTheme(name, source)
  }

  applyThemeScope(scope, themeName.value, attrName)

  return {
    themeName: computed(() => themeName.value),
    followExternal,
    themes,
    setTheme,
    toggleTheme,
    syncFromExternal,
    setFollowExternal: (next) => { followExternal.value = Boolean(next) },
  }
}

export function initThemeBeforeMount(options = {}) {
  const storageKey = options.storageKey || 'coworkui:theme'
  const attrName = options.attrName || 'data-theme'
  const fallback = options.fallback || DEFAULT_THEME
  if (typeof document === 'undefined') return
  const theme = readStoredTheme(storageKey, fallback)
  document.documentElement.setAttribute(attrName, theme)
}
