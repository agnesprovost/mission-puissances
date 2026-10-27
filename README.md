# Mission Puissances

Mini-applications interactives pour découvrir intuitivement les mathématiques, adaptées à une élève de 2e secondaire en Belgique.

## État actuel

Cinq expériences sont accessibles depuis `index.html` :

- `puissances/multiplication.html` : `a^n × b^n = (ab)^n`, par association de paires.
- `puissances/regles.html#produit` : `a^n × a^m = a^(n+m)`, en assemblant les facteurs.
- `puissances/regles.html#puissance` : `(a^n)^m = a^(nm)`, en ouvrant les groupes.
- `puissances/regles.html#quotient` : `a^n / a^m = a^(n-m)`, avec des facteurs restants au numérateur ou au dénominateur (écrits `1 / a^(m-n)` si `m > n`), y compris le résultat `a^0 = 1` pour une base non nulle.
- `puissances/scientifique.html` : déplacement de virgule et compensation par une puissance de 10, avec grands et petits nombres.

Chaque expérience propose des indices, une démonstration et une remise à zéro. Les nouvelles règles utilisent des bases entières de 2 à 9 et des exposants de 1 à 6. Aucun backend ni dépendance externe. Vérification automatisée de la logique : 93 configurations de puissances, cinq exemples scientifiques, association de blocs décalés et interruption des démonstrations. Le rendu et le tactile Safari iOS restent à valider sur appareil réel.

## Lancer

### Défis mélangés

Depuis l’accueil, choisir 20, 50 ou 100 exercices pour démarrer une séance. Les huit familles comprennent les produits, quotients, puissances de puissances, produits de bases différentes, expressions combinées, deux types d’exposants inconnus et la notation scientifique. Les questions arrivent une par une, sans afficher la solution. Réponse directe (ex. `3^4`, `1/3^2`, `4,5*10^-3`), vérification, nouvel essai, indice et développement visuel étape par étape sont disponibles. Les réponses équivalentes sont acceptées ; la notation scientifique doit être normalisée. Un bilan distingue les réussites sans aide, avec indice, avec développement et les questions passées. La séance n’est pas conservée après rechargement.

Vérifications : `node puissances/defis.test.cjs` (génération, calculs, saisies et déroulement d’une séance avec DOM simulé). Le rendu navigateur et Safari iOS restent à valider réellement.

Ouvrir `index.html` dans un navigateur sur ordinateur, ou servir le dossier via un serveur local. Le site reste utilisable localement et hors ligne.

## Feuille de route

1. Tester et fiabiliser le prototype (tactile iOS, affichage initial, accessibilité).
2. Créer une page d'accueil reliant les modules.
3. Ajouter `a^n × a^m = a^(n+m)` (assembler les facteurs).
4. Ajouter `(a^n)^m = a^(nm)` (déplier des groupes).
5. Ajouter `a^n / a^m = a^(n-m)` avec résultat au numérateur ou au dénominateur, sans exposant négatif (simplifier des facteurs).
6. Ajouter la notation scientifique, y compris les exposants négatifs de 10, avec déplacement de virgule.
7. Ajouter des exercices de découverte et de transfert, puis éventuellement les statistiques.

## Contraintes pédagogiques

- Ne pas introduire d'exposants négatifs dans les exercices ordinaires de puissances ; ils sont autorisés en notation scientifique.
- Montrer les facteurs répétés avant d'énoncer les règles.
- Favoriser la manipulation et les essais autonomes ; prévoir un indice et une démonstration guidée.
- Éviter les séries de calculs répétitifs ; viser la compréhension des transformations.
- Ne pas afficher automatiquement la réponse avant la manipulation.

La division autorise m > n : les facteurs restants restent au dénominateur, sous la forme 1 / a^(m-n), avec un exposant positif.

## Saisie et correction des défis

Le site s’appelle Mission Puissances. Les boutons Exposant, ×, ÷, −, + et = insèrent les signes au curseur (ou remplacent la sélection). Les signes * et / restent acceptés au clavier. Le retour est vert pour une réponse finale correcte, rouge pour une erreur, orange pour une valeur équivalente dont la réduction reste à terminer. Une base qui est elle-même une puissance entière doit être réduite : par exemple 3^4 × 9^4 = 27^4 est une étape juste, mais la réponse finale attendue est 3^12. Le développement assisté inclut cette réduction. Les égalités simples sont acceptées si les deux côtés ont la bonne valeur.

## Trois degrés de difficulté et fractions

Le niveau se choisit à l’accueil ou avant une nouvelle séance, pour 20, 50 ou 100 exercices. Un bouton en fin de séance permet de passer au niveau suivant.

- Niveau 1, Les bases : produits, quotients, puissances de puissances, produits à exposant commun.
- Niveau 2, Signes et mélanges : règles combinées, exposants inconnus, notation scientifique, signes moins dans ou devant les puissances et produits signés.
- Niveau 3, Défis et équations : produits et quotients de puissances signées, exposants inconnus et petites équations à une inconnue x.

Les signes moins concernent les bases négatives et les opposés (ex. (−3)^4 contre −(3)^4), pas des exercices de soustraction de termes. Les exercices signés demandent une valeur numérique ou une fraction réduite ; les autres calculs de puissances gardent la réduction de la base. L’aide explique les parenthèses, la parité, les produits ou quotients de signes et les opérations effectuées des deux côtés des équations. Les exposants négatifs restent réservés à la notation scientifique.

Le bouton Écrire une fraction propose un champ numérateur au-dessus d’un champ dénominateur, avec une vraie barre. Les boutons de signes et exposants agissent sur le champ sélectionné. L’aperçu reproduit la fraction et la correction utilise sa valeur exacte.

## Publication

- Site : https://agnesprovost.github.io/mission-puissances/
- Dépôt public : https://github.com/agnesprovost/mission-puissances
- GitHub Pages publie la racine de la branche `develop`.
- Pour une mise à jour : vérifier les exercices avec `node puissances/defis.test.cjs`, créer un commit puis exécuter `git push`. GitHub Pages republie ensuite le site.
