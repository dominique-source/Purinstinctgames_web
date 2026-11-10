# Services interactifs et design de l’estimateur — revue

Dépôt dominique-source/Purinstinctgames_web, dossier /Users/client/Documents/ChatGPT/purinstinct-web-app-review.
Branche codex/service-cards-estimator-design, base main40b6eaf. PR33 : https://github.com/dominique-source/Purinstinctgames_web/pull/33
AUCUNE fusion ni production pour cette mission.

## Résultat
Six cartes photographiques à l’emplacement de la bande de services : conférence, cliniques, formation, coordination, équipements et Games. Grille3×2 sur ordinateur ; une colonne à390px, deux aux tailles intermédiaires. Carte entière bouton, titre intégral, dégradé et+, zoom discret au survol. Toutes les images sont existantes et qualifiées d’illustratives.
Fenêtre native unique avec photo/titre/description concise, agrandissement Web Animations240ms puis retour160ms ; aucune bibliothèque ajoutée. Échap, fermeture extérieure et commande visible. Arrière-plan inerte et défilement verrouillé, focus initial et boucleTab/MajTab, retour du focus et duY exact de la carte. SélecteurFR/EN dans la fenêtre réutilisant le mécanisme existant sans perdre le focus ni recréer le contenu. Réduction des animations : ouverture/fermeture simple et survol immobile.
Estimateur : panneau sombre unique, réglages à gauche, résultat noir sur aplatlime intégré àdroite, prixparélève immédiatement souslemontant, ventilation courte, CTA noir/blanc. Mobile : réglages puis résultat. Sous-titre et mention courte exacts. Aide facultative conservée sur toute la largeur du réglage. Options clinique portent leurs forfaits, sans changer la grille ni le moteur. Valeursinitiales200/0/0 inchangées.

## Périmètre intact
Bloc tarifaire : HTML strictement identique àmain, même CSS antérieur àl’estimateur, même scriptcommercial et même responsive. Animation25→10/60% etmontants intacts. Aucun nouveau sélecteur de cartes/fenêtres ne cible ce bloc.
Moteur de calcul central inchangé, ainsi que school-home.js (zones/animations/calculs), ecoles-contact.js, APP, vercel.json etAPI de contact. Formulaire/destinataire/données inchangés. Parcours avant/pendant/après, vidéos, financement et textes de l’offre horspérimètre intacts.
Le middleware ajoute seulement /assets/school-services.js et.css àlaliste des ressources publiques ; les contrôlesAPP restent identiques.

## Médias et limites
-Conférence : assets/school-home/conference.webp, intervenant vu de dos. Aucun portrait réel approuvé de Dominique trouvé ; ce visuel n’est pas présenté comme son visage ni comme une archive.
-Cliniques : assets/school-home/cliniques.webp.
-Formation : assets/school-home/formation.webp.
-Coordination : assets/homepage/ecole.png, illustration de groupe surterrain ; une scène dédiée de préparation avec l’école/coordination est souhaitable.
-Équipements : assets/arena-hero.jpg, illustration des installations ; une photo approuvée du kit matériel et de la production manque.
-Games : assets/school-home/games.webp.
Les petites sources380px ne sont pas grossies : grillemax1140px, cartes366px, images365px (environ378px au survol), fenêtremax380px. Focal conférence/formation enhaut pour préserver les têtes. La fenêtre affiche les proportions intégrales des photos. Aucun média généré ni recadrage de capture agrandi.

## Vérifications
69 testsNode réussis etsyntaxeJS/diffcheck : ouvertures des6 contenus, langue/focus, fermetures, boucleTab, motionréduite, restitutionstyles/Y, une seule fenêtre ; ressourcespubliques ciblées ; prix/CSScommercial/animation/moteur etautresparcours comparés àmain. Tousles tests précédents conservés, saufadaptation àlanouvelle mention courte confirmée.
Navigateur1440×900 et390×844 : sixfenêtreschacunephoto/titrecorrect, closesparÉchap/commande/extérieur ; focusréel restauré etYidentique, fondverrouillé ;FR/ENouvert garde le contrôlelangueactif ; Tab/MajTab confinés. Aucun débordement horizontal ni erreurconsole.
Calcul200élèves+2intervenants+2classes=3550CAD/17,75parélève,inchangéFR/EN ; récapitulatifvisiblecohérentdansformulaire,aucunmailenvoyé. Défaut200/0/0→2000CAD confirmé aprèsrechargement. Réductionmotion couverte partestsunitaires de lapréférenceetCSS ; réglagesystème nonmodifié.

## Fichiers
index.html ; assets/ecoles.css ; assets/school-services.js et.css (nouveaux) ; assets/site-translations.js (entrées ajoutéesseulement) ; middleware.js (deuxressources) ; tests/school-services.test.mjs, school-estimator.test.mjs, school-journey.test.mjs ; noteset captures.
Captures locales dans captures/ : servicesdesktop/mobile, estimateurdesktop/mobile etfenêtresdesktop/mobile. L’aperçu reste une revue, pas laproduction.
Aperçulocal : http://127.0.0.1:4186/#services
AperçuVercel : https://purinstinct-c18x9h82a-dominique-soucy-s-projects.vercel.app/#services (protectionexistanteVercel).
Déploiementdpl_4oWvK3meLKz87phumUvVptG13coS READY,codebd0bd40 ; contrôlehébergéàconsigneravantlivraison.

## Contrôle hébergé terminé
L’aperçubd0bd40 READY a été ouvert avec la session Vercel existante : cartecliniques→boncontenu, langueENdansfenêtreavec focusconservé, Échapferme. Estimateur200/2/2→3550/17.75 etrésuméENcorrectviaCTA ; aucuneerreurJS,aucunsoumission. Aucun lien departage/bypass généré. Production vérifiée séparément, toujoursmain40b6eaf/dpl_93ahFoTqsTJJmTXJpWWh7iaSrDGb.
Captures : services-desktop-fr.jpg, services-mobile-fr.jpg ; estimate-desktop-fr.jpg, estimate-mobile-controls-fr.jpg, estimate-mobile-result-fr.jpg ; detail-desktop-fr.jpg, detail-mobile-fr.jpg, detail-mobile-en.jpg. Ces captures montrent l’état d’exemple200/2/2 lorsque l’estimateur est visible ; lesvaleursinitialesréellesrestent200/0/0.
Livraison prête àréviser. Attendre validation expliciteavantfusion/miseenproduction.
