<script setup>
import { computed } from 'vue'
import { resolveText } from './utils'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) } })
const name = computed(() => resolveText(props.dataModel, props.payload?.name || props.payload?.icon))
</script>
<template><span class="a2-icon">{{ name || '◎' }}</span></template>
<style scoped>.a2-icon{display:inline-flex;align-items:center;justify-content:center;min-width:20px}</style>
