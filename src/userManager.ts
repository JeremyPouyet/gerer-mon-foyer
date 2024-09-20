import { reactive } from 'vue'
import User from './user'

class UserManager {
  readonly users = reactive<User[]>([])

  create(name: string) : void {
    const trimmedName = name.trim()

    if (!trimmedName) return

    this.users.push(new User({ name }))
    this.computeRatios()
  }

  delete(user: User) {
    const userIndex = this.users.findIndex(({ id }) => user.id === id)

    if (userIndex === -1) return

    this.users.splice(userIndex, 1)
    this.computeRatios()
  }

  empty() : void {
    this.users.splice(0)
  }

  load() : void {
    this.empty()
    const users = localStorage.getItem('users')
    if (users) {
      this.users.push(...(JSON.parse(users) as Partial<User>[]).map((user: Partial<User>) => new User(user)))
    }
  }

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
  }
}

export default new UserManager()