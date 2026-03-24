<script setup>
const props = defineProps({
  as: { type: String, default: 'p' },
})
</script>

<template>
  <component :is="props.as" class="sweet-text"><slot /></component>
</template>

<style scoped>
.sweet-text {
  margin: 0;
  color: #e5e7eb;
  line-height: 1.65;
}

h1.sweet-text {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

h2.sweet-text {
  font-size: 24px;
  font-weight: 650;
}
</style>
