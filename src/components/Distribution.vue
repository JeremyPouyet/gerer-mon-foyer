<script setup lang="ts">
import ShowAmount from './helpers/ShowAmount.vue'

import { sexyNumber } from '@/formaters'
import userManager from '@/managers/userManager'

defineProps<{ total: number, withTotal?: boolean }>()
</script>

<template>
  <div class="col-sm-12 col-md-12 col-lg-6 mt-0 mb-4">
    <p class="mb-1">
      <span class="fw-bold">2. Répartition théorique du montant</span>
      <span v-if="userManager.users.length > 0 && withTotal">
        - pour un total de <ShowAmount :amount="total" /> :
      </span>
    </p>
    <p v-if="userManager.users.length === 0">
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <RouterLink class="text-primary-emphasis" to="/budget">Ajoutez des habitants et leurs revenus</RouterLink> pour voir la répartition des dépenses.
    </p>
    <ul class="list-group">
      <li
        v-for="user in userManager.users"
        :key="user.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <span class="fw-bold">{{ user.name }}</span> doit donner <ShowAmount :amount="total * user.ratio" />
        </div>
        <span class="badge bg-secondary rounded-pill">
          Ratio de {{ sexyNumber(user.ratio, 'percent') }}
        </span>
      </li>
    </ul>
  </div>
</template>