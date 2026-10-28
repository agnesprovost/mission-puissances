# Mission Codex — Extension de l’application interactive de mathématiques

Document de référence consolidé : neuf nouveaux modules, visualisations, progression pédagogique, moteur de calcul et apprentissage du formalisme.

Statut : cahier des charges et analyse du dépôt, complétés par un prototype Priorités et de premières versions des huit autres ateliers. Le périmètre livré est décrit dans le README ; les objectifs détaillés ci-dessous restent à compléter. Le tactile sur iPhone réel reste à tester.

**Mise à jour après autorisation d’étendre les catégories :** les huit autres ateliers disposent maintenant d’une première version accessible depuis l’accueil. Les suites incluent déjà figures, calcul direct/inverse, formules équivalentes et comparaison facultative d’une règle rédigée. Le périmètre livré et les fonctions restantes sont détaillés dans le README : les objectifs ci-dessous restent le cahier des charges complet, pas une déclaration d’achèvement de toutes les fonctions. Le navigateur a permis de contrôler les vingt techniques et l’affichage étroit ; le tactile sur iPhone réel reste à tester. La correction des photos originales n’a pas été réexaminée : seuls les exemples retranscrits sont accessibles dans ce dépôt et cette conversation.

## 1. Public et objectif

Application destinée à une élève de 2e secondaire en Belgique, âgée de 13 ans. Les modules existants portent sur les puissances, la notation scientifique et les statistiques.

L’élève doit pouvoir manipuler des objets mathématiques, observer, expérimenter, découvrir une règle, l’appliquer, généraliser puis communiquer son raisonnement. L’application ne doit pas se limiter à une collection de QCM.

Deux dimensions complémentaires doivent pouvoir se travailler séparément : compréhension mathématique et formalisation du raisonnement. Une erreur de notation ne prouve pas une absence de compréhension.

## 2. Contraintes communes

- Ordinateur, tablette et iPhone ; commandes tactiles et clavier accessibles.
- Hébergement statique sur GitHub Pages, sans backend ni API d’IA obligatoires.
- Réutilisation de l’application existante, sans réécriture inutile des modules.
- Modules indépendants reliés par une navigation simple et des composants communs.
- Exercices générés lorsque pertinent, niveaux progressifs, recommencement libre et reprise des erreurs.
- Calculs exacts lorsque possible ; validations déterministes et reproductibles.
- Tests automatisés des générateurs, résultats et transformations intermédiaires.
- Aucun objectif de rapidité dans l’exploration ; animations utiles au raisonnement, contrôlables et respectueuses de la réduction des mouvements.

## 3. Structure pédagogique

Chaque module propose trois modes librement accessibles.

| Mode | Fonctionnement |
|---|---|
| Explorer | Manipulations libres, visualisation immédiate, hypothèses, retour en arrière, aucune notation ni contrainte de temps. |
| Comprendre | Parcours guidé, une étape à la fois, indices progressifs, explication des erreurs et des mécanismes. |
| S’entraîner | Exercices générés, difficulté progressive, validation, reprise des erreurs, autonomie et rédaction. |

Dans chaque exercice compatible, quatre étapes restent facultatives : **Explorer → Résoudre → Formaliser → Comparer**. Ces étapes ne remplacent pas les trois modes : elles décrivent le parcours au sein d’un exercice. Une élève peut accéder directement à la formalisation.

## 4. Les neuf modules

### 4.1 Priorités des opérations — priorité haute

Objectif : comprendre l’ordre des opérations en sélectionnant une opération, en observant son remplacement par son résultat et en poursuivant jusqu’au résultat final.

Expressions de référence :

```text
24 ÷ 12 × 3 + 5²
−2 × (−3) × (−4) − 8
(8 × 2 + 1²) + 4
4 × 7⁰ + (6 + 4)²
```

Les parenthèses délimitent les sous-expressions. Les puissances précèdent les opérations ordinaires ; multiplication et division ont la même priorité ; addition et soustraction ont la même priorité. Pour les opérations arithmétiques usuelles d’un même niveau, respecter l’ordre de gauche à droite. Le traitement des signes unaires doit distinguer `−3²` et `(−3)²`.

Couleurs et étiquettes distinguent parenthèses, puissances, produits/quotients et sommes/différences. L’information ne dépend pas uniquement de la couleur.

