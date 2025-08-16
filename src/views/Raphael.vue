<script setup lang="ts">
import { ref } from 'vue'

const nombreDeviner = ref(-1)
const reponse = ref()
const text = ref('Cliquez sur le bouton pour générer un nombre')
const nombreCoup = ref()

function genererNouveauNombre() : void {
  const minimum = 0
  const maximum = 100

  text.value = 'Nouveau nombre généré, À TOI DE JOUER !'
  nombreCoup.value = 0
  nombreDeviner.value = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}

function verifierLaReponse() {
  nombreCoup.value = nombreCoup.value + 1

  if (reponse.value < nombreDeviner.value) {
    text.value = 'Plus grand'
  }
  if (reponse.value > nombreDeviner.value) {
    text.value = 'Plus petit'
  }
  if (reponse.value == nombreDeviner.value) {
    text.value = 'Parfait !'
    nombreDeviner.value = -1
  }
  reponse.value = null
}
</script>

<template>
  <div class="container">
    <h1>
      La page de RAPH
    </h1>
    <div class="row">
      <div class="col mt-4">
        <h2>Le basket</h2>
        <p>
          GBO meilleur équipe de basket de l’Oise
        </p>
        <a href="https://www.gouvieux-basket-oise.org/" rel="noopener noreferrer" target="_blank">Ici pour vous inscrire</a>
        <br>
        <img alt="Ballon de basket" class="espace-dessus" src="@/assets/basket.jpg">
      </div>
      <div class="col mt-4 mb-4">
        <h2>Memory number</h2>

        <button @click="() => genererNouveauNombre()">
          Générer un nouveau nombre entre 0 et 100
        </button>
        <br>
        <p>Nombre d’essai: {{ nombreCoup }}</p>
        <div v-if="nombreDeviner > -1">
          <input v-model="reponse" type="number" @keydown.enter="() => verifierLaReponse()">
        </div>
        <br>
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
a {
  color: #040aad;
}

.espace-dessus {
  margin-top: 100px;
}
</style>