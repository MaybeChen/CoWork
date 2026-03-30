import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'
import './component-lib/style/global.css'
import { vSafeHtml } from './component-lib/directives/v-safe-html'

const app = createApp(App)
app.use(ElementPlus)
app.directive('safe-html', vSafeHtml)
app.mount('#app')
