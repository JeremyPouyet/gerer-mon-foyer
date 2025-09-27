import { TransactionType } from '@/types'

export const TextTransactionTypes = {
  [TransactionType.Expense]: {
    articleSingular: 'de la dépense contrainte',
    plural: 'Dépenses contraintes',
    singular: 'Dépense contrainte'
  },
  [TransactionType.Income]: {
    articleSingular: 'du revenu',
    plural: 'Revenus',
    singular: 'Revenu'
  },
  [TransactionType.PersonalExpense]: {
    articleSingular: 'de la dépense personnelle',
    plural: 'Dépenses personnelles',
    singular: 'Dépense personnelle'
  },
}