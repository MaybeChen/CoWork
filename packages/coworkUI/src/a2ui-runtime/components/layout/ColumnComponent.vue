<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses } from '../utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, node:{type:Object,default:null}, dataModel:{type:Object,default:()=>({})} })
const justify = { start:'flex-start', center:'center', end:'flex-end', spaceBetween:'space-between' }
const align = { start:'flex-start', center:'center', end:'flex-end', stretch:'stretch' }

const distribution = computed(() => props.payload?.distribution ?? 'start')
const alignment = computed(() => props.payload?.alignment ?? 'stretch')
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const hostStyle = computed(() => ({
  justifyContent: justify[distribution.value]||'flex-start',
  alignItems: align[alignment.value]||'stretch',
  ...hostStyleFromNode(props.node, props.payload, props.payload?.usageHint),
}))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
</script>
<template><div v-if="!hidden" class="a2-column" :class="customClasses" :style="hostStyle" :data-alignment="alignment" :data-distribution="distribution"><slot/></div></template>
<style scoped>.a2-column{display:flex;flex-direction:column;gap:12px}</style>
