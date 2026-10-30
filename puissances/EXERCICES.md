# Puissances : fractions, phrases et calculs longs

Les séries gardent les exercices précédents et ajoutent neuf familles dans les trois niveaux. Les bases sont des entiers ou des fractions d’entiers ; aucun exposant négatif ni aucune base décimale n’est généré dans ces nouvelles familles.

## Fractions et intuition

- **Fraction vers puissance** : retrouver une puissance commune au numérateur et au dénominateur. Exemples : `121/100 = (11/10)^2` ; `−1/32 = −1/2^5`. La forme `(−1/2)^5` reste acceptée, mais l’aide et le retour après réussite privilégient `−1/2^5`, qui simplifie la puissance de 1. Avec un exposant pair, `(−1/2)^4 = 1/2^4` : le signe moins disparaît.
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

Les calculs de priorités comprennent aussi ces quatre références et des variantes générées :

- `−8 × (17−2) − (21−5) × 3 = −168`.
- `12 ÷ 3 × 2 + 3 × (5−8)^2 = 35` : division et multiplication de même priorité se font de gauche à droite.
- `2 × 3^2 + (4−1)^2 + 3 × (5−2) = 36`.
- `4 − 5 × (2^3 + 4 × 3) + (−8)^2 = −32` : la dernière ligne est `4 − 100 + 64`, pas une somme de trois nombres négatifs.

Quand le dernier calcul est une addition ou soustraction d’entiers, l’aide ajoute une droite graduée. Le déplacement rend explicite le sens du signe : `−96 + 64` avance vers la droite jusqu’à `−32` ; `−120 − 48` va vers la gauche jusqu’à `−168`. Cette représentation fait partie de la résolution demandée, jamais de l’énoncé avant réponse.

## Tests

```powershell
node puissances/exercices-plus.test.cjs
node commun/progression.test.cjs
node puissances/defis.test.cjs
node stats/stats.test.cjs
```

Les tests supplémentaires couvrent 1 440 questions générées, les deux fractions d’exemple, les traductions, les formes équivalentes, les signes et la comparaison à 1, les priorités et la conservation de la valeur à chaque étape, ainsi que les séries de 20/50/100. Essais navigateur : saisie et validation de l’exposant de toute la fraction, consignes distinctes et développement d’un calcul littéral. Safari iOS reste à vérifier sur appareil réel.

Seuls les types d’exercices mathématiques sont repris dans le code ; les photos et les informations présentes sur les copies ne font pas partie du dépôt.


## Progression en cinq paliers
1. Règles simples sur bases entières.
2. Signes, traduction de phrases et exposants inconnus, notamment au dénominateur.
3. Produits et quotients : simplifier seulement les bases communes.
4. Réécrire les bases (4 = 2²), combiner et respecter les priorités.
5. Puissances de fractions, réservées à plus tard.
Les quotients de puissances entières restent présents dès le premier palier. Les traductions et calculs de phrases sont présents dès le deuxième. Les anciens scores restent conservés ; les nouveaux paliers ne sont pas directement comparables aux anciennes séries.


Les produits de puissances signées demandent de résoudre les signes et de conserver les puissances. Plusieurs puissances peuvent rester si aucune règle ne les regroupe (7^4 × 6^2). Les bases parfaites, bases identiques et exposants identiques sont regroupés quand possible. Le résultat numérique entièrement effectué reste accepté, mais n’est pas imposé. Les démonstrations s’arrêtent à la forme en puissances.


Mise à jour : la forme réduite des simplifications à bases entières exige des bases premières. Ainsi 7^4 × 6^2 devient 2^2 × 3^2 × 7^4 et 6^6 devient 2^6 × 3^6. Les exposants d’une même base sont regroupés ; les facteurs communs aux deux côtés d’une fraction sont annulés. Le calcul numérique reste demandé seulement dans les familles explicitement numériques. Les phrases à traduire, la notation scientifique et les puissances de fractions conservent leurs consignes dédiées.
