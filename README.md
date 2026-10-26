# Laboratoire de maths

Mini-applications interactives pour découvrir intuitivement les mathématiques, adaptées à une élève de 2e secondaire en Belgique.

## État actuel

Prototype existant : `puissances/multiplication.html`, pour visualiser `a^n × b^n = (ab)^n` par regroupement de paires. Le prototype n'a pas encore été validé dans Safari iOS : l'aperçu de fichiers de ChatGPT/iOS n'affichait pas les blocs générés par JavaScript.

## Lancer

Ouvrir `puissances/multiplication.html` dans un navigateur sur ordinateur, ou servir le dossier via un serveur local. Pour GitHub Pages, prévoir une page d'accueil `index.html` et publier depuis la branche principale.

## Feuille de route

1. Tester et fiabiliser le prototype (tactile iOS, affichage initial, accessibilité).
2. Créer une page d'accueil reliant les modules.
3. Ajouter `a^n × a^m = a^(n+m)` (assembler les facteurs).
4. Ajouter `(a^n)^m = a^(nm)` (déplier des groupes).
5. Ajouter `a^n / a^m = a^(n-m)` avec `n >= m` (simplifier des facteurs).
6. Ajouter la notation scientifique, y compris les exposants négatifs de 10, avec déplacement de virgule.
7. Ajouter des exercices de découverte et de transfert, puis éventuellement les statistiques.

## Contraintes pédagogiques

- Ne pas introduire d'exposants négatifs dans les exercices ordinaires de puissances ; ils sont autorisés en notation scientifique.
- Montrer les facteurs répétés avant d'énoncer les règles.
- Favoriser la manipulation et les essais autonomes ; prévoir un indice et une démonstration guidée.
- Éviter les séries de calculs répétitifs ; viser la compréhension des transformations.
- Ne pas afficher automatiquement la réponse avant la manipulation.
