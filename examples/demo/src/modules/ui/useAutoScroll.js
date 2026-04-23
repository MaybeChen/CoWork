import { nextTick, ref } from 'vue'

export function useAutoScroll(options = {}) {
  const contentRef = ref(null)
  let mutationObserver
  let resizeObserver
  let autoScrollTimer
  let stopSetScrollY = false
  let isProgrammaticScroll = false

  const bottomOffsetThreshold = 10

  function getElement() {
    return contentRef.value
  }

  function shouldHandleMutation(mutations) {
    if (typeof options.mutationFilter === 'function') return options.mutationFilter(mutations)
    return true
  }

  function setScrollY() {
    nextTick(() => {
      const el = getElement()
      if (!el || stopSetScrollY) return
      isProgrammaticScroll = true
      el.scrollTop = el.scrollHeight
      if (autoScrollTimer) clearTimeout(autoScrollTimer)
      autoScrollTimer = setTimeout(() => {
        isProgrammaticScroll = false
      }, 120)
    })
  }

  function onResize() {
    setScrollY()
  }

  function handleScroll() {
    const el = getElement()
    if (!el || isProgrammaticScroll) return

    const currScrollTop = el.scrollTop || 0
    const currClientHeight = el.clientHeight || 0
    const currScrollHeight = el.scrollHeight || 0
    stopSetScrollY = Math.abs(currScrollTop + currClientHeight - currScrollHeight) >= bottomOffsetThreshold
  }

  function cleanupObservers() {
    if (mutationObserver) {
      mutationObserver.disconnect()
      mutationObserver = null
    }
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    const el = getElement()
    if (el) el.removeEventListener('scroll', handleScroll)
    if (autoScrollTimer) clearTimeout(autoScrollTimer)
  }

  function bindElement(el) {
    if (!el) return
    cleanupObservers()
    contentRef.value = el

    stopSetScrollY = false
    scheduleAutoScroll({ force: true })
    el.addEventListener('scroll', handleScroll, { passive: true })

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
  }

  function unbindElement(el) {
    if (el) el.removeEventListener('scroll', handleScroll)
    cleanupObservers()
    if (contentRef.value === el) contentRef.value = null
  }

  function scheduleAutoScroll({ force = false } = {}) {
    if (force) {
      stopSetScrollY = false
      const el = getElement()
      if (el) el.scrollTop = el.scrollHeight
      setScrollY()
      return
    }
    if (stopSetScrollY) return
    setScrollY()
  }

  const directive = {
    mounted(el) {
      bindElement(el)
    },
    updated(el) {
      if (contentRef.value !== el) bindElement(el)
    },
    unmounted(el) {
      unbindElement(el)
    },
  }

  return {
    contentRef,
    scheduleAutoScroll,
    directive,
  }
}
