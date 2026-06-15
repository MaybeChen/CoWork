<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses } from '../utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) }, node:{type:Object,default:null} })
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))
</script>
<template><hr v-if="!hidden" class="a2-divider" :class="customClasses" :style="styleObject" /></template>
<style scoped>.a2-divider{border:none;border-top:var(--swt-border-width-thin) var(--swt-border-style-solid) var(--swt-color-gray11-opacity20);margin:var(--swt-space-size-8) 0}</style>
