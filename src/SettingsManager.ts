import { reactive } from 'vue'

enum SortType {
  Abc = 'abc',
  Desc = 'desc'
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

export { SortType }
export default new SettingsManager()