import { createApp } from 'vue'
import Root from './Root.vue'
import './style.css'
import sweetBase from '@hw-seq/sweet-ui-base'
import '@hw-seq/sweet-ui-base/dist/sweet-ui-base.css'
import { createCoworkUI } from 'coworkUI'
import { router } from './router'

const app = createApp(Root)

const coworkUI = createCoworkUI({
  sweetBase,
  locale: 'zh_CN',
  themeName: 'light',
  installSweetBase: true,
})

app.use(coworkUI)
app.use(router)
app.mount('#app')
