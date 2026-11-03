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

## Refonte de l’accueil
- Dépôt dominique-source/Purinstinctgames_web, branche codex/public-homepage.
- ZIP purinstinct-accueil-ecole.zip lu depuis Downloads et confirmé dans dominique-source/purinstinct-app sur GitHub. La vue aérienne mobile est utilisée aux deux largeurs pour éviter le titre incrusté de la vue desktop.
- Accueil, menu et cinq cartes en HTML. L’Arène et Pür ID restent dans leurs parcours existants. Pour les écoles cible la compétition École.
- Tests node : 5 réussis. Diff vérifié. Le site est statique et ne définit pas de script de build. Aperçu local conjoint http://127.0.0.1:4178/.
- À 1440 et 390 px : cinq destinations, ouverture de l’Arène 3D et Pür ID, menu mobile, portail et trois compétitions, Précédent vers l’URL source et logo après accès direct. Pas de défilement horizontal.
- Captures refonte-1440.jpg et refonte-390.jpg dans le dossier de captures Codex du chat.
- Prochaine action : attendre la validation et l’autorisation de publication, puis vérifier le trajet avec une session de production autorisée.

## Accueil centré sur les cinq habiletés
- Branche codex/homepage-skill-navigation du dépôt dominique-source/Purinstinctgames_web.
- Accueil court, cinq liens profonds vers zones.html et bouton principal vers concept.html. Vidéo et parallaxe restaurés. L’Arène reste accessible à son ancre dans concept.html. Pour les écoles utilise la compétition École.
- Aperçu local http://127.0.0.1:4178/. Cinq tests Node réussis. Site statique sans commande de compilation.
- Vérifiés à 1440 et 390 px : cinq liens de zone, vidéo et déplacement parallaxe au défilement, accès à L’Arène et à Pür ID, portail APP, retour à l’URL d’origine et logo après ouverture directe. Captures games-accueil-1440.jpg et games-accueil-390.jpg.
- Prochaine action : attendre la validation et l’autorisation de mise en production, puis vérifier avec une session autorisée sur le site.
