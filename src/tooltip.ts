import type { DirectiveBinding } from 'vue'
import Tooltip from 'bootstrap/js/dist/tooltip'

type TooltipElement = HTMLElement & {
  _tooltipClickHandler?: () => void ;
  _tooltipLongPressTimeout?: number;
  _longPressTriggered?: boolean;
}
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

export const tooltip = {
  async mounted(el: TooltipElement, binding: DirectiveBinding) {
    if (!el.dataset.bsTitle) return

    const tooltip = new Tooltip(el, {
      html: true,
      trigger: isTouchDevice && binding.value?.disposeOnClick ? 'manual' : 'hover focus'
    })

    if (binding.value?.disposeOnClick)
      if (isTouchDevice)
        setupTouchHandlers(el, tooltip)
      else
        setupClickHandler(el, tooltip)
  },

  unmounted(el: TooltipElement) {
    el._tooltipClickHandler?.()
    delete el._tooltipClickHandler
  }
}

function setupTouchHandlers(el: TooltipElement, tooltip: Tooltip) {
  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault() // Prevent default browser behavior (e.g., context menu on long press)
    el._longPressTriggered = false
    el._tooltipLongPressTimeout = window.setTimeout(() => {
      el._longPressTriggered = true
      tooltip.show() // Show tooltip on long press
    }, 400)
  }

  const handleTouchEnd = () => {
    clearTimeout(el._tooltipLongPressTimeout)
    tooltip.hide()

    if (!el._longPressTriggered)
      el.click() // Trigger the simple press action if no long press occurred
  }

  el.addEventListener('touchstart', handleTouchStart)
  el.addEventListener('touchend', handleTouchEnd)
  el.addEventListener('touchcancel', handleTouchEnd)

  // Store cleanup handler
  el._tooltipClickHandler = () => {
    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchend', handleTouchEnd)
    el.removeEventListener('touchcancel', handleTouchEnd)
    tooltip.dispose()
  }
}

function setupClickHandler(el: TooltipElement, tooltip: Tooltip) {
  const clickHandler = () => tooltip.hide()

  el.addEventListener('click', clickHandler)

  // Store cleanup handler
  el._tooltipClickHandler = () => {
    el.removeEventListener('click', clickHandler)
    tooltip.dispose()
  }
}