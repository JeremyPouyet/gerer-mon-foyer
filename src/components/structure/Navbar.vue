<script setup lang="ts">
import distributionIcon from '@/assets/icons/distribution.png'
import historyIcon from '@/assets/icons/history.png'
import projectIcon from '@/assets/icons/criteria.png'
import taxCalculateIcon from '@/assets/icons/tax-calculate.png'
import userIcon from '@/assets/icons/user.png'

import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import unsavedManager from '@/managers/unsavedManager'
import { useScreenSize } from '@/composables/useScreenSize'
const { isSmallerScreen } = useScreenSize(576)

// on a small screen, do not show the sidenav by default
const showNav = ref(!isSmallerScreen.value)
const app = document.getElementById('app')

if (showNav.value && typeof window !== 'undefined' && app)
  app.classList.add('has-sidenav')

watch(showNav, showSidenav => {
  if (!app) return
  if (showSidenav)
    app.classList.add('has-sidenav')
  else
    app.classList.remove('has-sidenav')
})

watch(isSmallerScreen, () => toggleSidenavOnSmallScreen())
const toggleSidenavOnSmallScreen = () => showNav.value = !isSmallerScreen.value
const showSidenav = () => showNav.value = true

const unsavedChangesText = computed(() : string => {
  const count = unsavedManager.count.value

  return count === 1 ? `${count} modification non sauvegardée` : `${count} modifications non sauvegardées`
})

const menuItems: [string, string, string][] = [
  ['/users',     'Habitants',  userIcon],
  ['/budget',    'Budget',     taxCalculateIcon],
  ['/projects',  'Projets',    projectIcon],
  ['/simulator', 'Simulateur', distributionIcon],
  ['/history',   'Historique', historyIcon],
]
</script>

<template>
  <div v-if="showNav" class="sidenav">
    <RouterLink v-once id="home" aria-label="Accueil" to="/" @click="toggleSidenavOnSmallScreen">
      <p class="text-center mb-1 lh-1 small-hidden">
        Gérer&nbsp;&nbsp;
      </p>
      <div class="text-center">
        <span class="small-hidden">Mon</span> <img alt="Jolie petite maison" aria-hidden="true" class="small-icon-container large-icon-container-small baselined-icon" src="@/assets/icons/home.png"> <span class="small-hidden">Foyer</span>
      </div>
    </RouterLink>
    <hr>
    <RouterLink
      v-for="[uri, label, src] in menuItems"
      :key="label"
      active-class="active"
      class="small-centered nav-link"
      :to="uri"
      @click="toggleSidenavOnSmallScreen"
    >
      <div>
        <img :alt="label" aria-hidden="true" class="large-margin-end mb-1 icon-container" :src="src">
        {{ label }}
      </div>
    </RouterLink>
    <RouterLink active-class="active" class="nav-link small-centered" to="/settings" @click="toggleSidenavOnSmallScreen">
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
  <div v-else id="sidenavToggler" class="fixed-top d-sm-none d-inline p-2" style="" @click="showSidenav">
    <img alt="Afficher le menu" aria-hidden="true" class="icon-container" src="@/assets/icons/menu.png">
  </div>
</template>
