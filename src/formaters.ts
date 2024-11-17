import settingManager, { CurrencyToLocale } from './managers/settingManager'

/**
 * Formats a number as a currency amount based on user settings:
 * - 2 digits are always added to the decimal part when settingManager.settings.twoDecimals is true
 * - The integer part is separated in groups of 3 digits
 *
 * @param amount - The amount to format
 * @returns The formatted currency amount as a string
 */
export function sexyAmount(amount: number) : string {
  return Intl.NumberFormat(CurrencyToLocale[settingManager.settings.currency], {
    currency: settingManager.settings.currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
    minimumFractionDigits: settingManager.settings.twoDecimals ? 2 : 0,
    style: 'currency',
    useGrouping: true
  }).format(amount)
}

/**
 * Formats a string date to a readable date format.
 *
 * @param strDate - The date as a string
 * @param includeTime - Whether to include hours and minutes (default: true)
 * @return The formatted date as a string
 */
export function sexyDate(strDate: string, includeTime = true) : string {
  const dateTimeFormatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric'}

  if (includeTime)
    Object.assign(dateTimeFormatOptions, { hour: 'numeric', minute: 'numeric' })

  return Intl.DateTimeFormat(
    CurrencyToLocale[settingManager.settings.currency],
    dateTimeFormatOptions
  ).format(new Date(strDate))
}

/**
 * Make a number pretty for it to be printed
 * - 2 digits are always added to the decimal part when settingManager.settings.twoDecimals is true
 * - The integer part is separated in groups of 3 digits
 *
 * @param value Number to format
 * @param style Intl.NumberFormatOptions.style possible value
 * @return Formated number
 */
export function sexyNumber(value: number, style = 'decimal') : string {
  if (!isFinite(value))
    return 'NC'

  return Intl.NumberFormat(CurrencyToLocale[settingManager.settings.currency], {
    maximumFractionDigits: 2,
    minimumFractionDigits: settingManager.settings.twoDecimals ? 2 : 0,
    style,
    useGrouping: true
  }).format(value)
}