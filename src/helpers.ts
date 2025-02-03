import { create, divideDependencies, evaluateDependencies, subtractDependencies } from 'mathjs'

import { Frequency, TransactionType } from './types'
import type { ID, Transaction } from './types'
import { type Ref, computed, h } from 'vue'
import type Account from './account'

import { Modal } from 'bootstrap'

const math = create({ divideDependencies, evaluateDependencies, subtractDependencies })
const limitedEvaluate = math.evaluate.bind(math)

export { limitedEvaluate }

type Multipliers = Record<Frequency, Partial<Record<Frequency, number>>>

const multipliers : Multipliers = {
  [Frequency.monthly]:   { [Frequency.quarterly]: 3,  [Frequency.biannual]: 6,    [Frequency.yearly]: 12 },
  [Frequency.quarterly]: { [Frequency.monthly]: 1/3,  [Frequency.biannual]: 2,    [Frequency.yearly]: 4 },
  [Frequency.biannual]:  { [Frequency.monthly]: 1/6,  [Frequency.quarterly]: 1/2, [Frequency.yearly]: 2 },
  [Frequency.yearly]:    { [Frequency.monthly]: 1/12, [Frequency.quarterly]: 1/4, [Frequency.biannual]: 1/2 }
}

export function confirmModal(text: string, callback: (arg0: boolean) => void) {
  const htmlModal = document.getElementById('confirmModal')
  const htmlConfirmBtn = document.getElementById('confirmBtn')
  const htmlBodyText = document.querySelector('#confirmModal .modal-body')

  if (!htmlModal || !htmlConfirmBtn || !htmlBodyText)
    return

  htmlBodyText.textContent = text
  const confirmModal = new Modal(htmlModal)
  confirmModal.show()

  const handleCancel = () => {
    callback(false)
    htmlModal.removeEventListener('hidden.bs.modal', handleCancel)
  }

  // Attach cancellation handler
  htmlModal.addEventListener('hidden.bs.modal', handleCancel, { once: true })

  // Handle confirmation button click
  htmlConfirmBtn.onclick = function () {
    confirmModal.hide()

    // Prevent calling the callback again when the modal is hidden
    htmlModal.removeEventListener('hidden.bs.modal', handleCancel)

    callback(true)
  }
}

/**
 * Gets a Transaction value as another frequency than the one inside the Transaction
 * @param transaction
 * @param asFrequency
 * @returns
 */
export function valueAs(transaction: Pick<Transaction, 'value' | 'frequency'>, asFrequency: Frequency = Frequency.monthly) : number {
  const value = limitedEvaluate(transaction.value.toString()) as number
  return value * (multipliers[transaction.frequency][asFrequency] ?? 1)
}

function randomSegment(): string {
  return Math.round(Math.random()*10000).toString()
}

export function newId() : ID {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    return crypto.randomUUID() // only available with https
  // Only for testing purpose on firefox mobile
  return `${randomSegment()}-${randomSegment()}-${randomSegment()}-${randomSegment()}-${randomSegment()}`
}

export function useTransactions(accountRef: Ref<Account>, transactionTypeRef: Ref<TransactionType>) {
  return computed(() => accountRef.value.transactionSorted(transactionTypeRef.value))
}

import { nextTick, ref } from 'vue'

/**
 * Provides reactive state for editable data.
 * @template T The type of the editable value.
 */
export function useEditable<T>() {
  const editedValue = ref<T | undefined>()
  const editedId = ref<ID>()
  const editedType = ref<string>('')

  /**
   * Initiates editing mode for a given item.
   * @param id - The ID of the item to edit.
   * @param type - The type/category of the item.
   * @param value - The current value of the item.
   * @param onEditStart - Optional callback executed after starting the edit.
   */
  function startEdit(id: ID, type: string, value: T, onEditStart?: () => void) {
    editedType.value = type
    editedId.value = id
    editedValue.value = value
    nextTick(onEditStart)
  }


  /**
   * Cancels the editing mode and resets state.
   */
  function cancelEdit() {
    editedId.value = undefined
    editedValue.value = undefined
    editedType.value = ''
  }

  /**
   * Executes the edit operation using a callback and resets state.
   * @param callback - A function to handle the edit operation.
   */
  function executeEdit(type: string, callback: (id: ID, value: T | undefined) => void) {
    if (editedId.value !== undefined && editedType.value === type) {
      callback(editedId.value, editedValue.value)
      cancelEdit()
    }
  }

  return {
    cancelEdit,
    editedId,
    editedType,
    editedValue,
    executeEdit,
    startEdit,
  }
}
