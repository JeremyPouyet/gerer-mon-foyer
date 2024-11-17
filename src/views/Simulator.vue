<script setup lang="ts">
import '@/assets/secondary.scss'

import AdvancedSimulator from '@/components/simulator/AdvancedSimulator.vue'
import Distribution from '@/components/simulator/Distribution.vue'
import LeftColumn from '@/components/leftColumns/LeftColumn.vue'
import ProjectsEdit from '@/components/leftColumns/ProjectsEdit.vue'

import { onMounted, onUnmounted, ref, watch } from 'vue'

import { limitedEvaluate } from '@/helpers'
import settingManager from '@/managers/settingManager'
import { sexyAmount } from '@/formaters'
import Project from '@/project'
import BrowserStorage, { StorageKey } from '@/browserStorage'
import projectManager from '@/managers/projectManager'

const simulatorTabStorage = new BrowserStorage(localStorage, StorageKey.SimulatorTab)

type SimulatorTab = 'simple' | 'advanced'
const activeTab = ref<SimulatorTab>(simulatorTabStorage.get('simple') as SimulatorTab)

let computedValue = ref(0)
const expenseValue = ref<string>('')
const currentProject = ref<Project>(projectManager.getCurrent())

function switchProject() {
  currentProject.value = projectManager.getCurrent()
}

onMounted(() => {
  const simulatorValueStorage = new BrowserStorage(sessionStorage, StorageKey.SimulatorValue)
  expenseValue.value = simulatorValueStorage.get('')

  const watchers = [
    watch(expenseValue, value => simulatorValueStorage.set(value)),
    watch(activeTab, currentTab => simulatorTabStorage.set(currentTab)),
  ]

  projectManager.addEventListener('switchProject', switchProject)

  onUnmounted(() => {
    watchers.forEach(stop => stop())
    projectManager.removeEventListener('switchProject', switchProject)
  })
})

function setActiveTab(tab: 'simple' | 'advanced') {
  activeTab.value = tab
}

/**
 * Evaluates the `expenseValue` (which may be a formula) and returns the result.
 * If evaluation fails, it returns the last valid computed value.
 *
 * @returns {number} The computed value.
 */
function computeValue() : number {
  try {
    const value = (limitedEvaluate(expenseValue.value) || 0)
    if (!Number.isNaN(value))
      computedValue.value = value
  }
  catch { /* empty - otherwise an error would be shown when a user enters a symbol before entering a number */ }
  return computedValue.value
}
</script>

<template>
  <div class="container-fluid mt-2">
    <div class="row">
      <LeftColumn :show="activeTab === 'advanced'" :title="'Mes projets'">
        <ProjectsEdit />
      </LeftColumn>
      <div class="col">
        <!-- Tabs -->
        <div class="row">
          <ul class="nav nav-underline mb-3">
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'simple' }"
                href="#"
                @click="setActiveTab('simple')"
              >
                Dépense ponctuelle
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'advanced' }"
                href="#"
                @click="setActiveTab('advanced')"
              >
                Création de projet
              </a>
            </li>
          </ul>
        </div>
        <!-- Simple simulator -->
        <div v-if="activeTab === 'simple'" class="mb-4">
          <p class="mb-4">
            Pour un achat ponctuel type éléctroménager ou meuble.
          </p>
          <div class="row">
            <div class="col-md-5 col-sm-12">
              <label for="expenseInput" class="form-label fw-bold">Prix ou formule</label>
              <div class="input-group mb-3">
                <span v-if="!settingManager.isCurrencySymbolOnRight()" class="input-group-text">
                  {{ sexyAmount(computeValue()) }}
                </span>
                <input
                  id="expenseInput"
                  v-model="expenseValue"
                  v-tooltip
                  data-bs-placement="bottom"
                  class="form-control"
                  type="text"
                  placeholder="Exemples: 500 ou 10 * 50 ou 1000 / 2"
                  data-bs-title="Exemples:<ul><li class='text-start'>500</li><li class='text-start'>10 * 50</li><li class='text-start'>1000 / 2</li><li class='text-start'>250 + 250</li>"
                >
                <span v-if="settingManager.isCurrencySymbolOnRight()" class="input-group-text">
                  {{ sexyAmount(computeValue()) }}
                </span>
              </div>
            </div>
            <Distribution :total="computeValue()" />
          </div>
        </div>
        <!-- Advanced simulator -->
        <div v-if="activeTab === 'advanced'" class="mb-4">
          <AdvancedSimulator :key="currentProject.id" :current-project="currentProject" />
        </div>
      </div>
    </div>
  </div>
</template>