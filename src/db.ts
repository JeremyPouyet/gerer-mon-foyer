import { nextTick, reactive, ref, watch } from 'vue'

import historyManager, { type Sample } from './managers/historyManager'
import Account, { AccountType } from './account'
import userManager from './managers/userManager'
import settingManager from './managers/settingManager'
import projectManager from './managers/projectManager'

const persistatbleKeys = ['account', 'history', 'projects', 'settings', 'users'] as const
type Persistable = typeof persistatbleKeys[number]

class DB {
  readonly account = reactive<Account>(new Account({}, AccountType.Common))
  readonly unsavedChanges = ref<number>(0)

  constructor() {
    this.setup()
    this.watch()
  }

  empty() : void {
    userManager.empty()
    this.account.empty()
    historyManager.empty()
    sessionStorage.clear()
    projectManager.empty()

    // wait for watchers to save empty values before updating usavedChanges
    nextTick(() => this.unsavedChanges.value = 0)
  }

  export() : string {
    this.unsavedChanges.value = 0
    return JSON.stringify(localStorage, [...persistatbleKeys], 2)
  }

  setup() : void {
    const unsavedChanges = localStorage.getItem('unsavedChanges')
    if (unsavedChanges)
      this.unsavedChanges.value = +unsavedChanges

    userManager.load()

    const account = localStorage.getItem('account')
    if (account)
      Object.assign(this.account, JSON.parse(account))

    historyManager.load()
    projectManager.load()
    settingManager.load()
  }

  private persistChanges(key: Persistable, value: object) : boolean {
    const stringifiedItem = JSON.stringify(value)

    // Do not update already up to date data
    if (stringifiedItem === localStorage.getItem(key))
      return true

    try {
      localStorage.setItem(key, stringifiedItem)
      ++this.unsavedChanges.value
    }
    catch(err) {
      console.error(`Failed to persist ${key}:`, err)
      return false
    }
    return true
  }

  private watch() : void {
    watch(this.unsavedChanges, value => localStorage.setItem('unsavedChanges', value.toString()))
    watch(userManager.users, updated => this.persistChanges('users', updated), { deep: true })
    watch(this.account, updated => this.persistChanges('account', updated))
    watch(settingManager.settings, updated => this.persistChanges('settings', updated))

    historyManager.addEventListener('update', event => this.persistChanges('history', (event as CustomEvent<Sample[]>).detail))
  }
}

export default new DB()