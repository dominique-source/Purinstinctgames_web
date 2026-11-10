# APP À venir et accès privé — production vérifiée

Dépôt : dominique-source/Purinstinctgames_web.
Checkout : /Users/client/Documents/ChatGPT/purinstinct-web-app-review.
PR31 fusionnée à la demande de Dominique : https://github.com/dominique-source/Purinstinctgames_web/pull/31
Main production :34a899f31f260919208bd54e8b01b1e202a625b3.
Vercel : projet existant purinstinct-web (prj_JV1BLXQpq12GTYjBsYlaSwpBuBRf), équipe dominique-soucy-s-projects, déploiement dpl_5ctqPh41M7srPz7T6TZNPBs93MVS READY, confirmé via purinstinctgames.com.

## Comportement publié
APP reste à son emplacement, avec un bouton HTML actif. Il affiche « À venir au printemps 2027 » / « Coming spring 2027 » dans un dialogue sombre/cyan. Aucun changement d’URL, aucune connexion, aucun onglet ouvert au clic. Clavier, Échap, fermeture extérieure, commande Fermer/Close, focus initial et retour du focus. Animation150ms coupée sous prefers-reduced-motion.
Configuration centrale : PI_APP_ENTRY dans assets/app-portal.js. Mode actuel coming-soon ; accessible rétablit la navigation native vers /app avec la transition existante. Le réglage ne désactive jamais l’authentification.

## Protection effective
Le projet APP existant prj_brDgTZAXC0wiTj1o35I5YGNDeFkM utilise Vercel Authentication ssoProtection.deploymentType=all, domaines de production ET aperçus. Identités/droits existants conservés, aucun utilisateur ajouté ni achat/mot de passe créé.
Le proxy public a été retiré de vercel.json. /app et /app/* sur le site web redirigent307no-store vers l’origine fixe https://purinstinct-app.vercel.app, en préservant chemin et paramètres. Le navigateur utilise sa connexion Vercel sur l’origine protégée ; aucune deuxième connexion courriel du site nécessaire. Aucun secret de contournement client. Les protections pig_session des autres routes privées du site restent en place.
Accès propriétaire : https://purinstinct-app.vercel.app/app/ — connexion avec le compte Vercel existant. Le compte connecté au service est le propriétaire Dominique Soucy. Le navigateur déjà connecté a ouvert l’accueil, la section École et le trajet public /app → origine privée après activation ALL. Une nouvelle saisie de mot de passe/déconnexion-reconnexion n’a pas été effectuée ; accès confirmé dans la session existante seulement.

## Vérifications
54/54 tests Node passent, syntaxe JS et git diff check réussis. Build preview f1a9079 puis build production34a899f READY.
- Anonyme, accueil public :200, nouveau bouton présent.
- Anonyme, /app/?lang=en sur site public :307 vers l’origine fixe avec paramètre conservé.
- Neuf requêtes anonymes sur APP, section, gestion, projection, image, API d’envoi, deux aliases secondaires et URL immuable :302 vers Vercel SSO. Voir ANONYMOUS-ACCESS.json. Aucun POST ni mail réel.
- Navigateur réel :1440×900 et390×844 ; APPFR/EN, clavier, Échap, fermeture et retour du focus, URL stable, pas de débordement.
- Session connectée : accueil et section École accessibles ; parcours hébergé depuis aperçu et site public vers app privée validé ; Précédent revient à la page publique.
- Site public, parcours scolaire, tarifs, configurateur et formulaire inchangés par cette PR.

## Données et limites
Aucune donnée, règle Firebase ni identité modifiée. Le dépôt APP et son travail RFID sont préservés.
Lecture autorisée des seules règles historiques purinstinct-games : .read/.write conditionnés à now<1782705600000 (29juin2026), donc déjà fermés. Elles diffèrent du fichier du dépôt, qui n’a pas été déployé. L’endpoint des règles refuse les requêtes anonymes403. Le connecteur ne déchiffre pas les variables Firebase sensibles du build : cette intervention ne certifie pas le projet effectif de ce bundle, ni la synchronisation Firebase des parcours historiques. La démo manuelle reste accessible ; aucun fonctionnement temps réel n’est revendiqué.
L’API mail existante est désormais derrière la protection plateforme ALL ; sa clé client ne doit toujours pas être considérée comme une authentification autonome. Ne pas retirer cette protection sans remplacer les contrôles applicatifs.
Un appel web_fetch_vercel_url a été refusé par l’approbation automatique car il aurait créé un lien de partage23h. Aucun lien n’a été créé ; les vérifications ont été terminées par la session existante et des requêtes anonymes, sans contourner ce refus.

## Fichiers et preuves
Code : index.html, zones.html, concept.html, pur-id.html ; assets/app-portal.js/.css ; deux entrées de assets/site-translations.js ; middleware.js, vercel.json ; tests associés. Aucun changement des fichiers de calcul ou d’envoi du formulaire.
Captures de production dans captures/ : public-app-desktop-fr.jpg, public-app-mobile-en.jpg, private-access-desktop.jpg, private-access-mobile.jpg. Les premières captures desktop-fr/mobile-fr précédentes sont locales, conservées comme référence de revue.
Exécution locale, pas de continuité cloud autonome promise. Branche de travail et notes poussées pour reprise.
Prochaine action : aucune pour cette publication ; les futurs changements Firebase/temps réel restent une mission séparée à vérifier sans ouvrir les règles.
