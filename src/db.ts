import { reactive, ref, watch } from 'vue'

import { emptyTransactions } from './helpers'
import historyManager, { type Sample } from './historyManager'
import User from './user'
import Account from './account'

class DB {
  readonly account = reactive<Account>(new Account({}, this.computeRatios.bind(this)))
  readonly users = reactive<User[]>([])
  readonly unsavedChanges = ref<number>(0)

  constructor() {
    this.setup()
    this.watch()
  }

  setup() : void {
    const unsavedChanges = localStorage.getItem('unsavedChanges')
    if (unsavedChanges)
      this.unsavedChanges.value = +unsavedChanges

    const users = localStorage.getItem('users')
    if (users) {
      this.users.push(...(JSON.parse(users) as User[]).map((user: User) => this.newUser(user)))
    }

    const account = localStorage.getItem('account')
    if (account)
      Object.assign(this.account, JSON.parse(account))

    historyManager.load()

    this.computeRatios()
  }

  private watch() : void {
    watch(this.unsavedChanges, value => { localStorage.setItem('unsavedChanges', value.toString()) })
    watch(this.users, updated => this.persistChanges('users', updated), { deep: true })
    watch(this.account, updated => this.persistChanges('account', updated))

    historyManager.addEventListener('update', event => this.persistChanges('history', (event as CustomEvent<Sample[]>).detail))
  }

  export() : string {
    this.unsavedChanges.value = 0
    return JSON.stringify(localStorage, ['account', 'users', 'history'], 2)
  }

  empty() : void {
    while (this.users[0])
      this.userDelete(this.users[0])

    Object.assign(this.account.expenses, emptyTransactions())
    Object.assign(this.account.incomes, emptyTransactions())
    historyManager.empty()
    this.unsavedChanges.value = 0
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

  /**** Users ****/

  userCreate(name: string) : void {
    const trimmedName = name.trim()

    if (!trimmedName) return

    this.users.push(this.newUser({ name }))
    this.computeRatios()
  }

  private newUser(user: Partial<User>) {
    return new User(user, this.computeRatios.bind(this))
  }

  userDelete(user: User) {
    const userIndex = this.users.findIndex(({ id }) => user.id === id)

    if (userIndex === -1) return

    this.users.splice(userIndex, 1)
    this.computeRatios()
  }

  private computeRatios() : void {
    const remains : Map<string, number> = this.users.reduce((map, user) => {
      const remain = Math.max(user.monthlyRemainingBalance, 0)
      return map.set(user.id, remain)
    }, new Map<string, number>())

    const remainSum = [...remains.values()].reduce((sum, value) => sum + value, 0)
    const userCount = this.users.length

    this.users.forEach(user => {
      user.ratio = remainSum === 0 ? 1 / userCount : (remains.get(user.id) ?? 0) / remainSum
    })
  }
}

export default new DB()