import A2UIRenderer from './components/A2UIRenderer.vue'
import { vSafeHtml } from './a2ui-runtime/directives/v-safe-html'
import { defaultTheme } from './a2ui-runtime/theme'
import { createThemeStore, COWORKUI_THEME_EVENT } from './theme'
export { A2UIRenderer }
export { defaultTheme }
export { lightTheme, darkTheme } from './a2ui-runtime/theme'
export { defaultRegistry } from './a2ui-runtime/defaultRegistry'
export { createComponentRegistry } from './a2ui-runtime/registry'
export { A2UIComponentRenderer } from './a2ui-runtime'

export function createCoworkUI(options = {}) {

  const namespace = options.namespace || 'coworkui'
  const workspaceClass = options.workspaceClass || `${namespace}-workspace`
  const store = createThemeStore({
    themeName: options.themeName || 'light',
    storageKey: options.storageKey || 'coworkui:theme',
    attrName: options.attrName || 'data-theme',
    scope: options.scope || (typeof document !== 'undefined' ? document.documentElement : null),
    themes: options.themes || ['light', 'dark'],
    followExternal: true,
  })

  const setTheme = (nextThemeName, source = 'host') => {
    store.setTheme(nextThemeName, source)
    if (options.sweetBase && typeof options.sweetBase.setTheme === 'function') {
      options.sweetBase.setTheme(store.themeName.value)
    }
    if (typeof options.onThemeChange === 'function') {
      options.onThemeChange(store.themeName.value)
    }
  }

  return {
    install(app) {
      if (options.sweetBase) {
        if (typeof options.locale === 'string' && typeof options.sweetBase.i18n === 'function') {
          options.sweetBase.i18n(options.locale, app)
        }
        if (typeof options.sweetBase.setTheme === 'function') {
          options.sweetBase.setTheme(store.themeName.value)
        }
        if (options.installSweetBase !== false) {
          app.use(options.sweetBase)
        }
      }

      app.component('A2UIRenderer', A2UIRenderer)
      app.directive('safe-html', vSafeHtml)
      app.provide('coworkui:setTheme', setTheme)
      app.provide('coworkui:theme', store.themeName)
      app.provide('coworkui:themeStore', store)
      app.provide('coworkui:namespace', namespace)
      app.provide('coworkui:workspaceClass', workspaceClass)
    },
    setTheme,
    toggleTheme: store.toggleTheme,
    getTheme: () => store.themeName.value,
    getThemeStore: () => store,
    getNamespace: () => namespace,
    getWorkspaceClass: () => workspaceClass,
  }
}

export default createCoworkUI

export { createThemeStore, COWORKUI_THEME_EVENT } from './theme'
