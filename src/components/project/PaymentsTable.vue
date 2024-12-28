<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'

import VueDatePicker, { type DatePickerInstance } from '@vuepic/vue-datepicker'

import { type ComponentPublicInstance, onMounted, onUnmounted, ref } from 'vue'
import { sexyAmount, sexyDate, sexyNumber } from '@/formaters'
import type { Payment } from '@/project'
import type Project from '@/project'
import { useEditable } from '@/helpers'

const props = defineProps<{ currentProject: Project }>()

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
      props.currentProject.paymentUpdate(id, { date: value.toISOString() })
  })
}

/**** Edit payment value */

function startEditValue(payment: Payment) {
  startEdit(payment.id, 'value', payment.value, () => inputRef?.focus())
}

function executeEditValue() {
  executeEdit('value', (id, value) => {
    if (typeof value === 'number')
      props.currentProject.paymentUpdate(id, { value })
  })
}

/**** Edit payment comment */

function startEditComment(payment: Payment) {
  startEdit(payment.id, 'comment', payment.comment, () => inputRef?.focus())
}

function executeEditComment() {
  executeEdit('comment', (id, value) => {
    if (typeof value === 'string')
      props.currentProject.paymentUpdate(id, { comment: value })
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
        <th scope="col" style="width:50%">
          Commentaire
        </th>
        <th class="text-end" scope="col" style="width:20%">
          Valeur
        </th>
        <th class="text-end" scope="col" style="width:10%">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="payment in payments.list" :key="payment.id">
        <td v-if="editedId === payment.id && editedType === 'date'" class="text-nowrap">
          <VueDatePicker
            ref="datepicker"
            cancel-text="Annuler"
            :focus-start-date="true"
            :hide-offset-dates="true"
            locale="fr"
            :max-date="new Date()"
            :prevent-min-max-navigation="true"
            select-text="Sélectionner"
            :start-date="new Date(payment.date)"
            :teleport="true"
            :time-picker-inline="true"
            :v-model="editedValue"
            @close="cancelEdit"
            @update:model-value="(newDate: Date) => executeEditDate(newDate)"
          />
        </td>
        <td v-else class="editable-cell" @click="startEditDate(payment)">
          <span>{{ sexyDate(payment.date, false) }}</span>
        </td>
        <td v-if="editedId === payment.id && editedType === 'comment'" class="align-middle">
          <input
            :ref="el => setActiveInput(el)"
            v-model="editedValue"
            class="char-width-20"
            type="text"
            @keydown.enter="executeEditComment"
            @keydown.esc="cancelEdit"
            @keydown.tab="executeEditComment"
          >
        </td>
        <td v-else class="editable-cell" @click="startEditComment(payment)">
          <span>{{ payment.comment || 'N/D' }}</span>
        </td>
        <td v-if="editedId === payment.id && editedType === 'value'" class="align-middle">
          <input
            :ref="el => setActiveInput(el)"
            v-model="editedValue"
            class="char-width-20"
            type="number"
            @keydown.enter="executeEditValue"
            @keydown.esc="cancelEdit"
            @keydown.tab="executeEditValue"
          >
        </td>
        <td v-else class="editable-cell text-end" @click="startEditValue(payment)">
          <span>{{ sexyNumber(payment.value) }}</span>
        </td>
        <td class="text-end align-middle text-nowrap">
          <img
            v-tooltip="{ disposeOnClick: true }"
            alt="Supprimer le payment"
            class="icon-container-small icon-hoverable ms-2"
            data-bs-title="Supprimer le payment"
            src="@/assets/icons/cross.png"
            @click="currentProject.paymentDelete(payment.id)"
          >
        </td>
      </tr>
    </tbody>
  </table>
</template>