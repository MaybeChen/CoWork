<script setup>
const props = defineProps({ payload: { type: Object, default: () => ({}) } })
const justify = { start:'flex-start', center:'center', end:'flex-end', spaceBetween:'space-between' }
const align = { start:'flex-start', center:'center', end:'flex-end', stretch:'stretch' }
</script>
<template><div class="a2-column" :style="{justifyContent:justify[props.payload.distribution]||'flex-start',alignItems:align[props.payload.alignment]||'stretch'}"><slot/></div></template>
<style scoped>.a2-column{display:flex;flex-direction:column;gap:12px}</style>
