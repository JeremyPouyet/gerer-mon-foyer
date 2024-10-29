import { create, divideDependencies, evaluateDependencies, roundDependencies } from 'mathjs'

import { frequencies, Frequency, TransactionType } from './types'
import type { ID, Transaction } from './types'
import { computed, type Ref } from 'vue'
import type Account from './account'
import type User from './user'

const math = create({ divideDependencies, evaluateDependencies, roundDependencies })
const limitedEvaluate = math.evaluate.bind(math)

export { limitedEvaluate }

export function round(value: number) : number {
  return math.round(value, 2)
}

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

export function newId() : ID {
  // only available with https
  return crypto.randomUUID()
}

export function useTransactions(accountRef: Ref<Account>, transactionTypeRef: Ref<TransactionType>) {
  const transactionList = computed(() => accountRef.value.transactionSorted(transactionTypeRef.value))

  const totals = computed<number[]>(() =>
    frequencies.map(frequency =>
      round(transactionList.value.values.reduce((sum, transaction) => sum + valueAs(transaction, frequency), 0))
    )
  )

  return { totals, transactionList }
}

export function useFinanceCalculations(account: Ref<Account>, users: Ref<User[]>) {
  return {
    commonBill: computed(() => Math.max(account.value.expenses.sum - account.value.incomes.sum, 0)),
    incomeSum:  computed(() => users.value.reduce((sum, user) => sum + user.account.incomes.sum, account.value.incomes.sum)),
    remainSum:  computed(() => users.value.reduce((sum, user) => sum + (user.account.incomes.sum - user.account.expenses.sum), 0))
  }
}