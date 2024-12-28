import Account, { AccountType } from './account'
import User from './user'
import { reactive } from 'vue'

export default class DBSnapshot {
  account: Account
  users: User[]

  constructor(props : Partial<DBSnapshot>) {
    this.account = reactive<Account>(new Account(props.account ?? {}, AccountType.Common))
    this.users = reactive<User[]>((props.users ?? []).map((user: User) => new User(user)))
  }
}