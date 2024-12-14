<script setup lang="ts">
import userManager from '@/managers/userManager'
import { sexyAmount, sexyNumber } from '@/formaters'

defineProps<{ total: number }>()
</script>

<template>
  <div class="col-md-5 col-sm-12 mt-0 mb-4">
    <span class="form-label fw-bold d-block">Répartition</span>
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
          <div class="fw-bold">
            {{ user.name }}
          </div>
          {{ sexyAmount(total * user.ratio) }}
        </div>
        <span class="badge bg-secondary rounded-pill">
          Ratio de {{ sexyNumber(user.ratio, 'percent') }}
        </span>
      </li>
    </ul>
  </div>
</template>