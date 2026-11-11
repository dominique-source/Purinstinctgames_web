# Image de conférence — revue

Branche codex/dominique-conference-image, base main 60be746. Aucune fusion ni publication en production.

Source fournie : Dominique Soucy inspire les élèves.png (1536×1024, 2 014 136 octets). Copie originale identique par SHA-256 dans assets/school-home/sources/dominique-soucy-conference.png. Aucune retouche de l’apparence ni génération. Version WebP aux mêmes dimensions, qualité 92, 174 456 octets (environ 91 % de moins).

Seule la carte data-service=conference utilise le nouvel asset assets/school-home/dominique-soucy-conference.webp. La fenêtre reprend automatiquement cette même image avec le mécanisme existant inchangé. La réutilisation de l’ancienne image dans la mosaïque du parcours reste intacte, hors périmètre.

Cadrage carte : object-fit cover, point focal 25% 0%, visage visible au-dessus du titre. Fenêtre : contain existant, toute l’image visible ; ratio 3:2 confirmé à 380×253 sur ordinateur et 306×204 sur mobile. Titres, descriptions, signe +, mention Visuel illustratif, design et fonctionnement inchangés. Alt FR/EN exacts demandés.

76 tests passent ; git diff --check propre. Navigateur 1440×900 et 390×844 : carte et fenêtre vérifiées visuellement dans les deux langues ; aucun débordement mobile. Captures dans /Users/client/.codex/visualizations/2026/11/02/01a199a7-889a-70e0-ac64-b5ab2ee8e3ce/dominique-conference/.

Fichiers : index.html (carte et cache CSS/traductions), assets/school-services.css (point focal ciblé), assets/site-translations.js (nouvel alt), middleware.js (seul nouvel WebP public), tests/school-services.test.mjs (alt actualisé), les deux fichiers image et ce rapport. Le JavaScript des fenêtres n’est pas modifié.

Aperçu local : http://127.0.0.1:4183/#services. Prochaine action : validation avant toute mise en production.
