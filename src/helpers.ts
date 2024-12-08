import { create, divideDependencies, evaluateDependencies, subtractDependencies } from 'mathjs'

import { Frequency, TransactionType } from './types'
import type { ID, Transaction } from './types'
import { computed, type Ref } from 'vue'
import type Account from './account'

const math = create({ divideDependencies, evaluateDependencies, subtractDependencies })
const limitedEvaluate = math.evaluate.bind(math)

export { limitedEvaluate }

type Multipliers = {
  [key in Frequency]: {
    [key in Frequency]?: number
  }
}

const multipliers : Multipliers = {
  [Frequency.monthly]:   { [Frequency.quarterly]: 3,  [Frequency.biannual]: 6,    [Frequency.yearly]: 12 },
  [Frequency.quarterly]: { [Frequency.monthly]: 1/3,  [Frequency.biannual]: 2,    [Frequency.yearly]: 4 },
  [Frequency.biannual]:  { [Frequency.monthly]: 1/6,  [Frequency.quarterly]: 1/2, [Frequency.yearly]: 2 },
  [Frequency.yearly]:    { [Frequency.monthly]: 1/12, [Frequency.quarterly]: 1/4, [Frequency.biannual]: 1/2 }
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