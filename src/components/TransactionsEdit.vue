<script setup lang="ts">
import Note from '@/components/Note.vue'
import NoteIcon from './NoteIcon.vue'
import TableFooter from './transactionsTable/TableFooter.vue'
import TableHeader from './transactionsTable/TableHeader.vue'

import { type ComponentPublicInstance, nextTick, ref, toRefs } from 'vue'

import type Account from '@/account'
import { useTransactions, valueAs } from '@/helpers'
import { frequencies, Frequency, type ID, type Transaction, TransactionType } from '@/types'
import { sexyNumber } from '@/formaters'
import { AccountType } from '@/account'
import userManager from '@/managers/userManager'

const props = defineProps<{
  account: Account,
  income?: { label: string, value: number },
  transactionType: TransactionType
}>()

const { account, transactionType } = toRefs(props)
const transactionList = useTransactions(account, transactionType)

const editedName = ref<string>('')
const editedNameId = ref<ID>()
const editedValueId = ref<ID>()
const editedFrequency = ref<Frequency>()
const editedValue = ref<string>('')

let input : HTMLInputElement

function setActiveInput(el: Element | ComponentPublicInstance | null) : void {
  if (el)
    input = el as HTMLInputElement
}

function startEditTransactionName(transaction: Transaction) : void {
  cancelEditTransactionValue()
  editedNameId.value = transaction.id
  editedName.value = transaction.name
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => input?.focus())
}

function cancelEditTransactionName() : void {
  editedNameId.value = undefined
  editedName.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function executeEditTransactionName() : void {
  if (editedNameId.value && account.value.update(props.transactionType, editedNameId.value, { name: editedName.value }))
    cancelEditTransactionName()
}

function startEditTransactionValue(transaction: Transaction, newFrequency: Frequency) : void {
  cancelEditTransactionName()
  editedFrequency.value = newFrequency
  editedValueId.value = transaction.id
  editedValue.value = newFrequency === transaction.frequency
    ? transaction.value
    : sexyNumber(valueAs(transaction, newFrequency))
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => input?.focus())
}

function cancelEditTransactionValue() : void {
  editedFrequency.value = undefined
  editedValueId.value = undefined
  editedValue.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function executeEditTransactionValue() : void {
  const draft = { frequency: editedFrequency.value, value: editedValue.value }

  if (editedValueId.value && account.value.update(props.transactionType, editedValueId.value, draft)) {
    cancelEditTransactionValue()
    if (account.value.type === AccountType.Personal)
      userManager.computeRatios()
  }
}

function handleClickOutside(event: MouseEvent) : void {
  if (input && !input.contains(event.target as Node)) {
    executeEditTransactionName()
    executeEditTransactionValue()
  }
}

function deleteTransaction(transaction: Transaction) {
  if (!account.value.delete(props.transactionType, transaction))
    return
  if (account.value.type === AccountType.Personal)
    userManager.computeRatios()
}
</script>

<template>
  <TableHeader :income-label="income?.label" :transaction-type="transactionType" :with-actions="true" />
  <tbody>
    <tr v-for="transaction in transactionList.values" :key="transaction.id">
      <!-- Transaction name -->
      <td v-if="editedNameId === transaction.id">
        <input
          :ref="el => setActiveInput(el)"
          v-model="editedName"
          class="char-width-20"
          type="text"
          @keydown.esc="cancelEditTransactionName"
          @keydown.enter="executeEditTransactionName"
          @keydown.tab="executeEditTransactionName"
        >
      </td>
      <td v-else class="align-middle editable-cell" @click="startEditTransactionName(transaction)">
        <span>{{ transaction.name }}</span>
        <NoteIcon :text="transaction.note" />
      </td>
      <!-- Transaction value by frequency -->
      <template v-for="frequency in frequencies" :key="frequency">
        <td v-if="editedValueId == transaction.id && editedFrequency == frequency">
          <input
            :ref="el => setActiveInput(el)"
            v-model="editedValue"
            type="text"
            class="w-100"
            @keydown.esc="cancelEditTransactionValue"
            @keydown.enter="executeEditTransactionValue"
            @keydown.tab="executeEditTransactionValue"
          >
        </td>
        <td v-else class="text-end align-middle editable-cell" @click="startEditTransactionValue(transaction, frequency)">
          <span
            v-tooltip="{ disposeOnClick: true }"
            :data-bs-title="frequency === transaction.frequency ? transaction.value : ''"
          >
            {{ sexyNumber(valueAs(transaction, frequency)) }}
            <div v-show="transaction.frequency===frequency" class="underline" />
          </span>
        </td>
      </template>
      <!-- Transaction income percentage -->
      <td v-if="income" class="text-end align-middle">
        {{ sexyNumber(valueAs(transaction) / income.value * 100) }}
      </td>
      <!-- Actions -->
      <td class="text-end align-middle text-nowrap">
        <Note
          :item="transaction"
          @update="note => account.update(transactionType, transaction.id, { note })"
        />
        <img
          v-tooltip="{ disposeOnClick: true }"
          src="@/assets/icons/cross.png"
          alt="Supprimer"
          data-bs-title="Supprimer"
          class="icon-container-small icon-hoverable ms-2"
          @click="deleteTransaction(transaction)"
        >
      </td>
    </tr>
  </tbody>
  <TableFooter :income="income?.value" :transaction-list="transactionList" :with-tds="true" />
</template>