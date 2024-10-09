<script setup lang="ts">
import { computed } from 'vue'
import { round } from '@/helpers'
import User from '@/user'
import type Account from '@/account'

const props = defineProps<{ commonAccount: Account, commonBill: number, remainSum: number, user: User }>()

const ratio = computed(() => props.user.ratio)
// The user's remaining balance at the end of the month after paying all personal expenses
const monthlyRemainingBalance = computed(() => props.user.account.incomes.sum - props.user.account.expenses.sum)
// The amount the household needs to cover its shared expenses each month
const mensualCommonExpenses = computed<number>(() => round(Math.max(props.commonAccount.expenses.sum - props.commonAccount.incomes.sum, 0)))
// The total remaining amount after all personal expenses are covered, including shared incomes
const mensualRemainSum = computed<number>(() => round(props.remainSum + props.commonAccount.incomes.sum))
// The total amount the user can potentially save over 10 years, assuming they save the amount remaining after paying both personal and shared expenses
const in10years = computed<number>(() => round((monthlyRemainingBalance.value - ratio.value * props.commonBill) * 12 * 10))
</script>

<template>
  <div class="text-block finance-info mt-2">
    <template v-if="user.account.incomes.sum > 0">
      <p>Après avoir couvert tes dépenses obligatoires, il te reste <span class="text-danger fw-semibold">{{ round(monthlyRemainingBalance) }}€</span> par mois.</p>
      <p>Après avoir couvert les dépenses obligatoires de chacun, votre foyer dispose de <span class="text-danger fw-semibold">{{ mensualRemainSum }}€</span>.</p>
      <p>Pour couvrir vos dépenses communes, il vous faut <span class="text-danger fw-semibold">{{ mensualCommonExpenses }}€</span> par mois.</p>
      <p>Tes revenus représentent <span class="text-danger fw-semibold">{{ round(ratio * 100) }}%</span> des revenus du foyer.</p>
      <p>C’est à ce niveau que tu devras contribuer aux dépenses commune, soit <span class="text-danger fw-semibold">{{ round(ratio * commonBill) }}€</span> par mois.</p>
      <p>À la fin du mois, il te restera alors <span class="text-danger fw-semibold">{{ round(monthlyRemainingBalance - ratio * commonBill) }}€</span>.</p>
      <p v-if="in10years > 0">
        En 10 ans, tu pourrais économiser jusqu’à <span class="text-danger fw-semibold">{{ in10years }}€</span>.
      </p>
      <p v-else-if="in10years < 0">
        En 10 ans, tu t’endetterais de <span class="danger fw-semibold">{{ -in10years }}€</span>.
      </p>
    </template>
    <template v-else>
      <p>Renseigne tes revenus pour que soit calculé ta part des dépenses communes</p>
    </template>
  </div>
</template>

<style scoped>
.finance-info {
  max-width: 700px;
}

.finance-info p {
  margin-bottom: 0;
}
</style>