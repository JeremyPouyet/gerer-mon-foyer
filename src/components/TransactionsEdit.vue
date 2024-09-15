<script setup lang="ts">
import Note from '@/components/Note.vue'
import TableTitle from './TableTitle.vue'

import { type ComponentPublicInstance, computed, nextTick, ref } from 'vue'

import { round, valueAs } from '@/helpers'
import notificationManager, { NotificationType } from '@/notificationManager'
import { Frequency, type ID, type Transaction, type TransactionFunctional, TransactionType } from '@/types'
import type Account from '@/account'

const labels = {
  [TransactionType.Expense]: { plural: 'Dépenses', singular: 'Dépense' },
  [TransactionType.Income]: { plural: 'Revenus', singular: 'Revenu' }
}

const props = defineProps<{ account: Account, income?: number, transactionType: TransactionType }>()

const transactionList = computed(() => props.account.transactionSorted(props.transactionType))
const editedName = ref<string>('')
const editedNameId = ref<ID>()
const editedValueId = ref<ID>()
const editedFrequency = ref<Frequency | null>(null)
const editedValue = ref<string>('')
const yTotal = computed<number>(() => round(transactionList.value.values.reduce((sum, transaction) => sum + valueAs(transaction, Frequency.yearly), 0)))
const newTransaction = ref<TransactionFunctional>({ frequency: Frequency.monthly, name: '',  value: '' })
let input : HTMLInputElement
const newTransactionInputName = ref<HTMLInputElement>()

function testTransactionValue(transaction: Pick<Transaction, 'value' | 'frequency'>) : boolean {
  try {
    valueAs(transaction)
    return true
  } catch {
    notificationManager.create(`"${transaction.value}" n'est pas un montant valide`, NotificationType.Error)
    return false
  }
}

function transactionAdd() : void {
  const draft = newTransaction.value
  if (!draft.name || !draft.value || !testTransactionValue(draft))
    return

  // move all code logic to this function and return true/false ? or better show error with message if possible ?
  props.account.transactionAdd(props.transactionType, newTransaction.value)
  newTransaction.value = { frequency: Frequency.monthly, name: '', value: '' }

  // once the transaction is added, expect the user to add a new one
  nextTick(() => newTransactionInputName.value?.focus())
}

function setActiveInput(el: Element | ComponentPublicInstance | null) : void {
  if (el)
    input = el as HTMLInputElement
}

function startEditTransactionName(transaction: Transaction) : void {
  editedNameId.value = transaction.id
  editedName.value = transaction.name
  cancelEditTransactionValue()
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => input?.focus())
}

function cancelEditTransactionName() : void {
  editedNameId.value = undefined
  editedName.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function executeEditTransactionName(transaction: Transaction) : void {
  if (!editedName.value)
    return
  transaction.name = editedName.value
  // ToDo - create and call a function in user to edit transaction maybe ?
  cancelEditTransactionName()
}

function startEditTransactionValue(transaction: Transaction, newFrequency: Frequency) : void {
  editedFrequency.value = newFrequency
  editedValueId.value = transaction.id
  editedValue.value = newFrequency === transaction.frequency
    ? transaction.value
    : round(valueAs(transaction, newFrequency)).toString()
  cancelEditTransactionName()
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => input?.focus())
}

