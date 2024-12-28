<template>
  <section v-once class="container">
    <header class="text-center mb-5">
      <h1 class="mb-3">
        Répartissez vos dépenses communes de manière équitable
      </h1>
      <p class="lead">
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
      <p class="text-start">
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
      <ul class="text-start step-list">
        <li>Camille représente 60% des revenus du foyer et Sam 40%.</li>
        <li>Cependant, le revenu mensuel disponible de Sam est en réalité de 1 600 € - 200 € = 1 400 €.</li>
        <li>Le revenu total disponible du foyer est donc 2 400 € + 1 400 € = 3 800 €.</li>
        <li>Camille paiera alors 63% des dépenses communes (315 €).</li>
        <li>Sam ne paiera que 37% (185 €).</li>
      </ul>
      <p>Avec une répartition 50/50, Sam aurait payé 250 €, ce qui représente un avantage de 7 800 € sur 10 ans avec cette méthode.</p>
    </section>

    <section class="mb-5 text-center text-block shadow-sm">
      <h2 class="mb-3">
        Comment ça fonctionne ?
      </h2>
      <p class="text-start">
        Pour chaque membre du foyer, il suffit de renseigner :
      </p>
      <ul class="text-start step-list">
        <li>Les revenus (salaires, allocations, etc…).</li>
        <li>Les dépenses contraintes personnelles (crédits, essence, assurances, etc…).</li>
        <li>Les dépenses communes du foyer (loyer, eau, gaz, etc…).</li>
      </ul>
      <p class="text-start">
        L’outil soustrait automatiquement les dépenses contraintes des revenus individuels pour une répartition juste,
        vous attribuant ensuite un pourcentage des dépenses communes à payer, basé sur vos revenus disponibles.
        Utilisez ensuite le
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <RouterLink class="text-primary-emphasis" to="/simulator">simulateur de dépenses ponctuelles</RouterLink> pour diviser équitablement le prix d’un achat unique, et
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <RouterLink class="text-primary-emphasis" to="/history">l’historique</RouterLink>
        pour suivre l’évolution de vos budgets et dépenses dans le temps.
      </p>
    </section>
  </section>
</template>

<style scoped>
h1 {
  font-size: 2.75rem;
  font-weight: bold;
}

p:not(.lead) {
  line-height: 1.75;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  text-align: justify;
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