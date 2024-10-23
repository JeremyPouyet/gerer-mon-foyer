import { Frequency, Page, TransactionType } from '@/types'
import { SortType } from './SettingsManager'

export default {
  frequencies: {
    [Frequency.monthly]: 'Mois',
    [Frequency.quarterly]: 'Trimestre',
    [Frequency.biannual]: 'Semestre',
    [Frequency.yearly]: 'Année',
  },
  heads: {
    [Page.Budget]: {
      meta: {
        description: 'Définissez votre budget commun en renseignant les revenus et dépenses contraintes de tous les membres du foyer.'
      },
      title: 'Gérer mon budget'
    },
    [Page.History]: {
      meta: {
        description: 'Visualisez l’évolution de votre budget et de vos dépenses.'
      },
      title: 'Historique de mon budget'
    },
    [Page.Home]: {
      meta: {
        description: 'Un outil gratuit pour gérer votre budget et simplifier la gestion des dépenses communes de votre foyer, tout en tenant compte de vos charges personnelles.'
      },
      title: 'Comment gérer le budget de mon foyer ?'
    },
    [Page.NotFound]: {
      meta: {
        description: '404 - Cette page n’existe pas.'
      },
      title: 'Oulà, cette page n’existe pas !'
    },
    [Page.Settings]: {
      meta: {
        description: 'Gérez vos paramètres: exportez/importez/supprimez vos données.'
      },
      title: 'Paramètres'
    },
    [Page.Simulator]: {
      meta: {
        description: 'Répartissez le montant de dépenses ponctuelles entre les habitants d’un foyer en fonction de leurs revenus. Entrez une valeur ou une formule et découvrez le montant que chacun devra payer.'
      },
      title: 'Simulateur de dépenses ponctuelles'
    }
  },
  sortTypes: {
    [SortType.Abc]: 'Alphabétique',
    [SortType.Desc]: 'Décroissant'
  },
  transactionTypes: {
    [TransactionType.Expense]: { plural: 'Dépenses contraintes', singular: 'Dépense contrainte' },
    [TransactionType.Income]: { plural: 'Revenus', singular: 'Revenu' },
    [TransactionType.PersonalExpense]: { plural: 'Dépenses personnelles', singular: 'Dépense personnelle' },
  }
}