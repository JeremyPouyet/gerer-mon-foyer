import { reactive } from 'vue'

enum SortTYpe {
  Abc = 'abc',
  Desc = 'desc'
}

interface GlobalSettings {
  sort: SortTYpe,
  twoDecimals: boolean
}

function defaultSettings() : GlobalSettings {
  return {
    sort: SortTYpe.Desc,
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