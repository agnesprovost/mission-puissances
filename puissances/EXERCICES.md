# Puissances : fractions, phrases et calculs longs

Les séries gardent les exercices précédents et ajoutent neuf familles dans les trois niveaux. Les bases sont des entiers ou des fractions d’entiers ; aucun exposant négatif ni aucune base décimale n’est généré dans ces nouvelles familles.

## Fractions et intuition

- **Fraction vers puissance** : retrouver une puissance commune au numérateur et au dénominateur. Exemples : `121/100 = (11/10)^2` ; `−1/32 = (−1/2)^5`.
- **Puissance de fraction** : développer les facteurs, décider du signe et calculer une fraction réduite.
- **Quotient de puissances de fractions** : simplifier les facteurs identiques ; si les facteurs restants sont en bas, inverser la fraction et conserver un exposant positif.
- **Quotient signé sous forme de puissance** : séparer la règle des signes de la simplification des valeurs absolues. Par exemple `(−3)^9 / (−3)^12 = −1/3^3`, également écrit `1/(−3)^3`.

Les rapports couvrent des valeurs absolues inférieures, égales et supérieures à 1, et des signes positifs et négatifs. La prédiction de taille et de signe se fait avant l’aide. Le résultat reste sous forme de puissance lorsque la consigne le demande ; une valeur équivalente non mise sous la forme demandée est une étape intermédiaire.

Le mode de saisie de fraction comporte un champ d’exposant facultatif, qui porte sur **toute la fraction**. Les boutons de parenthèses complètent ceux des signes et de l’exposant. Le champ d’exposant se désactive lorsqu’on revient à la saisie sur une ligne et se remet à zéro à chaque question.

## Du français à l’expression

Deux consignes distinctes : **traduire sans effectuer** ou **traduire puis calculer**.

- L’opposé du cube de l’opposé de 3 : `−(−3)^3`, qui vaut 27.
- Le triple du carré de l’opposé de 5 : `3 × (−5)^2`, qui vaut 75.
- L’opposé du double du cube de 3 : `−(2 × 3^3)`, qui vaut −54.
- Le carré de l’opposé du double de 3 : `(−(2 × 3))^2`.
- Le double de l’opposé du carré de 3 : `2 × (−(3^2))`.

L’aide construit l’expression de l’intérieur vers l’extérieur. En traduction, un nombre déjà calculé ne suffit pas : on vérifie les opérations et leur place. Les parenthèses redondantes, les produits réordonnés et les coefficients implicites tels que `3(−5)^2` sont acceptés. Les traductions ne sont jamais exécutées comme du code.

## Priorités et lettres

Des expressions plus longues combinent signes, puissances, parenthèses, produits, quotients et sommes. Au niveau 3, on remplace aussi a et b par des valeurs données, dont des valeurs négatives. Exemple : `2a^2 − 3b + (a−b)^2` pour a = −2 et b = 3.

L’aide remplace les lettres, puis surligne une seule opération. Chaque étape affiche l’expression avant l’opération et après sa réduction. Les étapes conservent la valeur et respectent les groupes, puissances et priorités. Le calcul reste en fractions exactes lorsque nécessaire.

Deux variantes d’égalité demandent également de réécrire une base avant de retrouver l’exposant : `6^? × 36 = 6^8`, et `(7 × 16)^2 = 7^2 × 2^?`.

## Tests

```powershell
node puissances/exercices-plus.test.cjs
node commun/progression.test.cjs
node puissances/defis.test.cjs
node stats/stats.test.cjs
```

Les tests supplémentaires couvrent 1 440 questions générées, les deux fractions d’exemple, les traductions, les formes équivalentes, les signes et la comparaison à 1, les priorités et la conservation de la valeur à chaque étape, ainsi que les séries de 20/50/100. Essais navigateur : saisie et validation de l’exposant de toute la fraction, consignes distinctes et développement d’un calcul littéral. Safari iOS reste à vérifier sur appareil réel.

Seuls les types d’exercices mathématiques sont repris dans le code ; les photos et les informations présentes sur les copies ne font pas partie du dépôt.
