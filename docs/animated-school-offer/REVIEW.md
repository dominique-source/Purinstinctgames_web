# Parcours commercial scolaire animé

Branche : `codex/animated-school-offer` dans `dominique-source/Purinstinctgames_web`.
Base de revue : `codex/school-video` (PR #26), au-dessus de la PR commerciale #25, toutes deux encore ouvertes et non fusionnées lors de la vérification.

Aperçu Vercel vérifié : https://purinstinct-45hpy1352-dominique-soucy-s-projects.vercel.app/?lang=fr#offre-ecoles
Déploiement : dpl_F8fce8pUbC9gPiE922nq7mC6tQ9S, READY, environnement preview (`target: null`), commit 38a7e610eaf836448d5c61aeea53a95a9de58512. Projet existant purinstinct-web, équipe dominique-soucy-s-projects. Aucun merge ni déploiement production.

## Résultat

Une séquence commerciale unique remplace les anciens blocs tarifs, financement et configuration de l’accueil. Elle conserve les ancres historiques, les neuf champs, le calculateur centralisé, le formulaire existant et le récapitulatif joint au message. L’accueil immersif, ses six zones, la vidéo, le parcours APP, les accès et l’API de contact ne sont pas modifiés.

La présentation reprend les colonnes, la hiérarchie, les cadres cyan, les accents lime et les polices locales de la maquette. Les six services utilisent les icônes déjà présentes dans le projet. Photographie approuvée existante : `assets/school-home/action-ecole.webp` (850×660), recadrée dans un bandeau sur ordinateur, presque intégrale sur téléphone. Elle diffère de la photographie panoramique de la maquette. Le bandeau est plus haut pour conserver les visages ; les précisions commerciales et les champs avancés ajoutent de la hauteur par rapport à la maquette simplifiée.

## Correction prioritaire du tarif régulier

Le tarif de 25 $ est uniquement un repère de présentation, barré et secondaire à l’état final. Le compteur descend de 25 à 10 en 1,8 seconde, une fois par chargement, au seuil de visibilité de 40 %. Il n’écrit jamais dans les champs ni dans le budget. Le calculateur est immédiatement utilisable à 10 $ par élève, même avant la révélation.

Aucune multiplication de l’effectif par 25 n’existe dans le modèle final. Aucun total régulier n’est rendu dans le configurateur, le résumé de contact ou les commentaires transmis, en FR ou EN. Cette règle remplace les références régulières calculées présentes dans les versions antérieures de la PR #25 et de ses rapports historiques.

Personnel supplémentaire et déplacement sont inconnus et distincts : « À confirmer ». Le total n’est jamais assimilé à la base. Taxes, ratios d’encadrement et prix de vente du personnel ne sont pas inventés. Le financement externe n’est jamais soustrait automatiquement.

## Vérifications

- 30 tests Node réussis (`node --test tests/*.test.mjs`), syntaxe des deux scripts et `git diff --check`.
- Site statique sans script npm de compilation ; build Vercel de l’aperçu READY (environ 10 secondes après le début du build).
- Tests du code réel : tous les entiers 25→10, arrêt exact, seuil, exécution unique, réduction des mouvements, annulation au départ de page, clavier/limites des steppers, indépendance du budget, absence de totaux réguliers dans les résumés et POST FR/EN.
- Navigateur local et aperçu Vercel : 1440×900 et 390×844, absence de débordement, photo et champs lisibles, ordre mobile introduction → tarif → services → configuration/budget → financement → proposition.
- 200 élèves → 2 000 CAD ; 2 000 → 20 000 CAD, sans modifier les ressources ; montants conservés au changement FR/EN. Budget correct alors que la révélation est encore en attente.
- Retour par défilement : compteur reste à 10. Changement de langue/saisies : pas de relance.
- 36 adultes simultanés pour 35 déclarés : erreur visible et lien de proposition désactivé ; remise à 20 : lien rétabli.
- Saisie de zéro élève : message de validation, aucune base nulle ou NaN présentée.
- Commande plus au clavier : 200→201, base 2 010 CAD. Boutons 44×44 minimum ; champs éditables directement.
- Récapitulatif réel ouvert dans le formulaire, avec les neuf valeurs saisies, sans référence régulière. Aucun envoi réel : relais API couvert par fetch simulé dans les tests.
- Arène : ouverture Agilité et fermeture Échap ; six repères conservés. Vidéo : activation au clavier et lecteur youtube-nocookie avec commandes, sans boucle.
- Reduced-motion : branches testées avec préférence simulée, CSS audité ; réglage système réel et téléphone physique non testés. Sans JavaScript : état final et lien de formulaire présents dans le HTML (vérification statique).

## Fichiers

- `index.html` : séquence commerciale consolidée.
- `assets/ecoles.css` : styles limités à la nouvelle section et responsive.
- `assets/school-home.js` : steppers, révélation, suppression de l’affichage du budget régulier.
- `assets/site-translations.js` : traductions et modèle pilote uniquement pour les budgets/messages.
- Tests commerciaux/proposition/animation ; documentation et captures de revue ; `REPRISE-CODEX.md`.

L’exécution est locale. Les commits poussés et cette documentation permettent une reprise ; aucune continuité pendant l’arrêt de l’ordinateur n’est garantie.
