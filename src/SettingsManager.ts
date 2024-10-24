import { reactive } from 'vue'

export enum SortType {
  Abc = 'abc',
  Asc = 'asc',
  Desc = 'desc',
  Zyx = 'zyx'
}

interface GlobalSettings {
  sort: SortType,
  twoDecimals: boolean
}

function defaultSettings() : GlobalSettings {
  return {
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