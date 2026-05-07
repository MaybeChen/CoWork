<script setup>
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import { A2UIComponentRenderer, defaultRegistry, defaultTheme } from '../a2ui-runtime'
import { createRequestEngine } from '../core/requestEngine'
import '../a2ui-runtime/style/common.css'
import '../a2ui-runtime/style/light.css'
import '../a2ui-runtime/style/dark.css'

const props = defineProps({
  surface: { type: Object, default: null },
  dataModel: { type: Object, default: () => ({}) },
  onAction: { type: Function, default: null },
  theme: { type: Object, default: null },
  input: { type: [String, Object], default: '' },
  url: { type: String, default: '' },
  wsUrl: { type: String, default: '' },
  isStream: { type: Boolean, default: false },
})

const emit = defineEmits(['request-finish', 'request-error'])

const injectedTheme = inject('coworkui:theme', null)
const resolvedTheme = computed(() => props.theme || injectedTheme?.value || defaultTheme)
const workspaceClass = inject('coworkui:workspaceClass', 'coworkui-workspace')
const surfaceClass = computed(() => ['a2ui-surface', 'coworkui-workspace', workspaceClass].filter(Boolean).join(' '))

const requestSurface = ref(null)
const requestDataModel = ref({})
const engine = createRequestEngine()

const resolvedSurface = computed(() => requestSurface.value || props.surface)
const resolvedDataModel = computed(() => ({ ...(props.dataModel || {}), ...(requestDataModel.value || {}) }))

function applyResponse(payload) {
  if (!payload || typeof payload !== 'object') return
  if (payload.surface?.root) requestSurface.value = payload.surface
  if (payload.dataModel && typeof payload.dataModel === 'object') requestDataModel.value = payload.dataModel
}

watch(
  () => [props.input, props.isStream, props.url, props.wsUrl],
  ([input, isStream]) => {
    const hasInput = typeof input === 'string' ? input.trim().length > 0 : Boolean(input)
    if (!hasInput) return

    if (!isStream) {
      requestSurface.value = null
      requestDataModel.value = {}
      engine.requestOnce({
        url: props.url,
        input,
        onData: applyResponse,
        onDone: (meta) => emit('request-finish', meta),
        onError: (error) => emit('request-error', error),
      })
      return
    }

    engine.sendMessage({
      wsUrl: props.wsUrl,
      input,
      onData: applyResponse,
      onDone: (meta) => emit('request-finish', meta),
      onError: (error) => emit('request-error', error),
    })
  },
  { deep: true },
)

onBeforeUnmount(() => {
  engine.stop()
})
</script>

<template>
  <div v-if="resolvedSurface?.root" :class="surfaceClass">
    <A2UIComponentRenderer
      :node-id="resolvedSurface.root"
      :components-by-id="resolvedSurface.componentsById || {}"
      :data-model="resolvedDataModel"
      :surface-id="resolvedSurface.id"
      :registry="defaultRegistry"
      :theme="resolvedTheme"
      :on-action="onAction"
    />
  </div>
  <div v-else class="empty-tip">Surface is waiting for root...</div>
</template>

<style scoped>
.empty-tip {
  color: #64748b;
  padding: 10px;
}
</style>
