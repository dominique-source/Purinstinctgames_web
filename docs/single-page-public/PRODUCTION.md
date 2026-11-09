# Mise en production — 9 novembre 2026

Publication autorisée par l’utilisateur, réalisée via GitHub/Vercel existants.

- URL publique : https://purinstinctgames.com/
- Fusion : PR #28, merge commit main 8302de7aef95983484915574fee7b50ec0b6dc2f.
- Tous les commits des branches commerciales, vidéo et parcours unifié sont inclus par ascendance dans main. PR #25 reconnue fusionnée ; #26 et #27 clôturées comme redondantes après vérification de leur inclusion, sans supprimer leurs branches.
- Vercel : projet purinstinct-web (prj_JV1BLXQpq12GTYjBsYlaSwpBuBRf), équipe dominique-soucy-s-projects.
- Déploiement : dpl_GnYBDN3GcNQ6H6LUpvdKkusoinjc, READY, target production, branche main, commit exact ci-dessus. Build d’environ 13 secondes hors attente.
- Alias confirmés par Vercel : purinstinctgames.com et purinstinct-web.vercel.app, sans création de projet ou d’adresse.

## Vérifications après publication

- 37 tests Node réussis avant fusion ; diff propre. Aucun fichier applicatif, API de contact ou protection modifié dans cette livraison.
- Domaine public ouvert dans le navigateur à 1440×900 et 390×844, sans écran de connexion par courriel.
- Cinq zones et terrain distinct : image correcte, une sélection/panneau à la fois, boutons de choix sur place, aucun débordement horizontal. Panneau mobile à y=80 px sous l’en-tête ; sélection sans changement de scroll ; fermeture et focus restaurés.
- FR/EN : texte du panneau traduit, choix conservé ; saisies Nom et effectif conservées, récapitulatif mis à jour. 2 000 élèves donnent uniquement une base pilote de 20 000 CAD ; aucun budget à 25 $.
- Contact : un seul formulaire, mêmes champs/endpoint ; lien du menu et bouton de rencontre mènent sur place. Formulaire à y≈84 px sous l’en-tête. Une tentative vide est bloquée par les champs obligatoires et focus Nom.
- API réelle : POST {} vers /api/schools-contact retourne HTTP 400 et {"ok":false}, donc aucun courriel déclenché. Le succès d’envoi, l’échec et le contenu transmis au destinataire restent couverts par fetch simulé dans les tests. Aucun test de délivrabilité réelle ni courriel réel envoyé.
- APP : ouvre le portail existant des trois compétitions sans connexion ; Précédent retrouve la page publique précédente et conserve les réglages sur ordinateur et mobile. Le lien accessible du logo a été activé au clavier aux deux tailles : retour à l’accueil public publié, via son alias existant https://purinstinct-web.vercel.app/.
- HTTP accueil : 200, cache-control public,max-age=0,must-revalidate ; déploiement/alias confirmés côté Vercel.
- Captures de production enregistrées à côté de ce rapport. Les tests mobiles utilisent un viewport de navigateur, pas un téléphone physique. Reduced-motion était testé par simulation avant fusion.

Les extraits MP4 des zones restent protégés/non activés, conformément à MEDIAS.md. Les images publiques sont fonctionnelles. Aucune nouvelle règle commerciale, donnée de participant ou session n’est modifiée.

Ce commit ne contient qu’un compte rendu et des captures de vérification ; le code publié reste le merge 8302de7 sur main.
