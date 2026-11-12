# Signature scolaire FR / EN — revue du 12 novembre 2026

Dépôt dominique-source/Purinstinctgames_web ; branche codex/school-signature-funding, base main 830120f.

## Ressource et intégration

PNG fourni trouvé dans /Users/client/Downloads/Les jeux Pürinstinct à l’école.png (nom original normalisé Unicode par le système). Copie strictement identique par SHA-256 dans images/branding/les-jeux-purinstinct-ecole-fr.png : 1921×819, RGBA, alpha 0–255, 1 330 598 octets. Aucun redessin, transformation, fond, contour, ombre CSS ou modification de couleur. Le relief déjà présent dans la ressource originale est conservé.

Le H1 unique fournit une seule signature accessible, traduite par le mécanisme existant : « Les Jeux PürInstinct à l’école » / « PürInstinct Games at School ». Les variantes graphiques sont décoratives (aria-hidden) et leurs images ont un alt vide pour éviter une double lecture. L’image française garde son ratio entier. La signature anglaise utilise les éléments typographiques et le brush GAMES existants. Le logo institutionnel de navigation et les marques présentes dans les photographies restent distincts et inchangés. Le titre du document suit également la nouvelle signature.

Deux variantes dans une même cellule de grille : la variante inactive reste réservée dans le calcul de la taille, avec visibility:hidden. Pas de nouveau JavaScript, rechargement ou gestionnaire d’animation. La sélection s’appuie sur html[lang] déjà géré par site-language.js.

## Vérifications

80 tests passent sur les deux demandes actives (signature et transition financement). Source PNG, dimensions, alpha, H1 unique, traduction et accès public de l’asset vérifiés. Scripts d’arène, de langues et de calcul inchangés par rapport à main.

Navigateur 1440×900 et 390×844 : logo français entier, proportions intactes, transparence et couleur dorée conservées ; signature anglaise existante visible et lisible. Hauteur du H1 identique avant/après FR/EN : 281,53 px sur ordinateur, 159,87 px sur téléphone. Pas de débordement horizontal ; zones et fermeture du panneau testées au clavier. Commentaire existant et valeurs 200 élèves / 2 intervenants / 2 classes conservés, budget 3 550 $ CA au passage FR/EN. Les scripts et l’animation commerciale n’ont pas été modifiés. Aucune erreur console observée. Aucun courriel envoyé.

Captures : captures/signature-ordinateur-fr.png, signature-ordinateur-en.png, signature-telephone-fr.png et signature-telephone-en.png.

## Fichiers

index.html (H1, titre document et versions cache) ; assets/school-home.css (espace des deux signatures) ; assets/site-translations.js (signature exacte) ; images/branding/les-jeux-purinstinct-ecole-fr.png ; middleware.js (un asset autorisé) ; tests/school-signature-funding.test.mjs ; documentation. Aucun changement dans l’application technologique.

Aperçu : http://127.0.0.1:4183/?lang=fr ; version anglaise partageable : http://127.0.0.1:4183/?lang=en. Exécution locale dépendant de l’ordinateur. Aucune fusion ni publication en production.

La demande précédente de transition budget-financement est également terminée et conservée sur cette branche ; voir docs/budget-funding-transition/REVIEW.md.
