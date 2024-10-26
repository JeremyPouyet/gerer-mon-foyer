import SettingsManager from './SettingsManager'
import { round } from './helpers'
import { CurrencyPosition } from './types'

const NonBreakingSpace = '\u00A0'

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
  const currency = SettingsManager.settings.currency
  const position = SettingsManager.settings.currencyPosition
  let stringAmount = position === CurrencyPosition.Before ? `${currency}${NonBreakingSpace}` : ''

  stringAmount += sexyNumber(amount)
  if (position === CurrencyPosition.After)
    stringAmount += `${NonBreakingSpace}${currency}`
  return stringAmount
}

export function sexyDate(strDate: string) {
  return dateFormatter.format(new Date(strDate))
}

/**
 * Make a number pretty for it to be printed
 * - 2 digits are always added to the decimal part when SettingsManager.settings.twoDecimals is true
 * - The decimal part is separated in groups of 3 digits
 *
 * @param {Number} value Number to formatedformat
 * @returns {String} Formated number
 */
export function sexyNumber(value: number) : string {
  const rounded = round(value)
  let stringified = SettingsManager.settings.twoDecimals ? rounded.toFixed(2) : rounded.toString()
  stringified = stringified.replaceAll('.', SettingsManager.settings.decimalSeparator)
  const [integerPart, decimalPart] = stringified.split(',')
  let formated = ''
  for (let i = integerPart.length - 1; i >= 0; i--) {
    formated = `${integerPart[i]}${formated}`
    if ((integerPart.length - i) % 3 === 0)
      formated = `${NonBreakingSpace}${formated}`
  }
  if (decimalPart)
    formated += `,${decimalPart}`
  return formated
}