# Transition budget → financement — revue du 12 novembre 2026

Branche codex/school-signature-funding, base main 830120f. Aucune fusion ni production.

La calculatrice (estimate-grid), son CSS, ses contrôles et ses scripts sont identiques à main. Le bloc commercial 25 $ → 10 $ et les six services sont inchangés. Seules les notes après la calculatrice sont regroupées en une note compacte (événement 4 h, déplacement, adaptation et taxes).

Le financement suit immédiatement : 18 px entre les sections sur téléphone, bandeau lime demandé puis cinq cartes photo réelles avec HTML pour les titres, traits, invitations et signes + circulaires. Question sur plusieurs blocs déplacée après le financement. Son lien et celui du financement continuent de préremplir le formulaire sans écraser ni dupliquer les mentions et sans envoi.

## Extraction des photos

Source composite conservée sans modification dans source/cinq-cartes-reference.png. Cinq WebP extraits uniquement des zones photographiques, sans texte/bouton incrusté et sans génération : assets/funding/school.webp, grants.webp, foundations.webp, sponsors.webp et local.webp. Coordonnées dans l’image originale 2167×726 : (22,32,445,402), (462,32,864,402), (883,32,1285,402), (1306,32,1711,402), (1731,32,2148,402). Dimensions respectives 423/402/402/405/417 × 370 ; WebP qualité 92, total environ 166 ko. Aucun ballon de basketball. Personnes centrales et diversité de la référence préservées ; partenaires locaux montre dossards, cônes et caisses de matériel issus de la scène validée. Les photos sont décoratives dans les boutons nommés par leur titre HTML.

Les cinq fenêtres, contenus détaillés, critères, liens officiels, commandes et gestion clavier restent identiques. Aucune nouvelle recherche ou modification des informations de financement ; aucune aide fictive soustraite.

## Contrôles

80 tests passent : calculatrice HTML identique, scripts et CSS de calcul inchangés, bibliothèque détaillée des fenêtres identique à main, cinq WebP distincts et ordre de la question après financement. Syntaxe et git diff --check propres. Dépôt statique sans script build.

1440×900 : cinq cartes sur une rangée ; 390×844 : deux colonnes de 171 px séparées de 12 px, aucun débordement. Images non déformées, sans texte en double ; scènes vérifiées individuellement. Cinq fenêtres testées au clavier/Échap sur téléphone, contenu PAFILR et Une école montréalaise pour tous conservé en anglais. Saisies conservées et calcul 3 550 $ CA vérifié après FR/EN ; pas d’envoi réel. Préférence de réduction des animations conservée dans le CSS des fenêtres inchangées.

Captures ordinateur et téléphone dans captures/. Aperçu : http://127.0.0.1:4183/#financement.

Fichiers : index.html, assets/school-funding.css, cinq images assets/funding/, assets/site-translations.js (nouveaux textes FR/EN), middleware.js (cinq ressources statiques), tests concernés et documentation. assets/school-funding.js n’est pas modifié.
