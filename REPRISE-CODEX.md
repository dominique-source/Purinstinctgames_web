# Vidéo scolaire —9novembre2026

Branche codex/school-video, parent feat/schools-pilot-pricing-20261109 au commitb1ec296. Ajout uniquement vidéo chfQomu8rZ4 avant #parcours :miniature officielle, lecteur au clic, FR/EN sans redémarrage, fallback et plein écran natif.23tests passent, lecture YouTube réelle observée et formatsdesktop/mobile vérifiés. Plein écran visuel et préférence système de mouvement réduit non confirmés dans IAB.

Voir docs/school-video/REVIEW.md. Aperçu local4182/#video-games. Prochaine action :revue de la PR vidéo empilée, puis validation matérielle/réseau scolaire. Pas de fusion ni production. Tarifs/configurateur/formulaire/accès et application restent inchangés dans ce diff.

---

# Reprise — configuration commerciale écoles —9novembre2026

Dépôt dominique-source/Purinstinctgames_web. Branche feat/schools-pilot-pricing-20261109, PR25 existante complétée. Modèle25$/10$, base sans remise liée aux adultes, personnel/déplacement/total à confirmer. Formulaire unique existant reçoit un récapitulatif visible ;API inchangée. Programme sur plus d’un mois, financement séparé, ballons pédagogiques conservés par l’école et matériel Games récupéré.

18tests Node réussis, syntaxe et diff vérifiés, FR/EN/valeurs et captures1440×900/390×844, six zones et Échap contrôlés. Pas d’envoi réel de courriel. Inconnues de vente/taxes/encadrement documentées ;ne pas inventer de taux. Voir docs/schools-commercial/COMPTE-RENDU.md et PROGRESS.md.

Aperçu local4182 (#tarifs/#budget). Aucun merge ni production ;prochaine action :revue de PR25 et validation des paramètres avant toute publication. Middleware, routes privées et application inchangés.

L’audit RFID demandé auparavant est sauvegardé séparément dans /Users/client/Documents/ChatGPT/purinstinct-app/docs/rfid-audit-2026-11-09/RAPPORT.md, branche codex/rfid-readiness-audit-2026-11-09, commit9d1bbab. Les points bloquants matériels/multiappareils y sont détaillés. Ne pas mêler ce travail au correctif commercial.

---

## Publication et recette

PR23 fusionnée : e71ee38. Déploiement purinstinct-web dpl_74XchbZ7K59LJn36EidcyGLTXS7x READY/production. APP desktop ouvre le portail sans login, toutes les images sont chargées, Back retourne à l’accueil public. Requêtes HTTP sans cookies : catégories et Horizon200, organisateur/projection redirigent vers access.html.

La recette détecte un404 préexistant sur /app/ au proxy vide. Ajout d’une réécriture explicite /app/ vers le même portail déjà public, sans élargir les exemptions du middleware. Publier puis revalider /app et /app/ et le menu mobile.

# Accès APP public — 7 novembre 2026

Dépôt dominique-source/Purinstinctgames_web, branche codex/public-app-access depuis main d517ddf. L’utilisateur autorise le portail APP sans connexion courriel et la publication production.

Exemptions : portail /app, trois compétitions, activité publique Horizon et ressources statiques nécessaires. Pages organisateur/projection/opérationnelles toujours soumises au contrôle existant. L’exemption large de /app/ a été refusée par le contrôle automatique et n’a pas été appliquée.

Prochaine action : fusion autorisée puis recette de production sur purinstinctgames.com, desktop/mobile et vérification sans cookie de session.

---

# Reprise — couverture immersive du kit approuvé

- Dépôt dominique-source/Purinstinctgames_web, projet Vercel purinstinct-web, domaine purinstinctgames.com.
- Dossier /Users/client/Documents/ChatGPT/purinstinct-web-premium.
- Branche codex/hero-deck.
- Mission en aperçu, publication soumise à validation.

## Terminé
- Photos desktop et portrait sans annotations du kit, pinceau GAMES transparent, polices locales et licence.
- Header superposé, titre HTML accessible, barre de six boutons avec icônes.
- Repères et calques SVG communs à la transformation de chaque photo.
- Panneaux bilingues, fermeture et Échap, conservation de la sélection, aperçu temporaire au survol.
- Le contenu HTML à partir de #parcours est identique à main.
- Seuls les actifs nécessaires au hero ont été ajoutés à la liste publique du middleware.

## Vérifications
- Syntaxe, git diff --check et cinq tests existants réussis.
- Navigateur à 1920×1080, 1440×900, 1366×768, 390×844, 375×667 et 844×390.
- Six sélections, clavier, fermeture, menu mobile et retour du focus, FR/EN, conservation du configurateur, CTA #parcours, APP et Précédent.
- Test isolé des transitions rapides, du retour à la sélection et de la priorité du focus.
- Les photos sans texte remplacent les annotations françaises incrustées.
- Le navigateur disponible ne permet pas l’émulation de prefers-reduced-motion ni du zoom à 200 %. L’accès au service natif des réglages système échoue. Ces vérifications visuelles et un test tactile physique restent ouverts.
- La réduction des animations est prévue dans le CSS et le suivi JS, avec arrêt des effets hors écran.

## Prochaine action
- Faire valider l’aperçu local http://127.0.0.1:4178/ et les captures.
- Vérifier mouvement réduit et zoom réel à 200 % avec un navigateur permettant ces réglages.
- Attendre une instruction explicite avant fusion dans main et production.

---

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
