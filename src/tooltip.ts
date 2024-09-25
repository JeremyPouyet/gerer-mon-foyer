import { Tooltip } from 'bootstrap'

export const tooltip = {

  mounted(el: HTMLElement) {
    if (el.dataset.bsTitle)
      new Tooltip(el, { html: true, trigger: 'hover focus' })
  }

}