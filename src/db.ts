import { nextTick, reactive, watch } from 'vue'

import userManager from '@/managers/userManager'
import historyManager, { type Sample } from '@/managers/historyManager'
import Account, { AccountType } from '@/account'
import projectManager from '@/managers/projectManager'
import unsavedManager from '@/managers/unsavedManager'

const persistatbleKeys = ['account', 'history', 'projects', 'settings', 'users'] as const
type Persistable = typeof persistatbleKeys[number]

class DB {
  readonly account = reactive<Account>(new Account({}, AccountType.Common))

  constructor() {
    this.watch()
  }

  empty() : void {
    userManager.empty()
    this.account.empty()
    historyManager.empty()
    sessionStorage.clear()
    projectManager.empty()

    // wait for watchers to save empty values before updating usavedChanges
    nextTick(() => unsavedManager.reset())
  }

  export() : string {
    unsavedManager.reset()
    return JSON.stringify(localStorage, [...persistatbleKeys], 2)
  }

  setup() : void {
    userManager.load()
    historyManager.load()
    projectManager.load()
    const account = localStorage.getItem('account')
    if (account)
      Object.assign(this.account, JSON.parse(account))
  }

  private persistChanges(key: Persistable, value: object) : boolean {
    const stringifiedItem = JSON.stringify(value)

    // Do not update already up to date data
    if (stringifiedItem === localStorage.getItem(key))
      return true

    try {
      localStorage.setItem(key, stringifiedItem)
      unsavedManager.increment()
    }
    catch(err) {
      console.error(`Failed to persist ${key}:`, err)
      return false
    }
    return true
  }

  private watch() : void {
    watch(userManager.users, updated => this.persistChanges('users', updated), { deep: true })
    watch(this.account, updated => this.persistChanges('account', updated))
  }
}

export default new DB()