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
    <el-timeline>
      <slot />
    </el-timeline>
  </div>
</template>

<style scoped>
.a2-timeline { width: 100%; }

.a2-timeline :deep(.el-timeline-item__tail) {
  border-left-color: #22c55e;
  border-left-width: 2px;
}

.a2-timeline :deep(.el-timeline-item__node) {
  background-color: #22c55e;
}
</style>
