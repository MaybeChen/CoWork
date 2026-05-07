<script setup>
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import { A2UIComponentRenderer, defaultRegistry, defaultTheme } from '../a2ui-runtime'
import { createRequestEngine } from '../core/requestEngine'
import { applyRendererPayloadToTurn, createRenderTurnState } from '../core/responseParser'
import '../a2ui-runtime/style/common.css'
import '../a2ui-runtime/style/light.css'
import '../a2ui-runtime/style/dark.css'

const props = defineProps({
  surface: { type: Object, default: null },
  dataModel: { type: Object, default: () => ({}) },
  onAction: { type: Function, default: null },
  theme: { type: Object, default: null },
  input: { type: String, default: '' },
  options: { type: Object, default: () => ({}) },
  url: { type: String, default: '' },
  wsUrl: { type: String, default: '' },
  isStream: { type: Boolean, default: false },
})

const emit = defineEmits(['request-start', 'request-progress', 'request-finish', 'request-error'])

const injectedTheme = inject('coworkui:theme', null)
const resolvedTheme = computed(() => props.theme || injectedTheme?.value || defaultTheme)
const workspaceClass = inject('coworkui:workspaceClass', 'coworkui-workspace')
const surfaceClass = computed(() => ['a2ui-surface', 'coworkui-workspace', workspaceClass].filter(Boolean).join(' '))

const requestSurface = ref(null)
const requestDataModel = ref({})
const engine = createRequestEngine()
const renderTurnState = ref(createRenderTurnState())
let requestSeq = 0

const resolvedSurface = computed(() => requestSurface.value || props.surface)
const resolvedDataModel = computed(() => ({ ...(props.dataModel || {}), ...(requestDataModel.value || {}) }))

function applyResponse(payload, requestMeta = {}) {
  const normalized = applyRendererPayloadToTurn(renderTurnState.value, payload)
  if (!normalized) return
  if (normalized.surface?.root) requestSurface.value = normalized.surface
  if (normalized.dataModel && typeof normalized.dataModel === 'object') requestDataModel.value = normalized.dataModel
  emit('request-progress', { ...requestMeta, ...normalized })
}

watch(
  () => [props.input, props.isStream, props.url, props.wsUrl],
  ([input, isStream]) => {
    const hasInput = typeof input === 'string' && input.trim().length > 0
    if (!hasInput) return

    const requestId = `${Date.now()}-${++requestSeq}`
    const requestMeta = { requestId, input, mode: isStream ? 'ws' : 'http' }
    emit('request-start', requestMeta)

    if (!isStream) {
      requestSurface.value = null
      requestDataModel.value = {}
      renderTurnState.value = createRenderTurnState()
      engine.requestOnce({
        url: props.url,
        input,
        options: props.options,
        onData: (payload) => applyResponse(payload, requestMeta),
        onDone: (meta) => emit('request-finish', { ...requestMeta, ...meta }),
        onError: (error) => emit('request-error', { ...requestMeta, error }),
      })
      return
    }

    engine.sendMessage({
      wsUrl: props.wsUrl,
      input,
      options: props.options,
      onData: (payload) => applyResponse(payload, requestMeta),
      onDone: (meta) => emit('request-finish', { ...requestMeta, ...meta }),
      onError: (error) => emit('request-error', { ...requestMeta, error }),
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
