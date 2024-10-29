export enum SortType {
  Abc = 'abc',
  Asc = 'asc',
  Desc = 'desc',
  Zyx = 'zyx'
}

/**** Frequencies ****/

export enum Frequency {
  monthly = 'monthly',
  quarterly = 'quarterly',
  biannual = 'biannual',
  yearly = 'yearly'
}

export const frequencies = Object.freeze(Object.values(Frequency))

/**** ID ****/

export type ID = `${string}-${string}-${string}-${string}-${string}`

/**** Pages ****/

export enum Page {
  Budget = '/budget',
  History = '/history',
  Home = '/',
  NotFound = '/not-found',
  Settings = '/settings',
  Simulator = '/simulator'
}

/**** Transactions ****/

export enum TransactionType {
  Expense = 'expenses',
  Income = 'incomes',
  PersonalExpense = 'personalExpenses'
}

export interface Transaction {
  readonly id: ID,
  frequency: Frequency,
  name: string,
  note?: string,
  value: string // Not a number to allow math formulas
}

export interface TransactionRecord {
  values: Record<ID, Transaction>,
  sum: number
}
export interface TransactionList {
  values: Transaction[],
  sum: number
}
export type TransactionFunctional = Omit<Transaction, 'id' | 'note'>
