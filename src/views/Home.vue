<script setup lang="ts">
import CoinFieldDrawing from '@/components/drawings/CoinfFieldDrawing.vue'
import HouseDrawing from '@/components/drawings/HouseDrawing.vue'
import ScaleDrawing from '@/components/drawings/ScaleDrawing.vue'
</script>

<template>
  <section v-once class="container">
    <header class="text-center mb-5">
      <h1 class="mb-3">
        Répartissez vos dépenses communes équitablement
      </h1>
      <p class="lead text-body-secondary">
        Un outil gratuit pour gérer votre budget et simplifier la gestion des dépenses communes de votre foyer en tenant compte de vos charges personnelles.
      </p>

      <RouterLink class="btn btn-primary btn-lg mt-4 shadow-sm" to="/budget">
        Commencer maintenant
      </RouterLink>
    </header>

    <section class="mb-5 text-center text-block shadow-sm">
      <h2 class="mb-3">
        L’importance d’une répartition équitable
      </h2>
      <ScaleDrawing />

      <p class="text-start mb-0">
        Les revenus des membres d’un foyer sont souvent inégaux, en raison de facteurs tels que des différences salariales entre professions, d’interruptions de carrière, ou d’inégalités structurelles comme l’écart de salaires entre hommes et femmes.
        Malgré ces écarts, les dépenses communes sont souvent réparties de manière égale (50/50), désavantageant ainsi une seconde fois la personne gagnant le moins, en lui imposant une charge financière disproportionnée.
      </p>
    </section>

    <section class="mb-5 text-center text-block shadow-sm">
      <h2 class="mb-3">
        Exemple simple de répartition
      </h2>
      <p class="text-start">
        Prenons un foyer dans lequel Camille gagne 2 400 € par mois, et Sam 1 600 €, tout en remboursant un prêt étudiant de 200 €.
        Voici comment seront réparties 500 € de dépenses communes:
      </p>
      <div class="row">
        <div class="col-sm-12 col-md-9 col-lg-10">
          <ul class="text-start step-list">
            <li>Camille représente 60% des revenus du foyer et Sam 40%.</li>
            <li>Cependant, le revenu mensuel disponible de Sam est en réalité de 1 600 € - 200 € = 1 400 €.</li>
            <li>Le revenu total disponible du foyer est donc 2 400 € + 1 400 € = 3 800 €.</li>
            <li>Camille paiera alors 63% des dépenses communes (315 €).</li>
            <li>Sam ne paiera que 37% (185 €).</li>
          </ul>
          <p class="text-start mb-0">
            Avec une répartition 50/50, Sam aurait payé 250 €, ce qui représente une différence de 7 800 € sur 10 ans grâce à cette méthode.
          </p>
        </div>
        <div class="col-sm-12 col-md-3 col-lg-2 d-flex flex-column justify-content-end align-items-center">
          <CoinFieldDrawing />
        </div>
      </div>
    </section>

    <section class="mb-5 text-center text-block shadow-sm">
      <h2 class="mb-3">
        Répartissez vos dépenses en 3 étapes
      </h2>
      <p class="text-start">
        Pour chaque membre du foyer, il suffit de :
      </p>
      <ul class="text-start step-list">
        <li>
          <strong>Renseignez vos revenus</strong> : Indiquez les revenus de chaque membre du foyer, comme les salaires, allocations ou autres sources.
        </li>
        <li>
          <strong>Ajoutez vos dépenses personnelles</strong> : Notez vos charges fixes, telles que crédits, essence, assurances, et autres dépenses individuelles.
        </li>
        <li>
          <strong>Entrez les dépenses communes</strong> : Saisissez vos frais collectifs, comme le loyer, l’eau, le gaz, et les courses du ménage.
        </li>
      </ul>
      <p class="text-start">
        💡 Gérer Mon Foyer calcule automatiquement une répartition équitable en soustrayant vos dépenses personnelles de vos revenus disponibles.
      </p>

      <div class="row">
        <div class="col-sm-12 col-md-10">
          <p class="text-start">
            Découvrez ensuite des fonctionnalités complémentaires pour simplifier votre gestion de budget :
          </p>
          <p class="text-start mb-0">
            🛠️ <strong><RouterLink class="text-primary-emphasis" to="/simulator">Simulateur de dépenses ponctuelles</RouterLink></strong> : Partagez équitablement le prix d’un achat unique, comme de l’électroménager.
          </p>
          <p class="text-start mb-0">
            📊 <strong><RouterLink class="text-primary-emphasis" to="/history">Historique budgétaire</RouterLink></strong> : Suivez l’évolution de vos finances et dépenses dans le temps.
          </p>
          <p class="text-start">
            🎯 <strong><RouterLink class="text-primary-emphasis" to="/projects">Gestion de projets communs</RouterLink></strong> : Budgétez vos grands projets comme des travaux, des vacances ou un mariage.
          </p>

          <p class="text-start mb-0">
            Avec Gérer Mon Foyer, adoptez une approche financière claire, adaptée à chacun, et conçue pour simplifier votre quotidien.
          </p>
        </div>
        <div class="col-sm-12 col-md-2 d-flex flex-column justify-content-end align-items-center">
          <HouseDrawing />
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
h1 {
  font-size: 2.75rem;
  font-weight: bold;
}

p:not(.lead), ul {
  line-height: 1.75;
  font-size: 1.1rem;
}

ul.step-list {
  list-style: none;
  padding-left: 0;
  counter-reset: step-counter;
}

ul.step-list li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

ul.step-list li::before {
  content: counter(step-counter);
  counter-increment: step-counter;
  position: absolute;
  left: 0;
  top: 0;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
}
</style>