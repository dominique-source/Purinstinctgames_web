# Configurateur par blocs

Dépôt dominique-source/Purinstinctgames_web ; branche codex/school-configurator-blocks, basée sur codex/school-journey-three-cards (PR #29 non fusionnée). Travail récent préservé.

Audit : ancien schéma neuf nombres, pas de blocs ni de renforts calculables ; modèle central dans site-translations.js, affichage school-home.js, résumé ecoles-contact.js ; aucune compatibilité intérieure validée trouvée. Formulaire /api/schools-contact, destinataire inchangé. Limite technique actuelle 2 000 caractères pour commentaires + résumé : à adapter pour ne pas perdre les configurations multi-blocs.

Règles à appliquer : distincts×10, blocs4h,3intervenants de base EN PLUS des adultes des jeux, renfort100/h donc400/bloc, capacités14/14/14 terrain et6/6/6 jeu, surfaces terrain+ceil(jeux/2). Frais blocs supplémentaires/déplacement/taxes et compatibilités restent inconnus.

Prochaine action : modèle versionné, interface3étapes, transmission complète, tests et captures. Aucune fusion ni production.
