import { emptyTransactions, newId, valueAs } from './helpers'
import type { ID, Transaction, TransactionFunctional, TransactionList, TransactionRecord } from '@/types'
import { TransactionType } from '@/types'

interface UserSettings {
  show: {
    [TransactionType.Expense]: boolean,
    [TransactionType.Income]: boolean
  }
}

function buildSettings(settings: Partial<UserSettings> = {}) : UserSettings {
  return {
    show: Object.assign({[TransactionType.Expense]: true, [TransactionType.Income]: true}, settings.show)
  }
}

export default class User {
  readonly expenses: TransactionRecord
  readonly id: ID
  readonly incomes: TransactionRecord
  monthlyRemainingBalance = 0
  name: string
  note?: string
  readonly onTransactionChange?: () => void
  ratio: number
  readonly settings: UserSettings

  constructor(props: Partial<User>, onTransactionChange?: () => void) {
    this.id = props.id ?? newId()
    this.name = props.name ?? ''
    this.note = props.note
    this.ratio = props.ratio ?? 0
    this.settings = buildSettings(props.settings)
    this.incomes = props.incomes ?? emptyTransactions()
    this.expenses = props.expenses ?? emptyTransactions()

    this.onTransactionChange = onTransactionChange

    this.updateSum(TransactionType.Income)
    this.updateSum(TransactionType.Expense)
  }

  updateSum(transactionType: TransactionType) {
    this[transactionType].sum = Object.values(this[transactionType].values).reduce((sum, transaction) => sum + valueAs(transaction), 0)
    this.monthlyRemainingBalanceUpdate()
  }

  updateName(name: string) : void {
    name = name.trim()

    if (name)
      this.name = name;
  }

  transactionAdd(transactionType: TransactionType, transaction: TransactionFunctional) : void {
    const { name, frequency, value } = transaction;
    const trimmedName = name.trim()

    if (!trimmedName || !value)
      return;

    const newTransaction = { frequency, id: newId(), name: trimmedName, value }
    this[transactionType].values[newTransaction.id] = newTransaction
    this.updateSum(transactionType)
    this.onTransactionChange?.()
  }

  transactionDelete(transactionType: TransactionType, transaction: Transaction) : void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this[transactionType].values[transaction.id]
    this.updateSum(transactionType)
    this.onTransactionChange?.()
  }

  transactionUpdate(transactionType: TransactionType, id: ID, updates: Partial<Transaction>) {
    const transaction = this[transactionType].values[id]

    if (!transaction)
      return

    Object.assign(transaction, updates)

    if (['frequency', 'value'].some(key => key in updates)) {
      this.updateSum(transactionType)
      this.onTransactionChange?.()
    }
  }

  transactionSorted(transactionType: TransactionType) : TransactionList {
    const transactionRecord = this[transactionType]

    return {
      sum: transactionRecord.sum,
      values: Object.values(transactionRecord.values)
        .sort((a: Transaction, b: Transaction) => valueAs(b) - valueAs(a))
    }
  }

  monthlyRemainingBalanceUpdate() {
    this.monthlyRemainingBalance = this.incomes.sum - this.expenses.sum
  }
}