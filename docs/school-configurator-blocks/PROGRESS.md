# Configurateur par blocs

Dépôt dominique-source/Purinstinctgames_web ; branche codex/school-configurator-blocks, basée sur codex/school-journey-three-cards (PR #29 non fusionnée). Travail récent préservé.

Audit : ancien schéma neuf nombres, pas de blocs ni de renforts calculables ; modèle central dans site-translations.js, affichage school-home.js, résumé ecoles-contact.js ; aucune compatibilité intérieure validée trouvée. Formulaire /api/schools-contact, destinataire inchangé. Limite technique actuelle 2 000 caractères pour commentaires + résumé : à adapter pour ne pas perdre les configurations multi-blocs.

Règles à appliquer : distincts×10, blocs4h,3intervenants de base EN PLUS des adultes des jeux, renfort100/h donc400/bloc, capacités14/14/14 terrain et6/6/6 jeu, surfaces terrain+ceil(jeux/2). Frais blocs supplémentaires/déplacement/taxes et compatibilités restent inconnus.

Prochaine action : modèle versionné, interface3étapes, transmission complète, tests et captures. Aucune fusion ni production.

2026-11-10 — Reprise : 49/49 tests passent. Contrôle navigateur 390×844 et 1440×900 ; pas de débordement horizontal, données et calcul conservés FR/EN. Cas 200 élèves/2 terrains/15 jeux/18 adultes : 21 postes,3 renforts,3200 CAD connus. Saisie2000 affiche immédiatement base20000 même si horaire incomplet. Publication cartes+configurateur autorisée par « rend tout live » ; nouvelle mission APP explicitement séparée et sans production. Aucune soumission réelle du formulaire.
