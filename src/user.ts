import Account, { AccountType } from '@/account'
import type { ID } from '@/types'
import { newId } from '@/helpers'


export default class User {
  readonly account: Account
  readonly id: ID
  name: string
  ratio: number

  constructor(props: Partial<User>) {
    this.account = new Account(props.account, AccountType.Personal)
    this.id = props.id ?? newId()
    this.name = props.name ?? ''
    this.ratio = props.ratio ?? 0
  }

  updateName(name: string) : void {
    name = name.trim()

    if (name)
      this.name = name
  }
}