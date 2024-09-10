<script setup lang="ts">
  import { computed } from 'vue'
  import { round } from '@/helpers'
  import User from '@/user'

  const props = defineProps<{
    commonBill: number,
    remainSum: number,
    user: User
  }>()

  const monthlyRemainingBalance = computed(() => {
    return props.user.monthlyRemainingBalance
  })

  const ratio = computed(() => {
    return props.user.ratio
  })
  const in10years = computed<number>(() => {
    return round((monthlyRemainingBalance.value - ratio.value * props.commonBill) * 12 * 10)
  })
</script>

<template>
  <div class="text-block finance-info mt-2">
    <template v-if="user.incomes.sum > 0">
      <p>Après avoir couvert tes dépenses obligatoires, il te reste <span class="red fw-semibold">{{ round(monthlyRemainingBalance) }}€</span> par mois.</p>
      <p>Après avoir couvert les dépenses obligatoires de chacun, votre foyer dispose de <span class="red fw-semibold">{{ round(remainSum) }}€</span>.</p>
      <p>Tes revenus représentent <span class="red fw-semibold">{{ round(ratio * 100) }}%</span> des revenus du foyer.</p>
      <p>C'est à ce niveau que tu devras contribuer aux dépenses commune, soit <span class="red fw-semibold">{{ round(ratio * commonBill) }}€</span> par mois.</p>
      <p>À la fin du mois, il te restera alors <span class="red fw-semibold">{{ round(monthlyRemainingBalance - ratio * commonBill) }}€</span>.</p>
      <p v-if="in10years > 0">
        En 10 ans, tu pourrais économiser jusqu'à <span class="red fw-semibold">{{ in10years }}€</span>.
      </p>
      <p v-else-if="in10years < 0">
        En 10 ans, tu t'endetterais de <span class="red fw-semibold">{{ -in10years }}€</span>.
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

.red {
  color: var(--color-red);
}
</style>