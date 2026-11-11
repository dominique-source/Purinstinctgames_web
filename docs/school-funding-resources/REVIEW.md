# Financement documenté — revue du 10 novembre 2026

Branche codex/funding-resources, base origin/main d4c3936. Aucune fusion ni publication en production.

## Périmètre

Section financement unique enrichie dans index.html : introduction, cinq cartes avec une phrase et un indice d’interaction, conclusion et lien au formulaire existant. Le dialogue existant affiche maintenant des sous-sections et des liens officiels ; fermeture et langues restent visibles dans une barre fixe pendant le défilement interne.

Fichiers modifiés : index.html ; assets/school-funding.js ; assets/school-funding.css ; assets/site-translations.js (ajout de traductions seulement) ; tests/school-funding.test.mjs ; tests/school-commercial.test.mjs (libellé de la mention). Rapport et captures dans ce dossier.

Le bloc tarifaire, le modèle de calcul, les styles et calculs de l’estimateur, les six services, l’API de contact, les accès et fonctionnalités APP sont inchangés. Le lien de financement ajoute une mention modifiable une seule fois, préserve le commentaire et ne soumet rien. Les demandes de blocs et de financement restent indépendantes. Les textes rédigés restent conservés ; les mentions générées sont traduites seulement tant qu’elles restent intactes.

## Sources vérifiées

Consultées le 10 novembre 2026 :

- [À l’école, on bouge!](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/administration-encadrements/financement/regles-budgetaires/ecole-on-bouge), page mise à jour le 16 octobre 2026 : intégration de 15023 dans 1330 en 2026-2027.
- [Règles budgétaires](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/administration-encadrements/financement/regles-budgetaires) et [PDF officiel de fonctionnement amendé 2026-2027](https://cdn-contenu.quebec.ca/cdn-contenu/education/financement/Regles-budgetaires-css-fonctionnement-26-27-amendee.pdf), table de correspondance page PDF 9 (pagination imprimée III) : anciennes mesures 15023, 15028 et 15232 regroupées dans 1330. Pas de présentation comme trois subventions cumulables.
- [PAFILR](https://www.quebec.ca/tourisme-loisirs-sport/aides-financieres-sport-loisir-activite-physique-plein-air/aides-financieres-developpement/programme-aide-financiere-initiative-activite-physique-plein-air), mise à jour le 5 août 2026 : organismes scolaires dans les catégories admissibles ; volet Projets ; appels et analyse par l’URLS régionale. Aucun appel présenté comme ouvert ni plafond affiché. URLS n’est pas une aide supplémentaire ; volet Événements non recommandé automatiquement.
- [Une école montréalaise pour tous](https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/ressources-outils-reseau-scolaire/intervention-milieu-defavorise/programme-soutien-financier-ecole-montrealaise), mise à jour le 27 octobre 2026 : écoles primaires de l’île de Montréal confrontées aux enjeux de défavorisation, notamment en contexte pluriethnique. Restriction géographique visible dans la fenêtre.

Les références confirment les informations demandées : pas de correction factuelle nécessaire. Les noms officiels français des programmes sont conservés en EN, accompagnés d’explications anglaises.

## Vérifications

76 tests Node réussis, syntaxe JS et git diff --check. Dépôt statique sans script build ; aucune compilation Next.js applicable.

Navigateur 1440×900 et 390×844 : cinq fenêtres FR/EN, contenu correspondant, sources identifiées, aucun débordement horizontal, défilement de la longue fenêtre scolaire (1317 px de contenu dans une hauteur de 810 px sur téléphone). Bouton de fermeture et langues visibles pendant le défilement ; Tab/Maj+Tab prennent en compte les liens officiels, Échap et clic extérieur ferment avec retour à la carte. Animation légère désactivée par règle prefers-reduced-motion ; réglage système non modifié.

Commentaire et école déjà saisis conservés ; deux clics n’ajoutent qu’une mention de financement ; FR/EN conserve les champs de l’estimateur. Scénario 200 élèves, 2 intervenants et 2 classes supplémentaires : 3 550 $ CA / 17,75 $ par élève, inchangé. Base initiale 2 000 $ CA. Aucun courriel réel envoyé. Aucune erreur console observée.

## À confirmer par chaque établissement

Budgets réellement mobilisables, admissibilité et dépenses propres au projet, critères régionaux et échéances, soutien éventuel de fondations/entreprises/partenaires, modalités de visibilité. Aucune admissibilité automatique de PürInstinct ni financement garanti. Aucune aide hypothétique soustraite du budget.

Aperçu local : http://127.0.0.1:4183/#financement (dépend de cet ordinateur). Captures ordinateur et téléphone dans captures/.
