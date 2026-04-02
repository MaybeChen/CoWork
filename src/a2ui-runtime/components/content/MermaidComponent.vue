<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import mermaid from 'mermaid'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveText, resolveValue } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
})

const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

const rawSpec = computed(() => resolveValue(props.dataModel, props.payload?.spec))
const spec = computed(() => {
  if (!rawSpec.value) return {}
  if (typeof rawSpec.value === 'string') {
    try {
      return JSON.parse(rawSpec.value)
    } catch {
      return {}
    }
  }
  return typeof rawSpec.value === 'object' ? rawSpec.value : {}
})

const title = computed(() => resolveText(props.dataModel, spec.value?.title || props.payload?.title || ''))
const definition = computed(() => resolveText(props.dataModel, spec.value?.definition || ''))

const svg = ref('')
const error = ref('')
const diagramEl = ref(null)

mermaid.initialize({
  startOnLoad: false,
  flowchart: { htmlLabels: false },
})

let renderSeq = 0
async function renderMermaid() {
  const source = definition.value.trim()
  svg.value = ''
  error.value = ''
  if (!source) {
    if (diagramEl.value) diagramEl.value.innerHTML = ''
    return
  }

  const seq = ++renderSeq
  try {
    const id = `a2-mermaid-${seq}-${Math.random().toString(36).slice(2, 8)}`
    const result = await mermaid.render(id, source)
    if (seq !== renderSeq) return
    svg.value = result?.svg || ''
    await nextTick()
    if (diagramEl.value) diagramEl.value.innerHTML = svg.value
  } catch (err) {
    if (seq !== renderSeq) return
    error.value = err instanceof Error ? err.message : String(err)
    if (diagramEl.value) diagramEl.value.innerHTML = ''
  }
}

watch(definition, () => { renderMermaid() }, { immediate: true })
</script>

<template>
  <div v-if="!hidden" class="a2-mermaid-wrap" :class="customClasses" :style="styleObject">
    <div v-if="title" class="a2-mermaid-title">{{ title }}</div>
    <div v-if="error" class="a2-mermaid-error">Mermaid 渲染失败：{{ error }}</div>
    <div v-else-if="svg" ref="diagramEl" class="a2-mermaid" />
  </div>
</template>

<style scoped>
.a2-mermaid-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}

.a2-mermaid-title {
  margin-bottom: 8px;
  font-weight: 600;
}

.a2-mermaid :deep(svg) {
  display: block;
  max-width: 100%;
}

.a2-mermaid-error {
  color: #fca5a5;
}
</style>
