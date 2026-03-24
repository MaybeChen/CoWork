<script setup>
defineProps({
  interactive: { type: Boolean, default: false },
})
</script>

<template>
  <section class="sweet-card" :class="{ interactive }">
    <slot />
  </section>
</template>

<style scoped>
.sweet-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.sweet-card.interactive {
  cursor: pointer;
  transition: all 0.2s ease;
}

.sweet-card.interactive:hover {
  border-color: rgba(96, 165, 250, 0.5);
  transform: translateY(-1px);
}
</style>
