import { reactive } from 'vue'
import { Currency, CurrencyPosition } from './types'

export enum SortType {
  Abc = 'abc',
  Asc = 'asc',
  Desc = 'desc',
  Zyx = 'zyx'
}

interface GlobalSettings {
  currency: Currency,
  currencyPosition: CurrencyPosition,
  sort: SortType,
  twoDecimals: boolean
}

function defaultSettings() : GlobalSettings {
  return {
    currency: Currency.Euro,
    currencyPosition: CurrencyPosition.After,
    sort: SortType.Desc,
    twoDecimals: false
  }
}

class SettingsManager {
  readonly settings = reactive<GlobalSettings>(defaultSettings())

  load(): void {
    const stringifiedSettings = localStorage.getItem('settings') || '{}'
    const settings = JSON.parse(stringifiedSettings) as Partial<GlobalSettings>

    Object.assign(this.settings, settings)
  }
}

export default new SettingsManager()