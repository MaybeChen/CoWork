import { computed, ref } from 'vue'
import { createThemeStore } from 'coworkUI'

export function createHostThemeCenter(options = {}) {
  const host = createThemeStore({
    themeName: 'light',
    storageKey: options.hostStorageKey || 'demo:host-theme',
    attrName: 'data-theme',
    scope: document.documentElement,
    themes: ['light', 'dark'],
  })

  const libraryFollowHost = ref(true)

  const syncLibraryTheme = (libraryStore) => {
    if (!libraryStore || !libraryFollowHost.value) return
    libraryStore.syncFromExternal(host.themeName.value, 'host-sync')
  }

  const setTheme = (theme, libraryStore) => {
    host.setTheme(theme, 'host')
    syncLibraryTheme(libraryStore)
  }

  const toggleTheme = (libraryStore) => {
    host.toggleTheme()
    syncLibraryTheme(libraryStore)
  }

  return {
    hostTheme: computed(() => host.themeName.value),
    hostStore: host,
    libraryFollowHost,
    setLibraryFollowHost: (next) => { libraryFollowHost.value = Boolean(next) },
    setTheme,
    toggleTheme,
    syncLibraryTheme,
  }
}
