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
const mermaidSource = computed(() => definition.value.trim())

const svg = ref('')
const error = ref('')
const diagramEl = ref(null)
const diagramViewport = ref(null)
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)

function readThemeToken(name, fallback) {
  if (typeof window === 'undefined' || !diagramEl.value) return fallback
  return window.getComputedStyle(diagramEl.value).getPropertyValue(name).trim() || fallback
}

function initializeMermaidTheme() {
  mermaid.initialize({
    startOnLoad: false,
    suppressErrorRendering: true,
    flowchart: { htmlLabels: false },
    theme: 'base',
    themeVariables: {
      background: 'transparent',
      primaryColor: readThemeToken('--swt-color-bg-selected', '#e9e9e9'),
      primaryTextColor: readThemeToken('--swt-color-text-primary', '#1e1e1e'),
      primaryBorderColor: readThemeToken('--swt-color-dividing-line-primary', '#c6c6c6'),
      lineColor: readThemeToken('--swt-color-border', '#868686'),
      secondaryColor: readThemeToken('--swt-color-bg-secondary', '#f5f5f5'),
      secondaryTextColor: readThemeToken('--swt-color-text-secondary', '#626262'),
      tertiaryColor: readThemeToken('--swt-color-overlay-gray1-and-accent-normal-opacity10', '#e6f0fa'),
      tertiaryTextColor: readThemeToken('--swt-color-text-primary', '#1e1e1e'),
    },
  })
}

let renderSeq = 0

function normalizeMermaidText(source) {
  return source
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '  ')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\r\n?/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[\uFF1A]/g, ':')
    .replace(/[\uFF1B]/g, ';')
    .replace(/[\uFF0C]/g, ',')
    .replace(/[\uFF08]/g, '(')
    .replace(/[\uFF09]/g, ')')
    .replace(/→/g, '-->')
    .replace(/\t/g, '  ')
    .replace(/^\s*```(?:mermaid)?\s*\n?/i, '')
    .replace(/\n?\s*```\s*$/i, '')
    .trim()
}

function fixArrowLabelSyntax(source) {
  return source.replace(/--\s*([^|\n][^>\n]*?)\s*-->/g, (_, label) => `-->|${label.trim()}|`)
}

function addFlowchartDeclarationIfMissing(source) {
  const trimmed = source.trim()
  if (!trimmed) return trimmed
  const hasDeclaration = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|gitGraph)\b/i.test(trimmed)
  if (hasDeclaration) return source
  if (!/-->|<--|---/.test(trimmed)) return source
  return `flowchart TD\n${trimmed}`
}

function fixSubgraphEndBalance(source) {
  const subgraphCount = (source.match(/^\s*subgraph\b/gim) || []).length
  const endCount = (source.match(/^\s*end\b/gim) || []).length
  if (subgraphCount <= endCount) return source
  return `${source}\n${'end\n'.repeat(subgraphCount - endCount).trimEnd()}`
}

function fixParenthesesInSquareBracketLabels(source) {
  return source.replace(/\[([^\]\n]*)\]/g, (_, label) => `[${label.replace(/\(/g, '（').replace(/\)/g, '）')}]`)
}

function applyRepairPipeline(source, levels = ['A']) {
  let fixed = source
  const appliedRules = []

  const levelA = [
    { id: 'normalize-text', apply: normalizeMermaidText },
  ]
  const levelB = [
    { id: 'fix-arrow-label-syntax', apply: fixArrowLabelSyntax },
    { id: 'fix-subgraph-end-balance', apply: fixSubgraphEndBalance },
    { id: 'fix-parentheses-in-square-bracket-labels', apply: fixParenthesesInSquareBracketLabels },
    { id: 'add-flowchart-declaration', apply: addFlowchartDeclarationIfMissing },
  ]

  const rules = []
  if (levels.includes('A')) rules.push(...levelA)
  if (levels.includes('B')) rules.push(...levelB)

  for (const rule of rules) {
    const next = rule.apply(fixed)
    if (next !== fixed) {
      fixed = next
      appliedRules.push(rule.id)
    }
  }

  return { fixed: fixed.trim(), appliedRules }
}


