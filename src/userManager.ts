import { reactive } from 'vue'
import User from './user'

class UserManager {
  readonly users = reactive<User[]>([])

  computeRatios() : void {
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

  create(name: string) : void {
    const trimmedName = name.trim()

    if (!trimmedName) return

    this.users.push(this.newUser({ name }))
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
      this.users.push(...(JSON.parse(users) as User[]).map((user: User) => this.newUser(user)))
    }
  }

  private newUser(user: Partial<User>) : User {
    return new User(user, this.computeRatios.bind(this))
  }
}

export default new UserManager()