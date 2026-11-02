# Reprise — transition APP premium

- Dépôt : dominique-source/Purinstinctgames_web
- Dossier isolé : /Users/client/Documents/ChatGPT/purinstinct-web-premium
- Branche : codex/app-portal-premium
- Le dossier /Users/client/purinstinct-web contient du travail utilisateur préexistant : ne pas le modifier.

## Terminé
- index.html charge assets/app-portal.css et assets/app-portal.js.
- Le vrai lien /app est conservé. Activation normale : préchargement sur intention, impulsion lime et ouverture visuelle, puis navigation à 180 ms.
- Clics modifiés/nouvel onglet et mouvements réduits : navigation native immédiate.
- Navigation programmée avant les effets visuels, nettoyage pageshow et repli si l’animation échoue.
- Middleware et configuration de production inchangés.

## Vérifié
- Syntaxe JavaScript et git diff --check réussis.
- Configuration actuelle : /app est réécrit vers purinstinct-app.vercel.app/app.
- Contrôle d’accès privé existant : conserver.

## Prochaine action
- Tester le parcours complet local : node scripts/preview-public.mjs --site=/Users/client/Documents/ChatGPT/purinstinct-web-premium --port=4174 depuis le dépôt app.
- Terminer les contrôles navigateur et sauvegarder cette branche sur GitHub.
- Aucune fusion main ni production sans nouvelle instruction.

## QA terminée
- Parcours site local → APP → accueil testé avec un vrai lien /app ; arrivée portal confirmée.
- Préchargement sur focus confirmé (document et photo École seulement).
- 5 tests node réussis : clics modifiés, mouvements réduits, économiseur de données, navigation garantie en cas d’échec visuel et nettoyage pageshow.
- En-tête hero réel inclus dans l’effet de recul. Source formatée et syntaxe vérifiée.
- Le parcours en ligne reste soumis à la session privée existante ; aucune modification de middleware ou de permissions.
- Prochaine étape : validation utilisateur de l’aperçu, puis seulement sur instruction nouvelle, fusion/déploiement.

## Publication autorisée — 2 novembre 2026
L’utilisateur autorise maintenant la fusion des deux branches et la production.
Les 5 tests du script ont été relancés avec succès. Publier cette branche après
confirmation de la production premium de l’application ; vérifier le vrai lien APP.
Le contrôle d’accès privé doit rester en place.
