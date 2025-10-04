<script setup lang="ts">
import '@/assets/secondary.scss'

import Distribution from '@/components/Distribution.vue'
import ExpenseAdd from '@/components/projects/ExpenseAdd.vue'
import PaymentAdd from '@/components/projects/PaymentAdd.vue'
import PaymentsTable from '@/components/projects/PaymentsTable.vue'
import ShowAmount from '@/components/helpers/ShowAmount.vue'

import { type ComponentPublicInstance, computed, reactive, ref } from 'vue'
import type { ID } from '@/types'
import projectManager from '@/managers/projectManager'
import { projectsAvatars } from '@/avatars/projects'
import { sexyNumber } from '@/formaters'
import { useEditable } from '@/helpers'
import { useRoute } from 'vue-router'

const route = useRoute()
const project = reactive(projectManager.getProject(route.params.id as ID))
const expenses = computed(() => project.expenseSorted())

let inputRef : HTMLInputElement

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

function btnDoneClick(id: ID, done: boolean) {
  project.expenseUpdate(id, { done })
}

/**** Note ****/
const editedNote = ref<string | undefined>()
function startEditingNote() {
  editedNote.value = project.note || ''
}

const cancelEditNote = () => editedNote.value = undefined

function saveEditedNote() {
  projectManager.update({ id: project.id, note: editedNote.value })
  cancelEditNote()
}

/**** Expenses ****/
function executeEditExpenseName() {
  executeEdit('name', (id, value) => {
    if (typeof value === 'string')
      project.expenseUpdate(id, { name: value })
  })
}

function executeEditExpenseQuantity() {
  executeEdit('quantity', (id, value) => {
    if (typeof value === 'number')
      project.expenseUpdate(id, { quantity: value})
  })
}

function executeEditExpensePrice() {
  executeEdit('price', (id, value) => {
    if (typeof value === 'number')
      project.expenseUpdate(id, { price: value})
  })
}
</script>

<template>
  <div class="container-fluid">
    <div class="d-flex align-items-start mb-2">
      <img aria-hidden="true" class="d-inline-block user-avatar shadow-sm me-2" :src="projectsAvatars[project.avatar]">
      <div>
        <h2 class="fs-3">
          {{ project.name }}
        </h2>
        <div v-if="editedNote !== undefined">
          <textarea
            v-model="editedNote"
            placeholder="Ajouter une note"
            @keydown.ctrl.enter="saveEditedNote"
            @keydown.esc="cancelEditNote"
          />
          <button class="btn btn-sm btn-light border" type="button" @click="saveEditedNote">
            <img alt="Sauvegarder" class="icon-container-small" src="@/assets/icons/diskette.png">
          </button>
        </div>
        <div v-else>
          <span v-if="project.note" contenteditable="true">
            {{ project.note }}
          </span>
          <span v-else class="fw-light fst-italic">
            Aucune note pour le moment
          </span>
          <button class="btn btn-sm btn-light p-1 border included ms-2" @click="startEditingNote">
            <img alt="Éditer une note" class="icon-container-small" src="@/assets/icons/pencil.png">
          </button>
        </div>
      </div>
    </div>
    <hr class="mb-4 mt-0">
    <div class="row">
      <div class="col-xl-12 col-xxl-6 mb-3">
        <span class="form-label fw-bold d-block">1. Je liste les dépenses nécessaires au projet</span>
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
                  Prix unitaire
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
                  <button
                    v-tooltip
                    class="btn"
                    :class="expense.done ? 'btn-primary' : 'btn-secondary'"
                    data-bs-title="Cliquer pour changer"
                    :for="`btn-${expense.id}`"
                    @click="btnDoneClick(expense.id, !expense.done)"
                  >
                    {{ expense.done ? 'Oui' : 'Non' }}
                  </button>
                </td>
                <td class="text-end align-middle text-nowrap">
                  <img
                    v-tooltip="{ disposeOnClick: true }"
                    alt="Supprimer la dépense"
                    class="icon-container-small icon-hoverable ms-2"
                    data-bs-title="Supprimer"
                    role="button"
                    src="@/assets/icons/cross.png"
                    tabindex="0"
                    @click="project.expenseDelete(expense.id)"
                    @keydown.enter="project.expenseDelete(expense.id)"
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ExpenseAdd :current-project="project" />
      </div>
      <Distribution :total="expenses.sum" :with-total="true" />
    </div>
    <div class="row mt-3">
      <div class="col-xl-12 col-xxl-6 mb-3">
        <span class="form-label fw-bold d-block">3. Je liste les payments réalisés par les habitants</span>
        <div v-if="project.paymentsSorted().list.length === 0">
          <p>
            Aucun payment n’a encore été fait.
          </p>
        </div>
        <div v-else class="table-responsive shadowed-border mb-3">
          <PaymentsTable :current-project="project" />
        </div>
        <PaymentAdd :current-project="project" />
      </div>
      <div class="col-xl-12 col-xxl-6 mb-3">
        <div>
          <span class="form-label fw-bold d-block">4. Répartition effectué des payments</span>
          <div v-if="project.paymentsSorted().list.length === 0">
            <p>
              Aucun payment n’a encore été fait.
            </p>
          </div>
          <ul class="list-group">
            <li
              v-for="(value, resident) in project.paymentsSorted().byUser"
              :key="resident"
              class="list-group-item d-flex align-items-center"
            >
              <div>
                <span class="fw-bold">{{ resident }}</span> a donné <ShowAmount :amount="value" />,
                soit <span class="fw-bold">{{ sexyNumber(value / project.paymentsSorted().sum, 'percent') }}</span> du montant.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>