Comparer les arbres de `8 + (3 × 4) = 20` et `(8 + 3) × 4 = 44` permet d’expliquer l’effet d’un changement de groupement. Un ordre incorrect peut être exploré comme une autre expression, mais ne doit jamais être enregistré comme une égalité valable de l’expression initiale.

Progression : opérations simples, produits et sommes, parenthèses, puissances, relatifs, expressions combinées. La rédaction demande quelle opération est prioritaire, pourquoi et comment l’expression se transforme.

### 4.2 Nombres relatifs — priorité haute

- Droite numérique : déplacer un point, ajouter/soustraire, observer les déplacements, comparer et placer entiers, fractions et décimaux.
- Signes des produits : explorer `(−2) × (−3)`, `(−2) × 3`, `(−2) × (−3) × (−4)` sans analogie trompeuse.
- Fractions : afficher simultanément écriture fractionnaire, décimale et position.
- Comparaison de référence : `−5/10 = −0,5`, `−1/8 = −0,125`, `9/4 = 2,25`, donc `−5/10 < −1/8 < 9/4 < 3,4`.
- Formalisation : justifier le classement et employer correctement les inégalités.

### 4.3 Calcul littéral — priorité très haute

Expressions de référence :

```text
6a + 3b − 4a + 5a − 10b
−3a² × 5 − (−4) × 7a + 2a × 8a
8a²b × (3a − 4bc)
6x × (−9ax) − (−11ax + 4ax²)
```

- Regrouper des termes semblables par déplacement : `3a + 2a = 5a`, mais `3a + 2a²` ne se réduit pas ainsi.
- Représenter a par un objet, a² par un carré, a³ par un cube et b par une autre catégorie visuelle. Préciser les limites de ces représentations pour les valeurs négatives.
- Distinguer coefficients, variables et exposants : `a × a = a²`, `a² × a = a³`, `3a × 2a = 6a²`.
- Distribuer un facteur à chaque terme, de `3(a + 2)` à `8a²b(3a − 4bc)`.
- Visualiser les signes : `−(a − b) = −a + b` et `−(−11ax + 4ax²) = 11ax − 4ax²`.
- Vérifier chaque transformation : `6x(−9ax) − (−11ax + 4ax²) = −54ax² + 11ax − 4ax² = −58ax² + 11ax`.
- Formaliser par lignes d’égalités, justifier distributivité et regroupements, expliquer les changements de signe.

### 4.4 Équations — priorité très haute

Une équation est une égalité à préserver. Exemples : `−2x + 7 = 9`, `3x = 10`, `16 = 4x + 4`.

Une balance représente les deux membres. Ajouter/soustraire une même valeur ou multiplier/diviser par une même valeur non nulle conserve les solutions. Multiplier par zéro peut produire une égalité vraie mais n’est pas une transformation équivalente de résolution.

Présenter les transformations et leurs raisons : `16 = 4x + 4 → 12 = 4x → 3 = x`.

Pour vérifier `x = 6` dans `3x − 3 = 27 − 2x` : substituer séparément dans chaque membre, calculer `15` et `15`, comparer puis conclure. Distinguer cette vérification de la résolution.

Accepter la solution exacte `x = 10/3` pour `3x = 10`, sans imposer un décimal approché. La balance est une aide visuelle dont les limites doivent être explicitées, notamment pour les quantités négatives.

### 4.5 Factorisation — priorité haute

Manipuler des groupes et extraire des facteurs communs. Exemples : `50t + 35 = 5(10t + 7)` et `11nx − 33n = 11n(x − 3)`.

Sélectionner les facteurs, les extraire, revenir à la forme développée et vérifier l’équivalence. Faire apparaître la factorisation comme l’inverse de la distributivité. Accepter différentes factorisations valables ; préciser si la consigne exige une mise en évidence maximale.

### 4.6 Suites de figures — priorité moyenne, pilote du formalisme

| Figure n | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Segments s | 4 | 7 | 10 | 13 | 16 |

Afficher des figures géométriques, ajouter une figure, distinguer segments présents et nouveaux, compter et compléter un tableau. Faire découvrir l’ajout de 3, puis la décomposition `3n + 1`.

