# Accès scolaire public ciblé

/app et /app/ ouvrent directement la plateforme scolaire de test HTTPS isolée. Le bouton App transmet la langue FR/EN et conserve une navigation native. Les routes opérationnelles imbriquées historiques (/app/admin, stations, bracelets existants) gardent leur destination de production : aucun déplacement de données local.

/ecran ouvre la saisie publique du classement dans ce même environnement. L’alias pi-ecole-test.vercel.app pointe vers la Preview scolaire app, avec seule exception de protection Vercel explicitement autorisée par Dominique. La gestion conserve sa connexion et ses permissions serveur ; lecture publique filtrée. Aucun secret dans ces liens.

110 tests site réussis. Preview précédente a4d02ac vérifiée en navigateur FR/EN bureau/mobile pour le bouton ; racines/app et paramètres couverts par tests après ajout. Backend Firestore/OIDC limité au projet test, pas calendrier/historique ; aucune fusion ni publication du code app en production dans ce changement. Recette physique Android/TV encore à faire. Publication ciblée des accès autorisée par Dominique ; vérifier les deux liens sur le domaine réel après déploiement.
