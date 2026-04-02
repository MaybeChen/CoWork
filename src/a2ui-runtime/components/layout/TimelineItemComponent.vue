<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveText, resolveValue } from '../utils'
import dotIcon from '@/assets/dot.svg'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
})

const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

const timestamp = computed(() => resolveText(props.dataModel, props.payload?.timestamp ?? props.payload?.time ?? ''))
const type = computed(() => resolveText(props.dataModel, props.payload?.type ?? ''))
const color = computed(() => resolveText(props.dataModel, props.payload?.color ?? '#22c55e'))
const size = computed(() => resolveText(props.dataModel, props.payload?.size ?? ''))
const hollow = computed(() => Boolean(resolveValue(props.dataModel, props.payload?.hollow ?? false)))
</script>

<template>
  <sweet-timeline-item
    v-if="!hidden"
    class="a2-timeline-item"
    :class="customClasses"
    :style="styleObject"
    :timestamp="timestamp || undefined"
    :type="type || undefined"
    :color="color || undefined"
    :size="size || undefined"
    :hollow="hollow"
  >
    <template #dot>
      <img class="timeline-dot" :src="dotIcon" alt="" />
    </template>
    <slot />
  </sweet-timeline-item>
</template>

<style scoped>
.a2-timeline-item { width: 100%; }

.timeline-dot {
  width: 14px;
  height: 14px;
  display: block;
}
</style>
