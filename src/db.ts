import { nextTick, reactive, watch } from 'vue'

import Account, { AccountType } from '@/account'
import BrowserStorage, { StorageKey } from './browserStorage'
import historyManager from '@/managers/historyManager'
import notificationManager from '@/managers/notificationManager'
import projectManager from '@/managers/projectManager'
import settingManager from '@/managers/settingManager'
import unsavedManager from '@/managers/unsavedManager'
import userManager from '@/managers/userManager'

const persistatbleKeys = ['account', 'history', 'projects', 'settings', 'users'] as const

class DB {
  readonly account = reactive<Account>(new Account({}, AccountType.Common))
  #accountStorage: BrowserStorage

  constructor() {
    this.#accountStorage = new BrowserStorage(localStorage, StorageKey.CommonAccount)
    this.#load()
    watch(this.account, updated => {
      this.#accountStorage.set(JSON.stringify(updated))
    })
  }

  empty() : void {
    historyManager.empty()
    projectManager.empty()
    userManager.empty()

    this.account.empty()

    localStorage.clear()
    sessionStorage.clear()

    // wait for watchers to save empty values before updating usavedChanges
    nextTick(() => unsavedManager.reset())
  }

  export() : string {
    unsavedManager.reset()
    return JSON.stringify(localStorage, [...persistatbleKeys], 2)
  }

  historicize() {
    historyManager.create({ account: this.account, users: userManager.users })
    notificationManager.success('Répartition historisé !')
  }

  #load() : void {
    const account = this.#accountStorage.get('{}')
    Object.assign(this.account, JSON.parse(account))
  }

  setup() : void {
    historyManager.load()
    projectManager.load()
    settingManager.load()
    userManager.load()

    this.#load()
  }
}

export default new DB()
export { DB }