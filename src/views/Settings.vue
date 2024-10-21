<script setup lang="ts">
import '@/assets/secondary.scss'

import notificationManager, { NotificationType } from '@/notificationManager'
import db from '@/db'
import historyManager from '@/historyManager'
import SettingsManager, { SortType } from '@/SettingsManager'

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
    notificationManager.create('Données importées avec succès', NotificationType.Success)
  } catch (error) {
    console.error(error)
    notificationManager.create('Erreur lors de l’importation des données', NotificationType.Error)
  }
}

function confirmDataDeletion() : void {
  const confirmation = confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')

  if (confirmation) {
    db.empty()
    notificationManager.create('Données supprimées avec succès', NotificationType.Success)
  }
}

function handleCheckboxChange(event: Event) {
  SettingsManager.settings.twoDecimals = (event.target as HTMLInputElement).checked
  if (SettingsManager.settings.twoDecimals)
    notificationManager.create('Les nombres seront affichés avec 2 décimales', NotificationType.Success)
  else
    notificationManager.create('Les nombres seront simplement arrondis', NotificationType.Success)
}

function handleSortOrderChange(event: Event) {
  isAscending.value = (event.target as HTMLInputElement).checked;
  // Add your logic here for sorting the transactions based on the state
  if (isAscending.value) {
    // Sort in ascending order
    console.log('Sorting in ascending order');
  } else {
    // Sort in alphabetical order
    console.log('Sorting in alphabetical order');
  }
}
</script>

<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col-sm-12 col-md-5 mt-2">
        <h2 class="mb-4">
          <img src="@/assets/icons/diskette.png" class="icon-container" alt=""> Mes données
        </h2>
        <div class="alert alert-warning d-flex align-items-center justify-content-center mb-4">
          <img src="@/assets/icons/warning.png" class="icon-container" alt="Attention">
          <p class="mb-0 ms-2">
            <span class="fw-bold text-decoration-underline">
              Vos données sont uniquement sauvegardées dans votre navigateur.
            </span>
            <br>
            Pensez donc à les exporter régulièrement !
          </p>
        </div>

        <p v-if="db.unsavedChanges.value === 0">
          Toutes vos données ont été sauvegardées, mais vous pouvez le refaire quand même :
        </p>
        <p v-else-if="db.unsavedChanges.value === 1">
          {{ db.unsavedChanges }} modification non sauvegardée :
        </p>
        <p v-else>
          {{ db.unsavedChanges }} modifications non sauvegardées :
        </p>

        <button type="button" class="text-black btn btn-secondary btn-sm mb-3" @click="saveFile">
          Exporter mes données
        </button>

        <div>
          <p>Vous pouvez aussi :</p>
          <p>
            <button class="text-black btn btn-secondary btn-sm" @click="uploadFile">
              Importer une sauvegarde
            </button>
          </p>
          <p>
            <button class="text-black btn btn-danger btn-sm" @click="confirmDataDeletion">
              Supprimer toutes mes données
            </button>
          </p>
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
        <div class="fw-bold mb-2">
          Dans
          <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
          <RouterLink class="text-primary-emphasis" to="/budget">Mon Budget</RouterLink>
          et
          <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
          <RouterLink class="text-primary-emphasis" to="/history">l’historique</RouterLink>:
        </div>
        <div class="form-check form-switch form-check-reverse">
          <input
            id="setting2decimals"
            class="form-check-input"
            type="checkbox"
            :checked="SettingsManager.settings.twoDecimals"
            @change="handleCheckboxChange"
          >
          <label class="form-check-label" for="settings2decimals">
            Afficher les nombres avec 2 décimales
          </label>
        </div>
        <div class="row d-flex">
          <div class="col-7 my-auto">
            Trier les transactions par ordre:
          </div>
          <div class="col">
            <select class="form-select">
              <option :value="SortType.Abc">
                Alphabétique
              </option>
              <option :value="SortType.Desc">
                Croissant
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