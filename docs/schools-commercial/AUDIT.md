# Audit et périmètre · 9 novembre 2026

Base examinée :dominique-source/Purinstinctgames_web, main, commit bd04e63de2e9f2025c681950dbf18ecabefe0972. Pas de présentation PDF/PPTX ni de fichier AGENTS.md dans l’arbre de ce dépôt. Le dépôt de l’application n’a pas été modifié.

## Fichiers concernés

| Source | Constat | Modification |
|---|---|---|
| pour-les-ecoles.html | Page courte avec photo, proposition d’échange et formulaire | Sections expérience, composantes, déploiement, tarifs régulier/pilote, financement, discussion |
| index.html | Terrain interactif, parcours4 composantes, configuration, ancien exemple14 500$/7,25$ | Mention programme de plus d’un mois; déploiement; remplacement seul bloc financier; financement |
| assets/school-home.js | Compteurs et validation ressources; aucun moteur tarifaire complet | Calcul des totaux25×élèves/10×élèves, sans changer les autres réglages |
| assets/ecoles.css | Styles de la page écoles et formulaire | Styles commerciaux scoped noir/offwhite/lime et responsive |
| assets/site-translations.js | Dictionnaire FR/EN exact-text | Ajout des nouvelles expressions; mécanisme existant conservé |

Protégés :middleware.js, vercel.json, API de contact, scripts de soumission, menu, portail App, animations du terrain, routes bloquées. Aucun nouveau chemin d’asset nécessitant une ouverture du middleware. Aucun changement dans purinstinct-app.

## Documentation locale consultée

- Offre aux écoles2pages :texte extractible; sport sans contact3v2, cinq dimensions, cliniques, format défini avec établissement, ventilation et financement.
- Deck18pages consolidé disponible localement :pages raster sans texte extractible, aperçu visuel rendu et inspecté. Composantes confirmées notamment pages4,7,8,9,10,12,13,14,17. Il peut s’agir d’une version antérieure aux suppressions demandées dans la conversation. Ne pas prétendre que cette numérotation représente le PDF final actuel.
- Aucune source éditable du deck dans le dépôt. Les PDF existants n’ont pas été altérés; PRESENTATION.md fournit textes et mise en page, conformément au repli demandé.

## Anciennes hypothèses identifiées

- Accueil :14 500$ pour2 000 élèves/7,25$ par élève,15 responsables et5 intervenants8h. Remplacées par tarifs commerciaux fournis, pas réutilisées comme coûts internes.
- Deck de référence :page12 ancien forfait14 500$; page14 montants14 500/10 000/8 500 sur3ans. Les nouveaux tarifs de renouvellement ne sont pas définis :aucun montant inventé.
- Pages9–10 du deck :plus votre équipe s’implique plus le coût peut diminuer. À reformuler pour éviter une remise automatique qui contredirait le nouveau tarif pilote.

## Source des nouveaux tarifs

Instruction commerciale explicite de Dominique du9novembre2026 :25$/élève régulier;10$/élève cohorte pilote; déplacement en sus; réduction60% avant déplacement. Ce n’est pas une subvention. L’existence opérationnelle de l’offre régulière, les conditions de cohorte et le périmètre contractuel restent à valider avant publication en production. La branche de travail ne simule pas une validation commerciale indépendante.
