# Configuration active : OIDC sans clé permanente

Voir [OIDC-STATUS.md](OIDC-STATUS.md) pour les contrôles réels du 14 novembre 2026. L’ancienne proposition de clé JSON est remplacée par la fédération autorisée dans [AUTH-DECISION.md](AUTH-DECISION.md). Ne jamais créer `CALENDAR_SERVICE_ACCOUNT_KEY`.

## Infrastructure effective
- Projet Vercel existant : `purinstinct-web`, `prj_JV1BLXQpq12GTYjBsYlaSwpBuBRf`, équipe `team_u1gqksE34V1k4RRhLyoE5hok`.
- Google : `purinstinct-school-calendar`, numéro949360956465 ; Firestore `(default)`, `northamerica-northeast1`, STANDARD/freeTier, aucune facturation associée.
- Compte : `calendar-server@purinstinct-school-calendar.iam.gserviceaccount.com`.
- Pool : `vercel-calendar` ; fournisseur : `purinstinct-web-production`.
- Émetteur : `https://oidc.vercel.com/dominique-soucy-s-projects` ; audience autorisée : `https://vercel.com/dominique-soucy-s-projects`.
- Contraintes cumulatives : owner_id équipe exact, project_id exact, environment=production, sub=`owner:dominique-soucy-s-projects:project:purinstinct-web:environment:production`.
- Le seul principal correspondant possède `roles/iam.workloadIdentityUser` sur le compte calendrier. Aucun principalSet général.
- Rôle personnalisé `projects/purinstinct-school-calendar/roles/calendarDocumentAccess` : `datastore.entities.get` et `datastore.entities.update` uniquement. L’ancien rôle `roles/datastore.user` a été retiré du compte calendrier.

## Variables Vercel — Production uniquement, toutes non secrètes
| Nom | Valeur |
| --- | --- |
| CALENDAR_ADMIN_EMAILS | dominique@purinstinct.com |
| CALENDAR_FIRESTORE_PROJECT_ID | purinstinct-school-calendar |
| CALENDAR_SERVICE_ACCOUNT_EMAIL | calendar-server@purinstinct-school-calendar.iam.gserviceaccount.com |
| CALENDAR_OIDC_PROVIDER | projects/949360956465/locations/global/workloadIdentityPools/vercel-calendar/providers/purinstinct-web-production |

Aucune variable calendrier en Preview/Development. OIDC est activé sur le projet Vercel en mode issuer équipe. Les identifiants ci-dessus ne sont pas des credentials ; l’autorisation dépend des assertions signées et validées par Google. Les secrets préexistants de connexion et courriel restent inchangés.

## Serveur
`lib/calendar/oidc.js` emploie `@vercel/oidc` et `google-auth-library`, endpoints Google fixes et scope datastore. Les jetons Google sont demandés pour900secondes et renouvelés par la bibliothèque ; les requêtes concurrentes sont regroupées. Aucun retour vers une clé JSON ni journalisation des credentials. Les erreurs d’échange sont expurgées avant la réponse API.

Les accès fonctionnent uniquement avec la configuration dédiée exacte et VERCEL_ENV=production. Les tests locaux emploient le stockage de démonstration/injections unitaires sans accès à la base réelle.

## Données et migration
Document existant : `schoolCalendar/state`, payload JSON schema1 avec révision. GET public : liste explicite de champs ; brouillons, contacts et notes privés exclus. Écritures : contrôle de concurrence updateTime, session signée avec purpose=session, adresse autorisée côté serveur, origine identique et JSON. Aucune session fabriquée pour les tests distants.

Les droits IAM couvrent les documents de la base dédiée ; le chemin dans le code n’est pas une restriction IAM par document. La séparation avec les compétitions repose sur ce projet dédié et l’absence de rôles du compte ailleurs. Les règles clientes restent fermées. Ne rien stocker d’autre dans ce projet.

La base est initialisée avec Vanier sans dates. Le runtime ne peut pas créer ou supprimer de document Firestore : les opérations d’écoles/activités modifient le JSON existant. L’ancien outil d’initialisation est devenu une vérification en lecture (`--verify-existing-calendar`) ; une nouvelle migration doit être réalisée séparément par un opérateur autorisé, sans ajouter de droits au runtime.

## Révocation
Désactiver le fournisseur ou retirer le lien workloadIdentityUser bloque de nouveaux échanges. Pour bloquer aussi les appels des jetons déjà émis, retirer le rôle documentaire ou désactiver le compte. Prévoir la propagation IAM ; vérifier les refus jusqu’à confirmation. Les jetons expirent et se renouvellent automatiquement : aucune rotation manuelle de clé JSON.
