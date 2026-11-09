# Vidéo du parcours scolaire —9novembre2026

Dépôt dominique-source/Purinstinctgames_web. Branche codex/school-video, base b1ec296 de feat/schools-pilot-pricing-20261109 (PR25 commerciale non fusionnée). PR vidéo empilée :son diff doit se lire contre cette branche parente pour isoler l’ajout vidéo. Ne pas fusionner ni déployer en production.

## Audit et intégration

- Accueil réel :index.html, scène immersive/terrain dans la première section ;programme existant sous #parcours. Une seule nouvelle section #video-games insérée entre ces deux blocs.
- Pas de mécanisme de consentement vidéo/CMP repéré sur l’accueil ou dans ses scripts. Aucun mécanisme existant retiré ou contourné.
- Chemins déjà publics réutilisés :assets/ecoles.css,assets/school-home.js,assets/site-translations.js. Aucun nouvel actif local ou exception de middleware, aucun téléchargement/réhébergement de vidéo.
- Métadonnées officielles YouTube oEmbed consultées :vidéo chfQomu8rZ4, miniature réelle https://i.ytimg.com/vi/chfQomu8rZ4/hqdefault.jpg,480×360. Elle reste entière avec bandes noires dans le cadre9:16 ;aucune image fabriquée ou fausse description ajoutée.
- Textes FR/EN fournis repris dans le mécanisme de traduction existant. Le titre accessible de l’iframe est mis à jour sans réassigner src ni recréer le lecteur.
- Avant clic :bouton natif accessible, miniature lazy et lien YouTube permanent. Aucun iframe ou script YouTube avant interaction. L’image distante n’est pas un script.
- Après clic :iframe youtube-nocookie.com/embed/chfQomu8rZ4, autoplay1 uniquement après activation volontaire, controls1,playsinline1,loop0,allowfullscreen. Sons/contrôles du lecteur non remplacés. Pas de lecteur flottant.
- Plein écran natif proposé après activation si l’API existe, car l’interface Shorts ne rend pas toujours son bouton. Aucun lancement automatique du plein écran ;erreur traduite en cas de refus. Échap et commandes système restent la sortie native.
- Mise en page desktop :vidéo à gauche, texte et CTA à droite ;hauteur64svh plafonnée600px. Mobile :introduction, vidéo centrée, CTA ;58svh plafonné520px. La vidéo n’est ni étirée ni recadrée.
- Animation légère au défilement et agrandissement de l’icône seulement, sous prefers-reduced-motion:no-preference. Les contrôles et le cadre vidéo ne sont pas déformés.

## Fichiers

- index.html :section vidéo et liens réels, avant le programme.
- assets/ecoles.css :styles vidéo scoped et médiaqueries.
- assets/school-home.js :gestion au clic, focus, langue et demande native de plein écran.
- assets/site-translations.js :uniquement les nouvelles expressions vidéo.
- tests/school-video.test.mjs :cinq tests du comportement réel du bloc JS et du HTML.
- docs/school-video :ce rapport, tests et captures.

Comparaison automatisée avec la branche parente :retirer la seule section vidéo redonne exactement l’ancien index.html ;tout le code préexistant des trois assets est un préfixe inchangé. Aucun changement de tarifs/configurateur/contact, middleware/vercel.json, API, APP, application technologique, bracelets, compétitions ou données. Aucun parcours bloqué réactivé.

## Vérifications

- `node --test tests/*.test.mjs` :23/23 réussis, dont18 tests préexistants. Chargement à la demande, doubleactivation sans second iframe, focus, langue sans réécriture de src, erreur miniature, erreur lecteur, fullscreen natif et refus simulés, section unique et liens.
- Syntaxe JS et git diff --check réussis. Site statique sans script build local.
- Navigateur1440×900 :avant clic0iframe/0scriptYouTube, miniature chargée480px ;cadre324×576, top144/bottom720 après stabilisation, donc entièrement visible. Pas de débordement.
- Navigation clavier :Enter sur Lire la vidéo, focus observé sur IFRAME.
- **Lecture réelle intégrée vérifiée** dans le navigateur :lecteur YouTube, commandes et barre de progression ;progression passée de79 à80 pendant le changementFR→EN. Titre accessible devenu anglais,src inchangée. Il s’agit d’une progression observée, pas d’une durée revendiquée pour la vidéo.
- Mobile390×844 :cadre275,35×489,52 (9:16), ordre texte→vidéo→CTA, aucun débordement horizontal. La section complète reste défilable ;le bouton programme vient après le lecteur, sans superposition.
- Lien Voir sur YouTube activé au clavier :nouvel onglet ouvert sur https://www.youtube.com/shorts/chfQomu8rZ4, vidéo attendue retrouvée.
- CTA :URL #parcours et titre du programme visible. Scroll-margin76px préexistant conservé ;aucune réécriture de l’ancre.
- Six zones du terrain ouvertes, libellés et fermetureÉchap contrôlés après l’ajout.
- Aucun envoi de formulaire ni écriture de données. La recette du formulaire/tarifs existante reste dans les18tests et la PR parente.

## Limites

YouTube est un service externe :intégration et lecture ont fonctionné pendant cet essai, sans garantie de disponibilité/autorisation future ou sur chaque réseau scolaire. Le lien externe reste visible même si l’iframe charge une erreur YouTube qui ne déclenche pas l’événement réseau error.

L’API Fullscreen est câblée et ses succès/refus sont testés avec simulation ;la demande a été déclenchée dans IAB mais l’entrée visuelle en plein écran n’a pas été confirmée. À tester sur le navigateur réel de l’école. Le mode système reduced-motion et un téléphone physique n’ont pas été exercés ;leurs branchements et styles ont été audités, pas présentés comme une validation matérielle.

Aperçu local :http://127.0.0.1:4182/?lang=fr#video-games . Serveur statique existant sur4182 ;aucune production modifiée. Révision FR/EN :?lang=en#video-games. Captures dans captures/.
