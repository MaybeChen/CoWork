<script setup>
import { computed } from 'vue'
import { resolveText } from './utils'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) } })
const src = computed(() => resolveText(props.dataModel, props.payload?.src || props.payload?.url))
const alt = computed(() => resolveText(props.dataModel, props.payload?.alt || { literalString: 'image' }))
</script>
<template><img v-if="src" class="a2-image" :src="src" :alt="alt" /></template>
<style scoped>.a2-image{max-width:100%;border-radius:10px;display:block}</style>
