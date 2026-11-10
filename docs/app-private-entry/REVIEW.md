# APP à venir — revue, sans production

Dépôt dominique-source/Purinstinctgames_web. Branche codex/app-coming-soon-private-access, base main0f6626b. Checkout isolé /Users/client/Documents/ChatGPT/purinstinct-web-app-review : ancien checkout préservé car référence locale codex/match-full-width endommagée empêchant git fetch. Ce checkout temporaire est sauvegardé par commits/push ; il ne constitue pas une exécution cloud autonome.

## Changements
- APP devient un bouton HTML actif dans index/zones/concept/pur-id, même emplacement et style. Les anciennes pages scolaires redirigent déjà vers l’accueil public.
- assets/app-portal.js : réglage central PI_APP_ENTRY.mode = "coming-soon". Message FR « À venir au printemps 2027 », EN « Coming spring 2027 ». Dialogue natif modal, focus initial/retour, Échap, fermeture extérieure et bouton. Aucun préchargement, marqueur de session ou navigation dans ce mode.
- Pour réactiver la navigation : mode = "accessible" dans le même fichier. La destination reste /app ; la transition native précédente est conservée. Ce réglage ne modifie jamais l’authentification.
- assets/app-portal.css : traitement APP identique aux liens, dialogue sombre/cyan, animation150ms désactivée sous prefers-reduced-motion.
- assets/site-translations.js : deux entrées de traduction seulement ; aucune règle commerciale changée.
- middleware.js : retire toutes les exemptions /app, y compris bundles/images. Réutilise pig_session signé HMAC et sa durée existante. Cookie mal encodé refusé sans exception. Accueil et ressources publiques restent publics ; aucune nouvelle identité, aucun secret client.

## Tests locaux
53 tests passent : mode à venir FR/EN sans accès aux objets de navigation/préchargement/stockage ; fermeture et traduction ; mode accessible conservant navigation native, clics modifiés et retour ; refus de toutes routes APP sans session et acceptation d’une session signée synthétique, rejet expiré/falsifié/magic/malencodé ; maintien des ressources publiques. Les sessions synthétiques utilisent uniquement une clé de test non déployée. Tests commerciaux et formulaire inchangés passent.
Navigateur local : 390×844 et1440×900, clavier Entrée/Échap, clic APP, commande Fermer/Close et clic extérieur, retour du focus vers APP, aucun changement d’URL au clic, aucun débordement. FR/EN testés. Réduction des animations vérifiée dans la règle CSS (pas de changement du réglage système). Aucun message envoyé.

## Audit réel — accès privé complet PAS encore acquis
2026-11-10, requêtes anonymes sans cookie ni en-tête de contournement :
- https://purinstinct-app.vercel.app/app/ :200, app actuellement publique.
- https://purinstinct-5dnbx04p3-dominique-soucy-s-projects.vercel.app/app/ :302, URL de déploiement protégée.
- https://purinstinct-app.vercel.app/api/send-claim-code GET :405. Cela prouve que le gestionnaire est atteignable anonymement, PAS qu’un POST autorisé est vérifié. Aucun POST envoyé.
Production APP dpl_DhqYapm4VU6ErmJF5hJ1GUHBUvi6, projet prj_brDgTZAXC0wiTj1o35I5YGNDeFkM, mainf7877bcb. Alias également purinstinct-app-dominique-soucy-s-projects.vercel.app et purinstinct-app-git-main-dominique-soucy-s-projects.vercel.app (non testés individuellement).
Réglage observé Vercel ssoProtection.deploymentType=all_except_custom_domains. Il ne suffit pas à conclure que l’alias de production est protégé :200 constaté. Documentation : https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication

Dans /Users/client/Documents/ChatGPT/purinstinct-app (lecture seule, travail RFID et image locale préservés) :
- src/firebase.js appelle signInAnonymously.
- database.rules.json exige auth!=null pour lecture ET écriture de state. Une identité anonyme satisfait ce contrôle ; ce fichier seul ne protège donc pas des visiteurs non autorisés. Les règles réellement déployées n’ont pas été consultées ni modifiées.
- api/send-claim-code.js utilise x-internal-key conditionnel, décrit dans le code comme exposé au bundle client : ne constitue pas une authentification privée fiable.
Aucune donnée Firebase lue/écrite, aucun utilisateur ajouté. Ne pas présenter l’app ou les API comme entièrement privées après cette seule PR.

