import type Account from './account'
import type { Transaction } from './types'
import type User from './user'

type Hydratable = Account | User | undefined

const hydrators = new Map<string, (data: Hydratable) => void>([
  ['account', (data: Hydratable) => {
    const account = data as Account
    Object.values(account.expenses.values).forEach((expense: Transaction) => {
      if (expense.mandatory == null) expense.mandatory = true
    })
  }]
])

export default function hydrate(type: string, data: Hydratable) {
  const hydrator = hydrators.get(type)

  if (!data)
    throw new Error(`Unable to hydrate a null ${type}`)
  if (!hydrator)
    throw new Error(`Unknown hydrator ${type}`)

  hydrator(data)
}