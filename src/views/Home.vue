<template>
  <div class="container mt-4">
    <header class="text-center mb-5">
      <h1>Répartissez vos dépenses communes de manière équitable</h1>
      <p class="lead">
        Un outil gratuit pour gérer votre budget et simplifier la gestion des dépenses partagées, tout en tenant compte de vos charges personnelles.
      </p>

      <a href="/expense-distribution" class="btn btn-primary btn-lg mt-3">Commencer maintenant</a>
    </header>

    <main>
      <section class="mb-5 text-center text-block">
        <h2 class="mb-3">
          Exemple simple de répartition
        </h2>
        <p class="text-start">
          Prenons un couple dans lequel Monsieur gagne 2400€ par mois et Madame 1600€. Monsieur représente 60% des revenus du foyer et Madame 40%. Cependant, Madame rembourse un prêt étudiant de 200€ par mois. Voici comment sont répartit 500€ de dépenses communes :
        </p>
        <ul class="text-start">
          <li>Les revenus disponibles de Madame après son prêt sont de 1400€.</li>
          <li>Le revenu total disponible du foyer est donc 2400€ + 1400€ = 3800€.</li>
          <li>Monsieur paiera 63% des dépenses communes (315€).</li>
          <li>Madame paiera 37% (185€).</li>
          <li>Avec une répartition 50/50, Madame aurait payé 250€, soit une économie de 7 800€ sur 10 ans grâce à cette méthode!</li>
        </ul>
        <p class="text-start">
          Cette méthode permet à chacun de contribuer équitablement en tenant compte des charges personnelles.
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
          <li>Les dépenses contraintes personnelles (crédits, essence, assurances etc.).</li>
          <li>Les dépenses communes du foyer (loyer, factures, etc.).</li>
        </ul>
        <p class="text-start">
          L'outil soustrait automatiquement les dépenses contraintes des revenus individuels pour une répartition juste. Il vous est attribué un pourcentage des dépenses communes que vous devrez payer. Utilisez ensuite le <RouterLink to="/simulator">
            simulateur de dépenses ponctuelles
          </RouterLink> pour diviser équitablement le prix d'un achat uniques, et<RouterLink to="/history">
            l'historique
          </RouterLink> pour suivre l'évolution de vos budgets et dépenses dans le temps.
        </p>
      </section>
    </main>
  </div>
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