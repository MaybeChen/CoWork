import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export function useAutoScroll(options = {}) {
  const contentRef = ref(null)
  let mutationObserver
  let resizeObserver
  let autoScrollTimer
  let stopSetScrollY = false
  let isProgrammaticScroll = false

  const bottomOffsetThreshold = 10

  function shouldHandleMutation(mutations) {
    if (typeof options.mutationFilter === 'function') return options.mutationFilter(mutations)
    return true
  }

  function setScrollY() {
    nextTick(() => {
      const el = contentRef.value
      if (!el || stopSetScrollY) return
      const areaHeight = el.scrollHeight
      isProgrammaticScroll = true
      el.scrollTop = areaHeight
      if (autoScrollTimer) clearTimeout(autoScrollTimer)
      autoScrollTimer = setTimeout(() => {
        isProgrammaticScroll = false
      }, 120)
    })
  }

  function onResize() {
    setScrollY()
  }

  function handleChatPageBottom() {
    const el = contentRef.value
    if (!el || isProgrammaticScroll) return

    const currScrollTop = el.scrollTop || 0
    const currClientHeight = el.clientHeight || 0
    const currScrollHeight = el.scrollHeight || 0
    stopSetScrollY = Math.abs(currScrollTop + currClientHeight - currScrollHeight) >= bottomOffsetThreshold
  }

  function scheduleAutoScroll({ force = false } = {}) {
    if (force) stopSetScrollY = false
    setScrollY()
  }

  onMounted(() => {
    const el = contentRef.value
    if (!el) return

    stopSetScrollY = false
    scheduleAutoScroll({ force: true })
    el.addEventListener('scroll', handleChatPageBottom, { passive: true })

    if (typeof MutationObserver === 'function') {
      const config = { attributes: true, childList: true, subtree: true }
      const handler = (mutations) => {
        if (!shouldHandleMutation(mutations)) return
        onResize()
      }
      mutationObserver = new MutationObserver(handler)
      mutationObserver.observe(el, config)
    }

    if (typeof ResizeObserver === 'function') {
      const handler = () => {
        onResize()
      }
      resizeObserver = new ResizeObserver(handler)
      resizeObserver.observe(el)
    }
  })

  onBeforeUnmount(() => {
    if (mutationObserver) mutationObserver.disconnect()
    if (resizeObserver) resizeObserver.disconnect()
    if (contentRef.value) contentRef.value.removeEventListener('scroll', handleChatPageBottom)
    if (autoScrollTimer) clearTimeout(autoScrollTimer)
  })

  return {
    contentRef,
    scheduleAutoScroll,
  }
}
