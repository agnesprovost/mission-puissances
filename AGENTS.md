# Instructions pour Codex

## Objectif
Construire une bibliothèque de mini-applications de mathématiques, en français, intuitives, tactiles et adaptées à une élève de 2e secondaire belge.

## Principes
- Compréhension conceptuelle avant mémorisation de formules.
- Les élèves manipulent des facteurs, des groupes ou des blocs avant de voir la règle algébrique.
- UI responsive, utilisable au doigt dans Safari iOS et sur ordinateur.
- Site statique, sans backend ni données personnelles, publiable sur GitHub Pages.
- Privilégier HTML/CSS/JavaScript simples et sans dépendances inutiles.
- Prévoir des indices progressifs et un mode démonstration.
- Exposants négatifs interdits dans les exercices classiques de puissances ; autorisés pour 10 en notation scientifique.

## Première tâche proposée
Examiner `puissances/multiplication.html`, vérifier qu'il affiche bien huit blocs bleus « 4 » et huit blocs orange « 6 » au chargement, et que l'association tactile permet de former huit paires pour conclure à `24^8`. Corriger les problèmes identifiés, ajouter une page d'accueil et préparer GitHub Pages. Ne pas déclarer les tests iOS réussis sans test réel.

## Suite
Voir `README.md` pour la feuille de route. Maintenir des animations indépendantes, accessibles depuis la page d'accueil.

La division autorise m > n : les facteurs restants restent au dénominateur, sous la forme 1 / a^(m-n), avec un exposant positif.
