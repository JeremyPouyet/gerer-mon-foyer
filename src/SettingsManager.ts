import { reactive } from 'vue'
import notificationManager from '@/notificationManager'
import Texts from '@/texts'
import { SortType } from './types'

// ISO 4217 currencies
export enum Currency {
  Algeria = 'DZD',
  CanadianDollar = 'CAD',
  CentralAfricanCFAFranc = 'XAF',
  Euro = 'EUR',
  GuineaFranc = 'GNF',
  Marocco = 'MAD',
  PacificFranc = 'XPF',
  SwissFranc = 'CHF',
  Tunisia = 'TND',
  WestAfricanCFAFranc = 'XOF',
}

// IETF BCP 47 language tag
export const CurrencyToLocale: Record<Currency, string> = Object.freeze({
  [Currency.Algeria]: 'fr-DZ',
  [Currency.CanadianDollar]: 'fr-CA',
  [Currency.CentralAfricanCFAFranc]: 'fr-CM',
  [Currency.Euro]: 'fr-FR',
  [Currency.GuineaFranc]: 'fr-GN',
  [Currency.Marocco]: 'fr-MA',
  [Currency.PacificFranc]: 'fr-PF',
  [Currency.SwissFranc]: 'fr-CH',
  [Currency.Tunisia]: 'fr-TN',
  [Currency.WestAfricanCFAFranc]: 'fr-SN'
})

interface GlobalSettings {
  currency: Currency,
  sort: SortType,
  twoDecimals: boolean
}
type GlobalSettingsKey = keyof GlobalSettings

type Notifications = {
  [K in GlobalSettingsKey]: (value: GlobalSettings[K]) => void
}
const notifications: Notifications = {
  currency: (value: Currency) => notificationManager.create(
    Texts.notifications.settings.currency(settingsManager.getCurrencySymbol(value, true))
  ),
  sort: (value: SortType) => notificationManager.create(
    Texts.notifications.settings.sort(Texts.sortTypes[value].toLocaleLowerCase()),
  ),
  twoDecimals: (value: boolean) => notificationManager.create(
    Texts.notifications.settings.twoDecimals[value ? 'true' : 'false']
  )
}

function defaultSettings() : GlobalSettings {
  return {
    currency: Currency.Euro,
    sort: SortType.Desc,
    twoDecimals: false
  }
}

class SettingsManager {
  readonly settings = reactive<GlobalSettings>(defaultSettings())

  /**
   * Retrieves the currency symbol for a given currency.
   *
   * @param {Currency} [currency] - Currency to get the symbol for. Defaults to current setting.
   * @param {boolean} [with_iso_code=false] - Whether to append the ISO code to the symbol.
   * @returns {string} The currency symbol, optionally with ISO code.
   */
  getCurrencySymbol(currency?: Currency, with_iso_code = false) : string {
    currency ||= this.settings.currency

    const one = Intl.NumberFormat(
      CurrencyToLocale[currency],
      { currency, style: 'currency'}
    ).format(1).replaceAll(/[ \d.,]/g, '').trim() // trim removes non-breakable spaces

    return with_iso_code ? `${one} (${currency})` : one
  }

  /**
   * Checks if the currency symbol of the currency in the settings is positioned after the value.
   *
   * @returns {boolean} True if symbol is on the right; false otherwise.
   */
  isCurrencySymbolOnRight() : boolean {
    return Intl.NumberFormat(
      CurrencyToLocale[this.settings.currency],
      { currency: this.settings.currency, style: 'currency'}
    ).format(1).startsWith('1')
  }

  /**
   * Loads saved settings from local storage.
   * If no settings exist, applies default settings.
   */
  load(): void {
    const stringifiedSettings = localStorage.getItem('settings') || '{}'
    const settings = JSON.parse(stringifiedSettings) as Partial<GlobalSettings>

    Object.assign(this.settings, settings)
  }

  /**
   * Updates a setting and generates a notification
   *
   * @param {String} setting Name of the setting to update
   * @param {Any} value New setting value
   */
  update<K extends GlobalSettingsKey>(setting: K, value: GlobalSettings[K]): void {
    this.settings[setting] = value

    notifications[setting](value)
  }
}

const settingsManager = new SettingsManager()
export default settingsManager