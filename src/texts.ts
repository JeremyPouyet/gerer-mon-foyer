import { Frequency, Path, SortType, TransactionType } from '@/types'

export default {
  frequencies: {
    [Frequency.weekly]: 'Semaine',
    [Frequency.monthly]: 'Mois',
    [Frequency.quarterly]: 'Trimestre',
    [Frequency.biannualy]: 'Semestre',
    [Frequency.yearly]: 'Année',
  },
  heads: {
    [Path.Budget]: {
      meta: {
        description: 'Définissez votre budget commun en renseignant les revenus et les dépenses contraintes de tous les membres du foyer.'
      },
      title: 'Gérer notre budget'
    },
    [Path.History]: {
      meta: {
        description: 'Visualisez l’évolution de votre budget et de vos dépenses'
      },
      title: 'Historique de notre budget'
    },
    [Path.Home]: {
      meta: {
        description: 'Un outil gratuit pour gérer votre budget et simplifier la gestion des dépenses communes de votre foyer, tout en tenant compte de vos charges personnelles.'
      },
      title: 'Comment gérer le budget de mon foyer ?'
    },
    [Path.Legals]: {
      meta: {
        description: 'Tout ce qu’il faut savoir sur Gérer Mon Foyer'
      },
      title: 'Mentions légales'
    },
    [Path.NotFound]: {
      meta: {
        description: '404 - Cette page n’existe pas.'
      },
      title: 'Oups, cette page n’existe pas !'
    },
    [Path.Projects]: {
      meta: {
        description: 'Budgétez vos projets (travaux, vacances, mariage, etc.), répartissez les dépenses équitablement et suivez les achats réalisés'
      },
      title: 'Budgéter nos projets'
    },
    [Path.Raphael]: {
      meta: {
        description: 'Cette page est faite par mon neveu qui apprend l’informatique'
      },
      title: 'La page de Raph !'
    },
    [Path.Settings]: {
      meta: {
        description: 'Exportez, importez ou supprimez vos données, et modifiez l’interface'
      },
      title: 'Paramètres'
    },
    [Path.Simulator]: {
      meta: {
        description: 'Répartissez le coût d’une dépense ponctuelle (meuble, électroménager, etc.) entre les habitants de votre foyer, en fonction de leurs revenus'
      },
      title: 'Simuler une dépense ponctuelle'
    },
    [Path.Users]: {
      meta: {
        description: 'Renseignez la liste des habitants de votre foyer pour établir votre budget'
      },
      title: 'Lister les habitants de notre foyer'
    }
  },
  notifications: {
    settings: {
      currency: (txt: string) => `Les montants affichés utiliseront le symbole monétaire ${txt}.`,
      showConfirmModal: {
        false: 'La modal de confirmation ne sera pas affiché',
        true: 'La modal de confirmation sera affiché'
      },
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
}
