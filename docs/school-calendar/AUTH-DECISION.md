# Proposition d’authentification — autorisation en attente

Audit du 14 novembre 2026, lecture seule. Aucune clé créée, aucun pool configuré, aucun changement IAM ou de déploiement effectué pour cet audit.

## Constat vérifié
- Vercel : projet purinstinct-web, prj_JV1BLXQpq12GTYjBsYlaSwpBuBRf ; équipe team_u1gqksE34V1k4RRhLyoE5hok, dominique-soucy-s-projects.
- Découverte publique OIDC de l’équipe : HTTP200, issuer https://oidc.vercel.com/dominique-soucy-s-projects.
- L’API projet ne renvoie pas de configuration OIDC explicite : ne pas déduire qu’elle est désactivée, ni prétendre qu’un jeton de fonction a été vérifié.
- Google : projet purinstinct-school-calendar (949360956465), base dédiée canadienne, facturation désactivée lors du contrôle précédent.
- calendar-server@purinstinct-school-calendar.iam.gserviceaccount.com : zéro clé utilisateur, aucun pool de fédération ; STS API désactivée, IAM Credentials API activée.
- Rôle direct actuel dans ce projet : roles/datastore.user. Aucun rôle direct trouvé pour ce compte dans les politiques des 20 autres projets Firebase accessibles, toutes lisibles. Ce contrôle ne constitue pas un audit global des héritages IAM d’organisations ou des ressources extérieures non listées.

## Permissions exactes du rôle actuel (réponse IAM)
```
appengine.applications.get
databasesconsole.locations.get
databasesconsole.locations.list
databasesconsole.studioQueries.create
databasesconsole.studioQueries.delete
databasesconsole.studioQueries.search
databasesconsole.studioQueries.update
datastore.databases.get
datastore.databases.getMetadata
datastore.databases.list
datastore.entities.allocateIds
datastore.entities.create
datastore.entities.delete
datastore.entities.get
datastore.entities.list
datastore.entities.update
datastore.namespaces.get
datastore.namespaces.list
datastore.schemas.list
datastore.statistics.get
datastore.statistics.list
resourcemanager.projects.get
resourcemanager.projects.list
```
Ce rôle est plus large que nécessaire pour le code actuel.

## Option recommandée : OIDC Vercel → Google Workload Identity Federation
La documentation Vercel prévoit cette connexion GCP sur tous les plans. Les jetons temporaires remplacent une clé privée JSON. Le code actuel exige encore CALENDAR_SERVICE_ACCOUNT_KEY : il faudra adapter l’adaptateur, sans créer cette variable, et vérifier l’échange réel avant de déclarer la connexion opérationnelle.

Après autorisation seulement :
1. Activer STS dans le projet dédié, créer un pool/fournisseur OIDC avec issuer et audience explicites.
2. Restreindre les assertions aux identifiants exacts owner_id=team_u1gqksE34V1k4RRhLyoE5hok, project_id=prj_JV1BLXQpq12GTYjBsYlaSwpBuBRf et environment=production ; également restreindre le sujet attendu. Pas de principalSet global sur le pool, ni toutes les équipes/projets/environnements.
3. Donner roles/iam.workloadIdentityUser à ce seul principal sur calendar-server pour l’emprunt d’identité. Ce rôle n’est pas un droit d’administration du projet.
4. Remplacer roles/datastore.user par un rôle personnalisé contenant seulement datastore.entities.get et datastore.entities.update, sur le projet calendrier. L’initialisation existe déjà ; les créations/suppressions d’écoles modifient le JSON du document, pas les documents Firestore. Tester GET/PATCH et refus des autres opérations. Ne pas ajouter create/delete/list ou des droits IAM silencieusement si un test échoue.
5. Demander des jetons Google d’une durée de 15 minutes, renouvelés automatiquement par le serveur. Ne jamais journaliser jeton ou en-tête Authorization.

## Limites de sécurité à garder explicites
Les droits documentaires IAM s’étendent à la base du projet dédié ; le chemin schoolCalendar/state du code n’est pas une restriction IAM par document. La séparation des projets constitue donc la barrière vis-à-vis des compétitions. Ne pas déposer d’autres données dans ce projet ni accorder ce compte ailleurs. Les règles clients restent fermées ; le serveur utilise IAM et ne dépend pas de ces règles pour ses propres droits.

L’identité OIDC est celle du projet/environnement Vercel, pas d’une fonction individuelle. L’autorisation humaine de gestion reste contrôlée séparément par session existante et CALENDAR_ADMIN_EMAILS=dominique@purinstinct.com.

## Environnements
- Production de purinstinct-web : accès via OIDC temporaire ; seuls des identifiants de configuration non secrets sont à ajouter (pool, fournisseur, compte serveur, projet). Aucun secret calendrier permanent.
- Preview / Development : pas d’accès à la base réelle et pas de secret de production. Les essais préparatoires peuvent utiliser les doubles locaux ; la vérification réelle peut se faire sur un déploiement de production non affecté au domaine, sans publier de données fictives. Un environnement de test distant séparé demanderait une configuration et une autorisation distinctes.
- Aucun changement aux secrets existants de connexion/courriel ni à l’application de compétition.

## Révocation et renouvellement
OIDC : retirer le lien workloadIdentityUser ou désactiver le fournisseur pour arrêter les nouveaux échanges. Pour bloquer aussi l’accès des jetons déjà émis, retirer le rôle Firestore ou désactiver le compte ; les changements IAM ne sont pas instantanés. Ne pas promettre une coupure immédiate : surveiller les refus jusqu’à confirmation. Les jetons expirent automatiquement, aucune clé à renouveler manuellement.

Si une clé permanente devenait indispensable après un échec technique documenté : nouvelle autorisation avant création ; stockage Secret serveur Vercel Production uniquement, aucun Preview/Development. Rotation : nouvelle clé → nouveau déploiement testé → désactivation de l’ancienne → contrôle → suppression. Révocation urgente : désactiver la clé et au besoin le compte/son rôle. Supprimer une variable Vercel seule ne révoque pas la clé Google. Aucun retour automatique vers cette option.

## Décision demandée
Autoriser uniquement la configuration OIDC, le rôle minimal et l’adaptation du serveur, sans clé permanente, sans activation de facturation/service payant. Vérification complète obligatoire avant toute fusion ou publication ultérieure. Si un prérequis exige facturation ou un élargissement de droits, arrêter et présenter le besoin précis.

Sources :
- https://vercel.com/docs/oidc/gcp
- https://vercel.com/docs/oidc/reference
- https://firebase.google.com/docs/firestore/security/iam
- https://docs.cloud.google.com/iam/docs/workload-identity-federation
- https://docs.cloud.google.com/docs/security/compromised-credentials
