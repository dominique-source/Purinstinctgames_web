# OIDC : configuration et vérification réelles

14 novembre 2026 — branche `codex/calendar-oidc`, issue de la branche calendrier. Les nouveaux téléphones de PR41 ne sont pas inclus. Aucune fusion dans main ni affectation au domaine public durant cette tâche.

## Résultat
La connexion OIDC fonctionne réellement depuis une fonction Vercel Production du projet existant, sans clé JSON. Les détails de configuration et de révocation sont dans [CONFIGURATION.md](CONFIGURATION.md).

Déploiement isolé READY : `dpl_EN6aj2cvre4WLjJ733WtxHS4jX8G`, code serveur commit15b1f86, créé avec `--prod --skip-domain`.
- [Gestion privée de vérification](https://purinstinct-99lrbd7c8-dominique-soucy-s-projects.vercel.app/calendar-admin.html).
- [Calendrier de vérification](https://purinstinct-99lrbd7c8-dominique-soucy-s-projects.vercel.app/#school-calendar).
- Protection Vercel Authentication conservée sur ce déploiement. Elle s’ajoute à l’authentification de l’application ; cette URL n’est donc pas annoncée comme accessible à un internaute anonyme.
- `purinstinctgames.com` reste sur le déploiement précédent `dpl_HCuYcpc44mCwwjqdB5DSDbjBCpBv`.

## Contrôles distants effectués
1. Connexion normale demandée pour dominique@purinstinct.com, courriel d’accès reçu dans ce compte, lien validé dans le navigateur. Session de l’app établie par `/api/verify`, sans fabriquer ni récupérer sa clé de signature.
2. Gestion privée ouverte après connexion : réponse authentifiée correcte et Vanier présente. L’adresse autorisée côté serveur est exactement dominique@purinstinct.com.
3. Activité de contrôle créée en **brouillon privé** sur Vanier, avec une note de contrôle sans donnée personnelle. Enregistrement confirmé, rechargement de la page, réouverture : titre, publication draft et note retrouvés. Ceci vérifie GET et PATCH via OIDC avec les deux seules permissions IAM.
4. GET de projection publique pendant la présence du brouillon : Vanier seule, zéro événement, ni titre de contrôle ni note privée dans la réponse. Les clés retournées sont zone/revision/demo/cohorts/schools/events/slots.
5. Brouillon de contrôle supprimé avec confirmation. Relecture indépendante depuis Firestore et depuis l’API : zéro événement, Vanier seule, places restantes9/10. Aucune date fictive publiée.
6. Véritable jeton temporaire Vercel Development soumis à STS : HTTP400 unauthorized_client, rejet explicite par la condition d’attributs. Aucun token Google accordé ; valeur des jetons jamais affichée.
7. Lecture directe anonyme de la base Firestore : HTTP403. Aucun droit client ouvert.
8. Compte calendrier : zéro clé utilisateur. Aucun fichier de clé privée calendrier créé. Aucune variable CALENDAR_SERVICE_ACCOUNT_KEY. Seulement quatre variables calendrier non secrètes, Production uniquement ; aucune en Preview/Development.
9. Facturation : billingEnabled=false, aucun compte de facturation associé. Aucune base ou permission de compétition modifiée.
10. Navigateur : gestion réelle à1440×1000 et390×844, FR/EN, valeurs du formulaire conservées et aucun débordement horizontal.

## Contrôles automatisés
- `node --test tests/*.test.mjs` : **96 tests réussis**, aucun échec.
- Les refus applicatifs sont testés sur le vrai handler serveur avec sessions de test : sans session GET/POST401, autre adresse signée403, purpose=magic401, Dominique avec session valide200, origine non autorisée403. Aucun faux compte ou faux cookie n’a été introduit dans le déploiement réel.
- Les visiteurs anonymes sur l’URL isolée sont arrêtés par la protection Vercel ; nous ne présentons pas ce refus de plateforme comme la preuve d’un403 applicatif distant.
- Publication/dépublication et filtrage public des champs ont également leurs tests unitaires. Le test distant n’a publié aucune activité fictive.
- Dépendances OIDC officielles ; correctifs transitifs compatibles appliqués. `npm audit --omit=dev` : zéro vulnérabilité.
- Pas de build de framework dans ce site statique ; le build Vercel du déploiement isolé est READY.

## Secrets et effet secondaire corrigé
`vercel curl` a créé automatiquement un secret de contournement persistant en essayant l’accès protégé. Il n’a pas servi à valider la connexion OIDC. Ce seul secret a été identifié par son instant de création, révoqué sans régénération et son absence vérifiée. La protection SSO est restée active ; aucune variable VERCEL_AUTOMATION_BYPASS_SECRET n’a été ajoutée. Aucune valeur n’a été affichée. Les tests navigateur ont utilisé la connexion normale.

La CLI a aussi rétabli sa session Vercel habituelle et créé un fichier local de jeton **Development temporaire**, protégé en0600 et exclu de Git. Ce jeton n’a pas accès à la base calendrier, comme le test négatif réel le confirme. La règle générale d’exclusion des fichiers.env est conservée.

## Captures
Captures de l’administration authentifiée pendant le contrôle, avant suppression du brouillon jetable :
- [Ordinateur](captures/oidc-admin-desktop.png).
- [Téléphone EN](captures/oidc-admin-mobile.png).

## Étapes restantes
L’intégration OIDC est opérationnelle sur le déploiement isolé. Fusionner les branches calendrier/OIDC et affecter la version validée à purinstinctgames.com reste une étape de publication distincte ; le nouveau visuel bracelet/téléphones conserve sa PR séparée et sa consigne de non-publication avant validation. Après publication, refaire les contrôles sur le domaine public et vérifier une lecture réellement anonyme au-delà de la protection de staging.

Aucun échec OIDC ni besoin de clé permanente restant. Les seules limites de vérification sont explicitées ci-dessus (visiteur anonyme arrêté par la plateforme, pas de second compte réel utilisé pour provoquer403 applicatif).
