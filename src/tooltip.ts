import { Tooltip } from 'bootstrap'

export const tooltip = {

  mounted(el: Element) {
    new Tooltip(el)
  }

}