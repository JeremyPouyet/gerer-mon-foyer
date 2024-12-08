<script setup lang="ts">
import VueDatePicker, { type DatePickerInstance } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { sexyAmount, sexyDate, sexyNumber } from '@/formaters'
import { type ComponentPublicInstance, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import type Project from '@/project'
import type { Payment } from '@/project'
import projectManager from '@/managers/projectManager'
import type { ID } from '@/types'

const props = defineProps<{ currentProject: Project }>()
const currentProject = reactive(props.currentProject)

let inputRef : HTMLInputElement
const editedValue = ref<number|string|Date>()
const editedId = ref<ID>()
const editedType = ref('')

const datepicker = ref<DatePickerInstance[]>([])

function setActiveInput(el: Element | ComponentPublicInstance | null) : void {
  if (el)
    inputRef = el as HTMLInputElement
}

/**** Edit payment date */

function startEditDate(payment: Payment) {
  editedType.value = 'date'
  editedId.value = payment.id
  editedValue.value = new Date(payment.date)
  nextTick(() => datepicker.value[0]?.openMenu())
}

function executeEditDate(newDate: Date) {
  editedValue.value = newDate
  if (editedId.value && editedValue.value) {
    projectManager.updateCurrentProjectPayment(editedId.value, { date: editedValue.value.toISOString() })
    cancelEdit()
  }
}

/**** Edit payment value */

function startEditValue(payment: Payment) {
  editedType.value = 'value'
  editedId.value = payment.id
  editedValue.value = payment.value
  nextTick(() => inputRef?.focus())
}

function executeEditValue() {
  if (editedId.value && typeof editedValue.value === 'number') {
    projectManager.updateCurrentProjectPayment(editedId.value, { value: editedValue.value })
    cancelEdit()
  }
}

/**** Edit payment comment */

function startEditComment(payment: Payment) {
  editedType.value = 'comment'
  editedId.value = payment.id
  editedValue.value = payment.comment
  nextTick(() => inputRef?.focus())
}

function executeEditComment() {
  if (editedId.value && typeof editedValue.value === 'string') {
    projectManager.updateCurrentProjectPayment(editedId.value, { comment: editedValue.value })
    cancelEdit()
  }
}

function cancelEdit() {
  editedId.value = undefined
  editedValue.value = undefined
  editedType.value = ''
}

onMounted(() => {
  function handleClickOutside() : void {
    executeEditValue()
    executeEditComment()
    cancelEdit()
  }

  document.addEventListener('mousedown', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })
})

</script>

<template>
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
        <th scope="col">
          Valeur
        </th>
        <th scope="col">
          Commentaire
        </th>
        <th scope="col" class="text-end">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="payment in payments.list" :key="payment.id">
        <td v-if="editedId === payment.id && editedType === 'date'" class="text-nowrap">
          <VueDatePicker
            ref="datepicker"
            :v-model="editedValue"
            :teleport="true"
            locale="fr"
            cancel-text="Annuler"
            select-text="Sélectionner"
            :max-date="new Date()"
            :prevent-min-max-navigation="true"
            :hide-offset-dates="true"
            :time-picker-inline="true"
            :focus-start-date="true"
            :start-date="new Date(payment.date)"
            @update:model-value="(newDate: Date) => executeEditDate(newDate)"
            @close="cancelEdit"
          />
        </td>
        <td v-else @click="() => startEditDate(payment)">
          <span class="editable-text">
            {{ sexyDate(payment.date, false) }}
          </span>
        </td>
        <td v-if="editedId === payment.id && editedType === 'value'" class="align-middle">
          <input
            :ref="el => setActiveInput(el)"
            v-model="editedValue"
            class="char-width-20"
            type="number"
            @keydown.esc="cancelEdit"
            @keydown.enter="executeEditValue"
            @keydown.tab="executeEditValue"
          >
        </td>
        <td v-else @click="() => startEditValue(payment)">
          <span class="editable-text">
            {{ sexyNumber(payment.value) }}
          </span>
        </td>
        <td v-if="editedId === payment.id && editedType === 'comment'" class="align-middle">
          <input
            :ref="el => setActiveInput(el)"
            v-model="editedValue"
            class="char-width-20"
            type="text"
            @keydown.esc="cancelEdit"
            @keydown.enter="executeEditComment"
            @keydown.tab="executeEditComment"
          >
        </td>
        <td v-else @click="() => startEditComment(payment)">
          <span class="editable-text">
            {{ payment.comment || 'N/D' }}
          </span>
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
</template>