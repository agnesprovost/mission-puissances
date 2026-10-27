# Moyennes & stats

Mission statique ajoutée à l’application existante. Point d’entrée : `stats/index.html`. Les styles, la navigation et les séries 20/50/100 conservent les conventions de Puissances.

## Ateliers

- Équilibrage de cinq colonnes par transferts de cubes : total conservé ; trait de moyenne révélé après une prédiction, un premier transfert ou une demande d’aide.
- Ajout d’un score : prédiction monter / descendre / rester identique, puis curseur et moyenne synchronisée. Une valeur nulle compte comme observation.
- Note cachée à construire avec un curseur.
- Correction de 79 en 75 : baisse du total de 4 et baisse de la moyenne de 1, pas de 4.
- Tableau d’effectifs déplié en observations pour la moyenne pondérée.
- Proportions : objets manipulables, fraction simplifiée, pourcentage, barre et secteur synchronisés après une prédiction. Doubler effectif et total conserve la proportion.
- Pourcentage d’un total : exemple 25 % de 44, fraction 1/4, simplification 44/4 et quatre groupes de onze objets. Même visuel accessible via l’aide des défis.
- Comparaison de 6/20 et 6/30 : même effectif absolu, fréquences différentes.
- Tableau d’effectifs modifiable lié aux objets, bâtonnets et disque ; distinction entre catégories, évolution temporelle et classes numériques.

Les tutoriels permettent les essais. Les défis ne montrent ni la formule ni la solution avant demande d’aide. Les graphes fournis dans l’énoncé d’un exercice de lecture font partie des données ; les représentations de la solution restent masquées.

## Défis

Trois niveaux : (1) moyenne, note manquante, effectif, pourcentage et angle ; (2) correction, pondération, fréquences, « au plus / au moins / strictement plus de », secteur inverse et lecture inverse ; (3) ajout d’observation et choix de représentation, avec les notions précédentes. Les défis mixtes CE1D multi-étapes et les pourcentages successifs restent une extension ultérieure du brief.

Chaque exercice commence par une intuition facultative, verrouillée avant la résolution. Une estimation à ±20 % obtient un bonus si l’exercice est ensuite résolu. Les choix de statistiques demandent une prédiction exacte ; une cible numérique nulle demande zéro. Dans une question de pourcentage, l’intuition et la réponse interprètent 3/4 et 75 % comme la même proportion. Le bonus n’est pas révélé avant la résolution et ne modifie pas le taux de réussite sans aide. Les indices et les développements restent comptés séparément.

## Scores sur plusieurs mois

Les deux missions partagent `commun/progression.js` et `scores.html`. Jusqu’à 5 000 séries terminées sont conservées en `localStorage`, sans expiration volontaire. Le temps actif exclut les périodes où l’onglet est masqué ; il inclut la prédiction et la consultation de l’aide. Recharger une série inachevée ne la sauvegarde pas.

Le tableau conserve date, mission, niveau, longueur, résultats selon l’aide, durée, prédictions et bonus. Les graphes montrent les 30 dernières séries filtrées : réussite sans aide et secondes actives par exercice. Ils ne comparent pas un score brut sur 20 avec un score sur 100.

L’export JSON est une sauvegarde à ranger dans un dossier lui-même sauvegardé. L’import valide le contenu puis fusionne les séances par identifiant sans écraser les séances existantes. Il permet aussi un transfert manuel entre appareils. Le stockage est propre à l’origine du site et au navigateur : aperçu local et GitHub Pages ont des historiques distincts. Aucun score n’est écrit dans le dépôt GitHub.

Pour une synchronisation automatique entre appareils, GitHub Pages peut rester le frontend ; il faudrait ajouter une API/base de données et une authentification. Cette PR n’ajoute ni compte ni service distant.

## Validation

Depuis la racine :

```powershell
node puissances/defis.test.cjs
node stats/stats.test.cjs
node scripts/serve.cjs
```

Ouvrir `http://127.0.0.1:8080`. Pour un essai iPhone sur le même Wi-Fi : `node scripts/serve.cjs --lan`, puis ouvrir dans Safari l’adresse réseau affichée. Autoriser le serveur sur le réseau privé si Windows le demande. Vérifier les transferts tactiles, le curseur du score et de la note cachée, les secteurs, la saisie de fractions, la prédiction verrouillée, une série terminée, son historique après rechargement et un export/import.

Vérification navigateur effectuée sur ordinateur et dans le panneau étroit de Codex : cubes visibles et transférables, conservation du total, prédiction puis curseur de moyenne, doublement d’une proportion, simplification de 25 % de 44, verrouillage de l’intuition et attribution du bonus. Les tests couvrent les calculs, arrondis, seuils, générations de séries, stockage indisponible, import sans doublons, temps actif et déroulement de séance. Safari iOS n’a pas été testé sur appareil réel.

GitHub Pages publie toujours la racine de `develop` ; la branche de cette PR n’est publiée qu’après fusion. Aucun build ni dépendance supplémentaire n’est nécessaire.

Le score initial (première réponse correcte avant toute aide) est distingué de la réussite après essais dans les deux missions. Les anciennes séances affichent « Non mesuré ». Voir [les règles de mesure et les nouvelles intuitions des puissances](../commun/SCORES.md).
