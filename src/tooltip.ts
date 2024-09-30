import { Tooltip } from 'bootstrap'
import type { DirectiveBinding } from 'vue'

export const tooltip = {

  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (!el.dataset.bsTitle) return

    const tooltip = new Tooltip(el, { html: true, trigger: 'hover focus'})

    if (binding.value?.disposeOnClick)
      el.addEventListener('click', () => tooltip.dispose())
  }

}