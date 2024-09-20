<template>
  <section class="container mt-4">
    <header class="text-center mb-5">
      <h1>Répartissez vos dépenses communes de manière équitable</h1>
      <p class="lead">
        Un outil gratuit pour gérer votre budget et simplifier la gestion des dépenses partagées, tout en tenant compte de vos charges personnelles.
      </p>

      <a href="/expense-distribution" class="btn btn-primary btn-lg mt-3">Commencer maintenant</a>
    </header>

    <section class="mb-5 text-center text-block">
      <h2 class="mb-3">
        L’importance d'une répartition équitable
      </h2>
      <p class="text-start">
        Les revenus des membres d’un foyer sont souvent inégaux, en raison de facteurs tels que des différences salariales entre professions,
        une interruption de carrière, ou des inégalités structurelles comme l’écart de salaires entre les hommes et les femmes.
        Cependant, malgré ces écarts de revenus, la répartition des dépenses commune est généralement faite à 50/50, ce qui désavantage une seconde fois la personne qui gagne le moins,
        en lui imposant une charge financière disproportionnée.
      </p>
    </section>

    <section class="mb-5 text-center text-block">
      <h2 class="mb-3">
        Exemple simple de répartition
      </h2>
      <p class="text-start">
        Prenons un couple dans lequel un des membres gagne 2400€ par mois et l’autre 1600€. Le premier représente 60% des revenus du foyer et l’autre 40%.
        Cependant, la personne qui touche 1600€ rembourse en plus un prêt étudiant de 200€ par mois! Voici comment seront réparties 500€ de dépenses communes :
      </p>
      <ul class="text-start">
        <li>Le revenu mensuel disponible de la personne avec un prêt est de 1600€ - 200€ = 1400€.</li>
        <li>Le revenu total disponible du foyer est donc 2400€ + 1400€ = 3800€.</li>
        <li>La personne qui gagne 2400€ paiera alors 63% des dépenses communes (315€).</li>
        <li>La personne qui gagne 1600€ ne paiera que 37% (185€).</li>
        <li>Avec une répartition 50/50, la personne qui gagne 1600€ aurait payé 250€, soit une économie de 7 800€ sur 10 ans grâce à cette méthode !</li>
      </ul>
      <p class="text-start">
        Ce type de répartition permet à chacun·e de contribuer de manière équitable, tout en prenant en compte les charges personnelles.
      </p>
    </section>

    <section class="mb-5 text-center text-block">
      <h2 class="mb-3">
        Comment ça fonctionne ?
      </h2>
      <p class="text-start">
        Pour chaque membre du foyer, il suffit de renseigner :
      </p>
      <ul class="text-start">
        <li>Les revenus (salaires, allocations, etc.).</li>
        <li>Les dépenses contraintes personnelles (crédits, essence, assurances, etc.).</li>
        <li>Les dépenses communes du foyer (loyer, factures, etc.).</li>
      </ul>
      <p class="text-start">
        L’outil soustrait automatiquement les dépenses contraintes des revenus individuels pour une répartition juste. Il vous attribue ensuite un pourcentage des dépenses communes à payer, basé sur vos revenus disponibles. Utilisez ensuite le
        <RouterLink to="/simulator">
          simulateur de dépenses ponctuelles
        </RouterLink>
        pour diviser équitablement le prix d’un achat unique, et
        <RouterLink to="/history">
          l’historique
        </RouterLink>
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

h2 {
  font-size: 1.9rem;
  color: #343a40;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
  line-height: 1.6;
}

p {
  line-height: 1.6;
}

.btn-primary {
  font-size: 1.2rem;
}

a {
  text-decoration: none;
}
</style>
