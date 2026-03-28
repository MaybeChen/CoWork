<script setup>
import { computed } from 'vue'
import { classMapToString, hostStyleFromNode, isHidden } from './utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
  dataModel: { type: Object, default: () => ({}) },
})

const justify = { start:'flex-start', center:'center', end:'flex-end', spaceBetween:'space-between', spaceAround:'space-around', spaceEvenly:'space-evenly' }
const align = { start:'flex-start', center:'center', end:'flex-end', stretch:'stretch' }

const distribution = computed(() => props.payload?.distribution ?? 'start')
const alignment = computed(() => props.payload?.alignment ?? 'stretch')
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const hostStyle = computed(() => ({
  justifyContent: justify[distribution.value] || 'flex-start',
  alignItems: align[alignment.value] || 'stretch',
  ...hostStyleFromNode(props.node, props.payload),
}))
const customClasses = computed(() => classMapToString(props.payload?.classMap || props.payload?.className))
</script>
<template>
  <div v-if="!hidden" class="a2-row" :class="customClasses" :style="hostStyle" :data-alignment="alignment" :data-distribution="distribution"><slot/></div>
</template>
<style scoped>.a2-row{display:flex;flex-wrap:wrap;gap:12px;width:100%}</style>