Trois types d’exercices : termes suivants, calcul de s connaissant n, recherche de n connaissant s. Références : `s(43) = 130` ; `3n + 1 = 184 → 3n = 183 → n = 61`. Le domaine est celui des numéros entiers de figures à partir de 1. Vérifier si un nombre de segments correspond réellement à une figure.

Prévoir ensuite d’autres suites, pas uniquement de raison 3. Distinguer observation, règle verbale, formule générale, application numérique et justification.

### 4.7 Ensembles de nombres — priorité moyenne

Régions emboîtées `ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ` ; déplacer notamment `16`, `−67`, `1/3`, `5/2`, `√2`. Expliquer qu’un nombre appartient aussi aux ensembles qui contiennent sa région.

Distinguer appartenance et inclusion : `16 ∈ ℤ`, `−67 ∉ ℕ`, `ℚ ⊂ ℝ`, avec `∈`, `∉`, `⊂`, `⊄`. Annoncer les conventions concernant 0 dans ℕ et le sens du symbole d’inclusion employé.

### 4.8 Géométrie et repérage — priorité moyenne

- Repère : déplacer l’origine, placer des points, lire les coordonnées et les signes.
- Défi : placer les axes pour trois points d’ordonnée positive, un d’ordonnée négative, trois d’abscisse positive et aucun sur un axe. Les jeux de points proposés doivent permettre une solution.
- Triangle manipulable : construire médiane, hauteur, médiatrice et bissectrice ; montrer définitions et propriétés. La médiatrice d’un côté ne passe pas nécessairement par un sommet ; une hauteur peut être extérieure au triangle.
- Classification : polyèdres/non-polyèdres, pyramides, parallélogrammes, losanges, trapèzes et symétries. Préciser les conventions, notamment pour les trapèzes.
- Justifier à partir des définitions, sans confondre apparence et propriété démontrée.

### 4.9 Multiples et PPCM — priorité basse

Trois lignes temporelles représentent des gouttes toutes les 8, 6 et 3 secondes. L’élève lance, ralentit, arrête et parcourt le temps ; les multiples et coïncidences apparaissent progressivement.

```text
8 : 8, 16, 24…
6 : 6, 12, 18, 24…
3 : 3, 6, 9, 12, 15, 18, 21, 24…
```

Le premier instant commun strictement positif est 24 secondes, en supposant un départ simultané à t = 0. La rédaction présente les multiples, le premier commun et une conclusion avec unité.

## 5. Du raisonnement à la rédaction

**Ajustement pédagogique après essai du prototype :** ne pas demander systématiquement de justifier les choix dans les priorités des opérations. Ce module travaille l’application des règles ; les explications interviennent en cas d’erreur ou sur demande d’aide. Le premier prototype a été allégé en ce sens : suppression de la rubrique « Expliquer mon choix » et de son évaluation. Le travail explicite de formalisation vise en priorité les suites (relation entre numéro et quantité, puis formule) et, ensuite, la mise en équation des problèmes. Pour les moyennes, une saisie du calcul pourrait être utile ; cette piste reste à étudier, sans ajouter de rédaction obligatoire à ce stade. Les exigences générales de justification ci-dessous s’appliquent selon la pertinence pédagogique du module.

### 5.1 Compétences et intention

La réussite aux calculs `s(43) = 130` et `n = 61` ne garantit pas que l’élève sache écrire `s = 3n + 1`. Travailler séparément compréhension du mécanisme, généralisation et formalisation.

Apprendre à expliquer avec ses mots, sélectionner les informations, définir les variables, généraliser, traduire en symboles, organiser les étapes, justifier, répondre précisément à la consigne et comparer des solutions. Il ne s’agit pas de mémoriser une rédaction unique.

### 5.2 A — Traduire dans les deux sens

Associer explication et expression, construire une formule à partir d’une phrase, expliquer une formule, identifier les variables et compléter une rédaction.

Exemple : « on ajoute trois segments » est une observation ; « trois fois le numéro plus un » est une règle générale ; `s = 3n + 1` la formalise, avec n numéro et s nombre de segments. Le point de départ doit être pris en compte : l’augmentation seule ne détermine pas le terme constant.

### 5.3 B — Construire une rédaction

Blocs possibles : définir n, définir s, décrire l’évolution, justifier le point de départ, écrire la formule, appliquer à n = 43.

