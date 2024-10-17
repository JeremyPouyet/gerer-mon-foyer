import type { DirectiveBinding } from 'vue'

type TooltipElement = HTMLElement & { _tooltipClickHandler?: () => void }

export const tooltip = {

  async mounted(el: TooltipElement, binding: DirectiveBinding) {
    if (!el.dataset.bsTitle) return

    const { default: Tooltip } = await import('bootstrap/js/dist/tooltip')

    const tooltip = new Tooltip(el, { html: true, trigger: 'hover focus'})

    if (!binding.value?.disposeOnClick) return

    const clickHandler = () => tooltip.hide()
    el.addEventListener('click', clickHandler)

    // Store the handler on the element for cleanup
    el._tooltipClickHandler = clickHandler
  },

  unmounted(el: TooltipElement) {
    if (!el._tooltipClickHandler) return

    // Remove the event listener if it was added
    el.removeEventListener('click', el._tooltipClickHandler)
    el._tooltipClickHandler()
    delete el._tooltipClickHandler
  }

}