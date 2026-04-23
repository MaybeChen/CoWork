export const MODEL_OPTIONS = [
  { label: 'Qwen3.5', value: 'qwen3.5' },
  { label: 'Glm5', value: 'glm-5' },
  { label: 'Glm5.1', value: 'glm-5.1' },
]

export const DEFAULT_MODEL_LABEL = 'Qwen3.5'
const MODEL_STORAGE_KEY = 'cowork_demo_selected_model'

const MODEL_VALUE_BY_LABEL = Object.fromEntries(MODEL_OPTIONS.map((item) => [item.label, item.value]))

export function resolveModelValue(label) {
  return MODEL_VALUE_BY_LABEL[label] || MODEL_VALUE_BY_LABEL[DEFAULT_MODEL_LABEL]
}

export function getSavedModelLabel() {
  if (typeof window === 'undefined') return DEFAULT_MODEL_LABEL
  const saved = window.localStorage.getItem(MODEL_STORAGE_KEY)
  return saved && MODEL_VALUE_BY_LABEL[saved] ? saved : DEFAULT_MODEL_LABEL
}

export function saveModelLabel(label) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(MODEL_STORAGE_KEY, label)
}

export function withModelParam(endpoint, modelLabel) {
  const modelValue = resolveModelValue(modelLabel)
  const connector = endpoint.includes('?') ? '&' : '?'
  return `${endpoint}${connector}model=${encodeURIComponent(modelValue)}`
}
