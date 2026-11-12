# Spécifications d’intégration

## Emplacement et portée
Une section nouvelle après le hero et sa navigation des zones, avant la vidéo. Ne modifier aucun autre contenu. Pas d’onglets, de photo de réunion, de nouvelle navigation ou de CTA supplémentaire.

## Hiérarchie desktop
1. Titre condensé italique blanc, suite cyan. Introduction courte centrée.
2. Panorama trois scènes : matériel à gauche, installations gazonnées au centre, engagement des élèves à droite. Séparations diagonales. Photo dominante, environ la moitié de la section.
3. Engagements superposés au bas des photos sur dégradé noir. Gros symbole lime à gauche, repère cyan au centre, 0 $ lime à droite. Symboles en SVG ou bibliothèque existante, décoratifs pour lecteurs d’écran.
4. Bandeau compact délimité de traits lime, titre lime et phrase blanche.
5. Signature de fierté très visible en fonte pinceau lime, conclusion blanche plus petite.

## Couleurs
Fond #0A0A0A / marine existant; blanc #F4F4EF; lime #CCFF00; cyan indicatif #00D5E5, à aligner sur le token existant. Pas de nouveaux styles globaux.

## Typographie
Réutiliser les fichiers de fontes et règles existantes. Aucun fichier de fonte fourni dans ce kit. La maquette raster ne garantit pas une correspondance typographique exacte au pixel; utiliser la vraie fonte du site pour la cohérence et documenter toute différence.

## Mobile
Titre puis introduction, trois groupes image et engagement empilés, bandeau, signature et conclusion. Texte HTML adaptatif, marges 16–24px, texte courant au moins 16px. Adapter les coupures FR/EN; pas de carrousel masquant les engagements. Image panoramique utilisable via object-position, ou découpe des trois scènes sans déformer les personnes.

## Accessibilité et performance
H2 pour section, H3 pour engagements si pertinent. Les textes doivent rester sélectionnables et traduisibles. Images illustratives avec alt concis ou alt vide si redondantes. Dimensions réservées pour éviter les décalages. WebP/AVIF et chargement différé sous le hero. Respecter prefers-reduced-motion si animation discrète ajoutée.

## Fidélité et limites
La maquette approuvée est la référence de design. Le panorama sans texte est une reconstruction photographique séparée, pas un original en calques; une identité absolue pixel par pixel entre photo et maquette n’est pas garantie. Ne pas utiliser les textes raster comme contenu du site. Aucun logo de tiers de la photographie ne doit être utilisé comme logo officiel du projet.

## Recette
Comparer avant/après : hero, vidéo, programme et prix inchangés. Vérifier 1440x900 et 390x844, FR/EN, zoom 200%, absence d’overflow, lisibilité des bénéfices et distinction 0 $ transport élèves / frais de déplacement équipe en sus. Vérifier build et tests pertinents du dépôt.
