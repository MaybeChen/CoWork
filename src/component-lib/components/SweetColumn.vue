<script setup>
const props = defineProps({
  payload: { type: Object, default: () => ({}) },
})

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  spaceBetween: 'space-between',
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
}
</script>

<template>
  <div
    class="sweet-col"
    :style="{
      justifyContent: justifyMap[payload.distribution] || 'flex-start',
      alignItems: alignMap[payload.alignment] || 'stretch',
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.sweet-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