Progression : organiser des éléments fournis ; compléter des éléments manquants ; rédiger soi-même. Les blocs peuvent être sélectionnés, déplacés et retirés au doigt ou au clavier.

Accepter plusieurs rédactions correctes. Distinguer raisonnement incorrect, incomplet, correct mais hors consigne, suffisamment justifié et correct mais trop long. Une application numérique peut être superflue si seule une formule est demandée.

### 5.4 C — Comparer

Présenter côte à côte sur grand écran, puis successivement sur petit écran :

- A : « On ajoute trois segments à chaque fois. Pour la figure 43, je fais 43 × 3 + 1 = 130. »
- B : « Soit n le numéro de la figure et s son nombre de segments. Le nombre de segments vaut trois fois le numéro plus un, donc s = 3n + 1. »

Les deux reconnaissent le mécanisme ; B répond directement à la demande générale. Questionner éléments communs, informations manquantes, précision, variables et possibilité de raccourcir sans perdre le sens.

Variantes : deux solutions correctes, rédaction incomplète, erreur de raisonnement à localiser, réponse correcte hors sujet. Éventuellement, deux réponses saisies indépendamment en mode parent-enfant puis dévoilées ensemble. Le parent n’est pas automatiquement la référence correcte.

### 5.5 D — Corriger

Faire améliorer « On ajoute trois à chaque fois, donc pour la figure 43, il y a 130 segments » lorsqu’une formule générale est demandée.

Indices successifs, sur demande :

1. La question demande-t-elle une valeur particulière ou une règle générale ?
2. Comment représenter le numéro d’une figure quelconque ?
3. Peut-on écrire une relation utilisant cette variable ?

Ne pas fournir immédiatement la solution complète. L’élève modifie sa réponse puis la compare à nouveau.

### 5.6 E — Décoder la consigne

| Verbe | Attendu |
|---|---|
| Calcule | Une valeur numérique. |
| Détermine | La valeur, relation ou l’objet demandé. |
| Exprime en fonction de | Une relation utilisant la variable indiquée. |
| Vérifie | Tester une affirmation et conclure. |
| Justifie | Expliquer pourquoi la réponse est correcte. |
| Démontre | Établir une propriété par un raisonnement valable. |
| Simplifie | Transformer en une forme plus simple. |
| Réduis | Regrouper les termes semblables. |
| Factorise | Transformer une somme en produit. |
| Résous | Trouver les solutions d’une équation. |

Faire choisir les types de réponses adaptés. Pour vérifier `x = 6` dans `3x − 3 = 27 − 2x`, demander substitution, calcul des deux membres, comparaison et conclusion ; ne pas exiger une résolution complète.

### 5.7 F — Observer une rédaction en construction

Lecture par étapes avec retour arrière et étape suivante masquée. Avant chaque révélation : « Que ferais-tu maintenant ? » Puis comparer le choix de l’élève au choix expliqué.

Exemple : définir les variables parce qu’une relation générale est cherchée ; écrire la relation ; tester sur les premières figures ; conclure. Les tests particuliers contrôlent la cohérence mais ne remplacent pas une justification générale.

### 5.8 Intégration transversale

Suites : observation vers formule ; équations : conservation de l’égalité ; calcul littéral et factorisation : justification des transformations ; priorités : ordre choisi ; PPCM : premier multiple commun ; géométrie : définitions ; statistiques : calcul et interprétation ; puissances : sens des exposants et transformations.

## 6. Évaluation et limites

| Compétence | Preuve observable |
|---|---|
| Compréhension | Identifier correctement un mécanisme ou une règle. |
| Généralisation | Passer de cas particuliers à une relation générale. |
| Calcul | Effectuer les opérations correctement. |
| Formalisation | Définir les variables et utiliser les symboles. |
| Justification | Expliquer pourquoi le résultat est valable. |
| Adéquation | Répondre exactement à la consigne. |

Conserver des observations séparées, avec états « non observé », « à travailler », « réussi avec aide », « réussi sans aide ». Une étape ignorée n’est pas un échec. Un score global ne suffit pas. Une erreur de calcul isolée ne doit pas effacer la réussite de la structure du raisonnement.

