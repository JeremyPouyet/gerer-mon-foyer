import { reactive } from 'vue'

export enum DecimalSeparator {
  Comma = ',',
  Dot = '.'
}

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

export enum SortType {
  Abc = 'abc',
  Asc = 'asc',
  Desc = 'desc',
  Zyx = 'zyx'
}

interface GlobalSettings {
  currency: Currency,
  decimalSeparator: DecimalSeparator,
  sort: SortType,
  twoDecimals: boolean
}

function defaultSettings() : GlobalSettings {
  return {
    currency: Currency.Euro,
    decimalSeparator: DecimalSeparator.Comma,
    sort: SortType.Desc,
    twoDecimals: false
  }
}

class SettingsManager {
  readonly settings = reactive<GlobalSettings>(defaultSettings())

  getCurrencySymbol(currency?: Currency, with_iso_code = false) : string {
    currency ||= this.settings.currency

    const one = Intl.NumberFormat(
      CurrencyToLocale[currency],
      { currency, style: 'currency'}
    ).format(1).replaceAll(/[ \d.,]/g, '').trim() // trim removes non-breakable spaces

    return with_iso_code ? `${one} (${currency})` : one
  }

  isCurrencySymbolOnRight() : boolean {
    return Intl.NumberFormat(
      CurrencyToLocale[this.settings.currency],
      { currency: this.settings.currency, style: 'currency'}
    ).format(1).startsWith('1')
  }

  load(): void {
    const stringifiedSettings = localStorage.getItem('settings') || '{}'
    const settings = JSON.parse(stringifiedSettings) as Partial<GlobalSettings>

    Object.assign(this.settings, settings)
  }
}

export default new SettingsManager()