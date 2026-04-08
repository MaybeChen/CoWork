<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveText } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
})

const md = new MarkdownIt()

const text = computed(() => resolveText(props.dataModel, props.payload?.text))
const usageHint = computed(() => props.payload?.usageHint || 'body')
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

const markdownText = computed(() => {
  const raw = text.value
  if (!raw) return ''
  switch (usageHint.value) {
    case 'h1': return `# ${raw}`
    case 'h2': return `## ${raw}`
    case 'h3': return `### ${raw}`
    case 'h4': return `#### ${raw}`
    case 'h5': return `##### ${raw}`
    case 'caption': return `*${raw}*`
    default: return raw
  }
})

const renderedHtml = computed(() => md.render(markdownText.value || ''))
</script>

<template>
  <div v-if="!hidden" class="a2ui-text" :style="styleObject">
    <section class="a2-text" :class="customClasses" v-safe-html="renderedHtml" />
  </div>
</template>

<style scoped>
.a2ui-text { width: 100%; }
.a2-text :deep(p) { margin: 0; color: inherit; line-height:1.6; }
.a2-text :deep(h1), .a2-text :deep(h2), .a2-text :deep(h3), .a2-text :deep(h4), .a2-text :deep(h5) { margin: 0.2em 0; line-height:1.3; }
.a2-text :deep(code) { background: rgba(255,255,255,0.08); padding: 0 4px; border-radius: 4px; }
.a2-text :deep(pre) { background: rgba(0,0,0,0.35); padding: 10px; border-radius: 8px; overflow:auto; }
.a2-text :deep(ul), .a2-text :deep(ol) { margin: 0.3em 0; padding-left: 1.2em; }
.a2-text :deep(blockquote) { margin: 0.3em 0; padding-left: 10px; border-left: 3px solid rgba(255,255,255,0.25); color: rgba(229,231,235,.9); }
.a2-text :deep(a) { color: #93c5fd; text-decoration: underline; }
</style>
