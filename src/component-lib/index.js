export { createComponentRegistry } from './registry'
export { defaultRegistry } from './defaultRegistry'
export { default as A2UIComponentRenderer } from './A2UIComponentRenderer.vue'

import { injectA2UIStyles } from './style/styleManager'

injectA2UIStyles()
