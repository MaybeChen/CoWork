<template>
  <section class="a2-card a2-card-enter">
    <slot />
  </section>
</template>

<style scoped>
.a2-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 14px;
  transform-origin: top center;
}

.a2-card-enter {
  animation: card-grow-in 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes card-grow-in {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
</style>