function isMermaidErrorSvg(svgText) {
  const raw = String(svgText || '')
  if (!raw) return false
  return /syntax error in text/i.test(raw)
    || /mermaid version\s*\d+/i.test(raw)
    || /class="error-icon"/i.test(raw)
    || /id="error"/i.test(raw)
}

async function renderSvg(source, seq) {
  const id = `a2-mermaid-${seq}-${Math.random().toString(36).slice(2, 8)}`
  const result = await mermaid.render(id, source)
  if (seq !== renderSeq) return
  const nextSvg = result?.svg || ''
  if (isMermaidErrorSvg(nextSvg)) {
    throw new Error('Mermaid returned an error diagram')
  }
  svg.value = nextSvg
}

function applySvgZoom() {
  if (!diagramEl.value) return
  const svgEl = diagramEl.value.querySelector('svg')
  if (!svgEl) return
  svgEl.style.transform = `translate(${panX.value}px, ${panY.value}px) scale(${zoomLevel.value})`
  svgEl.style.transformOrigin = 'center center'
}

function setZoom(nextZoom) {
  zoomLevel.value = Math.min(Math.max(nextZoom, 0.5), 3)
  applySvgZoom()
}

function handleWheel(event) {
  const step = event.deltaY < 0 ? 0.1 : -0.1
  setZoom(zoomLevel.value + step)
}

function resetZoom() {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
  isDragging.value = false
  applySvgZoom()
}

function startDrag(event) {
  if (!diagramEl.value || !svg.value) return
  isDragging.value = true
  dragStartX.value = event.clientX - panX.value
  dragStartY.value = event.clientY - panY.value
}

function onDrag(event) {
  if (!isDragging.value) return
  panX.value = event.clientX - dragStartX.value
  panY.value = event.clientY - dragStartY.value
  applySvgZoom()
}

function stopDrag() {
  isDragging.value = false
}

async function renderMermaid() {
  const source = mermaidSource.value
  svg.value = ''
  error.value = ''
  resetZoom()
  if (!source) {
    if (diagramEl.value) diagramEl.value.innerHTML = ''
    return
  }

  initializeMermaidTheme()

  const seq = ++renderSeq
  const attempts = [
    { name: '原始输入', levels: [] },
    { name: '安全修复(Level A)', levels: ['A'] },
    { name: '增强修复(Level A+B)', levels: ['A', 'B'] },
  ]
  const errors = []
  const triedSources = new Set()

  for (const attempt of attempts) {
    const { fixed, appliedRules } = attempt.levels.length ? applyRepairPipeline(source, attempt.levels) : { fixed: source, appliedRules: [] }
    if (!fixed || triedSources.has(fixed)) continue
    triedSources.add(fixed)

    try {
      await renderSvg(fixed, seq)
      error.value = ''
      break
    } catch (attemptError) {
      if (seq !== renderSeq) return
      const msg = attemptError instanceof Error ? attemptError.message : String(attemptError)
      const ruleSuffix = appliedRules.length ? `；应用规则: ${appliedRules.join(', ')}` : ''
      errors.push(`${attempt.name}失败: ${msg}${ruleSuffix}`)
    }
  }

  if (errors.length && !svg.value) {
    error.value = errors.join(' | ')
  }

  if (!error.value) {
    await nextTick()
    if (diagramEl.value) {
      diagramEl.value.innerHTML = svg.value
      const svgEl = diagramEl.value.querySelector('svg')
      if (svgEl) {
        const viewBox = svgEl.getAttribute('viewBox') || ''
        const parts = viewBox.split(/\s+/).map(Number).filter((n) => Number.isFinite(n))
        if (parts.length === 4 && parts[2] > 0) {
          svgEl.style.width = `${parts[2]}px`
          svgEl.style.maxWidth = '100%'
        } else {
          svgEl.style.width = 'auto'
          svgEl.style.maxWidth = '100%'
        }
        svgEl.style.height = 'auto'
        applySvgZoom()
      }
    }
  } else if (diagramEl.value) {
    diagramEl.value.innerHTML = ''
  }
}

