import { newId } from '@/helpers'
import type { ID } from '@/types'
import { SortType } from '@/types'
import settingManager from '@/managers/settingManager'
import userManager from './managers/userManager'
import notificationManager, { NotificationType } from './managers/notificationManager'

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

export enum ProjectStates {
  Started = 'started',
  Frozen = 'frozen',
  Ended = 'ended'
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
  state: ProjectStates
  residents: Resident[]
  payments: Payment[]

  constructor(props: Partial<Project> = {}) {
    this.createdAt = props.createdAt ?? new Date().toISOString()
    this.updatedAt = props.updatedAt ?? this.createdAt
    this.id = props.id ?? newId()
    this.expenses = props.expenses ?? {}
    this.name = props.name ?? 'Notre super projet'
    this.state = props.state ?? ProjectStates.Started
    this.residents = props.residents ?? []
    this.payments = props.payments ?? []
  }

  /**
   * Creates a new expense and adds it to the expenses list.
   *
   * @param expense The expense details, excluding the id.
   */
  expenseCreate(expense: Omit<Expense, 'id'>) {
    const trimmedName = expense.name

    if (!trimmedName) {
      notificationManager.create(`"${expense.name}" n’est pas un nom valide.`, NotificationType.Error)
      return
    }
    const id = newId()
    this.expenses[id] = { ...expense, id: id, name: trimmedName }
    this.updateTimestamp()
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

  paymentCreate(payment: Omit<Payment, 'id' | 'date'>) : void {
    const trimmedName = payment.resident

    if (!trimmedName) {
      notificationManager.create(`"${payment.resident}" n’est pas un nom valide.`, NotificationType.Error)
      return
    }
    const newPayment = {
      ...payment,
      date: new Date().toISOString(),
      id: newId(),
      resident: trimmedName
    }
    this.payments.push(newPayment)
    this.updateTimestamp()
  }

  paymentDelete(id: ID) : void {
    const index = this.payments.findIndex(payment => payment.id === id)

    if (index === -1) return

    this.payments.splice(index, 1)
    this.updateTimestamp()
  }

  /**
   * Group payments by resident name
   */
  paymentsSorted() : Record<string, Payment[]> {
    const sortedPayments: Record<string, Payment[]> = {}

    this.payments.forEach(payment => {
      if (!sortedPayments[payment.resident])
        sortedPayments[payment.resident] = []
      sortedPayments[payment.resident].push(payment)
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