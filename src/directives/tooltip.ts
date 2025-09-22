import type { DirectiveBinding } from 'vue'
import Tooltip from 'bootstrap/js/dist/tooltip'

/**
 * Extended HTMLElement type for tooltip directive,
 * with support for storing cleanup handlers and state
 * related to long-press interactions on touch devices.
 */
type TooltipElement = HTMLElement & {
  _tooltipClickHandler?: () => void ;
  _tooltipLongPressTimeout?: number;
  _longPressTriggered?: boolean;
}


/**
 * Utility to detect if the current device supports touch input.
 */
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

/**
 * Vue directive `v-tooltip`.
 *
 * Attaches a Bootstrap tooltip to an element, with support for:
 * - Standard hover/focus triggers on desktop devices.
 * - Manual long-press or click-to-dismiss behavior on touch devices.
 *
 * @param el - The target element to attach the tooltip.
 * @param binding - Vue directive binding object.
 *   - `disposeOnClick`: If `true`, hides and disposes the tooltip after a click or tap.
 */
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

/**
 * Sets up a click handler to hide tooltips on non-touch devices
 * when `disposeOnClick` is enabled.
 *
 * @param el - The element to attach handlers to.
 * @param tooltip - The Bootstrap tooltip instance.
 */
function setupClickHandler(el: TooltipElement, tooltip: Tooltip) {
  const clickHandler = () => tooltip.hide()

  el.addEventListener('click', clickHandler)

  // Store cleanup handler
  el._tooltipClickHandler = () => {
    el.removeEventListener('click', clickHandler)
    tooltip.dispose()
  }
}