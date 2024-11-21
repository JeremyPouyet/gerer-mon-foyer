<script setup lang="ts">
import Distribution from '@/components/simulator/Distribution.vue'
import Note from '@/components/Note.vue'
import NoteIcon from '@/components/NoteIcon.vue'

import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'

import Project, { type Expense, ProjectStates } from '@/project'
import projectManager from '@/managers/projectManager'

const props = defineProps<{ currentProject: Project }>()
const currentProject = reactive(props.currentProject)

const newExpense = ref<Omit<Expense, 'id'>>({ name: '', price: 0, quantity: 1 })
const newPayment = ref({ comment: '', resident: '', value: null })
const expenses = computed(() => currentProject.expenseSorted())
const projectState = ref(currentProject.state)
const newProjectName = ref('')
const projectNameInput = ref<HTMLInputElement>()
const isEditing = ref(false)

function expenseAdd() : void {
  if (!newExpense.value.name) return

  currentProject.create(newExpense.value)

  newExpense.value = { name: '', price: 0, quantity: 1 }
}

function startEditProjectName() : void {
  isEditing.value = true
  newProjectName.value = currentProject.name
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => projectNameInput.value?.focus())
}

function executeEditName() : void {
  projectManager.update({ id: currentProject.id, name: newProjectName.value })
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

function moveState() : void {
  if (currentProject.state === ProjectStates.Ended)
    return

  const nextState = {
    [ProjectStates.Started]: ProjectStates.Frozen,
    [ProjectStates.Frozen]: ProjectStates.Ended
  }[currentProject.state]

  projectManager.update({ id: currentProject.id, state: nextState })
  projectState.value = nextState
  if (currentProject.state === ProjectStates.Frozen)
    currentProject.freeze()
}

function paymentAdd() : void {

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
    </div>
    <div>
      <button
        v-if="projectState === ProjectStates.Started"
        v-tooltip="{ disposeOnClick: true }"
        class="btn btn-secondary"
        data-bs-title="Le projet ne sera plus éditable, les ratios et les montants seront figés. Cela indique que le projet est définis et que les habitants peuvent commencer les payments."
        @click="moveState"
      >
        Figer le projet
      </button>
      <button
        v-else-if="projectState === ProjectStates.Frozen"
        v-tooltip="{ disposeOnClick: true }"
        class="btn btn-secondary"
        data-bs-title="Le projet sera considéré comme terminé."
        @click="moveState"
      >
        Marquer comme terminé
      </button>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 col-sm-12">
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
      <div v-if="projectState === ProjectStates.Started" class="input-group flex-sm-row">
        <input
          v-model="newExpense.name"
          class="form-control"
          placeholder="Dépense"
          type="text"
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
        <input
          v-model="newExpense.price"
          v-tooltip
          class="form-control"
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
  <div v-if="projectState !== ProjectStates.Started" class="row">
    <div class="col-md-6 col-sm-12">
      <span class="form-label fw-bold d-block">Payments</span>
      <div class="table-responsive shadowed-border mb-3">
        <table class="table table-hover mb-0">
          <template v-for="(payments, resident) in currentProject.paymentsSorted()" :key="resident">
            <tr>
              <th colspan="3">
                {{ resident }} - Total 450
              </th>
            </tr>
            <tr>
              <th>Date</th>
              <th>Valeur</th>
              <th>Commentaire</th>
            </tr>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ payment.date }}</td>
              <td>{{ payment.value }}</td>
              <td>{{ payment.comment }}</td>
            </tr>
          </template>
        </table>
      </div>
      <div v-if="projectState === ProjectStates.Frozen" class="input-group flex-sm-row">
        <select
          v-model="newPayment.resident"
          class="form-select mt-2 mt-sm-0"
        >
          <option v-for="resident in currentProject.residents" :key="resident.name">
            {{ resident.name }}
          </option>
        </select>
        <input
          v-model="newPayment.value"
          class="form-control"
          placeholder="Valeur"
          type="number"
          @keydown.enter="paymentAdd"
        >
        <input
          v-model="newPayment.comment"
          v-tooltip
          class="form-control"
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