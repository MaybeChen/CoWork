import { createApp, computed, ref } from 'vue'
import { A2UIRenderer, defaultTheme } from 'coworkUI'
import 'coworkUI/src/a2ui-runtime/style/global.css'

const defaultPayload = {
  surface: {
    id: 'main',
    root: 'root',
    componentsById: {
      root: { id: 'root', component: { Column: { children: { explicitList: ['txt'] } } } },
      txt: { id: 'txt', component: { Text: { text: { valueString: 'Paste your JSON and render it here.' } } } },
    },
  },
  dataModel: {},
}

const App = {
  components: { A2UIRenderer },
  setup() {
    const text = ref(JSON.stringify(defaultPayload, null, 2))
    const parseError = ref('')
    const parsed = computed(() => {
      try {
        parseError.value = ''
        const obj = JSON.parse(text.value)
        return {
          surface: obj.surface || defaultPayload.surface,
          dataModel: obj.dataModel || {},
        }
      } catch (err) {
        parseError.value = err instanceof Error ? err.message : String(err)
        return defaultPayload
      }
    })
    return { text, parsed, parseError, theme: defaultTheme }
  },
  template: `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;min-height:100vh;background:#020617;color:#e2e8f0;">
      <div>
        <h3>CoWorkUI Playground</h3>
        <textarea v-model="text" style="width:100%;height:80vh;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:10px;"></textarea>
        <p v-if="parseError" style="color:#fca5a5">{{ parseError }}</p>
      </div>
      <div>
        <A2UIRenderer :surface="parsed.surface" :data-model="parsed.dataModel" :theme="theme" />
      </div>
    </div>
  `,
}

createApp(App).mount('#app')