function cancelEditTransactionValue() : void {
  editedFrequency.value = Frequency.monthly
  editedValueId.value = undefined
  editedValue.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function executeEditTransactionValue(transaction: Transaction, frequency: Frequency) : void {
  if (!editedValue.value)
    return

  const draft = { frequency, value: editedValue.value }
  if (testTransactionValue(draft)) {
    props.account.transactionUpdate(props.transactionType, transaction.id, draft)
    cancelEditTransactionValue()
  }
}

function handleClickOutside(event: MouseEvent) : void {
  // todo - When a click outside an input is made, modified values should be updated, not discarded
  if (input && !input.contains(event.target as Node)) {
    cancelEditTransactionName()
    cancelEditTransactionValue()
  }
}
</script>

<template>
  <div v-show="account.settings.show[transactionType]" class="col mb-4">
    <section>
      <TableTitle :account="account" :title="labels[transactionType]['plural']" :transaction-type="transactionType" />

      <div class="table-responsive shadowed-border mb-3">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">
                {{ labels[props.transactionType]['singular'] }}
              </th>
              <th scope="col" class="text-end">
                Mois
              </th>
              <th scope="col" class="text-end">
                Trimestre
              </th>
              <th scope="col" class="text-end">
                Semestre
              </th>
              <th scope="col" class="text-end">
                Année
              </th>
              <th v-if="props.income" scope="col" class="text-end">
                % des revenus
              </th>
              <th scope="col" class="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactionList.values" :key="transaction.id">
              <!-- Transaction name -->
              <td>
                <template v-if="editedNameId === transaction.id">
                  <input
                    :ref="el => setActiveInput(el)"
                    v-model="editedName"
                    type="text"
                    @keydown.esc="cancelEditTransactionName"
                    @keypress.enter="() => executeEditTransactionName(transaction)"
                    @keydown.tab="() => executeEditTransactionName(transaction)"
                  >
                </template>
                <template v-else>
                  <span
                    class="editable-text text-break"
                    style="position:relative;"
                    :title="transaction.note"
                    @click="() => startEditTransactionName(transaction)"
                  >
                    {{ transaction.name }}
                  </span>
                  <span
                    v-if="transaction.note"
                    data-toggle="tooltip"
                    :title="transaction.note"
                    class="translate-middle badge"
                    style="position:relative;top:-0.2rem;right:-0.6rem"
                  >
                    <img src="@/assets/icons/message.png" class="icon-container-small">
                  </span>
                </template>
              </td>

              <!-- Transaction value by frequency -->
              <td v-for="frequency in [Frequency.monthly, Frequency.quarterly, Frequency.biannual, Frequency.yearly]" :key="frequency" class="char-width-10 text-end">
                <template v-if="editedValueId == transaction.id && editedFrequency == frequency">
                  <input
                    :ref="el => setActiveInput(el)"
                    v-model="editedValue"
                    type="text"
                    class="w-100"
                    @keydown.esc="cancelEditTransactionValue"
                    @keypress.enter="() => executeEditTransactionValue(transaction, frequency)"
                    @keydown.tab="() => executeEditTransactionValue(transaction, frequency)"
                  >
                </template>
                <template v-else>
                  <span
                    class="editable-text"
                    :title="frequency===transaction.frequency ? transaction.value : ''"
                    @click="() => startEditTransactionValue(transaction, frequency)"
                  >
                    {{ round(valueAs(transaction, frequency)) }}
                    <div v-show="transaction.frequency===frequency" class="underline" />
                  </span>
                </template>
              </td>

              <!-- Transaction income percentage -->
              <td v-if="props.income" class="text-end">
                {{ round(valueAs(transaction) / props.income * 100) }}
              </td>

              <!-- Actions -->
              <td class="char-width-10 text-end" style="vertical-align: middle;">
                <Note :item="transaction" @update="note => transaction.note = note" />
                <img
                  src="@/assets/icons/cross.png"
                  alt="Supprimer"
                  title="Supprimer"
                  class="icon-container-small icon-hoverable"
                  style="margin-left:0.4rem;"
                  @click="() => props.account.transactionDelete(props.transactionType, transaction)"
                >
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="fw-bold" style="">
                Total
              </td>
              <td class="text-end">
                {{ round(transactionList.values.reduce((sum, transaction) => sum + valueAs(transaction), 0)) }}
              </td>
              <td class="text-end">
                {{ round(transactionList.values.reduce((sum, transaction) => sum + valueAs(transaction, Frequency.quarterly), 0)) }}
              </td>
              <td class="text-end">
                {{ yTotal }}
              </td>
              <td v-if="props.income" class="text-end">
                {{ round(yTotal / (props.income * 12) * 100) }}
              </td>
              <td colspan="2" />
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="input-group flex-sm-row">
        <input
          ref="newTransactionInputName"
          v-model="newTransaction.name"
          type="text"
          :placeholder="labels[props.transactionType]['singular']"
          class="form-control"
          aria-label="Nom de la transaction"
          :title="`${transactionType == TransactionType.Expense ? 'eau/gaz/courses' : 'salaire/allocation/rentes'}`"
          @keypress.enter="transactionAdd"
        >
        <input
          v-model="newTransaction.value"
          type="text"
          placeholder="Valeure"
          class="form-control"
          title="Exemples:
· 500
· 10 * 50
· 1000 / 2"
          aria-label="Valeur de la transaction"
          @keypress.enter="transactionAdd"
        >
        <span class="input-group-text">€</span>
        <div class="w-100 d-sm-none" />

        <select v-model="newTransaction.frequency" class="form-select mt-2 mt-sm-0" title="Fréquence" @keypress.enter="transactionAdd">
          <option :value="Frequency.monthly">
            Mois
          </option>
          <option :value="Frequency.quarterly">
            Trimestre
          </option>
          <option :value="Frequency.quarterly">
            Semestre
          </option>
          <option :value="Frequency.yearly">
            Annnée
          </option>
        </select>
        <button class="btn btn-primary default-button mt-2 mt-sm-0" :disabled="!newTransaction.name || !newTransaction.value" @click="transactionAdd">
          Ajouter
        </button>
      </div>
    </section>
  </div>
</template>