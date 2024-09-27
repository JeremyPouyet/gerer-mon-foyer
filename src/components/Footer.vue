<template>
  <footer v-once class="footer mt-auto py-4">
    <div class="container">
      <div class="row">
        <div class="col-md-3 text-center text-md-start">
          <h5 class="section-title">
            Crédits
          </h5>
          <p>
            Icons créés par
            <a href="https://www.flaticon.com/authors/juicy-fish" target="_blank" rel="noopener noreferrer">juicy_fish</a>
            sur
            <a href="https://www.flaticon.com" target="_blank" rel="noopener noreferrer">Flaticon</a>
          </p>
          <p>
            Développé avec
            <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">Vue.js</a>
            et
            <a href="https://getbootstrap.com/docs/5.3/" target="_blank" rel="noopener noreferrer">Bootstrap 5</a>
          </p>
        </div>

        <div class="col-md-6 text-center mb-3 mb-md-0 px-5">
          <h5 class="section-title">
            À propos de Mon Foyer
          </h5>
          <p>
            Ce site est gratuit, ne récupère pas vos informations personnelles et ne nécessite aucune inscription.
            <br>
            Abusez-en tant qu’il existe !
          </p>
          <p>
            Contact : <a href="mailto:contact@gerer-mon-foyer.fr">contact@gerer-mon-foyer.fr</a>
          </p>
        </div>

        <div class="col-md-3 text-center text-md-end">
          <h5 class="section-title">
            Ressources
          </h5>
          <p>
            Code source disponible sur <a href="https://github.com/JeremyPouyet/Mon-Foyer" target="_blank" rel="noopener noreferrer">Github</a>
          </p>
          <p>
            Développeur fait avec amour par sa mère et son père ❤️
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 2rem 0;
  background-color: var(--color-celadon);
}

.footer p, .footer h5 {
  margin: 0;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.footer .section-title {
  font-weight: bold;
}

.footer a {
  text-decoration: underline;
}

.footer .row {
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  padding-top: 1.5rem;
}
</style>