<script setup lang="ts">
import '@/assets/secondary.scss'

import ViewTitle from '@/components/ViewTitle.vue'

import db from '@/db'
import historyManager from '@/managers/historyManager'
import notificationManager from '@/managers/notificationManager'
import settingManager, { Currency } from '@/managers/settingManager'
import { Path, SortType } from '@/types'

import Texts from '@/texts'
import { computed } from 'vue'
import unsavedManager from '@/managers/unsavedManager'

function generateDateString() : string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Months start at 0
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}-sauvegarde.json`
}

function saveFile() : void {
  const blob = new Blob([db.export()], { type: 'application/json' })
  const link = document.createElement('a')

  link.href = URL.createObjectURL(blob)
  link.download = generateDateString()
  link.click()
  URL.revokeObjectURL(link.href)
  notificationManager.success('Données exportées avec succès')
}

function uploadFile() : void {
  const input = document.createElement('input')

  input.type = 'file'
  input.accept = '.json'

  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = (target.files || [])[0]

    if (!file)
      return

    const reader = new FileReader()

    reader.addEventListener('load', onFileUploaded, { once: true })
    reader.readAsText(file)
  }

  input.click()
}

function onFileUploaded(event: ProgressEvent<FileReader>) : void {
  try {
    const reader = event.target

    if (!reader)
      throw new Error('Unexpected error')

    const data = JSON.parse(reader.result as string) as Record<string, string>

    db.empty()
    for (const [key, value] of Object.entries(data))
      localStorage.setItem(key, value)

    db.setup()
    historyManager.activeDate = historyManager.history[0]?.date || ''
    notificationManager.success('Données importées avec succès')
  } catch (error) {
    console.error(error)
    notificationManager.error('Erreur lors de l’importation des données')
  }
}

function confirmDataDeletion() : void {
  const confirmation = confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')

  if (confirmation) {
    db.empty()
    notificationManager.success('Données supprimées avec succès')
  }
}

function twoDecimalsChange(event: Event) : void {
  settingManager.update('twoDecimals', (event.target as HTMLInputElement).checked)
}

function sortTypeChange(event: Event) : void {
  settingManager.update(
    'sort',
    (event.target as HTMLSelectElement).value as SortType
  )
}

function currencyChange(event: Event) : void {
  settingManager.update(
    'currency',
    (event.target as HTMLSelectElement).value as Currency
  )
}

const unsavedChangeText = computed(() => {
  const count = unsavedManager.count.value

  if (count === 0) return 'Aucune nouvelle donnée à sauvegarder.'
  if (count === 1) return '1 modification non sauvegardée.'
  return `${count} modifications non sauvegardées.`
})
</script>

<template>
  <div class="container">
    <ViewTitle :path="Path.Settings" emoji="💅" unpaded />
    <div class="row mb-4">
      <div class="col-sm-12 col-md-5 mt-2">
        <h2 class="mb-4">
          Mes données
        </h2>
        <div class="alert alert-warning d-flex align-items-center justify-content-center mb-4">
          <img src="@/assets/icons/warning.png" class="icon-container" alt="Attention">
          <p class="mb-0 ms-2">
            <span class="fw-bold text-decoration-underline">Vos données sont uniquement sauvegardées dans votre navigateur.</span> Pensez à les exporter régulièrement !
          </p>
        </div>

        <p class="fw-bold d-flex">
          <img src="@/assets/icons/diskette.png" class="icon-container-small my-auto" alt="">
          <span class="ms-1">Sauvegarde:</span>
        </p>
        <div class="row d-flex mb-3">
          <div class="col">
            <button class="text-black btn btn-secondary btn-sm" @click="uploadFile">
              Importer une sauvegarde
            </button>
            <small class="text-muted d-block">Cela remplacera vos données actuelles.</small>
          </div>
          <div class="col my-auto">
            <div class="text-end">
              <button type="button" class="text-black btn btn-secondary btn-sm" @click="saveFile">
                Exporter une sauvegarde
              </button>
              <small class="text-muted d-block">{{ unsavedChangeText }}</small>
            </div>
          </div>
        </div>

        <p class="fw-bold d-flex">
          <img src="@/assets/icons/warning.png" class="icon-container-small my-auto" alt="Attention">
          <span class="ms-1">Zone dangereuse:</span>
        </p>
        <div>
          <button class="text-black btn btn-danger btn-sm" @click="confirmDataDeletion">
            Supprimer toutes mes données
          </button>
          <small class="text-muted d-block">
            Cette action est définitive.
            <br>
            Pensez à d'abord faire une sauvegarde.</small>
        </div>
      </div>

      <div class="col-md-1 d-md-flex mt-2">
        <!-- Vertical Rule for medium and larger screens -->
        <div class="vr my-auto mx-auto d-none d-md-block" style="height: 400px;" />
        <!-- Horizontal Rule for small screens -->
        <hr class="d-md-none w-100 my-4">
      </div>

      <div class="col-sm-12 col-md-5 mt-2">
        <h2 class="mb-4">
          Affichage
        </h2>
        <div class="form-check form-switch form-check-reverse mb-4">
          <label class="form-check-label" for="settings2decimals">
            Afficher les nombres avec 2 décimales:
          </label>
          <input
            id="setting2decimals"
            class="form-check-input"
            type="checkbox"
            :checked="settingManager.settings.twoDecimals"
            @change="twoDecimalsChange"
          >
        </div>
        <div class="row d-flex mb-3">
          <div class="col-7 my-auto">
            Trier les dépenses et revenus par ordre:
          </div>
          <div class="col">
            <select class="form-select" @change="sortTypeChange">
              <option v-for="sortType in Object.values(SortType)" :key="sortType" :selected="settingManager.settings.sort === sortType" :value="sortType">
                {{ Texts.sortTypes[sortType] }}
              </option>
            </select>
          </div>
          <small class="text-muted d-block">
            Pour un tableau indexé par date, l’ordre alphabétique s’applique à la date.
          </small>
        </div>
        <div class="row d-flex mb-3">
          <div class="col-7 my-auto">
            Utiliser le symbol monétaire:
          </div>
          <div class="col">
            <select class="form-select" @change="currencyChange">
              <option v-for="currency in Object.values(Currency)" :key="currency" :selected="settingManager.settings.currency === currency" :value="currency">
                {{ settingManager.getCurrencySymbol(currency, true) }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
div.form-check-reverse {
  text-align: left !important;
}
input.form-check-input {
  cursor: pointer;
}
</style>