import { newId } from './helpers'
import type { ID } from '@/types'
import Account from './account'

export default class User {
  readonly account: Account
  readonly id: ID
  monthlyRemainingBalance = 0
  name: string
  ratio: number

  constructor(props: Partial<User>, onTransactionChange?: () => void) {
    this.account = new Account(props.account, () => {
      this.monthlyRemainingBalanceUpdate()
      onTransactionChange?.()
    })
    this.id = props.id ?? newId()
    this.name = props.name ?? ''
    this.ratio = props.ratio ?? 0
    this.monthlyRemainingBalanceUpdate()
  }

  updateName(name: string) : void {
    name = name.trim()

    if (name)
      this.name = name;
  }

  monthlyRemainingBalanceUpdate() {
    this.monthlyRemainingBalance = this.account.incomes.sum - this.account.expenses.sum
  }
}