Correction automatique initiale : blocs identifiés, rôles des variables, expressions analysables et étapes structurées. Ne pas comparer seulement des chaînes ; accepter les équivalences dans le domaine pris en charge.

Un texte libre ne peut pas être évalué fiablement par ces seuls mécanismes. Proposer une grille de relecture ou une validation humaine et annoncer la limite. Une saisie hors grammaire est « non prise en charge », pas automatiquement « mathématiquement fausse ». Ne jamais déduire la compréhension d’une seule erreur de syntaxe.

## 7. Analyse du dépôt existant

État observé dans `laboratoire-maths` : HTML/CSS/JavaScript simples, sans gestionnaire de dépendances nécessaire. Les scripts exposent une API navigateur et des exports CommonJS pour les tests Node. Les neuf nouveaux modules ne sont pas encore présents.

| Composant existant | Réutilisation proposée | Limite à respecter |
|---|---|---|
| `index.html` | Accueil et navigation vers les nouveaux modules. | Ne pas réorganiser les parcours existants sans nécessité. |
| `puissances/labo.css`, `commun/mission.css` | Panneaux, cartes, boutons, responsive, retours accessibles. | Extraire seulement les styles communs nécessaires ; compléter les états de sélection. |
| `puissances/defis-moteur.js` | Conventions générateurs, validations, indices et étapes. | Parseur spécialisé ; ne représente pas un arbre général de transformations. |
| `stats/moteur.js`, `stats/vue.js` | Séparation logique/vue, questions à visualisation. | Calculs statistiques parfois flottants ; ne pas les employer comme moteur algébrique exact. |
| `commun/intuition.js` | Prédiction facultative dans l’entraînement. | Bonus et prédiction ne conviennent pas au mode Explorer sans notation. |
| `commun/graphiques.js` | Visualisations SVG et conventions d’affichage. | Ajouter des vues d’expressions et figures dédiées. |
| `commun/progression.js`, `commun/scores.js`, `scores.html` | Historique local, import/export, suivi des séances existantes. | Schéma actuellement limité à deux missions et aux séries 20/50/100 ; ne pas y injecter des preuves de compétences incompatibles. |
| `scripts/serve.cjs` | Aperçu statique local et accès réseau local pour appareil réel. | La compatibilité tactile Safari doit être testée sur iPhone réel. |
| `puissances/defis.test.cjs`, `stats/stats.test.cjs` | Tests Node, cas déterministes et contrôleurs avec DOM simulé. | Compléter par des tests navigateur ; un DOM simulé ne valide pas la sélection tactile. |

## 8. Architecture proposée

Ajouter progressivement des composants communs ; ne pas construire d’emblée un système algébrique complet.

```text
commun/
  maths/          rationnels exacts, analyse syntaxique, AST, règles, équivalences
  interactions/  sélection, transformations, historique, rendu d’expressions
  pedagogie/     modes, indices progressifs, étapes et démonstrations
  redaction/     modèles structurés, validation, comparaison et relecture
  competences/   observations versionnées, stockage local et migration
priorites/       première intégration du moteur
suites/          deuxième prototype et pilote de rédaction
```

Chaque module conserve son contrôleur, ses générateurs et ses représentations spécifiques. Les modules existants continuent à fonctionner avec leurs moteurs actuels. Les composants communs sont adoptés au besoin après validation.

### 8.1 Moteur mathématique et interaction

Représenter chaque expression par un arbre syntaxique immuable avec identifiants de nœuds stables : nombre rationnel, variable, opposé, opération binaire, puissance et groupement explicite. Une équation contient deux expressions. Conserver les parenthèses pédagogiques, même lorsqu’elles sont redondantes.

Les rationnels utilisent un numérateur et un dénominateur entiers réduits, de signe normalisé, avec rejet du dénominateur nul. Une implémentation BigInt est proposée pour éviter les débordements silencieux ; sérialiser ses entiers en chaînes dans les sauvegardes JSON. Les premiers exposants sont entiers et bornés ; déclarer explicitement les cas hors domaine, dont division par zéro et `0⁰`.

Une transformation reçoit l’arbre, un identifiant de nœud et une règle choisie. Elle retourne un nouvel arbre, une justification, les nœuds concernés et les observations de compétences. Aucun `eval` ni exécution du texte saisi.

