import { Frequency, Path, SortType, TransactionType } from '@/types'

export default {
  frequencies: {
    [Frequency.monthly]: 'Mois',
    [Frequency.quarterly]: 'Trimestre',
    [Frequency.biannual]: 'Semestre',
    [Frequency.yearly]: 'Année',
  },
  heads: {
    [Path.Budget]: {
      meta: {
        description: 'Définissez votre budget commun en renseignant les revenus et dépenses contraintes de tous les membres du foyer.'
      },
      title: 'Gérer mon budget'
    },
    [Path.History]: {
      meta: {
        description: 'Visualisez l’évolution de votre budget et de vos dépenses.'
      },
      title: 'Historique de mon budget'
    },
    [Path.Home]: {
      meta: {
        description: 'Un outil gratuit pour gérer votre budget et simplifier la gestion des dépenses communes de votre foyer, tout en tenant compte de vos charges personnelles.'
      },
      title: 'Comment gérer le budget de mon foyer ?'
    },
    [Path.NotFound]: {
      meta: {
        description: '404 - Cette page n’existe pas.'
      },
      title: 'Oulà, cette page n’existe pas !'
    },
    [Path.Settings]: {
      meta: {
        description: 'Gérez vos paramètres: exportez/importez/supprimez vos données.'
      },
      title: 'Paramètres'
    },
    [Path.Simulator]: {
      meta: {
        description: 'Répartissez le montant de dépenses ponctuelles entre les habitants d’un foyer en fonction de leurs revenus. Entrez une valeur ou une formule et découvrez le montant que chacun devra payer.'
      },
      title: 'Simulateur de dépenses ponctuelles'
    }
  },
  notifications: {
    settings: {
      currency: (txt: string) => `Les montants affichés utiliseront le symbol monétaire ${txt}.`,
      sort: (txt: string) => `Les dépenses et revenus seront triés dans l’ordre ${txt}.`,
      twoDecimals: {
        false: 'Les nombres seront simplement arrondis.',
        true: 'Les nombres seront affichés avec 2 décimales.'
      }
    }
  },
  sortTypes: {
    [SortType.Abc]: 'Alphabétique',
    [SortType.Asc]: 'Croissant',
    [SortType.Desc]: 'Décroissant',
    [SortType.Zyx]: 'Alphabétique inverse'
  },
  transactionTypes: {
    [TransactionType.Expense]: { plural: 'Dépenses contraintes', singular: 'Dépense contrainte' },
    [TransactionType.Income]: { plural: 'Revenus', singular: 'Revenu' },
    [TransactionType.PersonalExpense]: { plural: 'Dépenses personnelles', singular: 'Dépense personnelle' },
  }
}