<script setup lang="ts">
import { ref } from 'vue'

import type { Expense } from '@/project'
import Project from '@/project'

const props = defineProps<{ currentProject: Project }>()
const newExpense = ref({ name: '', price: undefined, quantity: undefined })
const firstInputRef = ref<HTMLInputElement | null>(null)

function expenseAdd() : void {
  const expense = { ...newExpense.value } as unknown as Omit<Expense, 'id'>

  if (props.currentProject.expenseCreate(expense)) {
    newExpense.value = { name: '', price: undefined, quantity: undefined }
    firstInputRef.value?.focus()
  }
}
</script>

<template>
  <div class="input-group flex-sm-row">
    <input
      ref="firstInputRef"
      v-model="newExpense.name"
      v-tooltip
      aria-label="Nom de la dépense"
      class="form-control"
      data-bs-placement="bottom"
      data-bs-title="Nom de la dépense"
      placeholder="Dépense"
      type="text"
      @keydown.enter="expenseAdd"
    >
    <input
      v-model="newExpense.quantity"
      v-tooltip
      aria-label="Quantité"
      class="form-control"
      data-bs-placement="bottom"
      data-bs-title="Quantité"
      placeholder="Quantité"
      type="number"
      @keydown.enter="expenseAdd"
    >
    <div class="w-100 d-sm-none" />
    <input
      v-model="newExpense.price"
      v-tooltip
      aria-label="Prix unitaire"
      class="form-control mt-2 mt-sm-0"
      data-bs-placement="bottom"
      data-bs-title="Prix unitaire"
      placeholder="Prix unitaire"
      type="number"
      @keydown.enter="expenseAdd"
    >
    <button
      class="btn btn-secondary mt-2 mt-sm-0"
      :disabled="!(newExpense.name && typeof newExpense.price === 'number' && typeof newExpense.quantity === 'number')"
      @click="expenseAdd"
    >
      Ajouter
    </button>
  </div>
</template>
