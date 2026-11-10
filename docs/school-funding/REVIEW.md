# Blocs supplémentaires et financement — revue

Dépôt : dominique-source/Purinstinctgames_web.
Branche : codex/funding-multiple-blocks, basée sur codex/interschool-menu-notice pour préserver le travail précédent. Le diff de cette revue exclut l’ajout au menu, conservé dans son propre commit. Aucune fusion ni publication en production.

## Audit et modifications

Ancienne case multiple-blocks et deux grands blocs financement repérés dans index.html. La case alimentait uniquement une indication de plusieurs blocs dans le moteur existant ; sa suppression ne modifie aucun prix. Les documents docs/schools-commercial/AUDIT.md, PRESENTATION.md et COMPTE-RENDU.md décrivent des pistes générales et distinguent la réduction pilote des aides externes. Aucun lien officiel confirmé et applicable n’a été identifié dans ces contenus. Aucun programme, partenaire, montant disponible ou lien externe ajouté.

La nouvelle invitation mène au formulaire existant avec son scroll-margin sous l’en-tête. Elle conserve le commentaire rédigé, ajoute une mention modifiable une seule fois et ne calcule ni n’envoie rien. La mention ajoutée est traduite tant qu’elle reste intacte ; les modifications personnelles sont conservées. L’ancien signal multipleBlocks reste pris en charge par le modèle pour compatibilité, mais les nouvelles saisies du site utilisent false ; les demandes supplémentaires passent par le message.

Cinq catégories compactes ouvrent un dialogue natif unique : icônes SVG décoratives, intitulés et +, titres et descriptions traduits par le système existant. Styles de dialogue réutilisés depuis les services ; fond inerte, fermeture clavier/bouton/extérieur, focus captif et restauré, verrouillage et restauration du défilement. Animation de 150 ms désactivée par prefers-reduced-motion. Aucune nouvelle page.

## Vérifications

- 74 tests Node réussis ; syntaxe JS et git diff --check.
- Navigateur : 1440 × 900 et 390 × 844, cinq titres et descriptions, FR/EN, absence de débordement horizontal.
- Fermeture Échap et bouton, retour du focus ; contrôle Tab dans le dialogue. Le clic extérieur est implémenté comme pour les services.
- Commentaire préexistant conservé ; deux clics n’ajoutent qu’une mention ; FR/EN conserve les saisies. Le formulaire se positionne à environ 80 px du haut sur ordinateur.
- Budget 200 élèves, 2 intervenants, 2 classes supplémentaires : 3 550 $ CA / 17,75 $ par élève avant et après le lien et FR/EN. Base initiale 2 000 $ CA. Aucun courriel envoyé.
- Le bloc tarifaire, l’animation, le modèle de calcul dans site-translations.js, les styles de l’estimateur, ecoles-contact.js, l’API, les accès APP et les autres sections sont préservés. Seules deux nouvelles ressources statiques sont ajoutées à la liste publique du middleware.

Pas de script build dans ce dépôt statique : suite Node et syntaxe exécutées. Réduction des animations vérifiée dans la règle CSS ; aucun changement de réglage système pendant cette revue.

## Fichiers

index.html ; assets/school-home.js (suppression des références à la case uniquement) ; assets/school-funding.js et .css ; assets/site-translations.js (nouveaux textes uniquement) ; middleware.js (ressources statiques) ; tests/school-funding.test.mjs et contrôles existants adaptés à la suppression de la case.

Aperçu local : http://127.0.0.1:4183/#financement. Exécution locale dépendante de l’ordinateur. Captures dans captures/ : financement et pop-up, ordinateur et téléphone.
