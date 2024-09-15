import { reactive } from 'vue'
import User from './user'
import Account from './account'

export default class DBSnapshot {
  account: Account
  users: User[]

  constructor(props : Partial<DBSnapshot>) {
    this.account = reactive<Account>(new Account(props.account ?? {}))
    this.users = reactive<User[]>((props.users ?? []).map((user: User) => new User(user)))
  }
}