<script setup>
const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
})

function readPath(path) {
  if (!path || typeof path !== 'string') return undefined
  const normalized = path.replace(/^\//, '')
  if (!normalized) return props.dataModel
  return normalized
    .split('/')
    .filter(Boolean)
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), props.dataModel)
}

function decodeTextValue(textDef) {
  if (textDef == null) return ''
  if (typeof textDef === 'string') return textDef
  if (typeof textDef.valueString === 'string') return textDef.valueString
  if (typeof textDef.path === 'string') {
    const val = readPath(textDef.path)
    return val == null ? '' : String(val)
  }
  return ''
}

function textTag() {
  const hint = props.payload?.usageHint
  if (hint === 'h1') return 'h1'
  if (hint === 'h2') return 'h2'
  return 'p'
}
</script>

<template>
  <component :is="textTag()" class="sweet-text-builtin">{{ decodeTextValue(payload.text) }}</component>
</template>

<style scoped>
.sweet-text-builtin {
  margin: 0;
  color: #e5e7eb;
  line-height: 1.6;
}
h1.sweet-text-builtin {
  font-size: 28px;
}
h2.sweet-text-builtin {
  font-size: 22px;
}
</style>
