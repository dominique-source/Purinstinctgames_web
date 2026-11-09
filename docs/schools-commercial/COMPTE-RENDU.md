# Compte rendu · 9 novembre 2026

## Réalisé

- Audit du site public au commitbd04e63de2e9f2025c681950dbf18ecabefe0972 et de la documentation locale disponible. Aucune source éditable de présentation dans le dépôt.
- Page publique écoles structurée en sept temps :expérience, composantes documentées, déploiement sur plus d’un mois, valeur/tarif régulier, cohorte pilote, financement et discussion.
- Tarifs affichés dans cet ordre :25$/élève régulier,10$/élève pilote, déplacement en sus; réduction commerciale60% explicitement attribuée à PürInstinct et distincte d’une subvention.
- Ancien exemple14 500$/7,25$ retiré des deux pages concernées. Exemple dynamique2 000élèves :50 000$ régulier et20 000$ pilote, avant déplacement. Exemple200élèves :5 000$ et2 000$.
- Réglages existants conservés pour connaître les besoins. Les adultes, plateaux, heures ou séances ne déclenchent pas une remise automatique non définie.
- Financement direct et externe séparés. Aucun montant de subvention, garantie d’admissibilité ou contribution fictive.
- Nouvelle copie traduite via le mécanisme FR/EN déjà présent. Les nouveaux blocs commerciaux utilisent noir#0A0A0A, blanc#F4F4EF, lime#CCFF00, sans reconstruire le terrain interactif de l’accueil.
- PRESENTATION.md :textes prêts à intégrer, titres précis des pages à revoir et indications de mise en page. Aucun PDF local modifié ou présenté comme mis à jour.

## Conservé

Application technologique, middleware, réécritures, API, soumission du formulaire, champs du formulaire, menu, lien App, animations du terrain, contrôles d’effectif et ressources. Aucun bouton ou chemin privé réactivé. Aucun nouveau service ni nouvelle image.

## Vérifications

- `node --test tests/*.test.mjs` :13/13 réussis.
- Tests existants :5 portail App,2 accès public/privé.
- Tests ajoutés :6 sur calcul réel de configuration, saisies invalides, anglais, contenu tarifaire, conservation des contrôles et du formulaire.
- `node --check assets/school-home.js` et `node --check assets/site-translations.js` :réussis.
- Navigateur :page écoles FR et EN; cartes25/10 et financement; affichage desktop; viewport mobile390×844 via iframe de QA; correction du décalage d’ancre sous l’en-tête fixe.
- Navigateur accueil :passage2 000→200élèves, totaux5 000/2 000 confirmés; version anglaise et formats monétaires contrôlés.
- Contrôle statique des identifiants HTML et des fichiers protégés.

Limites :pas de test physique sur téléphone, pas de message réel envoyé par le formulaire, pas de validation d’une subvention, pas de contrôle de l’admissibilité d’un établissement, pas de modification d’un deck éditable. La prévisualisation est une copie locale, pas une mise à jour du site en production.

## À valider commercialement

1. L’offre régulière25$ est bien une offre réellement prévue, de périmètre comparable; le prix de référence n’a pas été vérifié indépendamment de l’instruction fournie.
2. Conditions de participation à la cohorte pilote et base de facturation des élèves.
3. Calcul des frais de déplacement et traitement des taxes, sans montant inventé.
4. Nombre/durée des cliniques et modalités précises de déploiement dans chaque établissement.
5. Conditions de renouvellement années2–3. Ne pas republier les anciens montants par défaut.
6. Fichier source final de la présentation avant intégration graphique des textes préparés.

## Livraison

Branche de travail et demande de révision en brouillon. Aucune fusion ni mise en production. Pour publication :valider les points commerciaux, revoir le diff, fusionner selon le workflow habituel et contrôler les deux pages publiques après déploiement. Les règles de sécurité et l’application ne font pas partie de ce changement.
