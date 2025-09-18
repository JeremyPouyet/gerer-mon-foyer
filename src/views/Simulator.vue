<script setup lang="ts">
import '@/assets/secondary.scss'

import Distribution from '@/components/Distribution.vue'
import ViewTitle from '@/components/ViewTitle.vue'

import { onMounted, onUnmounted, ref, watch } from 'vue'

import BrowserStorage, { StorageKey } from '@/browserStorage'
import { Path } from '@/types'
import { limitedEvaluate } from '@/helpers'
import settingManager from '@/managers/settingManager'
import { useScreenSize } from '@/composables/useScreenSize'

let computedValue = ref(0)
const expenseValue = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  const { isSmallerScreen } = useScreenSize(992)
  const simulatorValueStorage = new BrowserStorage(sessionStorage, StorageKey.SimulatorValue)
  expenseValue.value = simulatorValueStorage.get('')

  const watchers = [
    watch(expenseValue, value => simulatorValueStorage.set(value)),
  ]

  // On a large screen, autofocus the input
  if (!isSmallerScreen.value) inputRef.value?.focus()

  onUnmounted(() => {
    watchers.forEach(stop => stop())
  })
})

/**
 * Evaluates the `expenseValue` (which may be a formula) and returns the result.
 * If evaluation fails, it returns the last valid computed value.
 *
 * @returns {number} The computed value.
 */
function computeValue() : number {
  try {
    const value = (limitedEvaluate(expenseValue.value) || 0)
    if (!Number.isNaN(value))
      computedValue.value = value
  }
  catch { /* empty - otherwise an error would be shown when a user enters a symbol before entering a number */ }
  return computedValue.value
}
</script>

<template>
  <div class="container">
    <ViewTitle emoji="🛋️" :path="Path.Simulator" unpaded />
    <div class="row mb-4 mt-4">
      <div class="col-sm-12 col-md-12 col-lg-6">
        <label class="form-label fw-bold" for="expenseInput">1. Je donne la valeur de la dépense</label>
        <div class="input-group mb-3">
          <span v-if="!settingManager.isCurrencySymbolOnRight()" class="input-group-text">
            {{ settingManager.getCurrencySymbol() }}
          </span>
          <input
            id="expenseInput"
            ref="inputRef"
            v-model="expenseValue"
            v-tooltip
            class="form-control"
            data-bs-placement="bottom"
            data-bs-title="Exemples:<ul><li class='text-start'>500</li><li class='text-start'>10 * 50</li><li class='text-start'>1000 / 2</li><li class='text-start'>250 + 250</li>"
            placeholder="Exemples: 500 ou 10 * 50 ou 1000 / 2"
            type="text"
          >
          <span v-if="settingManager.isCurrencySymbolOnRight()" class="input-group-text">
            {{ settingManager.getCurrencySymbol() }}
          </span>
        </div>
      </div>
      <Distribution :total="computeValue()" />
    </div>
  </div>
</template>