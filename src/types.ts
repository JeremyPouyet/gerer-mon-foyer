export enum Frequency {
  monthly = 'monthly',
  quarterly = 'quarterly',
  biannual = 'biannual',
  yearly = 'yearly'
}

export const frequencies = Object.freeze(Object.values(Frequency))

export type ID = `${string}-${string}-${string}-${string}-${string}`

/**** Transactions ****/

export enum TransactionType {
  Expense = 'expenses',
  Income = 'incomes'
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
export type TransactionFunctional = Required<Omit<Transaction, 'id' | 'note'>>