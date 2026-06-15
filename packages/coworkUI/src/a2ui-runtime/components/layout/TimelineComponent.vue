<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
})

const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))
</script>

<template>
  <div v-if="!hidden" class="a2-timeline" :class="customClasses" :style="styleObject">
    <sweet-timeline>
      <slot />
    </sweet-timeline>
  </div>
</template>

<style scoped>
.a2-timeline {
  width: fit-content;
  max-width: 100%;
}

.a2-timeline :deep(ul) {
  padding-left: var(--swt-space-size-4);
}

.a2-timeline :deep(.el-timeline-item__tail) {
  display: block !important;
  border-left: none;
  left: var(--swt-space-size-4);
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--swt-color-function-success-background1) 0%, var(--swt-color-function-success-normal) 50%, var(--swt-color-function-success-background1) 100%);
}

.a2-timeline :deep(.a2ui-node .el-timeline-item__tail) {
  display: block !important;
}

.a2-timeline :deep(.a2ui-node:last-child .el-timeline-item__tail) {
  display: none !important;
}
</style>