Séparer deux questions : « cette transformation conserve-t-elle la valeur ou les solutions ? » et « respecte-t-elle la règle ou la consigne de cette activité ? ». L’équivalence numérique seule n’explique pas une étape.

Pour le premier prototype, réduire une opération dont les opérandes sont numériques, selon les parenthèses et les priorités. Dans une chaîne de même priorité, imposer la progression gauche-droite de cette activité. Des sous-expressions indépendantes peuvent offrir plusieurs premiers choix valables, par exemple `2 × 3 + 4 × 5`. Ne pas imposer systématiquement un seul parcours complet.

L’historique conserve les états et les actions ; annuler restaure l’état précédent sans modifier la question. La sélection se fait par boutons accessibles liés aux nœuds, avec focus visible, zone tactile d’au moins 44 px et nom accessible, sans dépendre d’un glisser-déposer précis.

Extension incrémentale : polynômes à coefficients rationnels pour les réductions et distributivités ; équations linéaires avec conditions d’équivalence ; factorisation par règles explicites. Ne pas valider une identité par quelques substitutions numériques. Pour la géométrie, séparer tolérance d’affichage et preuve par propriétés.

### 8.2 Données pédagogiques et rédaction

Exemple de contrat proposé, indépendant de l’interface :

```js
{
  version: 1,
  id: 'suites-carres-01',
  module: 'suites',
  seed: 42,
  consigne: { verbe: 'exprime', cible: 'relation-generale' },
  variables: [
    { symbole: 'n', sens: 'numero-figure', domaine: 'entier>=1' },
    { symbole: 's', sens: 'nombre-segments', domaine: 'entier>=0' }
  ],
  etapesDisponibles: ['explorer', 'resoudre', 'formaliser', 'comparer'],
  redaction: {
    blocs: [
      { id: 'definitions', role: 'definition', contenu: { variables: ['n', 's'] } },
      { id: 'depart', role: 'observation', contenu: { n: 1, s: 4 } },
      { id: 'ajout', role: 'justification', contenu: { increment: 3 } },
      { id: 'regle', role: 'relation', contenu: { expressionId: 'relation-ast' } }
    ],
    contraintes: [
      { type: 'definition-avant-usage', variable: 'n' },
      { type: 'cible-presente', cible: 'relation-generale' }
    ],
    references: ['raisonnement-par-ajouts', 'comptage-horizontal-vertical']
  }
}
```

Le contenu mathématique est structuré ; le texte d’affichage se génère séparément. Les contraintes décrivent des dépendances et des éléments utiles, pas une chaîne de rédaction unique. Pour les carrés accolés, accepter notamment `s = 3n + 1`, `s = 4 + 3(n − 1)` et `s = 2n + (n + 1)` par normalisation exacte.

Une observation de compétence conserve : exercice et version, compétence, statut, type de preuve, aide utilisée et tentative. Le texte libre reste distinct des preuves validées. Stockage local facultatif dans un schéma versionné séparé au départ, sans casser les imports de séances existants ; aucune donnée envoyée à un serveur.

### 8.3 Interface de comparaison

Afficher la consigne au-dessus des deux rédactions, avec leurs variables et étapes. Sur iPhone, empiler les panneaux dans un ordre lisible. Utiliser les rôles structurés pour signaler les éléments communs ou manquants ; ne pas produire un diagnostic sémantique arbitraire sur le texte libre.

L’élève identifie ce qui manque avant de révéler les explications. Une action « Améliorer ma réponse » retourne à un brouillon conservé. Les références sont des exemples possibles. Le mode parent-enfant, différé, masque chaque réponse jusqu’à la comparaison et propose la même grille aux deux auteurs.

## 9. Deux prototypes prioritaires

### 9.1 Prototype 1 — Priorités des opérations

Parcours : afficher `24 ÷ 12 × 3 + 5²`, sélectionner une opération, choisir de la calculer, recevoir un retour et voir l’expression mise à jour. Historique consultable et annulable ; indices sur demande et justification du choix.

Parcours de référence possible :

```text
24 ÷ 12 × 3 + 5²
= 24 ÷ 12 × 3 + 25
= 2 × 3 + 25
= 6 + 25
= 31
```

Les expressions restent lisibles sur petit écran et chaque sélection est possible au doigt et au clavier. Ne pas révéler automatiquement la solution. Inclure la comparaison `20` contre `44` et les arbres correspondants.

