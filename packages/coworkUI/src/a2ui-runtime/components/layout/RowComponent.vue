<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
  dataModel: { type: Object, default: () => ({}) },
})

const justify = { start:'flex-start', center:'center', end:'flex-end', spaceBetween:'space-between', spaceAround:'space-around', spaceEvenly:'space-evenly' }
const distribution = computed(() => props.payload?.distribution ?? 'start')
const alignment = computed(() => 'stretch')
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const hostStyle = computed(() => ({
  justifyContent: justify[distribution.value] || 'flex-start',
  alignItems: 'stretch',
  ...hostStyleFromNode(props.node, props.payload, props.payload?.usageHint),
}))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
</script>
<template>
  <div v-if="!hidden" class="a2-row" :class="customClasses" :style="hostStyle" :data-alignment="alignment" :data-distribution="distribution"><slot/></div>
</template>
<style scoped>.a2-row{display:flex;flex-wrap:wrap;gap:12px;width:100%}</style>
