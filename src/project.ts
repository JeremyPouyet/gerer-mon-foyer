import { newId } from '@/helpers'
import type { ID } from '@/types'
import { SortType } from '@/types'
import settingManager from '@/managers/settingManager'

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

  constructor(props: Partial<Project> = {}) {
    this.createdAt = props.createdAt ?? new Date().toISOString()
    this.updatedAt = props.updatedAt ?? this.createdAt
    this.id = props.id ?? newId()
    this.expenses = props.expenses ?? {}
    this.name = props.name ?? 'Mon super projet'
  }

  /**
   * Creates a new expense and adds it to the expenses list.
   *
   * @param expense The expense details, excluding the id.
   */
  create(expense: Omit<Expense, 'id'>) {
    const id = newId()
    this.expenses[id] = { ...expense, id: id }
    console.log(this)
    this.updateTimestamp()
  }

  /**
   * Deletes an expense by ID.
   *
   * @param id The ID of the expense to delete.
   * @return Whether the deletion was successful.
   */
  delete(id: ID) {
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
   * Updates the `updatedAt` timestamp to the current time.
   */
  updateTimestamp(): void {
    this.updatedAt = new Date().toISOString()
  }
}