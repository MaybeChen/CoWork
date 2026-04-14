import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export function useAutoScroll() {
  const contentRef = ref(null)
  let mutationObserver
  let resizeObserver
  let scrollStopTimer
  let userScrolling = false
  let scrollScheduled = false
  const BOTTOM_THRESHOLD = 20

  function distanceToBottom() {
    if (!contentRef.value) return Number.POSITIVE_INFINITY
    const el = contentRef.value
    return el.scrollHeight - el.scrollTop - el.clientHeight
  }

  function isNearBottom() {
    return distanceToBottom() <= BOTTOM_THRESHOLD
  }

  async function scrollToBottom() {
    await nextTick()
    if (contentRef.value) {
      contentRef.value.scrollTo({
        top: contentRef.value.scrollHeight,
        behavior: 'smooth',
      })
      return
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    }
  }

  function scheduleAutoScroll({ force = false } = {}) {
    if (!force) {
      if (userScrolling) return
      if (!isNearBottom()) return
    }
    if (scrollScheduled) return
    scrollScheduled = true
    const run = async () => {
      scrollScheduled = false
      await scrollToBottom()
    }
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
    else setTimeout(run, 0)
  }

  function hasNewSurface(mutations) {
    return mutations.some((mutation) =>
      Array.from(mutation.addedNodes || []).some((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return false
        const el = /** @type {Element} */ (node)
        return el.classList.contains('surface') || !!el.querySelector('.surface')
      }),
    )
  }

  function onUserScroll() {
    userScrolling = true
    if (scrollStopTimer) clearTimeout(scrollStopTimer)
    scrollStopTimer = setTimeout(() => {
      userScrolling = false
      if (isNearBottom()) {
        scheduleAutoScroll()
      }
    }, 120)
  }

  onMounted(() => {
    if (!contentRef.value) return

    scheduleAutoScroll({ force: true })
    contentRef.value.addEventListener('scroll', onUserScroll, { passive: true })

    if (typeof MutationObserver === 'function') {
      mutationObserver = new MutationObserver((mutations) => {
        if (hasNewSurface(mutations)) {
          scheduleAutoScroll({ force: true })
        }
      })
      mutationObserver.observe(contentRef.value, {
        childList: true,
        subtree: true,
      })
    }

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(() => {
        scheduleAutoScroll()
      })
      resizeObserver.observe(contentRef.value)
    }
  })

  onBeforeUnmount(() => {
    if (mutationObserver) mutationObserver.disconnect()
    if (resizeObserver) resizeObserver.disconnect()
    if (contentRef.value) contentRef.value.removeEventListener('scroll', onUserScroll)
    if (scrollStopTimer) clearTimeout(scrollStopTimer)
  })

  return {
    contentRef,
    scheduleAutoScroll,
  }
}
