<script setup lang="ts">
import Distribution from '@/components/simulator/Distribution.vue'
import Note from '@/components/Note.vue'
import NoteIcon from '@/components/NoteIcon.vue'

import { type ComponentPublicInstance, computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'

import Project, { type Expense } from '@/project'
import projectManager from '@/managers/projectManager'
import userManager from '@/managers/userManager'
import type { ID } from '@/types'

import PaymentsTable from './PaymentsTable.vue'
import { sexyNumber } from '@/formaters'

const props = defineProps<{ currentProject: Project }>()
const currentProject = reactive(props.currentProject)

const newExpense = ref<Omit<Expense, 'id'>>({ name: '', price: 0, quantity: 1 })
const newPayment = ref({ comment: '', resident: userManager.users[0]?.name, value: 0 })
const expenses = computed(() => currentProject.expenseSorted())
const newProjectName = ref('')
const isEditingProjectName = ref(false)

let inputRef : HTMLInputElement
const projectNameInput = ref<HTMLInputElement>()

const editedId = ref<ID>()
const editedType = ref('')
const editedExpenseName = ref('')

function setActiveInput(el: Element | ComponentPublicInstance | null) : void {
  if (el)
    inputRef = el as HTMLInputElement
}

/**** Edit expense name */

function cancelEditExpenseName() {
  editedId.value = undefined
  editedExpenseName.value = ''
  editedType.value = ''
}

function executeEditExpenseName() {
  if (editedId.value && editedExpenseName.value) {
    projectManager.updateCurrentProjectExpense(editedId.value, { name: editedExpenseName.value})
    cancelEditExpenseName()
  }
}

function startEditExpenseName(expense: Expense) {
  editedId.value = expense.id
  editedType.value = 'expenseName'
  editedExpenseName.value = expense.name
  nextTick(() => inputRef?.focus())
}

/**** Edit project name */

function startEditProjectName() : void {
  isEditingProjectName.value = true
  newProjectName.value = currentProject.name
  nextTick(() => projectNameInput.value?.focus())
}

function executeEditProjectName() : void {
  if (newProjectName.value)
    projectManager.update({ id: currentProject.id, name: newProjectName.value })
  cancelEditProjectName()
}

function cancelEditProjectName() : void {
  isEditingProjectName.value = false
  newProjectName.value = ''
}

/**** Create objects */
function expenseAdd() : void {
  if (!newExpense.value.name) return

  currentProject.expenseCreate(newExpense.value)
  newExpense.value = { name: '', price: 0, quantity: 1 }
}

function paymentAdd() : void {
  if (newPayment.value.resident) {
    currentProject.paymentCreate(newPayment.value)
    newPayment.value = { comment: '', resident: '', value: 0 }
  }
}

onMounted(() => {
  function handleClickOutside() : void {
    executeEditProjectName()
    executeEditExpenseName()
  }

  document.addEventListener('mousedown', handleClickOutside)
  const stop = watch(currentProject, project => projectManager.update(project))

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    stop()
  })
})
</script>

<template>
  <div class="d-flex justify-content-between col-md-11">
    <h3 v-if="isEditingProjectName">
      <input
        ref="projectNameInput"
        v-model="newProjectName"
        type="text"
        @keydown.enter="executeEditProjectName"
        @keydown.tab="executeEditProjectName"
        @keydown.esc="cancelEditProjectName"
      >
    </h3>
    <h3 v-else>
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
  </div>
  <hr class="mb-4 mt-0">
  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-6 mb-3">
      <span class="form-label fw-bold d-block">Liste des dépenses nécessaires</span>
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
              <td v-if="editedId === expense.id && editedType === 'expenseName'" class="align-middle">
                <input
                  :ref="el => setActiveInput(el)"
                  v-model="editedExpenseName"
                  class="char-width-20"
                  type="text"
                  @keydown.esc="cancelEditExpenseName"
                  @keydown.enter="executeEditExpenseName"
                  @keydown.tab="executeEditExpenseName"
                >
              </td>
              <td v-else class="editable-cell" @click="() => startEditExpenseName(expense)">
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
                {{ sexyNumber(expense.quantity * expense.price) }}
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
                  @click="() => currentProject.expenseDelete(expense.id)"
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
        <input
          v-model="newExpense.price"
          v-tooltip
          class="form-control"
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
    </div>
    <Distribution :total="expenses.sum" />
  </div>
  <div v-if="userManager.users.length > 0" class="row mt-3">
    <div class="col-sm-12 col-md-12 col-lg-6 mb-3">
      <span class="form-label fw-bold d-block">Payments réalisés par les habitants</span>
      <div v-if="Object.keys(currentProject.paymentsSorted()).length === 0">
        <p>
          Aucun payment n’a encore été fait.
        </p>
      </div>
      <div v-else class="table-responsive shadowed-border mb-3">
        <PaymentsTable :current-project="currentProject" />
      </div>
      <div class="input-group flex-sm-row">
        <select
          v-model="newPayment.resident"
          v-tooltip
          data-bs-placement="bottom"
          data-bs-title="Nom de l’habitant"
          class="form-select mt-2 mt-sm-0"
        >
          <option v-for="resident in userManager.users" :key="resident.name">
            {{ resident.name }}
          </option>
        </select>
        <input
          v-model="newPayment.value"
          v-tooltip
          class="form-control"
          data-bs-placement="bottom"
          data-bs-title="Valeur du payment"
          placeholder="Valeur"
          type="number"
          @keydown.enter="paymentAdd"
        >
        <input
          v-model="newPayment.comment"
          v-tooltip
          class="form-control"
          data-bs-placement="bottom"
          data-bs-title="Commentaire"
          type="text"
          placeholder="Commentaire"
          @keydown.enter="paymentAdd"
        >
        <button
          class="btn btn-secondary mt-2 mt-sm-0"
          :disabled="!(newPayment.value && newPayment.resident)"
          @click="paymentAdd"
        >
          Ajouter
        </button>
      </div>
    </div>
  </div>
</template>