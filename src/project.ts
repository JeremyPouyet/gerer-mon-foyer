import { newId } from '@/helpers'
import type { ID } from '@/types'
import { SortType } from '@/types'
import settingManager from '@/managers/settingManager'
import userManager from './managers/userManager'
import notificationManager from './managers/notificationManager'

export interface Expense {
  readonly id: ID
  name: string
  note?: string
  quantity: number
  price: number
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

// List of possible transactions sort
const sorters = {
  [SortType.Abc]: (a: Expense, b: Expense) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  [SortType.Asc]: (a: Expense, b: Expense) => a.price * a.quantity - b.price * b.quantity,
  [SortType.Desc]: (a: Expense, b: Expense) => b.price * b.quantity - a.price * a.quantity,
  [SortType.Zyx]: (a: Expense, b: Expense) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' })
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

  constructor(props: Partial<Project> = {}) {
    this.createdAt = props.createdAt ?? new Date().toISOString()
    this.updatedAt = props.updatedAt ?? this.createdAt
    this.id = props.id ?? newId()
    this.expenses = props.expenses ?? {}
    this.name = props.name ?? 'Notre super projet'
    this.residents = props.residents ?? []
    this.payments = props.payments ?? {}
  }

  /**
   * Creates a new expense and adds it to the expenses list.
   *
   * @param expense The expense details, excluding the id.
   */
  expenseCreate(expense: Omit<Expense, 'id'>) : boolean {
    const trimmedName = (expense.name || '').trim()
    const price = expense.price ?? -1
    const quantity = expense.quantity ?? -1
    let err = null

    if (!trimmedName)
      err = `"${expense.name}" n’est pas un nom valide.`
    else if (price < 0)
      err = 'Le prix d’une dépense ne peut être inférieur à 0.'
    else if (quantity < 0)
      err = 'La quantité d’une dépense ne peut être inférieur à 0.'
    if (err) {
      notificationManager.error(err)
      return false
    }
    const id = newId()
    this.expenses[id] = { id: id, name: trimmedName, price, quantity }
    this.updateTimestamp()
    return true
  }

  /**
   * Deletes an expense by ID.
   *
   * @param id The ID of the expense to delete.
   * @return Whether the deletion was successful.
   */
  expenseDelete(id: ID) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (delete this.expenses[id])
      this.updateTimestamp()
  }

  /**
   * Gets the sorted list of expenses with the sum of all expenses.
   *
   * @param sortType The sorting preference.
   * @return The sorted list of expenses and their total sum.
   */
  expenseSorted() : ExpenseList {
    return {
      sum: Object.values(this.expenses).reduce((sum, expense) => sum + expense.quantity * expense.price, 0),
      values: Object.values(this.expenses)
        .sort(sorters[settingManager.settings.sort])
    }
  }

  /**
   * Saves project residents and ratios
   */
  freeze() : void {
    userManager.users.forEach(user => this.residents.push({ name: user.name, ratio: user.ratio }))
  }

  paymentCreate(payment: Omit<Payment, 'id' | 'date'>) : boolean {
    const resident = (payment.resident || '').trim()
    const value = payment.value ?? -1
    const comment = payment.comment ?? ''
    let err = null

    if (!resident)
      err = `"${payment.resident}" n’est pas un nom valide.`
    else if (value < 0)
      err = 'La valeur d’un payment ne peut être inférieur à 0.'
    if (err) {
      notificationManager.error(err)
      return false
    }
    const date = new Date().toISOString()
    const newPayment = { comment, date, id: newId(), resident, value }
    this.payments[newPayment.id] = newPayment
    this.updateTimestamp()
    return true
  }

  paymentDelete(id: ID) : void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (delete this.payments[id])
      this.updateTimestamp()
  }

  /**
   * Group payments by resident name
   */
  paymentsSorted() : Record<string, { list: Payment[], sum: number }> {
    const sortedPayments: Record<string, { list: Payment[], sum: number }> = {}

    Object.values(this.payments).forEach(payment => {
      if (!sortedPayments[payment.resident])
        sortedPayments[payment.resident] = { list: [], sum: 0 }
      sortedPayments[payment.resident].list.push(payment)
      sortedPayments[payment.resident].sum += payment.value
    })
    return sortedPayments
  }

  /**
   * Updates the `updatedAt` timestamp to the current time.
   */
  updateTimestamp(): void {
    this.updatedAt = new Date().toISOString()
  }
}