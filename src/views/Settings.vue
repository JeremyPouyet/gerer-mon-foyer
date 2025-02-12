<script setup lang="ts">
import '@/assets/secondary.scss'

import ViewTitle from '@/components/ViewTitle.vue'

import { computed, inject } from 'vue'

import { type OpenModal, Path, SortType } from '@/types'
import settingManager, { Currency } from '@/managers/settingManager'
import { type DB } from '@/db'
import notificationManager from '@/managers/notificationManager'

import Texts from '@/texts'
import unsavedManager from '@/managers/unsavedManager'

const openModal = inject<OpenModal>('openModal')
let cachedDB: DB

/**
  Async load the database when needed because it loads many other data
*/
async function getDB() : Promise<DB> {
  cachedDB ||= (await import('@/db')).default
  return cachedDB
}

function generateDateString() : string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Months start at 0
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}-sauvegarde.json`
}

async function saveFile() : Promise<undefined> {
  const blob = new Blob([(await getDB()).export()], { type: 'application/json' })
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

async function onFileUploaded(event: ProgressEvent<FileReader>) : Promise<undefined> {
  try {
    const reader = event.target

    if (!reader)
      throw new Error('Unexpected error')

    const data = JSON.parse(reader.result as string) as Record<string, string>

    for (const [key, value] of Object.entries(data))
      localStorage.setItem(key, value)

    const db = await getDB()
    db.setup()

    const historyManager = (await import('@/managers/historyManager')).default
    historyManager.activeDate = historyManager.history[0]?.date || ''
    notificationManager.success('Données importées avec succès')
  } catch (error) {
    console.error(error)
    notificationManager.error('Erreur lors de l’importation des données')
  }
}

function confirmDataDeletion() : void {
  openModal?.('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.', async () => {
    const db = await getDB()
    db.empty()
    notificationManager.success('Données supprimées avec succès')
  })
}

function showConfirmModalChange(event: Event) : void {
  settingManager.update('showConfirmModal', (event.target as HTMLInputElement).checked)
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
    <ViewTitle emoji="💅" :path="Path.Settings" unpaded />
    <div class="row mb-4">
      <div class="col-sm-12 col-md-12 col-lg-5 mt-2">
        <h2 class="mb-4">
          Mes données
        </h2>
        <div class="alert alert-warning d-flex align-items-center justify-content-center mb-4">
          <img alt="Attention" class="icon-container" src="@/assets/icons/warning.png">
          <p class="mb-0 ms-2">
            <span class="fw-bold">Vos données sont uniquement sauvegardées dans votre navigateur.</span> Pensez à les exporter régulièrement !
          </p>
        </div>

        <p class="fw-bold d-flex">
          <img alt="" aria-hidden="true" class="icon-container-small my-auto" src="@/assets/icons/diskette.png">
          <span class="ms-1">Sauvegarde:</span>
        </p>
        <div class="row d-flex mb-3">
          <div class="col">
            <button class="text-black btn btn-secondary btn-sm" @click="uploadFile">
              Importer une sauvegarde
            </button>
          </div>
          <div class="col my-auto">
            <div class="text-end">
              <button aria-describedby="export-text" class="text-black btn btn-secondary btn-sm" type="button" @click="saveFile">
                Exporter une sauvegarde
              </button>
              <small id="export-text" class="text-body-secondary d-block">{{ unsavedChangeText }}</small>
            </div>
          </div>
        </div>

        <p class="fw-bold d-flex">
          <img alt="Attention" class="icon-container-small my-auto" src="@/assets/icons/warning.png">
          <span class="ms-1">Zone dangereuse:</span>
        </p>
        <div>
          <button aria-describedby="delete-text" class="text-black btn btn-danger btn-sm" @click="confirmDataDeletion">
            Supprimer toutes mes données
          </button>
          <small id="delete-text" class="text-body-secondary d-block">
            Cette action est définitive.
            <br>
            Pensez à d'abord faire une sauvegarde.</small>
        </div>
      </div>

      <div class="col-lg-2 d-lg-flex mt-2">
        <!-- Vertical Rule for larger screens -->
        <div class="vr my-auto mx-auto d-none d-lg-block" style="height: 400px;" />
        <!-- Horizontal Rule for smaller screens -->
        <hr class="d-lg-none w-100 my-4">
      </div>

      <div class="col-sm-12 col-md-12 col-lg-5 mt-2">
        <h2 class="mb-4">
          Affichage
        </h2>
        <div class="form-check form-switch form-check-reverse mb-4">
          <label class="form-check-label" for="settingConfirm">
            Demander confirmation lors de suppression importante de données
          </label>
          <input
            id="settingConfirm"
            :checked="settingManager.settings.showConfirmModal"
            class="form-check-input"
            type="checkbox"
            @change="showConfirmModalChange"
          >
        </div>
        <div class="form-check form-switch form-check-reverse mb-4">
          <label class="form-check-label" for="setting2decimals">
            Afficher les nombres avec 2 décimales:
          </label>
          <input
            id="setting2decimals"
            :checked="settingManager.settings.twoDecimals"
            class="form-check-input"
            type="checkbox"
            @change="twoDecimalsChange"
          >
        </div>
        <div class="row d-flex mb-3">
          <label class="col-7 my-auto" for="settingSort">
            Trier les dépenses et revenus par ordre:
          </label>
          <div class="col">
            <select
              id="settingSort"
              aria-label="Sélectionner le mode de tri des dépenses et revenus"
              class="form-select"
              @change="sortTypeChange"
            >
              <option v-for="sortType in Object.values(SortType)" :key="sortType" :selected="settingManager.settings.sort === sortType" :value="sortType">
                {{ Texts.sortTypes[sortType] }}
              </option>
            </select>
          </div>
          <small class="text-body-secondary d-block">
            Pour un tableau indexé par date, l’ordre alphabétique s’applique à la date.
          </small>
        </div>
        <div class="row d-flex mb-3">
          <label class="col-7 my-auto" for="settingSymbol">
            Utiliser le symbol monétaire:
          </label>
          <div class="col">
            <select
              id="settingSymbol"
              class="form-select"
              @change="currencyChange"
            >
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