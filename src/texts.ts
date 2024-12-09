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
        description: 'Définissez votre budget commun en renseignant les revenus et les dépenses contraintes de tous les membres du foyer.'
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
      title: 'Oups, cette page n’existe pas !'
    },
    [Path.Projects]: {
      meta: {
        description: 'Budgétez vos projets (travaux, vacances, mariage, etc.), répartissez les dépenses équitablement et suivez les achats réalisés 😉.'
      },
      title: 'Planifier mes projets'
    },
    [Path.Settings]: {
      meta: {
        description: 'Exportez, importez ou supprimez vos données, et modifiez l’interface.'
      },
      title: 'Paramètres'
    },
    [Path.Simulator]: {
      meta: {
        description: 'Répartissez le coût d’une dépense ponctuelle (meuble, électroménager, etc.) entre les habitants de votre foyer, en fonction de leurs revenus.'
      },
      title: 'Simuler une dépense ponctuelle'
    }
  },
  notifications: {
    settings: {
      currency: (txt: string) => `Les montants affichés utiliseront le symbole monétaire ${txt}.`,
      sort: (txt: string) => `Les dépenses et revenus seront triés dans l’ordre ${txt}.`,
      twoDecimals: {
        false: 'Les nombres seront simplement arrondis.',
        true: 'Les nombres seront affichés avec deux décimales.'
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
