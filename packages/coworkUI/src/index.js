import { ref } from 'vue'
import A2UIRenderer from './components/A2UIRenderer.vue'
import { vSafeHtml } from './a2ui-runtime/directives/v-safe-html'
import { defaultTheme, resolveTheme } from './a2ui-runtime/theme'
export { A2UIRenderer }
export { defaultTheme }
export { lightTheme, darkTheme } from './a2ui-runtime/theme'
export { defaultRegistry } from './a2ui-runtime/defaultRegistry'
export { createComponentRegistry } from './a2ui-runtime/registry'
export { A2UIComponentRenderer } from './a2ui-runtime'

export function createCoworkUI(options = {}) {
  const themeName = options.themeName || 'light'
  const state = {
    themeName,
  }
  const currentTheme = ref(resolveTheme(themeName))

  const setTheme = (nextThemeName) => {
    state.themeName = nextThemeName
    currentTheme.value = resolveTheme(nextThemeName)
    if (options.sweetBase && typeof options.sweetBase.setTheme === 'function') {
      options.sweetBase.setTheme(nextThemeName)
    }
    if (typeof options.onThemeChange === 'function') {
      options.onThemeChange(nextThemeName)
    }
  }

  return {
    install(app) {
      if (options.sweetBase) {
        if (typeof options.locale === 'string' && typeof options.sweetBase.i18n === 'function') {
          options.sweetBase.i18n(options.locale, app)
        }
        if (typeof options.sweetBase.setTheme === 'function') {
          options.sweetBase.setTheme(state.themeName)
        }
        if (options.installSweetBase !== false) {
          app.use(options.sweetBase)
        }
      }

      app.component('A2UIRenderer', A2UIRenderer)
      app.directive('safe-html', vSafeHtml)
      app.provide('coworkui:setTheme', setTheme)
      app.provide('coworkui:theme', currentTheme)
    },
    setTheme,
    getTheme: () => state.themeName,
  }
}

export default createCoworkUI
