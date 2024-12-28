import { Frequency, SortType, TransactionType } from './types'
import type { ID, Transaction, TransactionFunctional, TransactionList } from './types'
import { newId, valueAs } from './helpers'
import notificationManager from '@/managers/notificationManager'
import settingManager from './managers/settingManager'

export enum AccountType {
  Common = 'common',
  Personal = 'personal'
}

/**
 * Interface representing account related settings.
 * @interface AccountSettings
 */
interface AccountSettings {
  /**
   * An object indicating whether to show expenses and incomes.
   *
   * @type {Object}
   * @property {boolean} [TransactionType.Expense] Whether to show expenses.
   * @property {boolean} [TransactionType.Income] Whether to show incomes.
   */
  show: {
    [TransactionType.Expense]: boolean,
    [TransactionType.Income]: boolean,
    [TransactionType.PersonalExpense]: boolean
  }
}

export interface TransactionRecord {
  values: Record<ID, Transaction>,
  sum: number
}

// List of possible transactions sort
const sorters = {
  [SortType.Abc]: (a: Transaction, b: Transaction) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  [SortType.Asc]: (a: Transaction, b: Transaction) => valueAs(a) - valueAs(b),
  [SortType.Desc]: (a: Transaction, b: Transaction) => valueAs(b) - valueAs(a),
  [SortType.Zyx]: (a: Transaction, b: Transaction) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' })
}

/**
 * Constructs the default account settings based on provided partial settings.
 *
 * @param {Partial<AccountSettings>} [settings={}] Partial settings to merge with the default ones.
 * @returns {AccountSettings} The complete account settings.
 */
function buildSettings(settings: Partial<AccountSettings> = {}) : AccountSettings {
  return { show: { ...defaultSettings().show, ...settings.show } }
}

const defaultSettings : () => AccountSettings = () => ({
  show: { [TransactionType.Expense]: true, [TransactionType.Income]: true, [TransactionType.PersonalExpense]: true }
})
const emptyTransactions : () => TransactionRecord = () => ({ sum: 0, values: {} })

function formatName(transaction: Pick<Transaction, 'name'>) : boolean {
  const trimmedName = transaction.name.trim()

  if (!trimmedName) {
    notificationManager.error(`"${transaction.name}" n’est pas un nom valide.`)
    return false
  }
  transaction.name = trimmedName
  return true
}

/**
 * Normalizes a transaction value by triming it, removing spaces and replacing comas with dots
 *
 * @param {Transaction} transaction The transaction for whom the value should be normalized
 */
function formatValue(transaction: Pick<Transaction, 'value'> & Partial<Pick<Transaction, 'frequency'>>) : boolean {
  const value = transaction.value.trim().replaceAll(',', '.').replaceAll(' ', '')

  try {
    const computedValue = valueAs({ frequency: transaction.frequency || Frequency.monthly, value })
    if (Number.isNaN(computedValue) || Math.abs(computedValue) == Infinity) throw Error()
    transaction.value = value
    return true
  } catch {
    notificationManager.error(`"${transaction.value}" n’est pas un montant valide`)
    return false
  }
}

export default class Account {
  readonly expenses: TransactionRecord
  readonly incomes: TransactionRecord
  readonly personalExpenses: TransactionRecord

  note?: string
  readonly type: AccountType
  readonly settings: AccountSettings

  constructor(props: Partial<Account> = {}, accountType: AccountType) {
    this.note = props.note
    this.settings = buildSettings(props.settings)
    this.expenses = props.expenses ?? emptyTransactions()
    this.incomes = props.incomes ?? emptyTransactions()
    this.personalExpenses = props.personalExpenses ?? emptyTransactions()

    this.type = accountType

    this.updateSum(TransactionType.Expense)
    this.updateSum(TransactionType.Income)
    this.updateSum(TransactionType.PersonalExpense)
  }

  /**
   * Adds a new transaction to the specified transaction type.
   *
   * @param transactionType The type of transaction to add (either Income or Expense).
   * @param transaction The transaction details to add.
   * @returns Whether the transaction has been created.
   */
  create(transactionType: TransactionType, transaction: TransactionFunctional) : boolean {
    const { name, frequency, value } = transaction
    const draft: Transaction = { frequency, id: newId(), name, value }

    if (!formatName(draft) || !formatValue(draft as TransactionFunctional))
      return false

    this[transactionType].values[draft.id] = draft
    this.updateSum(transactionType)
    return true
  }

  /**
   * Deletes a transaction from the specified transaction type.
   *
   * @param transactionType The type of transaction to delete (either Income or Expense).
   * @param transaction The transaction to delete.
   * @returns Whether the transaction has been deleted
   */
  delete(transactionType: TransactionType, transaction: Transaction) : boolean {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (delete this[transactionType].values[transaction.id]) {
      this.updateSum(transactionType)
      return true
    }
    return false
  }

  empty() {
    Object.assign(this, {
      expenses: emptyTransactions(),
      incomes: emptyTransactions(),
      note: '',
      personalExpenses: emptyTransactions(),
      settings: defaultSettings()
    })
  }

  /**
   * Retrieves a sorted list of transactions for a specified transaction type.
   *
   * @param transactionType The type of transactions to retrieve (either Income or Expense).
   * @returns A list of transactions sorted by value in descending order.
   */
  transactionSorted(transactionType: TransactionType) : TransactionList {
    const transactionRecord = this[transactionType]

    return {
      sum: transactionRecord.sum,
      values: Object.values(transactionRecord.values)
        .sort(sorters[settingManager.settings.sort])
    }
  }

  /**
   * Updates an existing transaction with new details.
   *
   * @param transactionType The type of transaction to update (either Income or Expense).
   * @param id The ID of the transaction to update.
   * @param updates The updates to apply to the transaction.
   * @returns Whether the transaction has been updated.
   */
  update(transactionType: TransactionType, id: ID, updates: Partial<Transaction>) : boolean {
    const transaction = this[transactionType].values[id]

    if (!transaction) return false

    const draft: Partial<Transaction> = structuredClone(updates)

    if (draft.name !== undefined && !formatName(draft as Pick<Transaction, 'name'>))
      return false
    if (draft.value !== undefined && !formatValue(draft as Pick<Transaction, 'value'>))
      return false

    Object.assign(transaction, draft)

    if (draft.value !== undefined || draft.frequency !== undefined) {
      this.updateSum(transactionType)
    }
    return true
  }

  /**
   * Updates the sum of transactions for a specified transaction type.
   *
   * @param transactionType The type of transactions to update (either Income or Expense).
   */
  updateSum(transactionType: TransactionType) {
    this[transactionType].sum = Object.values(this[transactionType].values).reduce((sum, transaction) => sum + valueAs(transaction), 0)
  }
}