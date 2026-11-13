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
- 89 tests Node réussis au premier passage complet.
- Navigateur : Vanier sans dates, comptes 1/10 et 0/10, filtre fictif, événement final.
- Administration locale : clinique fictive enregistrée, conservée après rechargement puis publiée.
- Aucun courriel envoyé ; aucune fusion ni publication en production.

## À terminer
- Dernières captures ordinateur/mobile, changement FR/EN, dépublication et suppression de données QA.
- Guide d’administration et configuration distante ; tests complémentaires, commit/push/PR de revue.

## Blocage externe précis
Aucun stockage commercial calendrier n’est configuré dans Vercel. Variables requises : CALENDAR_ADMIN_EMAILS, CALENDAR_FIRESTORE_PROJECT_ID, CALENDAR_SERVICE_ACCOUNT_KEY. Ne pas utiliser la base des compétitions. L’environnement est local : pas de garantie de poursuite ordinateur éteint.

## Prochaine action
Terminer les vérifications navigateur sur http://127.0.0.1:4184/ (Vanier sans dates) et http://127.0.0.1:4185/ (démonstration fictive), puis documenter et pousser la branche sans fusion.
