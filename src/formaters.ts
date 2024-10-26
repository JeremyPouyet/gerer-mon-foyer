import SettingsManager, { CurrencyToLocale } from './SettingsManager'

/* eslint-disable sort-keys */
const dateTimeFormatOptions: Partial<Intl.DateTimeFormatOptions> = {
  minute: 'numeric',
  hour: 'numeric',
  day: 'numeric',
  month: 'short',
  year: 'numeric'
}
/* eslint-enable sort-keys */

/**
 * Formats a number as a currency amount based on user settings:
 * - 2 digits are always added to the decimal part when SettingsManager.settings.twoDecimals is true
 * - The integer part is separated in groups of 3 digits
 * - Set the user chose decimal separator
 *
 * @param amount - The amount to format
 * @returns The formatted currency amount as a string
 */
export function sexyAmount(amount: number) {
  return Intl.NumberFormat(CurrencyToLocale[SettingsManager.settings.currency], {
    currency: SettingsManager.settings.currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
    minimumFractionDigits: SettingsManager.settings.twoDecimals ? 2 : 0,
    style: 'currency'
  }).format(amount).replaceAll(/[,.]/g, SettingsManager.settings.decimalSeparator)
}

/**
 * Formats a string date to a readable date format.
 *
 * @param strDate - The date as a string
 * @returns The formatted date as a string
 */
export function sexyDate(strDate: string) {
  return Intl.DateTimeFormat(
    CurrencyToLocale[SettingsManager.settings.currency],
    dateTimeFormatOptions
  ).format(new Date(strDate))
}

/**
 * Make a number pretty for it to be printed
 * - 2 digits are always added to the decimal part when SettingsManager.settings.twoDecimals is true
 * - The integer part is separated in groups of 3 digits
 * - Set the user chose decimal separator
 *
 * @param {Number} value Number to format
 * @returns {String} Formated number
 */
export function sexyNumber(value: number) : string {
  return Intl.NumberFormat(CurrencyToLocale[SettingsManager.settings.currency], {
    maximumFractionDigits: 2,
    minimumFractionDigits: SettingsManager.settings.twoDecimals ? 2 : 0,
    useGrouping: true
  }).format(value).replaceAll(/[,.]/g, SettingsManager.settings.decimalSeparator)
}