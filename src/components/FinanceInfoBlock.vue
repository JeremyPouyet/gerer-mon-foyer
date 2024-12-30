<script setup lang="ts">
import { computed } from 'vue'

import { sexyAmount, sexyNumber } from '@/formaters'
import type Account from '@/account'
import User from '@/user'
import userManager from '@/managers/userManager'

const props = defineProps<{ commonAccount: Account, commonBill: number, remainSum: number, user: User }>()

const ratio = computed(() => props.user.ratio)
const monthlyCommonIncomes = computed<number>(() => {
  return userManager.users.reduce((sum, user) => sum + user.account.incomes.sum, props.commonAccount.incomes.sum)
})
// User's remaining money after paying their compulsory expenditures.
const incomeAfterConstraints = computed(() => props.user.account.incomes.sum - props.user.account.expenses.sum)
// Share of the common expenses the user has to pay.
const userShare = computed(() => ratio.value * props.commonBill)
// User's remaining money after paying their compulsory expenditures, their common expense share, and their personal expenses.
const incomeAfterAllExpenses = computed(() => incomeAfterConstraints.value - userShare.value - props.user.account.personalExpenses.sum)
// The amount the household needs to cover its shared expenses each month
const monthlyCommonExpenses = computed<number>(() => Math.max(props.commonAccount.expenses.sum - props.commonAccount.incomes.sum, 0))
// The total remaining amount after all personal expenses are covered, including shared incomes
const monthlyRemainSum = computed<number>(() => props.remainSum + props.commonAccount.incomes.sum)
// The total amount the user can potentially save over 10 years, assuming they save the amount remaining after paying both personal and shared expenses
const in10years = computed<number>(() => incomeAfterAllExpenses.value * 12 * 10)
</script>

<template>
  <div class="col-sm-12 col-md-12 col-lg-6 mb-4">
    <div class="text-block">
      <template v-if="user.account.incomes.sum > 0">
        <p class="mb-0">
          Votre foyer gagne
          <span class="text-danger fw-semibold">{{ sexyAmount(monthlyCommonIncomes) }}</span>
          par mois, avec
          <span class="text-danger fw-semibold">{{ sexyAmount(monthlyRemainSum) }}</span>
          restants après vos dépenses contraintes.
        </p>
        <p class="mb-0">
          Vos dépenses communes contraintes sont de
          <span class="text-danger fw-semibold">{{ sexyAmount(monthlyCommonExpenses) }}</span>
          mensuel.
        </p>
        <p class="mb-0">
          Tu gagnes
          <span class="text-danger fw-semibold">{{ sexyAmount(user.account.incomes.sum) }}</span>,
          mais après tes dépenses contraintes, il te reste
          <span class="text-danger fw-semibold">{{ sexyAmount(incomeAfterConstraints) }}</span>.
        </p>
        <p class="mb-0">
          C’est
          <span class="text-danger fw-semibold">{{ sexyNumber(ratio, 'percent') }}</span>
          des revenus du foyer.
        </p>
        <p class="mb-0">
          Ta contribution aux dépenses communes sera donc de
          <span class="text-danger fw-semibold">{{ sexyAmount(userShare) }}</span>
          te laissant
          <span class="text-danger fw-semibold">{{ sexyAmount(incomeAfterConstraints - userShare) }}</span> par mois.
        </p>
        <p v-if="user.account.personalExpenses.sum > 0" class="mb-0">
          Après tes dépenses personnelles, il te restera
          <span class="text-danger fw-semibold">{{ sexyAmount(incomeAfterAllExpenses) }}</span>
          par mois.
        </p>
        <p v-if="in10years > 0" class="mb-0">
          En 10 ans, tu pourrais économiser <span class="text-danger fw-semibold">{{ sexyAmount(in10years) }}</span>.
        </p>
        <p v-else-if="in10years < 0" class="mb-0">
          En 10 ans, tu t’endetterais de <span class="text-danger fw-semibold">{{ sexyAmount(-in10years) }}</span>.
        </p>
      </template>
      <template v-else>
        <p>Renseigne tes revenus pour que soit calculé ta part des dépenses communes</p>
      </template>
    </div>
  </div>
</template>