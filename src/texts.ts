import { Frequency, TransactionType } from './types'

export default {
  frequencies: {
    [Frequency.monthly]: 'Mois',
    [Frequency.quarterly]: 'Trimestre',
    [Frequency.biannual]: 'Semestre',
    [Frequency.yearly]: 'Année',
  },
  transactionTypes: {
    [TransactionType.Expense]: { plural: 'Dépenses contraintes', singular: 'Dépense contrainte' },
    [TransactionType.Income]: { plural: 'Revenus', singular: 'Revenu' },
    [TransactionType.PersonalExpense]: { plural: 'Dépenses personnelles', singular: 'Dépense personnelle' },
  }
}