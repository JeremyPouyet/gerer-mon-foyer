<script setup lang="ts">
import '@/assets/secondary.scss'

import Distribution from '@/components/simulator/Distribution.vue'
import ViewTitle from '@/components/ViewTitle.vue'

import { onMounted, onUnmounted, ref, watch } from 'vue'

import { limitedEvaluate } from '@/helpers'
import settingManager from '@/managers/settingManager'
import { sexyAmount } from '@/formaters'
import BrowserStorage, { StorageKey } from '@/browserStorage'
import { Path } from '@/types'

let computedValue = ref(0)
const expenseValue = ref<string>('')

onMounted(() => {
  const simulatorValueStorage = new BrowserStorage(sessionStorage, StorageKey.SimulatorValue)
  expenseValue.value = simulatorValueStorage.get('')

  const watchers = [
    watch(expenseValue, value => simulatorValueStorage.set(value)),
  ]

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
  <div class="container mt-2">
    <ViewTitle :path="Path.Simulator" />
    <div class="row mb-4 mt-4">
      <div class="col-md-5 col-sm-12">
        <label for="expenseInput" class="form-label fw-bold">Prix ou formule</label>
        <div class="input-group mb-3">
          <span v-if="!settingManager.isCurrencySymbolOnRight()" class="input-group-text">
            {{ sexyAmount(computeValue()) }}
          </span>
          <input
            id="expenseInput"
            v-model="expenseValue"
            v-tooltip
            data-bs-placement="bottom"
            class="form-control"
            type="text"
            placeholder="Exemples: 500 ou 10 * 50 ou 1000 / 2"
            data-bs-title="Exemples:<ul><li class='text-start'>500</li><li class='text-start'>10 * 50</li><li class='text-start'>1000 / 2</li><li class='text-start'>250 + 250</li>"
          >
          <span v-if="settingManager.isCurrencySymbolOnRight()" class="input-group-text">
            {{ sexyAmount(computeValue()) }}
          </span>
        </div>
      </div>
      <Distribution :total="computeValue()" />
    </div>
  </div>
</template>