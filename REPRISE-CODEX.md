# Reprise — calendrier déployable

16novembre2026. Dépôt dominique-source/Purinstinctgames_web, dossier /Users/client/Documents/ChatGPT/purinstinct-web-app-review, branche codex/calendar-deployable, base main b49bd86.

Terminé : enveloppe compacte animée du calendrier, FR/EN, accessibilité et vue HTML publique sans JavaScript. Données/filtres/mois/connexion OIDC/permissions et autres sections préservés.102tests et syntaxe réussis le16novembre. Voir docs/school-calendar/DEPLOYABLE.md.

Le propriétaire valide l’animation et autorise expressément fusion/main/production sur purinstinctgames.com. Prochaine action : pousser/créer PR/fusionner, vérifier Vercel READY et l’alias existant, puis tester le domaine réel sur ordinateur/mobile sans perte du mois ou des filtres. Consigner le résultat et les captures. Ne pas toucher à l’application de compétition ou au projet Firebase séparé.

La publication précédente bracelet/calendrier est déjà effective via PR43/mainb49bd86, OIDC sans clé permanente. Les anciens documents de livraison non publiée sont historiques.

## Publication validée — 2026-11-16
- PR 44 fusionnée dans main : e7a719b83fa31590d2dd75550365d1d282ca3552.
- Vercel production READY : dpl_924oNci5PiwvJ2MuWCCGYhqHUSew, alias purinstinctgames.com confirmé.
- 102 tests réussis. Vérification navigateur du domaine public à 1440×1000 et 390×844 : bande compacte, ouverture/fermeture, école Vanier et mois conservés après réouverture, aucun débordement horizontal.
- API publique et ressources : 200 ; API admin anonyme : 401 ; page admin anonyme : redirection access.html. Aucune donnée modifiée.
- Captures : calendrier-production-20261116 dans le dossier visualizations de cette session.
- Prochaine action : aucune action requise pour cette publication.
