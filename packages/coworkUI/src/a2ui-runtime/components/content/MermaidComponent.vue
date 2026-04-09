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

mermaid.initialize({
  startOnLoad: false,
  flowchart: { htmlLabels: false },
  theme: 'base',
  themeVariables: {
    background: 'transparent',
    primaryColor: '#1e293b',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#334155',
    lineColor: '#64748b',
    secondaryColor: '#0f172a',
    secondaryTextColor: '#cbd5e1',
    tertiaryColor: '#111827',
    tertiaryTextColor: '#cbd5e1',
  },
})

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

async function renderSvg(source, seq) {
  const id = `a2-mermaid-${seq}-${Math.random().toString(36).slice(2, 8)}`
  const result = await mermaid.render(id, source)
  if (seq !== renderSeq) return
  svg.value = result?.svg || ''
}

async function renderMermaid() {
  const source = mermaidSource.value
  svg.value = ''
  error.value = ''
  if (!source) {
    if (diagramEl.value) diagramEl.value.innerHTML = ''
    return
  }

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
          svgEl.style.maxWidth = 'none'
        } else {
          svgEl.style.width = 'max-content'
          svgEl.style.maxWidth = 'none'
        }
        svgEl.style.height = 'auto'
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
    <template v-if="error">
      <pre v-if="mermaidSource" class="a2-mermaid-source"><code>{{ mermaidSource }}</code></pre>
      <div class="a2-mermaid-error">Mermaid 渲染失败：{{ error }}</div>
    </template>
    <div v-else-if="svg" ref="diagramEl" class="a2-mermaid" />
  </div>
</template>

<style scoped>
.a2-mermaid-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 10px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.72) 0%, rgba(15, 23, 42, 0.45) 100%);
}

.a2-mermaid-title {
  margin-bottom: 8px;
  font-weight: 600;
}

.a2-mermaid :deep(svg) {
  display: block;
  width: max-content;
  max-width: none;
  height: auto;
}

.a2-mermaid-error {
  color: #fca5a5;
}

.a2-mermaid-source {
  margin: 0 0 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.35);
  background: #0b1220;
  color: #dbeafe;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
}
</style>
