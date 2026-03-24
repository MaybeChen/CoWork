<script setup>
import { computed } from 'vue'
import { resolveText } from './utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) } })

const tag = computed(() => {
  if (props.payload?.usageHint === 'h1') return 'h1'
  if (props.payload?.usageHint === 'h2') return 'h2'
  return 'p'
})
const text = computed(() => resolveText(props.dataModel, props.payload?.text))
</script>
<template><component :is="tag" class="a2-text">{{ text }}</component></template>
<style scoped>.a2-text{margin:0;color:#e5e7eb;line-height:1.6}</style>
