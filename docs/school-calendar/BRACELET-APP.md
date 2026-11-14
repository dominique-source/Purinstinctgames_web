# Remplacement du visuel bracelet — revue uniquement

Branche : codex/wristband-app-preview, basée sur codex/school-calendar-wristband (c28e30a). Aucun changement de production ni de configuration cloud pour cette tâche.

## Origine des images
- Bracelet : fichier officiel existant `assets/school-calendar/wristband.webp`, octets inchangés.
- Téléphones : extraits de « Bracelet et écrans sportifs.png » fourni dans le chat, original conservé dans `source/bracelet-app-reference.png`. WebP qualité94, sans génération ni modification des écrans.
- Desktop : paire de téléphones ; mobile : recadrages individuels empilés pour la lisibilité. Les titres, phrase, mention et signature de la référence ont été exclus des recadrages et recomposés en HTML traduisible.
- Les anciens WebP des joueuses sont conservés comme ressources ; ils ne sont plus référencés par cette section.

Les composants de classement/participants du dépôt app ont été examinés en lecture seule. Ils ne correspondent pas à ces deux maquettes et n’ont pas été modifiés. Les téléphones sont donc qualifiés explicitement de **maquettes illustratives**, pas de captures d’une fonctionnalité vérifiée. Données fictives/abrégées issues de la pièce jointe, aucun accès à des données d’élèves. Aucun lien ni interaction vers APP.

## Limite linguistique
Les textes HTML et les alternatives sont FR/EN. Les libellés incrustés dans les téléphones restent français, seule version fournie. Les alternatives anglaises précisent ce fait. Aucune traduction graphique inventée.

## Vérifications
- 92 tests Node réussis, 0 échec.
- Comparaison directe avec c28e30a : HTML hors section bracelet strictement identique ; image officielle strictement inchangée.
- Navigateur : 1440×1000 et 390×844, disposition, chargement des images, absence de débordement, textes FR/EN.
- Passage EN avec 325 élèves et commentaire saisis : valeurs conservées, aucun message envoyé.
- Aucun nouveau script d’interaction, animation ou accès à l’app. Styles limités à `.school-wristband`.
- Site statique sans script build : tests et exécution navigateur servent de validation.

## Fichiers modifiés
`index.html`, règles bracelet de `assets/school-calendar.css`, `assets/site-translations.js`, liste des nouvelles images publiques dans `middleware.js`. Ajout de trois WebP optimisés, source originale, documentation et captures. Calendrier, calculs, formulaire, routes et application inchangés.

## Captures
- [Ordinateur FR](captures/bracelet-phones-desktop-view.png).
- [Mobile FR, haut](captures/bracelet-phones-mobile-top.png), [mobile FR, téléphones et signature](captures/bracelet-phones-mobile-bottom.png).
- [Mobile EN](captures/bracelet-phones-mobile-en.png).

Aperçu local : http://127.0.0.1:4184/#bracelet. Dépend du serveur local et du maintien de l’ordinateur allumé. Ne pas fusionner ni déployer avant validation explicite de ce remplacement.
