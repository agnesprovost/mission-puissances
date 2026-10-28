# Missions maths · Puissances et Moyennes & stats

## Séances personnalisées et fondamentaux

Chaque catégorie propose une **séance de défis**, avec un nombre entier de questions saisi librement entre **1 et 500**, une technique ciblée ou un mélange, et un niveau. Les défis Puissances et Statistiques acceptent aussi ce nombre libre, depuis leur accueil ou leur page de séance.

Les séances avancent question par question, avec indices et démonstrations à la demande, passage d’une question, bilan final et reprise des questions à revoir. Les supports des nouveaux ateliers sont masqués au départ d’une séance et peuvent être ouverts comme une aide. Un arrêt anticipé compte les questions restantes comme passées. Les étapes algébriques intermédiaires correctes ne pénalisent pas le score initial ; une erreur validée ou une aide avant la réussite empêche d’obtenir ce point initial. Une question passée compte zéro. Les corrections ultérieures restent possibles.

Les bilans de toutes les catégories sont compatibles avec Ma progression, ses filtres et les sauvegardes existantes ; les anciennes séances restent lisibles. L’exercice en cours n’est pas repris après rechargement. La reprise des erreurs reste disponible dans la page pendant la visite.

L’exemple statique des deux arbres de calcul est conservé dans `priorites/fondamentaux.html`, séparément du parcours dynamique et des séances de défis. Ce premier exemple est gardé comme ressource ; le module complet de fondamentaux n’est pas développé à ce stade.

Test complémentaire : `node commun/seances.test.cjs` vérifie les longueurs libres, les bilans, la reprise, les anciennes sauvegardes et le démarrage des séances dans les neuf nouvelles catégories.

Le [cahier des charges consolidé](CAHIER-DES-CHARGES.md) décrit les neuf nouveaux modules, le formalisme transversal, l’analyse de l’existant et l’architecture proposée. Les deux prototypes prévus sont Priorités des opérations, puis Suites de figures — Du raisonnement à la rédaction.

## Prototype Priorités des opérations

Accessible depuis l’accueil ou `priorites/index.html`. Sélectionner un signe puis « Calculer cette opération » ; les étapes sont validées et annulables. Trois modes libres, trois niveaux générés, expressions personnalisées, reprise des expressions à revoir pendant la visite, indices progressifs, démonstration d’une seule étape et accès séparé aux fondamentaux (comparaison de deux arbres) sont disponibles. Le bilan des séances terminées est sauvegardé ; une séance en cours ne reprend pas après rechargement. Aucun score dans Explorer.

Le moteur commun `commun/expressions.js` utilise un arbre syntaxique immuable et des rationnels BigInt. Il prend en charge les entiers, signes unaires, parenthèses, opérations arithmétiques et exposants entiers de 0 à 12 ; il refuse les divisions par zéro, `0^0`, les exposants négatifs et les écritures hors grammaire. Le calcul littéral et les équations ne sont pas encore implémentés dans ce moteur. Pour cette activité, on traite les parenthèses, les puissances, puis les chaînes de même priorité de gauche à droite ; plusieurs sous-expressions indépendantes peuvent être sélectionnées.

Test : `node priorites/priorites.test.cjs` (cas du cahier des charges, fractions exactes, signes, priorités, 450 exercices reproductibles et parcours du contrôleur). L’essai Safari tactile sur iPhone réel reste à effectuer. Lancer `node scripts/serve.cjs` puis ouvrir `http://127.0.0.1:8080/priorites/`.

Mini-applications interactives pour découvrir intuitivement les mathématiques, adaptées à une élève de 2e secondaire en Belgique.

## Huit ateliers supplémentaires — premières versions

L’accueil donne désormais accès aux neuf catégories ajoutées, dont Priorités. Les huit nouveaux ateliers partagent `commun/ateliers.js`, leur modèle et leurs validations dans `commun/ateliers-moteur.js`, le calcul polynomial exact dans `commun/algebre.js` et les figures à segments partagés dans `commun/figures.js`. Aucun backend ni dépendance externe.

| Atelier | Techniques et supports disponibles |
|---|---|
| `litteral/` | Termes semblables sélectionnables et regroupables, produits de monômes, distributivité, parenthèses et signes. Étapes équivalentes acceptées avant la forme développée et réduite. |
| `relatifs/` | Addition/soustraction, signes des produits, classement de fractions. Droite numérique manipulable et association des signes. |
| `equations/` | Équations linéaires à solution unique, opérations identiques sur les deux membres, annulation, solutions fractionnaires exactes ; vérification par calcul séparé des deux membres et conclusion. |
| `factorisation/` | Facteur numérique ou avec lettre, essai de partage des coefficients ; factorisations équivalentes non triviales acceptées, sans imposer le plus grand facteur. |
| `suites/` | Termes suivants, application directe, question inverse et formule. Chaînes de triangles/carrés/pentagones à côtés partagés ; rédaction et comparaison facultatives pour la formule. |
| `ensembles/` | Plus petit ensemble d’un nombre, appartenance et inclusion, régions emboîtées. Convention : 0 dans ℕ, inclusion stricte pour ⊂. |
| `geometrie/` | Lecture de coordonnées avec point exploratoire déplaçable par curseurs ; définitions et affichage des quatre droites du triangle. |
| `multiples/` | Deux ou trois périodes, déplacement manuel sur une ligne du temps, premier multiple commun strictement positif et unité en secondes. |

