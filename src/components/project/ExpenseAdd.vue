<script setup lang="ts">
import { ref } from 'vue'

import type { Expense } from '@/project'
import Project from '@/project'

const props = defineProps<{ currentProject: Project }>()

const newExpense = ref<Omit<Expense, 'id'>>({ name: '', price: 0, quantity: 1 })
const firstInputRef = ref<HTMLInputElement | null>(null)

function expenseAdd() : void {
  if (!newExpense.value.name) return

  props.currentProject.expenseCreate(newExpense.value)
  newExpense.value = { name: '', price: 0, quantity: 1 }
  firstInputRef.value?.focus()
}
</script>

<template>
  <div class="input-group flex-sm-row">
    <input
      ref="firstInputRef"
      v-model="newExpense.name"
      v-tooltip
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
      class="form-control"
      data-bs-placement="bottom"
      data-bs-title="Quantité"
      type="number"
      placeholder="Quantité"
      @keydown.enter="expenseAdd"
    >
    <div class="w-100 d-sm-none" />
    <input
      v-model="newExpense.price"
      v-tooltip
      class="form-control mt-2 mt-sm-0"
      data-bs-placement="bottom"
      data-bs-title="Prix"
      placeholder="Prix"
      type="number"
      @keydown.enter="expenseAdd"
    >
    <button class="btn btn-secondary mt-2 mt-sm-0" :disabled="!newExpense.name" @click="expenseAdd">
      Ajouter
    </button>
  </div>
</template>
