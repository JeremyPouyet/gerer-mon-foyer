import { nextTick, reactive, ref, watch } from 'vue'

import historyManager, { type Sample } from './historyManager'
import Account, { AccountType } from './account'
import userManager from './userManager'

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

    // wait for watchers to save empty values before updating usavedChanges
    nextTick(() => this.unsavedChanges.value = 0)
  }

  export() : string {
    this.unsavedChanges.value = 0
    return JSON.stringify(localStorage, ['account', 'users', 'history'], 2)
  }

  setup() : void {
    if (typeof localStorage == 'undefined') return
    const unsavedChanges = localStorage.getItem('unsavedChanges')
    if (unsavedChanges)
      this.unsavedChanges.value = +unsavedChanges

    userManager.load()

    const account = localStorage.getItem('account')
    if (account)
      Object.assign(this.account, JSON.parse(account))

    historyManager.load()
  }

  private persistChanges(key: 'account' | 'users' | 'history', value: object) : boolean {
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

    historyManager.addEventListener('update', event => this.persistChanges('history', (event as CustomEvent<Sample[]>).detail))
  }
}

export default new DB()