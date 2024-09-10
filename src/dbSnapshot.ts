import { reactive } from "vue"
import User from "./user"

export default class DBSnapshot {
  account: User
  users: User[]

  constructor(props : Partial<DBSnapshot>) {
    this.account = reactive<User>(new User(props.account ?? {}))
    this.users = reactive<User[]>((props.users ?? []).map((user: User) => new User(user)))
  }
}