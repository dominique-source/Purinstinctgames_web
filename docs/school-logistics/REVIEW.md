# Moins de logistique — revue du 12 novembre 2026

Branche codex/school-logistics-section, base main 7956ac7, dépôt dominique-source/Purinstinctgames_web. Aucune fusion ni production.

## Audit et portée

Aucune section logistique préexistante. Insertion unique après la fermeture du hero (barre des zones incluse) et avant la vidéo. Le kit fourni PurInstinct_Section_Logistique_Kit_Codex.zip a été extrait et conservé dans design/purinstinct-logistique/ ; README.md, SPECIFICATIONS.md et content.fr-en.json lus, maquette gazonnée et panorama inspectés.

Le H2, les trois engagements H3, bandeau et signature sont en HTML sélectionnable ; SVG décoratifs pour validation et localisation. Aucun onglet, CTA, dialogue ou accordéon ajouté. Le 0 $ est explicitement associé au transport des élèves. Les frais de déplacement de l’équipe et les prix existants restent inchangés. Aucun personnage n’est identifié comme Dominique.

Le panorama fourni conserve ses trois scènes contiguës et diagonales sur ordinateur. Terrain gazonné, personnes et diversité de la ressource conservés, aucun ballon de basketball. Sur mobile, trois groupes image + engagement sont empilés sans carrousel, avec trois découpes issues du même panorama, sans déformation.

## Fontes et écarts à la maquette

Fontes réellement présentes réutilisées : Barlow Condensed Black Italic 900 pour titres/engagements/signature et Barlow Bold 700 pour les phrases. Fichiers déjà servis depuis assets/hero-deck/fonts/.

La recherche du dépôt n’a trouvé aucune fonte pinceau : le mot Games est un PNG, assets/hero-deck/games-brush.png. Pour garder la nouvelle signature en texte HTML traduisible, Barlow Condensed Black Italic est utilisée à grande taille en lime, avec un soulignement décoratif. Il ne s’agit pas d’une correspondance exacte avec la fonte pinceau raster de la maquette. Aucun nouveau fichier de police ni fausse correspondance introduits.

Le panorama est la reconstruction fournie, dont les visages et détails ne sont pas identiques à la maquette raster. Il est utilisé directement, sans génération. Les textures de pinceau cyan des coins de la référence ne sont pas reproduites ; fond noir et couleurs du site conservés. Toutes les interactions et autres sections restent inchangées.

## Ressources et performance

assets/school-logistics/panorama.webp : 2170×725, 476 300 octets, WebP qualité 90.
Découpes mobile : equipment.webp 735×725 / 148 068 octets ; school.webp 825×725 / 214 932 octets ; pride.webp 770×725 / 154 724 octets. Découpes originales respectives (0,0,735,725), (650,0,1475,725), (1400,0,2170,725). Source PNG conservée dans le kit. Images sous le hero, loading=lazy, decoding=async et dimensions réservées. Aucune animation nouvelle ; réduction des animations existante inchangée.

## Vérifications

83 tests Node passent, syntaxe/structure et git diff --check propres. Ce dépôt statique ne fournit pas de script build : aucun build Next.js inventé.

Un test retire uniquement la nouvelle section et ses références de chargement et compare le reste de index.html à origin/main : identique. Scripts arène/langues/calcul/contact et CSS existants comparés à main : inchangés. Textes JSON FR/EN, trois engagements, portée du 0 $, ressources et protections APP vérifiés.

Navigateur 1440×900 et 390×844 : FR/EN, textes entiers, contraste, photos sans déformation, trois scènes sur ordinateur et trois groupes sur téléphone, aucun débordement. Captures complètes de la section dans captures/. Reflow complémentaire à 720×450 en FR/EN sans débordement (largeur CSS équivalente à une fenêtre desktop à 200 % ; zoom natif du navigateur non modifié).

Saisies conservées au changement de langue : 200 élèves, 2 intervenants, 2 classes supplémentaires → 3 550 $ CA ; commentaire « Projet de notre école. » conservé. Aucun courriel réel envoyé.

## Fichiers modifiés

index.html (insertion et chargement CSS/version traductions uniquement), assets/school-logistics.css (styles tous préfixés par .school-logistics), quatre WebP, assets/site-translations.js (ajout des textes du kit seulement), middleware.js (cinq ressources publiques statiques), tests/school-logistics.test.mjs, kit et documentation.

Aperçu local : http://127.0.0.1:4183/#logistique. Exécution locale dépendante de l’ordinateur. Prochaine étape : validation avant toute fusion ou publication.
