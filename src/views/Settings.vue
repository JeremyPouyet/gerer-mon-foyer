<script setup lang="ts">
import '@/assets/secondary.scss'

import db from '@/db'
import historyManager from '@/historyManager'
import SettingsManager, { Currency, DecimalSeparator, SortType } from '@/SettingsManager'
import { setHead } from '@/helpers'
import notificationManager, { NotificationType } from '@/notificationManager'
import { Page } from '@/types'
import Texts from '@/texts'
import { computed } from 'vue'

setHead(Page.Settings)

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
  notificationManager.create('Données exportées avec succès')
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
  db.empty()

  try {
    const reader = event.target

    if (!reader)
      throw new Error('Unexpected error')

    const data = JSON.parse(reader.result as string) as Record<string, string>

    for (const [key, value] of Object.entries(data))
      localStorage.setItem(key, value)

    db.setup()
    historyManager.activeDate = historyManager.history[0]?.date || ''
    notificationManager.create('Données importées avec succès')
  } catch (error) {
    console.error(error)
    notificationManager.create('Erreur lors de l’importation des données', NotificationType.Error)
  }
}

function confirmDataDeletion() : void {
  const confirmation = confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')

  if (confirmation) {
    db.empty()
    notificationManager.create('Données supprimées avec succès')
  }
}

function twoDecimalsChange(event: Event) : void {
  SettingsManager.update('twoDecimals', (event.target as HTMLInputElement).checked)
}

function sortTypeChange(event: Event) : void {
  SettingsManager.update(
    'sort',
    (event.target as HTMLSelectElement).value as SortType
  )
}

function currencyChange(event: Event) : void {
  SettingsManager.update(
    'currency',
    (event.target as HTMLSelectElement).value as Currency
  )
}

function decimalSeparatorChange(event: Event) : void {
  SettingsManager.update(
    'decimalSeparator',
    (event.target as HTMLSelectElement).value as DecimalSeparator
  )
}

const unsavedChangeText = computed(() => {
  const count = db.unsavedChanges.value

  if (count === 0) return 'Aucune nouvelle donnée à sauvegarder.'
  if (count === 1) return '1 modification non sauvegardée.'
  return `${count} modifications non sauvegardées.`
})
</script>

<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col-sm-12 col-md-5 mt-2">
        <h2 class="mb-4">
          <!-- <img src="@/assets/icons/diskette.png" class="icon-container" alt="">  -->
          Mes données
        </h2>
        <div class="alert alert-warning d-flex align-items-center justify-content-center mb-4">
          <img src="@/assets/icons/warning.png" class="icon-container" alt="Attention">
          <p class="mb-0 ms-2">
            <span class="fw-bold text-decoration-underline">Vos données sont uniquement sauvegardées dans votre navigateur.</span> Pensez à les exporter régulièrement !
          </p>
        </div>

        <p class="fw-bold">
          Sauvegarde:
        </p>
        <div class="row d-flex mb-3">
          <div class="col">
            <button class="text-black btn btn-secondary btn-sm" @click="uploadFile">
              Importer une sauvegarde
            </button>
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

        <p class="fw-bold">
          Zone dangereuse:
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
        <div class="form-check form-switch form-check-reverse mb-3">
          <input
            id="setting2decimals"
            class="form-check-input"
            type="checkbox"
            :checked="SettingsManager.settings.twoDecimals"
            @change="twoDecimalsChange"
          >
          <label class="form-check-label" for="settings2decimals">
            Afficher les nombres avec 2 décimales:
          </label>
        </div>
        <div class="row d-flex mb-3">
          <div class="col-7 my-auto">
            Trier les dépenses et revenus par ordre:
          </div>
          <div class="col">
            <select class="form-select" @change="sortTypeChange">
              <option v-for="sortType in Object.values(SortType)" :key="sortType" :selected="SettingsManager.settings.sort === sortType" :value="sortType">
                {{ Texts.sortTypes[sortType] }}
              </option>
            </select>
          </div>
        </div>
        <div class="row d-flex mb-3">
          <div class="col-7 my-auto">
            Utiliser le symbol monétaire:
          </div>
          <div class="col">
            <select class="form-select" @change="currencyChange">
              <option v-for="currency in Object.values(Currency)" :key="currency" :selected="SettingsManager.settings.currency === currency" :value="currency">
                {{ SettingsManager.getCurrencySymbol(currency, true) }}
              </option>
            </select>
          </div>
        </div>
        <div class="row d-flex mb-3">
          <div class="col-7 my-auto">
            Utiliser le séparateur décimales:
          </div>
          <div class="col">
            <select class="form-select" @change="decimalSeparatorChange">
              <option v-for="separator in Object.values(DecimalSeparator)" :key="separator" :selected="SettingsManager.settings.decimalSeparator === separator" :value="separator">
                {{ separator }}
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