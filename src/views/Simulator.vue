<script setup lang="ts">
import { ref, watch } from 'vue'
import db from '@/db'
import { limitedEvaluate, round } from '@/helpers'

const expenseValue = ref<string>(sessionStorage.getItem('simulatorValue') || '')

watch(expenseValue, () => {
  sessionStorage.setItem('simulatorValue', expenseValue.value)
})
</script>

<template>
  <div class="container mt-2">
    <div v-if="!db.users.length">
      <p class="text-center">
        Ajoutez des utilisateurs pour voir la distribution d'une dépense ponctuelle
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
        <label for="expenseInput" class="form-label">Valeure ou formule</label>

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
            v-for="user in db.users"
            :key="user.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <div class="fw-bold">
                {{ user.name }}
              </div>
              {{ round((limitedEvaluate(expenseValue) || 0) * user.ratio) }}€
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