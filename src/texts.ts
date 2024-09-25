import { Frequency, TransactionType } from './types'

export default {
  frequencies: {
    [Frequency.monthly]: 'Mois',
    [Frequency.quarterly]: 'Trimestre',
    [Frequency.biannual]: 'Semestre',
    [Frequency.yearly]: 'Année',
  },
  transactionTypes: {
    [TransactionType.Expense]: { plural: 'Dépenses', singular: 'Dépense' },
    [TransactionType.Income]: { plural: 'Revenus', singular: 'Revenu' }
  }
}