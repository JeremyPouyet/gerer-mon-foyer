<script setup lang="ts">
import Note from '@/components/Note.vue'
import NoteIcon from '@/components/NoteIcon.vue'

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import Project, { type Expense } from '@/project'
import projectManager from '@/managers/projectManager'

const { currentProject } = defineProps<{ currentProject: Project }>()

function expenseAdd() : void {
  if (!newExpense.value.name) return

  currentProject.create(newExpense.value)

  newExpense.value = { name: '', price: 0, quantity: 1 }
}

function startEditProjectName() {
  isEditing.value = true
  newProjectName.value = currentProject.name
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => projectNameInput.value?.focus())
}

function executeEditName() : void {
  currentProject.name = newProjectName.value
  cancelEdit()
}

function cancelEdit() : void {
  isEditing.value = false
  newProjectName.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function handleClickOutside(event: MouseEvent) : void {
  if (!projectNameInput.value?.contains(event.target as Node)) executeEditName()
}

const newExpense = ref<Omit<Expense, 'id'>>({ name: '', price: 0, quantity: 1 })
const expenses = computed(() => currentProject.expenseSorted())
const newProjectName = ref(currentProject.name)
const projectNameInput = ref<HTMLInputElement>()
const isEditing = ref(false)

onMounted(() => {
  const stop = watch(() => currentProject, project => projectManager.update(project))

  onUnmounted(() => stop())
})
</script>

<template>
  <small class="text-muted d-block mb-4">Pour un projet plus important, comme budgéter des vacances ou des travaux.</small>
  <h3 v-if="isEditing">
    <input
      ref="projectNameInput"
      v-model="newProjectName"
      type="text"
      @keydown.enter="executeEditName"
      @keydown.tab="executeEditName"
      @keydown.esc="cancelEdit"
    >
  </h3>
  <h3 v-else class="mb-4">
    {{ currentProject.name }}
    <img
      v-tooltip="{ disposeOnClick: true }"
      alt="Éditer le nom du projet"
      class="icon-container-small ms-2 icon-hoverable"
      data-bs-title="Éditer le nom du projet"
      src="@/assets/icons/pencil.png"
      @click="startEditProjectName"
    >
  </h3>
  <div class="row">
    <div class="col-md-5 col-sm-12">
      <span class="form-label fw-bold d-block">Dépenses</span>
      <div class="table-responsive shadowed-border mb-3">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th scope="col">
                Dépense
              </th>
              <th class="text-end" scope="col">
                Prix
              </th>
              <th class="text-end" scope="col">
                Quantitée
              </th>
              <th class="text-end" scope="col">
                Total
              </th>
              <th class="text-end" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenses.values" :key="expense.id">
              <td class="align-middle">
                <span>{{ expense.name }}</span>
                <NoteIcon :text="expense.note" />
              </td>
              <td class="align-middle text-end">
                {{ expense.price }}
              </td>
              <td class="align-middle text-end">
                {{ expense.quantity }}
              </td>
              <td class="align-middle text-end">
                {{ expense.quantity * expense.price }}
              </td>
              <td class="text-end align-middle text-nowrap">
                <Note
                  :item="expense"
                  @update="note => expense.note = note"
                />
                <img
                  v-tooltip="{ disposeOnClick: true }"
                  src="@/assets/icons/cross.png"
                  alt="Supprimer"
                  data-bs-title="Supprimer"
                  class="icon-container-small icon-hoverable ms-2"
                  @click="() => currentProject.delete(expense.id)"
                >
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="fw-bold">
                Total
              </td>
              <td class="text-end" colspan="3">
                {{ expenses.sum }}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="input-group flex-sm-row">
        <input
          v-model="newExpense.name"
          class="form-control"
          placeholder="Dépense"
          type="text"
          @keydown.enter="expenseAdd"
        >
        <input
          v-model="newExpense.price"
          v-tooltip
          class="form-control"
          data-bs-title="Prix"
          placeholder="Prix"
          type="number"
          @keydown.enter="expenseAdd"
        >
        <input
          v-model="newExpense.quantity"
          v-tooltip
          class="form-control"
          data-bs-title="Quantité"
          type="number"
          placeholder="Quantité"
          @keydown.enter="expenseAdd"
        >
        <button class="btn btn-secondary mt-2 mt-sm-0" :disabled="!newExpense.name" @click="expenseAdd">
          Ajouter
        </button>
      </div>
    </div>
    <Distribution :total="expenses.sum" />
  </div>
</template>