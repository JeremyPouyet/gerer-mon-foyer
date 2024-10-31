<script setup lang="ts">
import '@/assets/secondary.scss'

import { onMounted, ref, watch } from 'vue'

import { limitedEvaluate } from '@/helpers'
import userManager from '@/userManager'
import SettingsManager from '@/SettingsManager'
import { sexyAmount, sexyNumber } from '@/formaters'

const expenseValue = ref<string>('')

onMounted(() => {
  expenseValue.value = sessionStorage.getItem('simulatorValue') || ''
})

let computedValue = ref(0)

watch(expenseValue, () => {
  sessionStorage.setItem('simulatorValue', expenseValue.value)
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
    <div v-if="!userManager.users.length">
      <p class="text-center">
        Ajoutez des utilisateurs pour voir la distribution d’une dépense ponctuelle
      </p>
    </div>
    <div v-else class="row">
      <div class="col-md-6">
        <p>
          Ici on réutilise les ratios calculés lors de la
          <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
          <RouterLink class="text-primary-emphasis" to="/expense-distribution">répartition des dépenses</RouterLink> pour
          savoir la somme que chaque habitant du foyer doit donner pour une dépense ponctuelle.
        </p>
        <label for="expenseInput" class="form-label fw-bold">Valeur ou formule</label>

        <div class="input-group mb-3">
          <span v-if="!SettingsManager.isCurrencySymbolOnRight()" class="input-group-text">
            {{ sexyAmount(computedValue) }}
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
          <span v-if="SettingsManager.isCurrencySymbolOnRight()" class="input-group-text">
            {{ sexyAmount(computedValue) }}
          </span>
        </div>
      </div>

      <div class="col-md-6 mt-4 mt-md-0 mb-4">
        <ul class="list-group">
          <li
            v-for="user in userManager.users"
            :key="user.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <div class="fw-bold">
                {{ user.name }}
              </div>
              {{ sexyAmount(computeValue() * user.ratio) }}
            </div>
            <span class="badge bg-secondary rounded-pill">
              Ratio de {{ sexyNumber(user.ratio, 'percent') }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>