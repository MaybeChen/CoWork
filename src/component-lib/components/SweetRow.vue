<script setup>
const props = defineProps({
  payload: { type: Object, default: () => ({}) },
})

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
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
    class="sweet-row"
    :style="{
      justifyContent: justifyMap[payload.distribution] || 'flex-start',
      alignItems: alignMap[payload.alignment] || 'stretch',
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.sweet-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
