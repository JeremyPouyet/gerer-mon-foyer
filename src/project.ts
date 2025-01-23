import { type ID, SortType } from '@/types'
import { newId } from '@/helpers'
import notificationManager from './managers/notificationManager'
import settingManager from '@/managers/settingManager'

export interface Expense {
  readonly id: ID
  name: string
  note?: string
  quantity: number
  price: number
  done: boolean
}

export interface ExpenseList {
  values: Expense[],
  sum: number
}

export interface Payment {
  comment: string,
  date: string,
  id: ID,
  resident: string,
  value: number
}

export interface Resident {
  name: string,
  ratio: number
}

/**
 * Mapping of possible sorting types for expenses to their respective sorting functions.
 */
const expenseSorters: Record<SortType, (a: Expense, b: Expense) => number> = {
  [SortType.Abc]: (a: Expense, b: Expense) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  [SortType.Asc]: (a: Expense, b: Expense) => a.price * a.quantity - b.price * b.quantity,
  [SortType.Desc]: (a: Expense, b: Expense) => b.price * b.quantity - a.price * a.quantity,
  [SortType.Zyx]: (a: Expense, b: Expense) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' })
}

const paymentSorters: Record<SortType, (a: Payment, b: Payment) => number> = {
  [SortType.Abc]: (a: Payment, b: Payment) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  [SortType.Asc]: (a: Payment, b: Payment) => a.value - b.value,
  [SortType.Desc]: (a: Payment, b: Payment) => b.value - a.value,
  [SortType.Zyx]: (a: Payment, b: Payment) => new Date(b.date).getTime() - new Date(a.date).getTime(),
}

/**
 * Validates the details of an expense.
 *
 * @param expense The expense to validate.
 * @returns An error message if invalid, or null if valid.
 */
function expenseValidate(expense: Expense): string | null {
  expense.name = (expense.name || '').trim()
  expense.price = expense.price ?? 0
  expense.quantity = expense.quantity ?? 0

  if (expense.name === '') return `"${expense.name}" n’est pas un nom valide.`
  if (expense.price < 0) return 'Le prix d’une dépense ne peut être inférieur à 0.'
  if (expense.quantity < 0) return 'La quantité d’une dépense ne peut être inférieur à 0.'
  return null
}

/**
 * Validates the details of a payment.
 *
 * @param payment The payment to validate.
 * @returns An error message if invalid, or null if valid.
 */
function paymentValidate(payment: Payment): string | null {
  payment.resident = (payment.resident || '').trim()
  payment.value = payment.value ?? 0

  if (payment.resident === '') return `"${payment.resident}" n’est pas un nom valide.`
  if (payment.value < 0) return 'La valeur d’un paiement ne peut être inférieur à 0.'
  return null
}

/**
 * Validates a Payment or an Expense. When an error is detected, a notification is shown.
 *
 * @param item Payment/Expense
 * @param validateFn A function to validate the item
 * @returns whether the validation succeedded
 */
function handleValidation<T>(item: T, validateFn: (item: T) => string | null): boolean {
  const error = validateFn(item)

  if (error) {
    notificationManager.error(error)
    return false
  }
  return true
}

export default class Project {
  createdAt: string
  updatedAt: string
  readonly id: ID
  readonly expenses: Record<ID, Expense>
  name: string
  note?: string
  residents: Resident[]
  readonly payments: Record<ID, Payment>

  /**
   * Creates a new project instance.
   * @param props Partial initial properties to set up the project.
   */
  constructor(props: Partial<Project> = {}) {
    this.createdAt = props.createdAt ?? new Date().toISOString()
    this.updatedAt = props.updatedAt ?? this.createdAt
    this.id = props.id ?? newId()
    this.expenses = props.expenses ?? {}
    this.name = props.name ?? 'Notre super projet'
    this.note = props.note
    this.residents = props.residents ?? []
    this.payments = props.payments ?? {}
  }

  /**
   * Creates a new expense and adds it to the expenses list.
   *
   * @param expense The expense details, excluding the id.
   * @return Whether the creation is successful.
   */
  expenseCreate(expense: Omit<Expense, 'id'>) : boolean {
    const newExpense: Expense = { ...expense, id: newId() }

    if (!handleValidation(newExpense, expenseValidate))
      return false

    this.expenses[newExpense.id] = newExpense
    this.updateTimestamp()
    return true
  }

  /**
   * Deletes an expense by ID.
   *
   * @param id The ID of the expense to delete.
   */
  expenseDelete(id: ID): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (delete this.expenses[id])
      this.updateTimestamp()
  }

  /**
   * Retrieves a sorted list of expenses along with their total sum.
   *
   * @return The sorted list of expenses and their total sum.
   */
  expenseSorted(): ExpenseList {
    const expenses = Object.values(this.expenses)

    return {
      sum: expenses.reduce((sum, expense) => sum + expense.quantity * expense.price, 0),
      values: expenses.sort(expenseSorters[settingManager.settings.sort])
    }
  }

  /**
   * Updates an existing expense by its ID.
   *
   * @param id The ID of the expense to update.
   * @param updates The updates to apply.
   * @returns Whether the update was successful.
   */
  expenseUpdate(id: ID, updates: Partial<Expense>): boolean {
    if (!this.expenses[id]) return false

    const updatedExpense = { ...this.expenses[id], ...updates }

    if (!handleValidation(updatedExpense, expenseValidate))
      return false

    Object.assign(this.expenses[id], updatedExpense)
    this.updateTimestamp()
    return true
  }

  /**
   * Creates a new payment and adds it to the project.
   *
   * @param payment The payment details, excluding the ID and date.
   * @returns Whether the creation was successful.
   */
  paymentCreate(payment: Omit<Payment, 'id' | 'date'>): boolean {
    const newPayment: Payment = { ...payment, date: new Date().toISOString(), id: newId() }

    if (!handleValidation(newPayment, paymentValidate))
      return false

    this.payments[newPayment.id] = newPayment
    this.updateTimestamp()
    return true
  }

  /**
   * Deletes a payment by its ID.
   *
   * @param id The ID of the payment to delete.
   */
  paymentDelete(id: ID): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (delete this.payments[id])
      this.updateTimestamp()
  }

  /**
   * Updates an existing payment by its ID.
   *
   * @param id The ID of the payment to update.
   * @param updates The updates to apply.
   * @returns Whether the update was successful.
   */
  paymentUpdate(id: ID, updates: Partial<Payment>): boolean {
    if (!this.payments[id]) return false

    const updatedPayment = { ...this.payments[id], ...updates }

    if (!handleValidation(updatedPayment, paymentValidate))
      return false

    Object.assign(this.payments[id], updatedPayment)
    this.updateTimestamp()
    return true
  }

  /**
   * Groups payments by resident name and calculates their total values.
   *
   * @returns A record of payments grouped by resident.
   */
  paymentsSorted(): Record<string, { list: Payment[], sum: number }> {
    const payments = Object.values(this.payments).reduce((acc, payment) => {
      if (!acc[payment.resident])
        acc[payment.resident] = { list: [], sum: 0 }
      acc[payment.resident].list.push(payment)
      acc[payment.resident].sum += payment.value
      return acc
    }, {} as Record<string, { list: Payment[]; sum: number }>)

    for (const key in payments)
      payments[key].list = payments[key].list.sort(paymentSorters[settingManager.settings.sort])

    return payments
  }

  /**
   * Updates the `updatedAt` timestamp to the current time.
   */
  updateTimestamp(): void {
    this.updatedAt = new Date().toISOString()
  }
}