<script setup lang="ts">
import Distribution from '@/components/simulator/Distribution.vue'
import Note from '@/components/Note.vue'
import NoteIcon from '@/components/NoteIcon.vue'

import { type ComponentPublicInstance, computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'

import Project, { type Expense } from '@/project'
import projectManager from '@/managers/projectManager'
import { sexyAmount, sexyDate } from '@/formaters'
import userManager from '@/managers/userManager'
import { ID } from '@/types'

const props = defineProps<{ currentProject: Project }>()
const currentProject = reactive(props.currentProject)

const newExpense = ref<Omit<Expense, 'id'>>({ name: '', price: 0, quantity: 1 })
const newPayment = ref({ comment: '', resident: userManager.users[0]?.name, value: 0 })
const expenses = computed(() => currentProject.expenseSorted())
const newProjectName = ref('')
const projectNameInput = ref<HTMLInputElement>()
const isEditing = ref(false)

let input : HTMLInputElement

function setActiveInput(el: Element | ComponentPublicInstance | null) : void {
  if (el)
    input = el as HTMLInputElement
}

const editedId = ref<ID>()
const editedExpenseName = ref('')

/** Edit expense name */
function cancelEditExpenseName() {
  editedId.value = undefined
  editedExpenseName.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function executeEditExpenseName() {
  if (editedExpenseName.value) {
    // Add real update
    cancelEditExpenseName()
  }
}

function startEditExpenseName(expense: Expense) {
  editedId.value = expense.id
  editedExpenseName.value = expense.name
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => input?.focus())
}

/** Edit project name */

function startEditProjectName() : void {
  isEditing.value = true
  newProjectName.value = currentProject.name
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => projectNameInput.value?.focus())
}

function executeEditProjectName() : void {
  projectManager.update({ id: currentProject.id, name: newProjectName.value })
  cancelEditProjectName()
}

function cancelEditProjectName() : void {
  isEditing.value = false
  newProjectName.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function handleClickOutside(event: MouseEvent) : void {
  if (!projectNameInput.value?.contains(event.target as Node)) {
    executeEditProjectName()
    executeEditExpenseName()
  }
}

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
  const stop = watch(currentProject, project => projectManager.update(project))

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    stop()
  })
})
</script>

<template>
  <p class="mb-4">
    Pour un projet plus important, comme budgéter des vacances ou des travaux.
  </p>
  <div class="d-flex justify-content-between col-md-11">
    <div>
      <h3 v-if="isEditing">
        <input
          ref="projectNameInput"
          v-model="newProjectName"
          type="text"
          @keydown.enter="executeEditProjectName"
          @keydown.tab="executeEditProjectName"
          @keydown.esc="cancelEditProjectName"
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
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 col-sm-12 mb-3">
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
              <td class="align-middle">
                <template v-if="editedId === expense.id">
                  <input
                    :ref="el => setActiveInput(el)"
                    v-model="editedExpenseName"
                    class="char-width-20"
                    type="text"
                    @keydown.esc="cancelEditExpenseName"
                    @keydown.enter="executeEditExpenseName"
                    @keydown.tab="executeEditExpenseName"
                  >
                </template>
                <template v-else>
                  <span class="editable-text" @click="() => startEditExpenseName(expense)">
                    {{ expense.name }}
                  </span>
                  <NoteIcon :text="expense.note" />
                </template>
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
  <div class="row">
    <div class="col-md-6 col-sm-12">
      <span class="form-label fw-bold d-block">Payments réalisés par les habitants</span>
      <div v-if="Object.keys(currentProject.paymentsSorted()).length === 0">
        <p>
          Aucun payment n’a encore été fait.
        </p>
      </div>
      <div v-else class="table-responsive shadowed-border mb-3">
        <table v-for="(payments, resident) in currentProject.paymentsSorted()" :key="resident" class="table table-hover mb-0">
          <thead>
            <tr>
              <th colspan="4">
                {{ resident }} - Total payé : {{ sexyAmount(payments.sum) }}
              </th>
            </tr>
            <tr>
              <th scope="col">
                Date
              </th>
              <th scope="col" class="text-end">
                Valeur
              </th>
              <th scope="col" class="text-end">
                Commentaire
              </th>
              <th scope="col" class="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments.list" :key="payment.id">
              <td class="text-nowrap">
                {{ sexyDate(payment.date, false) }}
              </td>
              <td class="text-end align-middle">
                {{ payment.value }}
              </td>
              <td class="text-end align-middle">
                {{ payment.comment }}
              </td>
              <td class="text-end align-middle text-nowrap">
                <img
                  v-tooltip="{ disposeOnClick: true }"
                  src="@/assets/icons/cross.png"
                  alt="Supprimer le payment"
                  data-bs-title="Supprimer le payment"
                  class="icon-container-small icon-hoverable ms-2"
                  @click="() => currentProject.paymentDelete(payment.id)"
                >
              </td>
            </tr>
          </tbody>
        </table>
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