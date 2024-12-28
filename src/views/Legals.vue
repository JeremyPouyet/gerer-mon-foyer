<script setup lang="ts">
import '@/assets/secondary.scss'
import ViewTitle from '@/components/ViewTitle.vue'

import { Path } from '@/types'

</script>

<template>
  <div v-once class="container">
    <ViewTitle emoji="🚓" :path="Path.Legals" />

    <div class="row justify-content-around">
      <section class="mb-4 text-block col-sm-12 col-md-5 justified">
        <h2>Éditeur</h2>
        Jérémy Pouyet<br>
        Email: <a class="text-dark" href="mailto:contact@gerer-mon-foyer.fr">contact@gerer-mon-foyer.fr</a><br>
        Me retrouver: <a class="text-dark" href="https://github.com/JeremyPouyet" rel="noopener noreferrer" target="_blank">Github</a> | <a class="text-dark" href="https://www.linkedin.com/in/j%C3%A9r%C3%A9my-pouyet-b8b3407a/" rel="noopener noreferrer" target="_blank">LinkedIn</a><br>
      </section>
      <section class="mb-4 text-block col-sm-12 col-md-5 justified">
        <h2>Gestion des données</h2>
        <p>
          Gérer Mon Foyer ne collecte aucune de vos données personnelles. Vos données sont uniquement
          sauvegardées dans votre navigateur. Seuls vous, ainsi que ceux ayant accès à votre navigateur, pouvez y accéder.
        </p>
        <p>
          <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
          Vous pouvez supprimer définitivement vos données dans les <RouterLink class="text-primary-emphasis" to="/settings">paramètres</RouterLink>.
          Si vous souhaitez accéder à vos données sur un autre appareil,
          <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
          vous devez d’abord les exporter dans les <RouterLink class="text-primary-emphasis" to="/settings">paramètres</RouterLink> pour
          ensuite les importer dans le nouveau navigateur.
        </p>
        <p>
          Le site ne vous traque pas et ne revend pas vos informations à des fins publicitaires.
        </p>
      </section>
      <section class="mb-4 text-block col-sm-12 col-md-5 justified">
        <h2>Propriété intellectuelle</h2>
        <p>
          Gérer Mon Foyer est développé sous licence GPLv3. Vous pouvez redistribuer et modifier ce site tant que vous respectez les conditions de la licence GPLv3.
          Cette licence est amendée par la "Commons Clause", qui interdit strictement de vendre tout ou partie de ce logiciel, ou de restreindre son accès par une licence payante.
          Tout site dérivé de celui-ci doit également respecter la "Commons Clause".
        </p>

        <p>
          <a class="text-dark" href="https://github.com/JeremyPouyet/gerer-mon-foyer/blob/master/LICENSE.md" rel="noopener noreferrer" target="_blank">Voir la license complète</a>.<br>
          Le code source du site est accessible sur <a class="text-primary-emphasis" href="https://github.com/JeremyPouyet/gerer-mon-foyer" rel="noopener noreferrer" target="_blank">GitHub</a>.<br>
          Les icônes ont été créées par <a class="text-primary-emphasis" href="https://www.flaticon.com/authors/juicy-fish" rel="noopener noreferrer" target="_blank">juicy_fish</a>.<br>
        </p>
      </section>
      <section class="mb-4 text-block col-sm-12 col-md-5 justified">
        <h2>Hébergeur</h2>

        <p>Ce site est hébergé par OVH Cloud</p>
        SAS au capital de 50 000 000 €<br>
        RCS Lille Métropole 424 761 419 00045<br>
        Code APE 2620Z<br>
        N° TVA : FR 22 424 761 419<br>
        <address>
          Siège social : 2 rue Kellermann - 59100 Roubaix - France
        </address>
        OVH SAS est une filiale de la société OVH Groupe SA, société immatriculée au RCS de Lille sous le numéro 537 407 926, sise 2, rue Kellermann, 59100 Roubaix.<br>
        Directeur de la publication : Michel Paulin<br>
      </section>
    </div>
  </div>
</template>

<style scoped>
.justified {
  text-align: justify;
}
</style>