Critères : fluidité, précision de la validation, explication d’un choix refusé, retour arrière, indices graduels, reproductibilité et moteur indépendant de la vue. Tester les exemples de référence, signes unaires, égalités de priorité et cas interdits. Valider réellement l’iPhone avant de déclarer le tactile conforme.

### 9.2 Prototype 2 — Suites de figures et rédaction

Scénario complet : observer les carrés accolés ; identifier l’évolution ; compléter des valeurs ; expliquer avec ses mots ; définir les variables ; construire une formule ; comparer à une référence ; identifier les manques ; améliorer la réponse.

Inclure tableau, couleurs des ajouts, application directe `n = 43`, question inverse `s = 184`, saisie de formule équivalente, blocs de rédaction, indices graduels et solution en construction avec retour arrière. Pour le sens inverse formule vers phrase, proposer une association structurée ; conserver le texte libre pour relecture humaine.

| Situation observée | Accompagnement |
|---|---|
| A : évolution non identifiée | Retour à la construction et au comptage visuel. |
| B : évolution identifiée, généralisation non aboutie | Passage du premier terme aux ajouts et à un numéro quelconque. |
| C : formule correcte, présentation à travailler | Variables, justification, adéquation et comparaison. |

Ces orientations décrivent des réponses observées, pas un diagnostic définitif sur l’élève. Une compétence non testée reste non observée. Une formule non analysable demande clarification avant d’orienter vers B.

## 10. Plan incrémental et validations

1. **Cadrage — présent document.** Inventaire, réutilisation, contrats, limites et périmètre des deux prototypes. Aucun développement simultané des neuf modules.
2. **Socle et prototype Priorités.** Rationnels, AST arithmétique, règles de réduction, rendu sélectionnable, historique, indices, trois modes accessibles et premiers générateurs à graine reproductible.
3. **Prototype Suites.** Visualisation, tableau, questions directes/inverses, formules affines exactes, rédaction structurée, comparaison et observations séparées.
4. **Validation des deux prototypes.** Vérifications mathématiques, parcours avec erreurs, clavier, affichage étroit et essai sur iPhone réel ; retour pédagogique sur la compréhension des messages. Attendre validation avant généralisation.
5. **Phase 1 — fondamentaux.** Étendre priorités, relatifs, calcul littéral et équations, dans cet ordre de dépendances, avec priorité pédagogique très haute pour les deux derniers. Brancher graduellement le formalisme.
6. **Phase 2 — algèbre et raisonnement.** Factorisation, enrichissement des suites au-delà de la raison 3 et PPCM.
7. **Phase 3 — classification et géométrie.** Ensembles de nombres, repérage et constructions géométriques.

À chaque incrément : tests unitaires du moteur et des cas limites, tests déterministes des générateurs et des étapes valides/invalides, tests de parcours de l’interface et contrôles de non-régression des modules existants. Vérifier les équivalences symboliquement dans le périmètre supporté, sans se contenter des résultats finaux.

Commandes existantes de non-régression : `node puissances/defis.test.cjs` et `node stats/stats.test.cjs`. Les tests du nouveau moteur et des deux prototypes seront ajoutés à leur livraison. Un résultat automatisé ne remplace pas la vérification visuelle et tactile réelle.

## 11. Livrables et règle d’exécution

1. Analyse et architecture réutilisant l’existant : sections 7 et 8 de ce document.
2. Démonstration interactive Priorités des opérations : premier prototype local livré dans `priorites/`, vérification navigateur et tactile encore nécessaire.
3. Démonstration Suites de figures — Du raisonnement à la rédaction : première version locale dans `suites/`, avec formules équivalentes et comparaison ; organisation de blocs et suivi fin des compétences encore à développer.
4. Plan progressif des autres modules : section 10.

Ne pas réécrire les modules existants sans nécessité. Prévoir le formalisme dès le socle, sans prétendre corriger automatiquement tous les textes libres. Attendre validation des prototypes avant de généraliser.

Principe directeur : voir, manipuler, expérimenter, comprendre, résoudre, généraliser, formaliser, comparer et corriger. Le formalisme sert à exprimer une idée avec précision ; il ne constitue pas une contrainte arbitraire de présentation.
