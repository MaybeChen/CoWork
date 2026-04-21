import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import sweetBase from '@hw-seq/sweet-ui-base'
import '@hw-seq/sweet-ui-base/dist/sweet-ui-base.css'
import { createCoworkUI } from 'coworkUI'

const app = createApp(App)

const coworkUI = createCoworkUI({
  sweetBase,
  locale: 'zh_CN',
  themeName: 'light',
  installSweetBase: true,
})

app.use(coworkUI)
app.mount('#app')
