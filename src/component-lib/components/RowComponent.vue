<script setup>
const props = defineProps({ payload: { type: Object, default: () => ({}) } })
const justify = { start:'flex-start', center:'center', end:'flex-end', spaceBetween:'space-between', spaceAround:'space-around', spaceEvenly:'space-evenly' }
const align = { start:'flex-start', center:'center', end:'flex-end', stretch:'stretch' }
</script>
<template><div class="a2-row" :style="{justifyContent:justify[props.payload.distribution]||'flex-start',alignItems:align[props.payload.alignment]||'stretch'}"><slot/></div></template>
<style scoped>.a2-row{display:flex;flex-wrap:wrap;gap:12px}</style>
