# Mon Foyer

## Description

Ce projet propose un **outil gratuit** pour gérer les dépenses communes et personnelles d'un foyer de manière **équitable**. Il permet à chaque membre du foyer de contribuer aux dépenses partagées en tenant compte de ses revenues et de ses charges personnelles, telles que les crédits étudiant ou les dépenses incompressibles (essence/assurances). Cette approche garantit une répartition juste et évite les déséquilibres financiers.

### Fonctionnalités

- **Répartition des dépenses** : Au travers de l'établissement d'un budget par habitant du foyer, la répartition des dépenses commune se fait en respectant les revenus et charges personnelles de chacun pour une répartition équitable.
- **Simulation de dépenses ponctuelles** : Un outil pour diviser de manière équitable le coût d'achats uniques.
- **Suivi de l'historique** : Un historique pour suivre l'évolution de ses budgets et des dépenses au fil du temps.

## Installation et développement

### Prérequis

- [Node.js](https://nodejs.org/) version 16 ou supérieure
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) pour la gestion des paquets

### Installation

1. Clonez le dépôt :
  ```bash
  git clone https://github.com/JeremyPouyet/Mon-Foyer.git
  ```
2. Accédez au dossier du projet :
  ```bash
  cd Mon-Foyer
  ```
3. Installez les dépendances :
  ```bash
  npm install
  ```
---
### Scripts npm

    npm run dev : Lance le serveur de développement avec Vite.
    npm run build : Compile le projet pour la production.
    npm run preview : Prévisualise le projet en mode production.
    npm run lint : Vérifie le code avec ESLint.
    npm run type-check : Vérifie les types TypeScript.
---

### Stack technique

    Frontend : Vue.js 3 avec Vue Router
    Styles : Bootstrap 5
    Gestion des mathématiques : Math.js
    Utilitaires : uuid pour la génération d'identifiants uniques
    Build : Vite pour un environnement de développement rapide
    Linting : ESLint avec des règles spécifiques pour Vue.js et TypeScript