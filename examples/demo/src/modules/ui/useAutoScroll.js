import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export function useAutoScroll() {
  const contentRef = ref(null)
  let mutationObserver
  let resizeObserver
  let scrollStopTimer
  let autoScrollTimer
  let shouldAutoScroll = true
  let isProgrammaticScroll = false
  let scrollScheduled = false

  async function smoothScrollToBottom() {
    await nextTick()
    if (contentRef.value) {
      isProgrammaticScroll = true
      contentRef.value.scrollTo({
        top: contentRef.value.scrollHeight,
        behavior: 'smooth',
      })
      if (autoScrollTimer) clearTimeout(autoScrollTimer)
      autoScrollTimer = setTimeout(() => {
        isProgrammaticScroll = false
      }, 300)
      return
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    }
  }

  function scheduleAutoScroll({ force = false } = {}) {
    if (!force && !shouldAutoScroll) return
    if (scrollScheduled) return
    scrollScheduled = true
    const run = async () => {
      scrollScheduled = false
      await smoothScrollToBottom()
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
    if (isProgrammaticScroll) return
    shouldAutoScroll = false
    if (scrollStopTimer) clearTimeout(scrollStopTimer)
    scrollStopTimer = setTimeout(() => {
      shouldAutoScroll = true
      scheduleAutoScroll()
    }, 150)
  }

  onMounted(() => {
    if (!contentRef.value) return

    shouldAutoScroll = true
    scheduleAutoScroll({ force: true })
    contentRef.value.addEventListener('scroll', onUserScroll, { passive: true })

    if (typeof MutationObserver === 'function') {
      mutationObserver = new MutationObserver((mutations) => {
        if (hasNewSurface(mutations)) {
          scheduleAutoScroll()
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
    if (autoScrollTimer) clearTimeout(autoScrollTimer)
  })

  return {
    contentRef,
    scheduleAutoScroll,
  }
}