Les trois modes sont accessibles librement. Les réglages se replient pour garder l’exercice accessible sur téléphone. Les indices et corrections se dévoilent à la demande, une étape à la fois. Le mode Explorer n’attribue aucun score ; les autres modes permettent de reprendre les erreurs durant la visite. Les séances terminées sont enregistrées dans Ma progression, pour toutes les catégories.

Le formalisme écrit reste ciblé sur la construction de formules dans les suites. Les autres ateliers demandent de calculer ou transformer, sans justification rédigée obligatoire. Le texte libre des suites n’est pas corrigé automatiquement ; les cases de relecture sont une autoévaluation.

Périmètre mathématique initial : polynômes à coefficients rationnels, lettres individuelles, exposants de 0 à 6 dans le parseur algébrique, division uniquement par une constante non nulle ; la grammaire arithmétique conserve son propre périmètre. Un format non pris en charge reçoit une explication ; il ne prouve pas une erreur de raisonnement. Les contrôles d’équivalence se font sur les coefficients exacts, jamais sur quelques valeurs testées. Les résultats exacts restent distincts des décimales approchées dans les aides.

**À compléter :** bilan fin de compétences persistant, générateurs plus variés, cas d’équations sans solution ou à infinité de solutions, organisation de blocs de rédaction, véritable déplacement d’objets entre ensembles, origine mobile et contrainte sur plusieurs points, triangle déformable, classification des solides/quadrilatères et animation temporelle automatique. Les exemples d’ensembles, de classement et de définitions géométriques utilisent pour l’instant de petits jeux fixes ; leurs deux niveaux ne constituent pas encore deux progressions distinctes.

Vérification : `node commun/ateliers.test.cjs` couvre 1 600 questions générées, les exemples du contrôle retranscrits dans le cahier des charges, les équivalences, les étapes et les parcours des huit contrôleurs. Contrôles effectués aussi dans le navigateur : chargement des vingt techniques, regroupement littéral, opérations sur les deux membres d’une équation, formule équivalente et comparaison ; les huit pages ne débordent pas horizontalement à environ 390 px. Un essai tactile Safari sur iPhone réel reste à faire.

## Deux missions et progression

La navigation propose **Puissances**, **Moyennes & stats** et **Ma progression**. La nouvelle mission comprend des tutoriels manipulables (moyenne, proportions, tableaux et graphes), puis des séries de 1 à 500 défis, au choix sur trois niveaux. Les deux missions partagent les prédictions bonus et un historique local : scores selon l’aide utilisée, temps actif, bonus et graphes dans le temps, avec export/import JSON. [Détails et test iPhone](stats/README.md).

Aucun backend ni compte. Les scores restent dans ce navigateur, jusqu’à 5 000 séries : garder une sauvegarde exportée pour les conserver sur plusieurs mois ou changer d’appareil. La synchronisation automatique entre appareils demanderait un service supplémentaire.

## Puissances

Cinq expériences sont accessibles depuis `index.html` :

- `puissances/multiplication.html` : `a^n × b^n = (ab)^n`, par association de paires.
- `puissances/regles.html#produit` : `a^n × a^m = a^(n+m)`, en assemblant les facteurs.
- `puissances/regles.html#puissance` : `(a^n)^m = a^(nm)`, en ouvrant les groupes.
- `puissances/regles.html#quotient` : `a^n / a^m = a^(n-m)`, avec des facteurs restants au numérateur ou au dénominateur (écrits `1 / a^(m-n)` si `m > n`), y compris le résultat `a^0 = 1` pour une base non nulle.
- `puissances/scientifique.html` : déplacement de virgule et compensation par une puissance de 10, avec grands et petits nombres.

Chaque expérience propose des indices, une démonstration et une remise à zéro. Les nouvelles règles utilisent des bases entières de 2 à 9 et des exposants de 1 à 6. Aucun backend ni dépendance externe. Vérification automatisée de la logique : 93 configurations de puissances, cinq exemples scientifiques, association de blocs décalés et interruption des démonstrations. Le rendu et le tactile Safari iOS restent à valider sur appareil réel.

## Lancer

### Défis mélangés

Depuis l’accueil, choisir librement de 1 à 500 exercices pour démarrer une séance. Les huit familles comprennent les produits, quotients, puissances de puissances, produits de bases différentes, expressions combinées, deux types d’exposants inconnus et la notation scientifique. Les questions arrivent une par une, sans afficher la solution. Réponse directe (ex. `3^4`, `1/3^2`, `4,5*10^-3`), vérification, nouvel essai, indice et développement visuel étape par étape sont disponibles. Les réponses équivalentes sont acceptées ; la notation scientifique doit être normalisée. Un bilan distingue les réussites sans aide, avec indice, avec développement et les questions passées. La séance n’est pas conservée après rechargement.

Vérifications : `node puissances/defis.test.cjs` (génération, calculs, saisies et déroulement d’une séance avec DOM simulé). Le rendu navigateur et Safari iOS restent à valider réellement.

Pour une adresse locale stable et l’historique, lancer `node scripts/serve.cjs` puis ouvrir `http://127.0.0.1:8080`. L’ouverture directe de `index.html` reste possible pour les manipulations, mais le stockage des scores dépend du navigateur avec une URL de fichier. Le site reste utilisable localement et hors ligne.

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
