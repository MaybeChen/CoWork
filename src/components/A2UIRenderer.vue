<script setup>
import { computed } from 'vue'

const props = defineProps({
  surface: {
    type: Object,
    required: true,
  },
  dataModel: {
    type: Object,
    required: true,
  },
  onAction: {
    type: Function,
    required: true,
  },
})

const rootComponents = computed(() => {
  const candidate = props.surface?.components ?? []
  return Array.isArray(candidate) ? candidate : []
})

const valueFromPath = (path) => {
  if (!path || typeof path !== 'string') return undefined
  const normalized = path.replace(/^\$\.?/, '')
  return normalized.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), props.dataModel)
}

const resolveChildren = (component) => {
  if (Array.isArray(component.children)) return component.children
  if (Array.isArray(component.items)) return component.items
  return []
}

const typeMap = {
  heading: 'h2',
  title: 'h2',
  subtitle: 'h3',
  paragraph: 'p',
  text: 'p',
  caption: 'small',
  code: 'pre',
  markdown: 'pre',
}

const actionOf = (component) => component.action ?? component.onClick ?? null

const handleComponentAction = (component) => {
  const action = actionOf(component)
  if (!action) return
  props.onAction({
    actionName: action.name ?? action.actionName ?? 'unknown_action',
    surfaceId: props.surface.id,
    componentId: component.id,
    args: action.args ?? action.payload ?? {},
  })
}

const contentOf = (component) => {
  if (component.text != null) return component.text
  if (component.content != null) return component.content
  if (component.label != null) return component.label
  if (component.path != null) {
    const resolved = valueFromPath(component.path)
    return resolved == null ? '' : String(resolved)
  }
  return ''
}
</script>

<template>
  <div class="surface-wrapper">
    <div v-for="component in rootComponents" :key="component.id || component.key" class="node" :class="`node--${component.type || 'unknown'}`">
      <template v-if="component.type === 'button'">
        <button class="ui-button" :disabled="component.disabled" @click="handleComponentAction(component)">
          {{ contentOf(component) || 'Action' }}
        </button>
      </template>

      <template v-else-if="component.type === 'image'">
        <img class="ui-image" :src="component.src" :alt="component.alt || 'image'" />
      </template>

      <template v-else-if="component.type === 'chip' || component.type === 'badge'">
        <button class="ui-chip" @click="handleComponentAction(component)">{{ contentOf(component) }}</button>
      </template>

      <template v-else-if="component.type === 'row' || component.type === 'column' || component.type === 'container' || component.type === 'card'">
        <div class="ui-group" :class="`ui-group--${component.type}`">
          <A2UIRenderer
            :surface="{ id: surface.id, components: resolveChildren(component) }"
            :data-model="dataModel"
            :on-action="onAction"
          />
        </div>
      </template>

      <template v-else>
        <component :is="typeMap[component.type] || 'p'" class="ui-text" @click="handleComponentAction(component)">
          {{ contentOf(component) }}
        </component>
      </template>
    </div>
  </div>
</template>

<style scoped>
.surface-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(980px, 100%);
}

.node {
  width: 100%;
}

.ui-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
}

.ui-group--row {
  flex-direction: row;
  flex-wrap: wrap;
}

.ui-button,
.ui-chip {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: #f9fafb;
  padding: 8px 13px;
  cursor: pointer;
}

.ui-button:hover,
.ui-chip:hover {
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
}

.ui-text {
  margin: 0;
  color: #e5e7eb;
}

.ui-image {
  max-width: 100%;
  border-radius: 12px;
}
</style>
