/**** Drawings ****/

export interface Coin {
  id: ID
  x: number
  y: number
}

export interface Particle {
  id: ID
  x: number
  y: number
  velocityX: number
  velocityY: number
  life: number
}

/**** Frequencies ****/

export enum Frequency {
  weekly = 'weekly',
  monthly = 'monthly',
  quarterly = 'quarterly',
  biannualy = 'biannual',
  yearly = 'yearly'
}

export const frequencies = Object.freeze(Object.values(Frequency))

/**** Modal ****/

export type OpenModal = (arg0: string, arg1: () => void) => void

/**** ID ****/

export type ID = `${string}-${string}-${string}-${string}-${string}`

/**** Paths ****/

// When a Path is added, its title should be added in Texts too
export enum Path {
  Budget = '/budget',
  History = '/history',
  Home = '/',
  Legals = '/legals',
  NotFound = '/not-found',
  Projects = '/projects',
  Raphael = '/raphael',
  Settings = '/settings',
  Simulator = '/simulator'
}

/**** Sort ****/

export enum SortType {
  Abc = 'abc',
  Asc = 'asc',
  Desc = 'desc',
  Zyx = 'zyx'
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

export interface TransactionList {
  values: Transaction[],
  sum: number
}
export type TransactionFunctional = Omit<Transaction, 'id' | 'note'>