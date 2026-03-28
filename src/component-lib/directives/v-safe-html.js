import DOMPurify from '../vendors/dompurify'

function apply(el, value) {
  const next = DOMPurify.sanitize(String(value ?? ''))
  if (el.__safeHtml !== next) {
    el.__safeHtml = next
    el.innerHTML = next
  }
}

export const vSafeHtml = {
  mounted(el, binding) {
    apply(el, binding.value)
  },
  updated(el, binding) {
    apply(el, binding.value)
  },
}
