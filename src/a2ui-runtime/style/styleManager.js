import { resetStyles } from './reset'
import { structuralStyles } from './structural'
import { componentSpecificStyles } from './components'

export const STYLE_TAG_ID = 'a2ui-structural-styles'

function buildStyleText() {
  return [resetStyles, structuralStyles, componentSpecificStyles].join('\n\n')
}

export function injectA2UIStyles() {
  if (typeof document === 'undefined') return

  let styleEl = document.getElementById(STYLE_TAG_ID)
  const cssText = buildStyleText()

  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = STYLE_TAG_ID
    document.head.appendChild(styleEl)
  }

  if (styleEl.textContent !== cssText) {
    styleEl.textContent = cssText
  }
}
