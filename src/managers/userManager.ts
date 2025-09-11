import { reactive, watch } from 'vue'

import BrowserStorage, { StorageKey } from '@/browserStorage'
import type { ID } from '@/types'
import User from '@/user'

class UserManager {
  readonly users = reactive<User[]>([])
  #storage: BrowserStorage

  constructor() {
    this.#storage = new BrowserStorage(localStorage, StorageKey.Users)
    this.load()
    watch(this.users, () => this.#save(), { deep: true })
  }

  /**
   * Computes the shared expense ratio of each user ((what they earn - what they spend) / user number)
   * If the total remaining balance is zero, each user is given an equal ratio.
   */
  computeRatios() : void {
    const remains : Map<string, number> = this.users.reduce((map, user) => {
      const monthlyRemainingBalance = user.account.incomes.sum - user.account.expenses.sum
      const remain = Math.max(monthlyRemainingBalance, 0)
      return map.set(user.id, remain)
    }, new Map<string, number>())

    const remainSum = [...remains.values()].reduce((sum, value) => sum + value, 0)
    const userCount = this.users.length

    this.users.forEach(user => {
      user.ratio = remainSum === 0 ? 1 / userCount : (remains.get(user.id) ?? 0) / remainSum
    })
    this.#save()
  }

  /**
   * Adds a user to the users array if its name is not empty and re-computes ratios for all users.
   *
   * @param {string} name The name of the user to create.
   */
  create(name: string) : void {
    const trimmedName = name.trim()

    if (!trimmedName) return

    this.users.push(new User({ name }))
    this.computeRatios()
  }

  /**
   * Deletes a user from the users array and re-computes ratios for the remaining users.
   *
   * @param {User} user The user to delete.
   */
  delete(user: User) {
    const userIndex = this.users.findIndex(({ id }) => user.id === id)

    if (userIndex === -1) return

    this.users.splice(userIndex, 1)
    this.computeRatios()
  }

  /**
   * Empties the users array, removing all users.
   */
  empty() : void {
    this.users.splice(0)
  }

  /**
   * Loads users from local storage ('users' key) and repopulates the users array.
   */
  load(): void {
    this.empty()
    const stringifiedUsers = this.#storage.get('[]')
    const users = JSON.parse(stringifiedUsers) as Partial<User>[]

    for (const user of users)
      this.users.push(new User(user))
  }

  update(updates: Partial<User> & { id: ID }): void {
    const userIndex = this.users.findIndex(({ id }) => updates.id === id)

    if (userIndex === -1) return

    Object.assign(this.users[userIndex], updates)
    this.#save()
  }

  #save(): void {
    this.#storage.set(JSON.stringify(this.users))
  }
}

export default new UserManager()
export type { UserManager }