import SettingsManager from './SettingsManager'
import { round } from './helpers'
import { CurrencyPosition } from './types'

/* eslint-disable sort-keys */
const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  minute: 'numeric',
  hour: 'numeric',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
/* eslint-enable sort-keys */

export function sexyAmount(amount: number) {
  // Todo - split numbers in group of 3 digits
  const currency = SettingsManager.settings.currency
  const position = SettingsManager.settings.currencyPosition
  let stringAmount = position === CurrencyPosition.Before ? `${currency} ` : ''

  stringAmount += amount
  if (position === CurrencyPosition.After)
    stringAmount += ` ${currency}`
  return stringAmount.replaceAll('.', ',')
}

export function sexyDate(strDate: string) {
  return dateFormatter.format(new Date(strDate))
}

export function sexyNumber(value: number) : string {
  const rounded = round(value)
  const stringified = SettingsManager.settings.twoDecimals ? rounded.toFixed(2) : rounded.toString()
  // , instead of . as a French number format. Change that later if multilingue
  return stringified.replaceAll('.', ',')
}