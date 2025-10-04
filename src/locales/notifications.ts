export const TextNotifications = {
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
}