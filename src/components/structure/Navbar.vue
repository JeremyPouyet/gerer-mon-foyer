<script setup lang="ts">
import distributionIcon from '@/assets/icons/distribution.png'
import historyIcon from '@/assets/icons/history.png'
import projectIcon from '@/assets/icons/criteria.png'
import taxCalculateIcon from '@/assets/icons/tax-calculate.png'

import { RouterLink } from 'vue-router'
import { computed } from 'vue'

import unsavedManager from '@/managers/unsavedManager'

const unsavedChangesText = computed(() : string => {
  const count = unsavedManager.count.value

  return count === 1 ? `${count} modification non sauvegardée` : `${count} modifications non sauvegardées`
})

const menuItems: [string, string, string][] = [
  ['/budget',    'Budget',     taxCalculateIcon],
  ['/projects',  'Projets',    projectIcon],
  ['/simulator', 'Simulateur', distributionIcon],
  ['/history',   'Historique', historyIcon],
]
</script>

<template>
  <div class="sidenav">
    <RouterLink v-once id="home" aria-label="Accueil" to="/">
      <p class="text-center mb-1 lh-1 small-hidden">
        Gérer&nbsp;&nbsp;
      </p>
      <div class="text-center">
        <span class="small-hidden">Mon</span> <img alt="Jolie petite maison" aria-hidden="true" class="small-icon-container large-icon-container-small baselined-icon" src="@/assets/icons/home.png"> <span class="small-hidden">Foyer</span>
      </div>
    </RouterLink>
    <hr style="color:aliceblue;">
    <RouterLink v-for="[uri, label, src] in menuItems" :key="label" active-class="active" class="small-centered nav-link" :to="uri">
      <img :alt="label" aria-hidden="true" class="large-margin-end mb-1 icon-container" :src="src">
      {{ label }}
    </RouterLink>
    <RouterLink active-class="active" class="nav-link small-centered" to="/settings">
      <div class="position-relative" style="width:95%">
        <img alt="Paramètres" aria-hidden="true" class="mb-1 icon-container large-margin-end" src="@/assets/icons/cog.png">
        Paramètres
        <div
          v-if="unsavedManager.count.value > 0"
          id="unsaved-count"
          v-tooltip
          class="small-hidden position-absolute top-50 start-100 translate-middle badge rounded-pill bg-secondary"
          data-bs-placement="bottom"
          :data-bs-title="unsavedChangesText"
        >
          {{ unsavedManager.count }}
        </div>
      </div>
    </RouterLink>
  </div>
</template>