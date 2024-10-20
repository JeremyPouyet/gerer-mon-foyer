<script setup lang="ts">
import '@/assets/secondary.scss'

import notificationManager, { NotificationType } from '@/notificationManager'
import db from '@/db'
import historyManager from '@/historyManager'

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
</script>

<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col-sm-12 col-md-5 mt-2 text-center">
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
        <h2 class="mb-4 text-center">
          Affichage
        </h2>

        <div class="row mb-2">
          <div class="col-7">
            Afficher les nombres avec 2 décimales
          </div>
          <div class="col-1">
            <input type="checkbox" value="">
          </div>
          <div class="col-4" />
        </div>
        <div class="row">
          <div class="col">
            Trier les transactions par ordre:
          </div>
        </div>
        <div class="row">
          <div class="col-7 text-end">
            croissant
          </div>
          <div class="col-1">
            <label class="switch">
              <input type="checkbox">
              <span class="slider" />
            </label>
          </div>
          <div class="col-4">
            alphabétique
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
}

/* Hide the input squared checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 17px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4CAF50;
}

input:checked + .slider:before {
  transform: translateX(13px);
}

</style>