<script setup lang="ts">
import VueDatePicker, { type DatePickerInstance } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { sexyAmount, sexyDate, sexyNumber } from '@/formaters'
import { type ComponentPublicInstance, onMounted, onUnmounted, ref } from 'vue'
import type Project from '@/project'
import type { Payment } from '@/project'
import projectManager from '@/managers/projectManager'
import { useEditable } from '@/helpers'

defineProps<{ currentProject: Project }>()

const {
  editedValue,
  editedId,
  editedType,
  startEdit,
  cancelEdit,
  executeEdit,
} = useEditable<number | string | Date>()

let inputRef : HTMLInputElement
const datepicker = ref<DatePickerInstance[]>([])

function setActiveInput(el: Element | ComponentPublicInstance | null) : void {
  if (el)
    inputRef = el as HTMLInputElement
}

/**** Edit payment date */

function startEditDate(payment: Payment) {
  startEdit(payment.id, 'date', new Date(payment.date), () => datepicker.value[0]?.openMenu())
}

function executeEditDate(newDate: Date) {
  editedValue.value = newDate

  executeEdit('date', (id, value) => {
    if (value instanceof Date)
      projectManager.updateCurrentProjectPayment(id, {
        date: value.toISOString()
      })
  })
}

/**** Edit payment value */

function startEditValue(payment: Payment) {
  startEdit(payment.id, 'value', payment.value, () => inputRef?.focus())
}

function executeEditValue() {
  executeEdit('value', (id, value) => {
    if (typeof value === 'number')
      projectManager.updateCurrentProjectPayment(id, { value })
  })
}

/**** Edit payment comment */

function startEditComment(payment: Payment) {
  startEdit(payment.id, 'comment', payment.comment, () => inputRef?.focus())
}

function executeEditComment() {
  executeEdit('comment', (id, value) => {
    if (typeof value === 'string')
      projectManager.updateCurrentProjectPayment(id, { comment: value })
  })
}

onMounted(() => {
  function handleClickOutside() : void {
    executeEditValue()
    executeEditComment()
    cancelEdit()
  }

  document.addEventListener('mousedown', handleClickOutside)

  onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
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
        <th scope="col" style="width:20%">
          Date
        </th>
        <th scope="col" style="width:20%">
          Valeur
        </th>
        <th scope="col" style="width:50%">
          Commentaire
        </th>
        <th scope="col" class="text-end" style="width:10%">
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
        <td v-else class="editable-cell" @click="() => startEditDate(payment)">
          <span>{{ sexyDate(payment.date, false) }}</span>
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
        <td v-else class="editable-cell" @click="() => startEditValue(payment)">
          <span>{{ sexyNumber(payment.value) }}</span>
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
        <td v-else class="editable-cell" @click="() => startEditComment(payment)">
          <span>{{ payment.comment || 'N/D' }}</span>
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