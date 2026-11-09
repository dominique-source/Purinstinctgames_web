# De la découverte aux Games — trois cartes

Dépôt : dominique-source/Purinstinctgames_web. Branche : codex/school-journey-three-cards, basée sur main 8302de7. Cette livraison est une revue, sans fusion ni production.

## Résultat

La section #parcours fusionne les quatre anciennes cartes et le bloc textuel de déploiement en trois étapes : AVANT LES GAMES, LE JOUR DES GAMES, APRÈS LES GAMES. Titre, sous-titre et descriptions approuvés sont des textes HTML, traduits par le mécanisme existant. Une espace insécable française évite de séparer les deux-points de mini-documentaire.

Composition : trois largeurs égales sur ordinateur, photos majoritaires, numéros visibles, cadres biseautés cyan/violet/vert, titre GAMES cyan, repères décoratifs discrets. Mobile : une colonne, ordre 01→02→03, images de plus de 300 px de haut, aucun carrousel. Apparition légère par l’observateur déjà présent ; zoom photographique de 2,5 % au survol seulement avec no-preference, sans déplacement ni curseur cliquable sur les cartes statiques.

L’ancre #deploiement demeure dans cette même section pour les anciens liens. Les précisions utiles ont rejoint le volet existant « Disponibilités et séances » du forfait : préparation avec l’école, accompagnement/coordination, équipements/production, DJ/sonorisation, ballons pédagogiques laissés à l’école et récupération du matériel des Games. Elles ne sont pas placées sous la carte Après les Games.

## Médias et écarts à la maquette

- Avant : assets/homepage/ecole.png (1961×802), coach et élèves. Image déjà approuvée et utilisée par le contact ; recadrage CSS individuel, source conservée.
- Jour : assets/school-home/action-ecole.webp (850×660), élèves en action avec le ballon.
- Après : mosaïque 2×2 de cliniques.webp, conference.webp, formation.webp et games.webp (380×378 chacun). Ces images sont réduites dans les vignettes, sans agrandissement de recadrages de la maquette.

Les photographies distinctes de la maquette ne sont pas disponibles séparément dans le dépôt. L’image Avant montre une scène extérieure, et la mosaïque utilise les illustrations approuvées du projet, avec le libellé « Visuels illustratifs ». Il manque notamment un visuel d’élèves qui filment et des images d’entrevues/projet média. Aucun portfolio scolaire réel identifié, aucune livraison professionnelle de captation prétendue.

Aucun faux bouton lecture, lien vide, lecteur vidéo ni trailer général dans la mosaïque. Chaque figure possède data-portfolio-id, data-media-kind="illustration" et data-media-src="" : structure simple pour associer plus tard une ressource réelle et autorisée. Aucun média fictif ou visage régénéré. Une future visionneuse demandera des fichiers/URL autorisés, leur nature photo/vidéo, leurs aperçus, légendes et autorisations de diffusion ; elle n’est pas simulée ici.

Toutes les sources sont déjà publiques selon les règles existantes. Aucun ajout de route ou changement des protections. Dimensions réservées, chargement lazy et décodage async. La grande image Avant réutilise exactement l’URL du contact ; aucune copie lourde créée.

## Vérifications

- 41 tests Node réussis : 37 préexistants et 4 ciblés sur l’unicité des trois étapes, les textes FR/EN, la mosaïque sans faux contrôles et la logistique déplacée. Le test vidéo existant a uniquement reçu le nouveau marqueur de début de #parcours.
- node --check assets/site-translations.js et git diff --check.
- Site statique, sans script npm de compilation ; aperçu Vercel créé par le push de branche, projet existant purinstinct-web.
- Navigateur à 1440×900 et 390×844, FR/EN : pas de débordement horizontal, textes lisibles et complets, quatre vignettes chargées. Ordinateur : cartes de 427 px de large ; fin des cadres à y≈895 px dans les deux langues. Mobile : largeur 354 px, ordre vertical, aucun contrôle interactif fictif ; carte mosaïque entièrement lisible.
- Changement FR/EN : titres/descriptions et alternatives traduits, 2 000 élèves et Nom fictif conservés, base pilote toujours 20 000 CAD. Aucun courriel envoyé.
- Logistique dépliée en anglais : préparation, DJ/sonorisation, ballons laissés et matériel récupéré correctement traduits.
- Comparaison au HTML de main : tout le préfixe accueil/navigation/arène/panneaux/vidéo est identique, sauf version de l’URL CSS. Tout le suffixe offre/tarifs/configurateur/financement/contact est identique, sauf les deux paragraphes de logistique déplacés dans le volet existant.
- school-home.js, ecoles-contact.js, app-portal.js, ecoles.css, middleware.js, vercel.json et API de contact sont identiques à main. Politique commerciale du fichier de traductions inchangée ; seul un Object.assign de nouveaux textes est ajouté.
- Réduction des mouvements : même observateur conditionné à no-preference et survol CSS sous cette préférence. Audit du code ; pas de réglage système réel ni de téléphone physique.

## Fichiers modifiés

index.html ; assets/school-home.css ; assets/site-translations.js ; tests/school-video.test.mjs ; tests/school-journey.test.mjs ; documentation, captures et REPRISE-CODEX.md. Aucun autre composant, application ou média modifié.

Les captures propres sont prises sur le serveur local avec le même code ; l’aperçu Vercel est également contrôlé aux deux dimensions. La petite commande du Vercel Toolbar éventuellement visible dans l’aperçu authentifié ne fait pas partie de la section.
