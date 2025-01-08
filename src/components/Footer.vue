<template>
  <footer v-once class="bg-primary footer mt-auto py-4">
    <div class="container">
      <div class="row">
        <div class="col-md-3 text-center text-md-start">
          <h3 class="section-title">
            Crédits
          </h3>
          <p>
            Icons créés par
            <a class="text-primary-emphasis" href="https://www.flaticon.com/authors/juicy-fish" rel="noopener noreferrer" target="_blank">juicy_fish</a>
            sur
            <a class="text-primary-emphasis" href="https://www.flaticon.com" rel="noopener noreferrer" target="_blank">Flaticon</a>
          </p>
          <p>
            Développé avec
            <a class="text-primary-emphasis" href="https://vuejs.org/" rel="noopener noreferrer" target="_blank">Vue.js</a>
            et
            <a class="text-primary-emphasis" href="https://getbootstrap.com/docs/5.3/" rel="noopener noreferrer" target="_blank">Bootstrap 5</a>
          </p>
        </div>

        <div class="col-md-6 text-center mb-3 mb-md-0 px-5">
          <h3 class="section-title text-center">
            <div class="d-flex justify-content-center align-items-center">
              <div class="align-middle me-2">
                À propos de
              </div>
              <div class="border p-2">
                <p class="mb-0 lh-1 py-0">
                  Gérer
                </p>
                Mon <img alt="" class="icon-container-small" src="@/assets/icons/home.png"> Foyer
              </div>
            </div>
          </h3>
          <p>
            Ce site est gratuit, ne récupère pas vos informations personnelles et ne nécessite aucune inscription.
            Abusez-en tant qu’il existe !
          </p>
          <p>
            Contact : <a class="text-primary-emphasis" href="mailto:contact@gerer-mon-foyer.fr">contact@gerer-mon-foyer.fr</a>
          </p>
        </div>

        <div class="col-md-3 text-center text-md-end">
          <h3 class="section-title">
            Ressources
          </h3>
          <p>
            Code source disponible sur <a class="text-primary-emphasis" href="https://github.com/JeremyPouyet/gerer-mon-foyer" rel="noopener noreferrer" target="_blank">Github</a>
          </p>
          <p>
            <RouterLink class="text-primary-emphasis" to="/legals">
              Mentions légales
            </RouterLink>
          </p>
          <p>
            Développeur fait avec amour par sa mère et son père ❤️
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>