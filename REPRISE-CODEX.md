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
