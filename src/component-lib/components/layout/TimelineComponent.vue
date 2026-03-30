<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, normalizeChildren, resolveComponentClasses, resolveText, resolveValue } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
})

const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

const events = computed(() => {
  const raw = normalizeChildren(props.payload?.items ?? props.payload?.events)
  return raw.map((item) => ({
    timestamp: resolveText(props.dataModel, item?.timestamp ?? item?.time ?? ''),
    title: resolveText(props.dataModel, item?.title ?? item?.label ?? ''),
    content: resolveText(props.dataModel, item?.content ?? item?.description ?? ''),
    type: resolveText(props.dataModel, item?.type ?? ''),
    color: resolveText(props.dataModel, item?.color ?? ''),
    size: resolveText(props.dataModel, item?.size ?? ''),
    hollow: Boolean(resolveValue(props.dataModel, item?.hollow ?? false)),
  }))
})
</script>

<template>
  <div v-if="!hidden" class="a2-timeline" :class="customClasses" :style="styleObject">
    <el-timeline>
      <el-timeline-item
        v-for="(evt, idx) in events"
        :key="idx"
        :timestamp="evt.timestamp"
        :type="evt.type || undefined"
        :color="evt.color || undefined"
        :size="evt.size || undefined"
        :hollow="evt.hollow"
      >
        <h4 v-if="evt.title" class="a2-tl-title">{{ evt.title }}</h4>
        <p v-if="evt.content" class="a2-tl-content">{{ evt.content }}</p>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style scoped>
.a2-timeline { width: 100%; }
.a2-tl-title { margin: 0 0 4px; font-size: 14px; color: #f8fafc; }
.a2-tl-content { margin: 0; color: rgba(248,250,252,.88); line-height: 1.55; }
</style>
