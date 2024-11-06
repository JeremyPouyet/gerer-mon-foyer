<script setup lang="ts">
import '@/assets/secondary.scss'

import Note from '@/components/Note.vue'
import NoteIcon from '@/components/NoteIcon.vue'

import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

import { limitedEvaluate } from '@/helpers'
import SettingsManager from '@/SettingsManager'
import { sexyAmount } from '@/formaters'
import Project, { type Expense } from '@/project'
import Distribution from '@/components/simulator/distribution.vue'

let computedValue = ref(0)
const expenseValue = ref<string>('')
const projectStringified = localStorage.getItem('currentProject') || '{}'
const currentProject = reactive<Project>(new Project(JSON.parse(projectStringified)))
const newExpense = ref<Omit<Expense, 'id'>>({ name: '', price: 0, quantity: 0 })
const newProjectName = ref(currentProject.name)
const projectNameInput = ref<HTMLInputElement>()
const isEditing = ref(false)
const expenses = computed(() => currentProject.expenseSorted())

onMounted(() => {
  expenseValue.value = sessionStorage.getItem('simulatorValue') || ''

  watch(expenseValue, () => {
    sessionStorage.setItem('simulatorValue', expenseValue.value)
  })

  watch(currentProject, () => {
    localStorage.setItem('currentProject', JSON.stringify(currentProject))
  })
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

function expenseAdd() : void {
  if (!newExpense.value.name) return

  currentProject.create(newExpense.value)

  newExpense.value = { name: '', price: 0, quantity: 0 }
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
</script>

<template>
  <div class="container mt-2">
    <div class="mb-4">
      <h1>Simulateur</h1>
      <p>
        Ici on réutilise les ratios calculés lors de la
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <RouterLink class="text-primary-emphasis" to="/expense-distribution">création de votre budget</RouterLink> pour
        savoir la somme que chaque habitant du foyer doit donner pour une dépense ponctuelle ou un projet (travaux/vacances...).
      </p>
    </div>
    <!-- Quick simulator -->
    <div class="row mb-4">
      <h2>Simulation simple</h2>
      <hr>
      <small class="text-muted d-block mb-4">Pour un achat ponctuel type éléctroménager ou meuble</small>
      <div class="col-md-6">
        <label for="expenseInput" class="form-label fw-bold">Valeur ou formule</label>
        <div class="input-group mb-3">
          <span v-if="!SettingsManager.isCurrencySymbolOnRight()" class="input-group-text">
            {{ sexyAmount(computeValue()) }}
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
            {{ sexyAmount(computeValue()) }}
          </span>
        </div>
      </div>
      <Distribution :total="computeValue()" />
    </div>
    <div class="row mb-4">
      <h2>Simulation avancé</h2>
      <hr>
      <small class="text-muted d-block mb-4">Pour un projet plus important, comme budgéter les vacances ou des travaux</small>
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
      <div class="col-sm-12 col-md-6 mb-4">
        <span class="form-label fw-bold d-block">Dépenses</span>
        <div class="table-responsive shadowed-border mb-3">
          <table class="table table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">
                  Dépense
                </th>
                <th class="text-end" scope="col">
                  Quantitée
                </th>
                <th class="text-end" scope="col">
                  Prix
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
                  {{ expense.quantity }}
                </td>
                <td class="align-middle text-end">
                  {{ expense.price }}
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
            v-model="newExpense.quantity"
            class="form-control"
            placeholder="Quantité"
            type="number"
            @keydown.enter="expenseAdd"
          >
          <input
            v-model="newExpense.price"
            class="form-control"
            type="number"
            placeholder="Prix"
            @keydown.enter="expenseAdd"
          >
          <button class="btn btn-secondary mt-2 mt-sm-0" :disabled="!newExpense.name" @click="expenseAdd">
            Ajouter
          </button>
        </div>
      </div>
      <Distribution :total="expenses.sum" />
    </div>
  </div>
</template>