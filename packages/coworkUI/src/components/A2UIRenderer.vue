<script setup>
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import { A2UIComponentRenderer, defaultRegistry, defaultTheme } from '../a2ui-runtime'
import '../a2ui-runtime/style/common.css'
import '../a2ui-runtime/style/light.css'
import '../a2ui-runtime/style/dark.css'

const props = defineProps({
  surface: { type: Object, required: true },
  dataModel: { type: Object, default: () => ({}) },
  onAction: { type: Function, default: null },
  theme: { type: Object, default: null },
})

const emit = defineEmits(['request-start', 'request-progress', 'request-finish', 'request-error'])

const injectedTheme = inject('coworkui:theme', null)
const resolvedTheme = computed(() => props.theme || injectedTheme?.value || defaultTheme)
const workspaceClass = inject('coworkui:workspaceClass', 'coworkui-workspace')
const surfaceClass = computed(() => ['a2ui-surface', 'coworkui-workspace', workspaceClass].filter(Boolean).join(' '))
</script>

<template>
  <div v-if="surface?.root" :class="surfaceClass">
    <A2UIComponentRenderer
      :node-id="resolvedSurface.root"
      :components-by-id="resolvedSurface.componentsById || {}"
      :data-model="resolvedDataModel"
      :surface-id="resolvedSurface.id"
      :registry="defaultRegistry"
      :theme="resolvedTheme"
      :on-action="onAction"
    />
  </div>
  <div v-else class="empty-tip">Surface is waiting for root...</div>
</template>

<style scoped>
.empty-tip {
  color: #64748b;
  padding: 10px;
}
</style>
