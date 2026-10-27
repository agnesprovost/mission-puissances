# Score initial et intuitions

## Mesurer la première réponse

Dans les deux missions, le score initial est le nombre de premières réponses correctes données **avant toute aide**, rapporté au nombre total d’exercices de la série.

- Une première réponse incorrecte puis une correction correcte donne 0 au score initial, mais compte dans la réussite finale.
- Un indice ou un développement ouvert avant la première réponse empêche de gagner un point initial.
- Une aide consultée après une première réponse correcte ne retire pas le point initial acquis.
- Une question passée sans réponse donne 0 point initial.
- Une réponse soumise non vide fige le résultat initial, y compris si l’écriture est incorrecte ou si une expression équivalente n’est pas encore dans la forme demandée. Un champ vide ne compte pas comme une première réponse.
- La prédiction bonus est indépendante : ce n’est pas la première réponse au calcul et elle ne révèle pas de correction.

`Progression.captureFirst` s’exécute avant tout message de correction. Les états de question conservent la validité de la première réponse et le fait qu’elle ait été soumise avant l’aide. Les séances enregistrées conservent uniquement les agrégats `initialCorrect` et `initialAnswered`, pas le texte des réponses.

Le bilan, le tableau et une courbe dédiée affichent le score initial. Le taux final « sans aide après essais » reste disponible séparément : il peut augmenter après des tentatives, tandis que le score initial reste figé.

Les anciennes sauvegardes restent compatibles. Leur score initial apparaît « Non mesuré » et elles ne créent pas de point à zéro sur la nouvelle courbe. On ne peut pas déduire le score du premier essai à partir du seul taux de réussite final.

## Intuitions pour les puissances

L’estimation numérique est remplacée par deux groupes de boutons :

1. Valeur absolue supérieure à 1, égale à 1 ou inférieure à 1.
2. Signe positif, négatif ou nul.

Exemples : `−8` est de valeur absolue supérieure à 1 et négatif ; `−1/8` est de valeur absolue inférieure à 1 et négatif ; `−1` est de valeur absolue égale à 1 et négatif ; `0` est inférieur à 1 en valeur absolue et nul. Pour une équation, le texte précise si on classe la valeur de x ou l’exposant manquant.

Les deux choix sont requis pour enregistrer une prédiction. Ils sont ensuite verrouillés avant la résolution et l’aide. Un bonus est attribué si les deux choix sont justes et que l’exercice est résolu. Il reste possible de résoudre sans prédiction. Les comparaisons sur les puissances utilisent des fractions en entiers exacts, y compris pour les petits rapports.

Les statistiques conservent leurs estimations numériques à ±20 % et leurs choix de représentation. La conversion `3/4 = 75 %` reste valable.

## Vérification

```powershell
node commun/progression.test.cjs
node puissances/defis.test.cjs
node stats/stats.test.cjs
```

Essai navigateur effectué : choix et verrouillage des deux boutons, première réponse fausse puis correcte, bilan initial distinct du résultat après essais, et colonne/courbe du tableau de bord. Safari iOS reste à vérifier sur appareil réel. Aucune modification du déploiement GitHub Pages : la PR est publiée après sa fusion dans `develop`.
