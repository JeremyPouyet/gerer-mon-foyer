import { emptyTransactions, newId, valueAs } from './helpers'
import type { ID, Transaction, TransactionFunctional, TransactionList, TransactionRecord } from './types'
import { TransactionType } from './types'

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
    [TransactionType.Income]: boolean
  }
}


/**
 * Constructs the default account settings based on provided partial settings.
 *
 * @param {Partial<AccountSettings>} [settings={}] Partial settings to merge with the default ones.
 * @returns {AccountSettings} The complete account settings.
 */
function buildSettings(settings: Partial<AccountSettings> = {}) : AccountSettings {
  return {
    show: Object.assign({[TransactionType.Expense]: true, [TransactionType.Income]: true}, settings.show)
  }
}


export default class Account {
  readonly expenses: TransactionRecord
  readonly incomes: TransactionRecord
  note?: string
  readonly onTransactionChange?: () => void
  readonly settings: AccountSettings

  constructor(props: Partial<Account> = {}, onTransactionChange?: () => void) {
    this.note = props.note
    this.settings = buildSettings(props.settings)
    this.incomes = props.incomes ?? emptyTransactions()
    this.expenses = props.expenses ?? emptyTransactions()

    this.onTransactionChange = onTransactionChange

    this.updateSum(TransactionType.Income)
    this.updateSum(TransactionType.Expense)
  }

  /**
   * Updates the sum of transactions for a specified transaction type.
   *
   * @param {TransactionType} transactionType The type of transactions to update (either Income or Expense).
   */
  updateSum(transactionType: TransactionType) {
    this[transactionType].sum = Object.values(this[transactionType].values).reduce((sum, transaction) => sum + valueAs(transaction), 0)
  }

  /**
   * Adds a new transaction to the specified transaction type.
   *
   * @param {TransactionType} transactionType The type of transaction to add (either Income or Expense).
   * @param {TransactionFunctional} transaction The transaction details to add.
   */
  transactionAdd(transactionType: TransactionType, transaction: TransactionFunctional) : void {
    const { name, frequency, value } = transaction
    const trimmedName = name.trim()

    if (!trimmedName || !value)
      return

    const newTransaction = { frequency, id: newId(), name: trimmedName, value }
    this[transactionType].values[newTransaction.id] = newTransaction
    this.updateSum(transactionType)
    this.onTransactionChange?.()
  }

  /**
   * Deletes a transaction from the specified transaction type.
   *
   * @param {TransactionType} transactionType The type of transaction to delete (either Income or Expense).
   * @param {Transaction} transaction The transaction to delete.
   */
  transactionDelete(transactionType: TransactionType, transaction: Transaction) : void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this[transactionType].values[transaction.id]
    this.updateSum(transactionType)
    this.onTransactionChange?.()
  }

  /**
   * Updates an existing transaction with new details.
   *
   * @param {TransactionType} transactionType The type of transaction to update (either Income or Expense).
   * @param {ID} id The ID of the transaction to update.
   * @param {Partial<Transaction>} updates The updates to apply to the transaction.
   */
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

  /**
   * Retrieves a sorted list of transactions for a specified transaction type.
   *
   * @param {TransactionType} transactionType The type of transactions to retrieve (either Income or Expense).
   * @returns {TransactionList} A list of transactions sorted by value in descending order.
   */
  transactionSorted(transactionType: TransactionType) : TransactionList {
    const transactionRecord = this[transactionType]

    return {
      sum: transactionRecord.sum,
      values: Object.values(transactionRecord.values)
        .sort((a: Transaction, b: Transaction) => valueAs(b) - valueAs(a))
    }
  }
}