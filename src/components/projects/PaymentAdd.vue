<script setup lang="ts">
import { ref } from 'vue'

import Project, { type Payment } from '@/project'

import userManager from '@/managers/userManager'

const props = defineProps<{ currentProject: Project }>()
const firstInputRef = ref<HTMLSelectElement | null>(null)
const newPayment = ref({ comment: '', resident: userManager.users[0]?.name, value: undefined })

function paymentAdd() : void {
  const payment = { ...newPayment.value } as unknown as Omit<Payment, 'id' | 'date'>

  if (props.currentProject.paymentCreate(payment)) {
    newPayment.value = { comment: '', resident: newPayment.value.resident, value: undefined }
    firstInputRef.value?.focus()
  }
}
</script>

<template>
  <div class="input-group flex-sm-row">
    <select
      v-model="newPayment.resident"
      v-tooltip
      aria-label="Sélectionner l’habitant"
      class="form-select mt-2 mt-sm-0"
      data-bs-placement="bottom"
      data-bs-title="Nom de l’habitant"
    >
      <option v-for="resident in userManager.users" :key="resident.name">
        {{ resident.name }}
      </option>
    </select>
    <input
      ref="firstInputRef"
      v-model="newPayment.comment"
      v-tooltip
      aria-label="Commentaire (optionnel)"
      class="form-control mt-2 mt-sm-0"
      data-bs-placement="bottom"
      data-bs-title="Commentaire (optionnel)"
      placeholder="Commentaire"
      type="text"
      @keydown.enter="paymentAdd"
    >
    <div class="w-100 d-sm-none" />
    <input
      v-model="newPayment.value"
      v-tooltip
      aria-label="Valeur du payment"
      class="form-control mt-2 mt-sm-0"
      data-bs-placement="bottom"
      data-bs-title="Valeur du payment"
      min="0"
      placeholder="Valeur"
      type="number"
      @keydown.enter="paymentAdd"
    >
    <button
      class="btn btn-secondary mt-2 mt-sm-0"
      :disabled="!(typeof newPayment.value === 'number' && newPayment.resident)"
      @click="paymentAdd"
    >
      Ajouter
    </button>
  </div>
</template>
