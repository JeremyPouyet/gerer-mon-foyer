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
  <div class="container text-center mt-2">
    <div class="alert alert-warning d-flex align-items-center justify-content-center mb-5">
      <img src="@/assets/icons/warning.png" class="icon-container" alt="Attention">
      <p class="mb-0 ms-2">
        <span style="font-size: 0.9rem;font-weight: bold;">
          Vos données sont uniquement sauvegardées dans votre navigateur
        </span>.
        Pensez donc à exporter vos données si vous comptez mettre à jour votre situation régulièrement !
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

    <div class="mb-4">
      <p>Ou sinon vous pouvez aussi :</p>
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
</template>