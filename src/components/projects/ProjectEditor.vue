<script setup lang="ts">
import Distribution from '@/components/Distribution.vue'
import ExpenseAdd from '@/components/projects/ExpenseAdd.vue'
import Note from '@/components/Note.vue'
import NoteIcon from '@/components/NoteIcon.vue'
import PaymentAdd from '@/components/projects/PaymentAdd.vue'
import PaymentsTable from '@/components/projects/PaymentsTable.vue'

import { type ComponentPublicInstance, computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'

import Project from '@/project'
import projectManager from '@/managers/projectManager'
import userManager from '@/managers/userManager'

import { sexyNumber } from '@/formaters'
import { useEditable } from '@/helpers'
import type { ID } from '@/types'

const props = defineProps<{ currentProject: Project }>()
const currentProject = reactive(props.currentProject)

const expenses = computed(() => currentProject.expenseSorted())
const newProjectName = ref('')
const isEditingProjectName = ref(false)

let inputRef : HTMLInputElement
const projectNameInput = ref<HTMLInputElement>()

const {
  editedValue,
  editedId,
  editedType,
  startEdit,
  cancelEdit,
  executeEdit,
} = useEditable<number | string | undefined>()

function setActiveInput(el: Element | ComponentPublicInstance | null) : void {
  if (el)
    inputRef = el as HTMLInputElement
}

/**** Edit expense name */

function executeEditExpenseName() {
  executeEdit('name', (id, value) => {
    if (typeof value === 'string')
      currentProject.expenseUpdate(id, { name: value })
  })
}

function executeEditExpenseQuantity() {
  executeEdit('quantity', (id, value) => {
    if (typeof value === 'number')
      currentProject.expenseUpdate(id, { quantity: value})
  })
}

function executeEditExpensePrice() {
  executeEdit('price', (id, value) => {
    if (typeof value === 'number')
      currentProject.expenseUpdate(id, { price: value})
  })
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

function btnDoneClick(id: ID, done: boolean) {
  currentProject.expenseUpdate(id, { done })
}

onMounted(() => {
  function handleClickOutside(event: MouseEvent) : void {
    if (!inputRef?.contains(event.target as Node)) {
      executeEditProjectName()
      executeEditExpenseName()
      executeEditExpensePrice()
      executeEditExpenseQuantity()
    }
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
    <h2 v-if="isEditingProjectName" class="fs-3">
      <input
        ref="projectNameInput"
        v-model="newProjectName"
        type="text"
        @keydown.enter="executeEditProjectName"
        @keydown.esc="cancelEditProjectName"
        @keydown.tab="executeEditProjectName"
      >
    </h2>
    <h2 v-else class="fs-3">
      {{ currentProject.name }}
      <img
        v-tooltip="{ disposeOnClick: true }"
        alt="Éditer le nom du projet"
        class="icon-container-small ms-2 icon-hoverable"
        data-bs-title="Éditer le nom du projet"
        role="button"
        src="@/assets/icons/pencil.png"
        tabindex="0"
        @click="startEditProjectName"
        @keydown.enter="startEditProjectName"
      >
    </h2>
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
                Acheté ?
              </th>
              <th class="text-end" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenses.values" :key="expense.id">
              <td v-if="editedId === expense.id && editedType === 'name'" class="align-middle">
                <input
                  :ref="el => setActiveInput(el)"
                  v-model="editedValue"
                  class="char-width-20"
                  type="text"
                  @keydown.enter="executeEditExpenseName"
                  @keydown.esc="cancelEdit"
                  @keydown.tab="executeEditExpenseName"
                >
              </td>
              <td
                v-else
                class="align-middle editable-cell"
                role="button"
                tabindex="0"
                @click="startEdit(expense.id, 'name', expense.name, () => inputRef?.focus())"
                @keypress.enter="startEdit(expense.id, 'name', expense.name, () => inputRef?.focus())"
              >
                <span :class="`${expense.done ? 'text-body-secondary' : ''}`">{{ expense.name }}</span>
                <NoteIcon :text="expense.note" />
              </td>
              <td v-if="editedId === expense.id && editedType === 'quantity'" class="align-middle text-end">
                <input
                  :ref="el => setActiveInput(el)"
                  v-model="editedValue"
                  class="char-width-20"
                  type="number"
                  @keydown.enter="executeEditExpenseQuantity"
                  @keydown.esc="cancelEdit"
                  @keydown.tab="executeEditExpenseQuantity"
                >
              </td>
              <td
                v-else
                class="align-middle editable-cell text-end"
                role="button"
                tabindex="0"
                @click="startEdit(expense.id, 'quantity', expense.quantity, () => inputRef?.focus())"
                @keypress.enter="startEdit(expense.id, 'quantity', expense.quantity, () => inputRef?.focus())"
              >
                <span :class="`${expense.done ? 'text-body-secondary' : ''}`">{{ expense.quantity }}</span>
              </td>
              <td v-if="editedId === expense.id && editedType === 'price'" class="align-middle text-end">
                <input
                  :ref="el => setActiveInput(el)"
                  v-model="editedValue"
                  class="char-width-20"
                  type="number"
                  @keydown.enter="executeEditExpensePrice"
                  @keydown.esc="cancelEdit"
                  @keydown.tab="executeEditExpensePrice"
                >
              </td>
              <td
                v-else
                class="align-middle editable-cell text-end"
                role="button"
                tabindex="0"
                @click="startEdit(expense.id, 'price', expense.price, () => inputRef?.focus())"
                @keydown.enter="startEdit(expense.id, 'price', expense.price, () => inputRef?.focus())"
              >
                <span :class="`${expense.done ? 'text-body-secondary' : ''}`">{{ sexyNumber(expense.price) }}</span>
              </td>
              <td class="align-middle text-end" :class="`${expense.done ? 'text-body-secondary' : ''}`">
                {{ sexyNumber(expense.quantity * expense.price) }}
              </td>
              <td class="text-end">
                <input :id="`btn-${expense.id}`" autocomplete="off" :checked="expense.done" class="btn-check" type="checkbox">
                <label
                  class="btn btn-primary w-50"
                  :for="`btn-${expense.id}`"
                  @click="btnDoneClick(expense.id, !expense.done)"
                >
                  {{ expense.done ? 'Oui' : 'Non' }}
                </label>
              </td>
              <td class="text-end align-middle text-nowrap">
                <Note
                  :item="expense"
                  @update="note => expense.note = note"
                />
                <img
                  v-tooltip="{ disposeOnClick: true }"
                  alt="Supprimer la dépense"
                  class="icon-container-small icon-hoverable ms-2"
                  data-bs-title="Supprimer"
                  role="button"
                  src="@/assets/icons/cross.png"
                  tabindex="0"
                  @click="currentProject.expenseDelete(expense.id)"
                  @keydown.enter="currentProject.expenseDelete(expense.id)"
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
                {{ sexyNumber(expenses.sum) }}
              </td>
              <td colspan="2" />
            </tr>
          </tfoot>
        </table>
      </div>
      <ExpenseAdd :current-project="currentProject" />
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
      <PaymentAdd :current-project="currentProject" />
    </div>
  </div>
</template>