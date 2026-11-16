# Reprise — parcours administration calendrier
2026-11-16. Dépôt dominique-source/Purinstinctgames_web. Dossier /Users/client/Documents/ChatGPT/purinstinct-web-app-review. Branche codex/calendar-admin-journey.

Cause : middleware perdait la destination de retour et /api/verify redirigeait toujours vers /.
Terminé : lien public secondaire ; destination interne autorisée signée dans le magic link ; expiration conservant la destination ; portail avec identité/déconnexion, actions école/activité, recherche, prochains événements, statuts distincts, brouillon/publication et retour profond au mois publié ; reprise des saisies dans le même onglet pour le même compte. OIDC, modèle et stockage intacts.

Vérifications : 107 tests ; navigateur local 1440×1000 et390×844 FR/EN ; session autorisée locale vers portail ; école et activité créées uniquement dans /private/tmp/pi-admin-journey-test.json ; brouillon invisible ; activité provisoire publiée visible en mai2027 et notes privées exclues ; retour profond ouvert ; saisie restaurée après rechargement ; aucun débordement mobile. Tests du vrai vérificateur JWT sans cookie préalable vers session puis API admin200, autre compte403, expiration et destinations externes refusées. Aucun courriel réel ni écriture de production pendant les tests.

Aperçu : http://127.0.0.1:4198/#school-calendar ; portail /calendar-admin.html. Captures : calendar-admin-journey-20261116 dans visualizations.
Prochaine action : publier le correctif selon l’autorisation conditionnelle de la mission et contrôler domaine, redirection et protections ; la réception/clic du courriel réel par Dominique reste une vérification utilisateur à consigner explicitement. Ne jamais créer de fausse donnée en production.
