import { ref, watch } from 'vue'

class UnsavedManager {
  readonly count = ref<number>(0)

  constructor() {
    this.#load()
    watch(this.count, () => this.#save())
  }

  increment() {
    ++this.count.value
  }

  #load() {
    const unsavedChanges = localStorage.getItem('unsavedChanges') || '0'
    this.count.value = +unsavedChanges
  }

  reset() {
    this.count.value = 0
  }

  #save() {
    localStorage.setItem('unsavedChanges', this.count.value.toString())
  }
}

export default new UnsavedManager()