<script setup>
const props = defineProps({
  direction: { type: String, default: 'column' },
  gap: { type: Number, default: 12 },
})
</script>

<template>
  <div class="sweet-stack" :style="{ '--gap': `${props.gap}px` }" :class="props.direction === 'row' ? 'row' : 'column'">
    <slot />
  </div>
</template>

<style scoped>
.sweet-stack {
  display: flex;
  gap: var(--gap);
}

.sweet-stack.column {
  flex-direction: column;
}

.sweet-stack.row {
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
