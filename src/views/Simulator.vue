<script setup lang="ts">
import { ref, watch } from 'vue'
import { limitedEvaluate, round } from '@/helpers'
import type User from '@/user'
import userManager from '@/userManager'

const expenseValue = ref<string>(sessionStorage.getItem('simulatorValue') || '')
let computedValue = 0

watch(expenseValue, () => sessionStorage.setItem('simulatorValue', expenseValue.value))

/**
 * Computes a user's contribution to an expense based on their ratio.
 *
 * Evaluates the `expenseValue` (which may be a formula), multiplies it by the user's ratio,
 * and returns the rounded result. If evaluation fails, it returns the last valid computed value.
 *
 * @param {User} user The user object containing the ratio.
 * @returns {number} The computed contribution for the user.
 */
function computeValue(user: User) : number {
  try {
    const value = round((limitedEvaluate(expenseValue.value) || 0) * user.ratio)
    if (!Number.isNaN(value))
      computedValue = value
  }
  catch { /* empty */ }
  return computedValue
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
          <RouterLink to="/expense-distribution">
            répartition des dépenses
          </RouterLink>
          pour savoir la somme que chaque habitant du foyer doit donner pour une dépense ponctuelle.
        </p>
        <label for="expenseInput" class="form-label">Valeur ou formule</label>

        <div class="input-group mb-3">
          <input
            id="expenseInput"
            v-model="expenseValue"
            class="form-control"
            type="text"
            placeholder="Exemples: 500 ou 10 * 50 ou 1000 / 2"
            title="Exemples: 500 ou 10 * 50 ou 1000 / 2"
          >
          <span class="input-group-text">€</span>
        </div>
      </div>

      <div class="col-md-6 mt-4 mt-md-0">
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
              {{ computeValue(user) }}€
            </div>
            <span class="badge bg-primary rounded-pill">
              Ratio de {{ round(user.ratio * 100) }}%
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>