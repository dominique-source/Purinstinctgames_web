# Reprise — bracelet et calendrier scolaire

Dépôt : dominique-source/Purinstinctgames_web
Dossier : /Users/client/Documents/ChatGPT/purinstinct-web-app-review
Branche : codex/school-calendar-wristband (base main b3e3e52)

## Terminé
- Section bracelet bilingue et assets extraits des références approuvées, sources conservées.
- Calendrier public mensuel / agenda mobile, filtres, disponibilité explicite, détail et journée finale.
- État initial : École secondaire Vanier, Québec, participante sans dates ; deux cohortes de 10.
- Administration privée avec rôle explicite, CRUD, brouillons/publication, notes privées séparées.
- API serveur, adaptateur Firestore avec contrôle de concurrence, persistance locale de test.

## Vérifié
- 92 tests Node réussis au passage final.
- Navigateur : Vanier sans dates, comptes 1/10 et 0/10, filtre fictif, événement final.
- Administration locale : clinique fictive enregistrée, conservée après rechargement puis publiée.
- Aucun courriel envoyé ; aucune fusion ni publication en production.

## À terminer
- Vérifications FR/EN, captures et guide terminés (docs/school-calendar/STATUS.md).
- Clinique QA supprimée, données réelles Vanier inchangées.
- Branche poussée sur GitHub ; PR de revue en brouillon : https://github.com/dominique-source/Purinstinctgames_web/pull/40.
- main est restée à b3e3e52 ; aucune fusion. Les intégrations Vercel existantes ont lancé leurs aperçus de branche automatiquement.

## Blocage externe précis
Aucun stockage commercial calendrier n’est configuré dans Vercel. Variables requises : CALENDAR_ADMIN_EMAILS, CALENDAR_FIRESTORE_PROJECT_ID, CALENDAR_SERVICE_ACCOUNT_KEY. Ne pas utiliser la base des compétitions. L’environnement est local : pas de garantie de poursuite ordinateur éteint.

## Prochaine action
Lire docs/school-calendar/STATUS.md et CONFIGURATION.md. Après revue, configurer le stockage et la liste explicite des administrateurs sur une Preview, puis vérifier la connexion réelle. Ne pas fusionner ni déployer sans instruction.

## Reprise de publication — 13 novembre 2026
Le propriétaire valide le bracelet et le calendrier et autorise la configuration, la fusion et la production. Nouvelle vérification : dépôt propre, 92 tests réussis, aucune variable CALENDAR_* sur Vercel. Firebase CLI dispose d’un accès en lecture aux projets, mais aucun projet calendrier dédié n’existe.

La création proposée de `purinstinct-school-calendar` a été refusée par la vérification automatique avant exécution (création persistante et implications possibles de coûts/IAM, autorisation précise demandée). Aucune base n’a été créée, aucun secret ni droit modifié, aucune fusion ou production effectuée. Questions en attente : autoriser ce projet sans facturation/service payant ; confirmer l’adresse exacte administrateur.

Prochaine action : après ces réponses, créer/configurer le stockage dédié, vérifier le parcours authentifié réel sur Preview, puis fusionner la PR40 et vérifier la production ordinateur/mobile. Ne pas publier un calendrier non configuré.

## Configuration réelle — projet créé (14 novembre 2026)
Autorisations reçues : création du projet dédié sans facturation ni service payant ; administrateur exact dominique@purinstinct.com.
- Projet Firebase créé : purinstinct-school-calendar, numéro 949360956465.
- Firestore (default), northamerica-northeast1, STANDARD, freeTier=true. Billing API vérifiée : billingEnabled=false, aucun compte associé.
- Règles docs/school-calendar/firestore.rules publiées : clients refusés. Lecture directe anonyme : 403.
- Compte calendar-server@purinstinct-school-calendar.iam.gserviceaccount.com créé, rôle roles/datastore.user limité au projet calendrier.
- Initialisation conditionnelle effectuée via le compte Firebase connecté : Vanier seule, zéro événement, places restantes 9 et 10.
- Vercel purinstinct-web : CALENDAR_ADMIN_EMAILS et CALENDAR_FIRESTORE_PROJECT_ID créées en production. Aucun déploiement n’a eu lieu, domaine encore sur dpl_HCuYcpc44mCwwjqdB5DSDbjBCpBv.
- Création de la clé serveur refusée avant exécution par la vérification automatique : autorisation distincte exigée pour la clé longue durée et son transfert comme secret Vercel. Question précise présentée et en attente. Aucune clé créée.
- CLI Vercel : session expirée ; le connecteur Vercel fonctionne (création des deux variables réussie). Pour le secret, préférer le connecteur et ne jamais afficher la valeur. Ne demander aucun jeton dans le chat.

Après accord pour la clé : créer une seule clé, conserver temporairement en mode0600, transférer confidentiellement dans CALENDAR_SERVICE_ACCOUNT_KEY du projet Vercel existant, vérifier la connexion puis fusionner PR40 et contrôler production et administration desktop/mobile. Supprimer le fichier temporaire après transfert et vérification. Ne pas contourner le refus en créant la clé autrement tant que l’accord manque.

## Nouvelle demande — remplacement bracelet par les téléphones
Branche active : codex/wristband-app-preview, base c28e30a de la branche calendrier. Le nouveau prompt exige un aperçu uniquement, sans fusion ni production.
- Visuel officiel du bracelet conservé à l’identique ; deux photos remplacées par les téléphones extraits de la maquette fournie.
- Textes HTML FR/EN mis à jour, mobiles empilés, anciennes images conservées sur disque.
- 92 tests passent ; HTML hors bracelet strictement identique à la base. Vérification 1440 et390 pixels, saisies conservées au passage EN.
- Captures et rapport : docs/school-calendar/BRACELET-APP.md.
- La configuration privée du calendrier reste en attente de l’accord explicite pour créer/transférer la clé serveur ; aucune clé créée, aucun nouveau déploiement production.
Prochaine action : revue du nouveau visuel. Ne pas fusionner/publier cette branche sans validation.