watch(definition, () => { renderMermaid() }, { immediate: true })
</script>

<template>
  <div v-if="!hidden" class="a2-mermaid-wrap" :class="customClasses" :style="styleObject">
    <div v-if="title" class="a2-mermaid-title">{{ title }}</div>
    <div v-if="svg && !error" class="a2-mermaid-toolbar">
      <span class="a2-mermaid-zoom">{{ Math.round(zoomLevel * 100) }}%</span>
      <button type="button" class="a2-mermaid-btn" @click="resetZoom">重置</button>
    </div>
    <div
      v-if="svg"
      ref="diagramViewport"
      class="a2-mermaid-viewport"
      @wheel.prevent="handleWheel"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <div ref="diagramEl" class="a2-mermaid" :class="{ 'is-dragging': isDragging }" />
    </div>
  </div>
</template>

<style scoped>
.a2-mermaid-wrap {
  width: 100%;
  min-width: 500px;
  max-width: 100%;
  overflow: hidden;
  border: var(--swt-border-width-thin) var(--swt-border-style-solid) var(--swt-color-dividing-line-secondary);
  border-radius: var(--swt-radius-size-medium);
  padding: var(--swt-space-size-12);
  background: linear-gradient(180deg, var(--n-0, var(--swt-color-white)) 0%, var(--n-10, var(--swt-color-bg-secondary)) 100%);
}

.a2-mermaid-title {
  margin-bottom: var(--swt-space-size-8);
  font-weight: var(--swt-font-weight-bold);
  position: relative;
  z-index: 3;
}

.a2-mermaid-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--swt-space-size-8);
  margin-bottom: var(--swt-space-size-8);
  position: relative;
  z-index: 3;
}

.a2-mermaid-zoom {
  color: var(--swt-color-text-extra);
  font-size: var(--swt-font-size-small);
  line-height: 1;
}

.a2-mermaid-btn {
  border: var(--swt-border-width-thin) var(--swt-border-style-solid) var(--swt-color-accent-normal-opacity40);
  border-radius: var(--swt-space-size-8);
  background: var(--swt-color-overlay-gray1-and-accent-normal-opacity20);
  color: var(--swt-color-accent-text-normal);
  font-weight: var(--swt-font-weight-bold);
  font-size: var(--swt-font-size-small);
  padding: var(--swt-space-size-4) var(--swt-space-size-12);
  cursor: pointer;
}

.a2-mermaid-btn:hover {
  background: var(--swt-color-accent-normal-opacity40);
}

.a2-mermaid-viewport {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: hidden;
}

.a2-mermaid {
  display: flex;
  justify-content: center;
  cursor: grab;
  user-select: none;
}

.a2-mermaid.is-dragging {
  cursor: grabbing;
}

.a2-mermaid-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: var(--swt-space-size-8);
  margin-bottom: var(--swt-space-size-8);
}

.a2-mermaid-btn {
  border: var(--swt-border-width-thin) var(--swt-border-style-solid) var(--swt-color-accent-normal-opacity40);
  border-radius: var(--swt-space-size-8);
  background: var(--swt-color-overlay-gray1-and-accent-normal-opacity20);
  color: var(--swt-color-accent-text-normal);
  font-weight: var(--swt-font-weight-bold);
  font-size: var(--swt-font-size-small);
  padding: var(--swt-space-size-4) var(--swt-space-size-12);
  cursor: pointer;
}

.a2-mermaid-btn:hover {
  background: var(--swt-color-accent-normal-opacity40);
}

.a2-mermaid-viewport {
  width: 100%;
  overflow: hidden;
}

.a2-mermaid {
  display: flex;
  justify-content: center;
  cursor: grab;
  user-select: none;
}

.a2-mermaid.is-dragging {
  cursor: grabbing;
}

.a2-mermaid :deep(svg) {
  display: block;
  max-width: 100%;
  height: auto;
}

</style>
