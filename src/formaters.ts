import SettingsManager, { CurrencyToLocal } from './SettingsManager'
import { round } from './helpers'

const NonBreakingSpace = '\u00A0'

/* eslint-disable sort-keys */
const dateFormatter = Intl.DateTimeFormat('fr-FR', {
  minute: 'numeric',
  hour: 'numeric',
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})
/* eslint-enable sort-keys */

export function sexyAmount(amount: number) {
  return Intl.NumberFormat(CurrencyToLocal[SettingsManager.settings.currency], {
    currency: SettingsManager.settings.currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
    minimumFractionDigits: SettingsManager.settings.twoDecimals ? 2 : 0,
    style: 'currency'
  }).format(amount).replaceAll(/[,.]/g, SettingsManager.settings.decimalSeparator)
}

export function sexyDate(strDate: string) {
  return dateFormatter.format(new Date(strDate))
}

/**
 * Make a number pretty for it to be printed
 * - 2 digits are always added to the decimal part when SettingsManager.settings.twoDecimals is true
 * - The decimal part is separated in groups of 3 digits
 * - Set the user chose decimal separator
 *
 * @param {Number} value Number to format
 * @returns {String} Formated number
 */
export function sexyNumber(value: number) : string {
  const rounded = round(value)
  const stringified = SettingsManager.settings.twoDecimals ? rounded.toFixed(2) : rounded.toString()
  const [integerPart, decimalPart] = stringified.split('.')
  let formated = ''

  for (let i = integerPart.length - 1; i >= 0; i--) {
    formated = `${integerPart[i]}${formated}`
    if ((integerPart.length - i) % 3 === 0)
      formated = `${NonBreakingSpace}${formated}`
  }
  if (decimalPart)
    formated += `${SettingsManager.settings.decimalSeparator}${decimalPart}`
  return formated
}