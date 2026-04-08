import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { vSafeHtml } from './a2ui-runtime/directives/v-safe-html'
import sweetBase from '@hw-seq/sweet-ui-base';
import '@hw-seq/sweet-ui-base/dist/sweet-ui-base.css';

const app = createApp(App)
sweetBase.i18n('zh_CN', app);
sweetBase.setTheme('dark');
app.use(sweetBase);
app.directive('safe-html', vSafeHtml)
app.mount('#app')
