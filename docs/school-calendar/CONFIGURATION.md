# Configuration distante — non réalisée

L’audit a trouvé l’authentification par courriel existante, mais aucun stockage commercial du calendrier ni liste de gestionnaires. Aucun secret n’a été déchiffré, aucun droit n’a été ajouté et aucune base de compétition n’a été modifiée.

## Paramètres indispensables
Configurer côté serveur Vercel, séparément pour Preview puis Production lors d’une validation ultérieure :

| Variable | Valeur à fournir par l’opérateur |
| --- | --- |
| `CALENDAR_ADMIN_EMAILS` | Adresses exactes des gestionnaires, séparées par des virgules. Aucun compte n’a été supposé. |
| `CALENDAR_FIRESTORE_PROJECT_ID` | Projet Google Cloud/Firebase dédié au calendrier commercial, avec Firestore natif `(default)`. |
| `CALENDAR_SERVICE_ACCOUNT_KEY` | JSON du compte de service serveur autorisé uniquement sur cette base dédiée. Secret Vercel ; jamais dans le client ni dans Git. |
| `AUTH_SECRET` | Secret existant de signature des sessions, conservé inchangé. |

Le compte administrateur doit également être autorisé dans la liste de connexion existante du site. Réutiliser le parcours `request-access` / `verify` sans élargir l’accès à tous les comptes connectés. Ne jamais copier la clé de délégation Gmail pour lui ajouter de nouveaux droits. Ne pas créer de variable publique `NEXT_PUBLIC_*` / `VITE_*` pour ces paramètres.

## Base et initialisation
1. Utiliser un projet dédié, sans données d’élèves/compétition. Le compte de service n’a besoin que des opérations Firestore documentaires sur ce projet ; limiter les permissions IAM à ce besoin. Les permissions IAM serveur contournent les règles client : le cloisonnement du projet est indispensable.
2. Appliquer `firestore.rules` **uniquement dans ce nouveau projet** : aucun accès direct client. Ne pas appliquer ces règles dans une base existante de compétition.
3. Exporter les variables dans un environnement opérateur sécurisé, puis lancer manuellement `node scripts/calendar-init.mjs --initialize-dedicated-calendar`.
4. Le script lit avant d’écrire. S’il existe déjà un état, il ne fait rien. La création utilise `currentDocument.exists=false` : aucune réinitialisation concurrente ni remplacement des données existantes. Il initialise uniquement Vanier sans dates et les deux cohortes.
5. Vérifier la connexion réelle de l’administrateur, une création en brouillon, publication, dépublication et confidentialité sur une Preview avant d’envisager la production. Les démonstrations ne peuvent pas être écrites par l’adaptateur distant.

Stockage : document `schoolCalendar/state`, payload JSON versionné (`schema:1`) et révision. Les mises à jour utilisent la précondition Firestore `updateTime`. Un conflit retourne 409, sans écraser une autre modification. La projection GET publique utilise une liste explicite de champs ; contacts, notes et brouillons restent privés. POST impose session signée, rôle explicite, origine identique et JSON. Aucun cache public des réponses.

Cette architecture est adaptée à un petit calendrier commercial, pas à la télémétrie RFID : limite Firestore de taille d’un document, lectures globales et écritures concurrentes signalées plutôt que fusionnées. Prévoir une migration par collections si le calendrier grossit.

Références : [API REST Firestore](https://firebase.google.com/docs/firestore/use-rest-api), [préconditions d’écriture](https://firebase.google.com/docs/firestore/reference/rest/v1/Precondition).

## État vérifié ici
La persistance locale et les contrôles de l’API sont testés. Le transport Firestore et ses préconditions ont des tests simulés ; **aucune synchronisation distante ni connexion réelle administrateur à cette nouvelle gestion n’a été vérifiée**, faute des trois variables dédiées. Aucun déploiement ou changement de configuration Vercel n’a été effectué.
