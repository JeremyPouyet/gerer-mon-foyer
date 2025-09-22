import type { DirectiveBinding } from 'vue'

type ClickOutsideElement = HTMLElement & {
  _clickOutsideHandler?: (event: MouseEvent) => void
}

/**
 * Vue directive `v-click-outside`.
 *
 * Calls the provided handler when a click event occurs outside the bound element.
 */
export const vClickOutside = {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
    // Deffer adding the trigger to prevent the current click to trigger the callback
    setTimeout(() => {
      el._clickOutsideHandler = (event: MouseEvent) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event)
        }
      }
      document.addEventListener('click', el._clickOutsideHandler)
    })
  },
  unmounted(el: ClickOutsideElement) {
    if (el._clickOutsideHandler)
      document.removeEventListener('click', el._clickOutsideHandler)
  },
}