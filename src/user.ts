import Account, { AccountType } from '@/account'
import type { ID } from '@/types'
import { newId } from '@/helpers'

export default class User {
  readonly account: Account
  avatar: string
  readonly id: ID
  name: string
  ratio: number

  constructor(props: Partial<User>) {
    this.account = new Account(props.account, AccountType.Personal)
    this.avatar = props.avatar || 'tiger'
    this.id = props.id ?? newId()
    this.name = props.name ?? ''
    this.ratio = props.ratio ?? 0
  }
}