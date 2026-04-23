import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export function useAutoScroll(options = {}) {
  const contentRef = ref(null)
  let mutationObserver
  let resizeObserver
  let scrollStopTimer
  let autoScrollTimer
  let postScrollTimer
  let shouldAutoScroll = true
  let isProgrammaticScroll = false
  let scrollScheduled = false
  let userInteracted = false
  const bottomOffsetThreshold = 20

  function getBottomOffset() {
    if (!contentRef.value) return 0
    const el = contentRef.value
    return Math.max(0, el.scrollHeight - (el.scrollTop + el.clientHeight))
  }

  async function smoothScrollToBottom() {
    await nextTick()
    if (contentRef.value) {
      const el = contentRef.value
      isProgrammaticScroll = true
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'auto',
      })
      el.scrollTop = el.scrollHeight
      requestAnimationFrame(() => {
        if (!contentRef.value) return
        contentRef.value.scrollTop = contentRef.value.scrollHeight
      })
      if (postScrollTimer) clearTimeout(postScrollTimer)
      postScrollTimer = setTimeout(() => {
        if (!contentRef.value) return
        contentRef.value.scrollTop = contentRef.value.scrollHeight
      }, 120)
      if (autoScrollTimer) clearTimeout(autoScrollTimer)
      autoScrollTimer = setTimeout(() => {
        isProgrammaticScroll = false
      }, 400)
      return
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    }
  }

  function scheduleAutoScroll({ force = false } = {}) {
    if (!shouldAutoScroll && !(force && !userInteracted)) return
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

  function shouldForceScrollOnMutation(mutations) {
    if (typeof options.mutationFilter === 'function') {
      return options.mutationFilter(mutations)
    }
    return hasNewSurface(mutations)
  }

  function onUserScroll() {
    if (isProgrammaticScroll) return
    userInteracted = true
    shouldAutoScroll = false
    if (scrollStopTimer) clearTimeout(scrollStopTimer)
    scrollStopTimer = setTimeout(() => {
      const bottomOffset = getBottomOffset()
      shouldAutoScroll = bottomOffset <= bottomOffsetThreshold
    }, 150)
  }

  onMounted(() => {
    if (!contentRef.value) return

    shouldAutoScroll = true
    userInteracted = false
    scheduleAutoScroll({ force: true })
    contentRef.value.addEventListener('scroll', onUserScroll, { passive: true })

    if (typeof MutationObserver === 'function') {
      mutationObserver = new MutationObserver((mutations) => {
        if (shouldForceScrollOnMutation(mutations)) {
          scheduleAutoScroll()
        }
      })
      mutationObserver.observe(contentRef.value, {
        childList: true,
        subtree: true,
        characterData: true,
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
    if (postScrollTimer) clearTimeout(postScrollTimer)
  })

  return {
    contentRef,
    scheduleAutoScroll,
  }
}
