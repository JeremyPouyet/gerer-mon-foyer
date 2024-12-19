import { reactive } from 'vue'
import notificationManager from '@/managers/notificationManager'
import Texts from '@/texts'
import { SortType } from '../types'
import BrowserStorage, { StorageKey } from '@/browserStorage'

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
  currency: (value: Currency) => notificationManager.success(
    Texts.notifications.settings.currency(settingManager.getCurrencySymbol(value, true))
  ),
  sort: (value: SortType) => notificationManager.success(
    Texts.notifications.settings.sort(Texts.sortTypes[value].toLocaleLowerCase()),
  ),
  twoDecimals: (value: boolean) => notificationManager.success(
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
  #storage: BrowserStorage

  constructor() {
    this.#storage = new BrowserStorage(localStorage, StorageKey.Settings)
    this.load()
  }

  /**
   * Retrieves the currency symbol for a given currency.
   *
   * @param currency - Currency to get the symbol for. Defaults to current setting.
   * @param with_iso_code - Whether to append the ISO code to the symbol.
   * @returns The currency symbol, optionally with ISO code.
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
   * @returns True if symbol is on the right; false otherwise.
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
    const stringifiedSettings = this.#storage.get('{}')
    const settings = JSON.parse(stringifiedSettings) as Partial<GlobalSettings>

    Object.assign(this.settings, settings)
  }

  #save(): void {
    this.#storage.set(JSON.stringify(this.settings))
  }

  /**
   * Updates a setting and generates a notification
   *
   * @param setting Name of the setting to update
   * @param value New setting value
   */
  update<K extends GlobalSettingsKey>(setting: K, value: GlobalSettings[K]): void {
    this.settings[setting] = value

    notifications[setting](value)
    this.#save()
  }
}

const settingManager = new SettingsManager()
export default settingManager