## Actions nécessaires avant validation de l’accès privé complet
1. Dans le projet Vercel EXISTANT purinstinct-app / équipe dominique-soucy-s-projects, configurer Vercel Authentication pour ALL deployments, y compris domaines de production, sans créer de lien public de partage ni désactiver les protections d’aperçu. Vérifier l’option disponible selon le forfait avant changement ; aucun achat autorisé. Contrôler toutes les aliases ci-dessus, anciennes URLs de déploiement et API : visite anonyme doit être refusée.
2. Vérifier avec le compte propriétaire déjà autorisé l’accès direct APP après authentification Vercel. Aucun compte propriétaire ni droit d’équipe inventé. Les moyens connectés de test Vercel doivent rester limités aux accès autorisés.
3. Le proxy public /app est protégé par cette PR via /access.html puis pig_session ; demander le lien avec l’identité DÉJÀ présente dans la feuille d’autorisation. Après validation du lien, ouvrir /app/. Ce trajet signé est testé localement avec identité fictive seulement. Confirmer en hébergement avec l’identité existante et vérifier que la protection Vercel de l’origine ne bloque pas le proxy ; sinon privilégier l’accès direct authentifié Vercel pour le développement avant toute activation future du bouton. Ne jamais ajouter une clé de contournement au navigateur.
4. Auditer les règles Firebase réellement publiées avec accès console autorisé. Définir les UID/rôles propriétaires existants avant toute restriction d’accès aux données ; auth!=null + auth anonyme n’est pas suffisant. Ne pas déployer de règles inventées qui bloqueraient les bracelets/stations ou sessions existantes.
5. Dans purinstinct-app, remplacer le contrôle x-internal-key du relais mail par une authentification serveur vérifiable et autorisée, une fois les identités/rôles confirmés (ou vérifier que la protection plateforme ALL couvre effectivement ce point d’entrée). Aucun envoi réel requis pour les tests négatifs.

Ces modifications externes/de l’app ne sont PAS appliquées ici : mission interdit une mise en production. PR à laisser en revue jusqu’à vérification des protections directes et de l’accès propriétaire. Le site public doit rester sans connexion.

## Mise en ligne déjà réalisée, distincte
PR30 fusionnée main0f6626b : trois cartes et configurateur, conformément à « rend tout live ». Vercel purinstinct-web dpl_E5VmDWKS8F99EqAzRW9tFYiycS6h READY, purinstinctgames.com. Calcul3200CAD + conservationEN confirmés en navigateur sur site réel. Aucun changement APP dans cette production.

Captures locales de revue : captures/desktop-fr.jpg, captures/mobile-fr.jpg. PR31 : https://github.com/dominique-source/Purinstinctgames_web/pull/31 (brouillon).

## Vérification hébergée finale
Aperçu code2c98952 : https://purinstinct-kq1jq37py-dominique-soucy-s-projects.vercel.app/ ; dpl_A31Wye4ND4Gkb5gUv98YBHz4Fth1 READY. Requête anonyme sur / et /app/ :302 vers Vercel SSO (cache-control no-store), donc aperçu privé. Ce refus intervient AVANT le middleware applicatif ; il ne prouve pas l’exécution de son contrôle HMAC sur l’aperçu. Aucun lien de partage ni contournement généré. Accès propriétaire réel non vérifié. Aperçu local vérifié : http://127.0.0.1:4183/ . Le checkout a été déplacé vers un dossier permanent distinct /Users/client/Documents/ChatGPT/purinstinct-web-app-review ; branche distante sauvegardée et dépôt ancien conservé.
Production cartes/configurateur également vérifiée à390px : champs et calcul conservés aprèsFR/EN, aucun débordement. Le formulaire a été contrôlé via tests et résumé, sans soumission réelle. Aucun changement APP publié.
