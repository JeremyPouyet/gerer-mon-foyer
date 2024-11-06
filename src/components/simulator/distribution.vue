<script setup lang="ts">
import userManager from '@/userManager'
import { sexyAmount, sexyNumber } from '@/formaters'

defineProps<{ total: number }>()
</script>

<template>
  <div class="col-md-6 mt-4 mt-md-0">
    <span class="form-label fw-bold d-block">Répartition</span>
    <p v-if="userManager.users.length === 0">
      Ajoutez des habitants pour voir la répartition.
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