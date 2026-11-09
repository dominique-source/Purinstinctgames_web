# Site public sur une page — revue

Dépôt : dominique-source/Purinstinctgames_web. Branche : codex/single-page-public. Base : codex/animated-school-offer (PR #27, non fusionnée), qui dépend de #26 et #25. Travail antérieur conservé ; aucune fusion ni production.

Aperçu vérifié : https://purinstinct-fpoxb6paa-dominique-soucy-s-projects.vercel.app/?lang=fr
Vercel : projet purinstinct-web, équipe dominique-soucy-s-projects, déploiement dpl_B9CgaKs8mNjCSLJpxPKB5o56aWe3, commit ebfe65e1e2e8288100f75b04bb7e1f8584b8b7a5, READY, target null (preview). Build réussi, environ 14 secondes hors attente. Site statique sans script npm de compilation.

## Parcours livré

1. Accueil immersif : cinq zones et terrain distinct, avec leurs effets existants.
2. Vidéo générale conservée sur place.
3. Programme et déroulement existants.
4. Offre animée 25→10 ; 25 barré et secondaire à l’arrivée, exclusivement repère de présentation.
5. Configurateur/financement approuvés : budget uniquement à 10 $ par élève, suppléments et total à confirmer.
6. Contact en bas de page : image coach approuvée, texte demandé, demande de rencontre de 20 minutes, formulaire existant et récapitulatif des réglages actuels.
7. Pied de page simplifié. APP reste une entrée distincte.

Le menu fixe expose Les 5 zones, Le programme, Configurer mon école, Contact, APP et FR/EN. Les liens de découverte restent des ancres ; aucun lien public vers L’Arène, Pür ID ou une sous-page de zone/contact n’est rendu sur l’accueil. Les ancres disposent de 84 px de dégagement.

## Panneaux

Une image spécifique et une définition documentée suffisent à comprendre chaque zone. Les boutons Explorer la zone sont supprimés. Un sélecteur compact permet de passer aux cinq zones ou au terrain sans changer de page. La sélection est indiquée par aria-pressed, bordure et soulignement.

Région non modale : aucun verrouillage du défilement ni piège de focus. Sur mobile, le panneau reste sous l’en-tête et dans la fenêtre, sans modifier la hauteur de l’accueil. Le focus va au titre après activation d’un repère, avec preventScroll. Échap/fermeture rétablissent le focus sur le repère correspondant ; quitter l’arène vers une section referme le panneau sans déplacer le focus.

## Contact et compatibilité

Un seul formulaire actif, déplacé de pour-les-ecoles.html vers index.html. Champs, endpoint /api/schools-contact, destinataire dominique@purinstinct.com, validation native et messages d’état conservés. Le résumé est dans un volet dépliable et reflète les champs actuels, y compris au changement FR/EN et à l’envoi. Une configuration invalide bloque l’envoi avec un message adapté. Aucune réservation n’est prétendue confirmée ; aucun faux calendrier.

L’ancienne URL publique pour-les-ecoles.html redirige côté client vers la section équivalente de l’accueil, en conservant les paramètres de langue et configuration. L’accueil restaure une configuration partagée valide une fois au chargement, sans réinitialiser les valeurs au changement de langue. Le lien de repli reste visible sans JavaScript. L’ancienne page complète est archivée dans legacy-school-page.html.

Les anciennes routes zones.html, concept.html et pur-id.html sont actuellement protégées. Elles et leurs fichiers/fonctions restent inchangés ; aucune redirection ni modification de protection n’est ajoutée à ces routes. Le parcours public ne les sollicite plus.

## Médias

Images render-speed/agility/hand/foot/iq.jpg et arene-avec-reperes.webp, déjà publiques. Aucun extrait n’est inventé. Cinq MP4 correspondants existent, mais sont protégés et leur contenu n’a pas été validé pour ce parcours : ils ne sont pas exposés. Voir MEDIAS.md pour la configuration data-zone-video et les validations à fournir. Le lecteur optionnel volontaire et son arrêt/repli sont testés avec des doubles ; aucun lecteur vide ni bouton inactif n’est visible.

## Vérifications

- 37 tests Node réussis, syntaxe des trois scripts, git diff --check.
- Tests du code réel : sélection unique, Échap/focus, clic/survol distincts, lecteur optionnel sans chargement avant activation et arrêt/repli, redirection de l’ancienne URL, unicité des IDs/formulaire, routes publiques/privées, résumé vivant et POST simulé FR/EN, budget exclusivement pilote, compteur indépendant, reduced-motion simulé.
- Navigateur local : 1440×900 et 390×844 ; cinq zones + terrain changent sur place, images chargées, aucune sortie de page, aucun débordement. Le sélecteur du panneau ne change pas son contenu au simple survol.
- Mobile : panneaux à y=80 px sous l’en-tête de 61 px, bas entre 532 et 554 px ; scrollY reste à zéro lors des cinq sélections ; Échap restaure le repère Game IQ, body overflow reste visible.
- Menu mobile ferme après activation d’un lien. Contact arrive sous l’en-tête ; bouton de rencontre visible sur le premier écran du contact (environ y=390–456 px). Activation du bouton → formulaire à y≈84 px.
- FR/EN : panneau choisi, 2 000 élèves, adultes déclarés et texte du formulaire conservés. Résumé mis à jour, base 20 000 CAD, aucune référence régulière calculée. 200 élèves donnent 2 000 CAD. Ajouter des adultes ne réduit pas cette base.
- Ancienne URL scolaire testée dans le navigateur : redirection vers l’accueil, langue EN et neuf réglages repris correctement, formulaire accessible.
- Aperçu Vercel : contrôlé aux deux tailles, panneaux et contact FR/EN, console sans erreur ; clic APP ouvre le portail existant des trois compétitions sans connexion par courriel. Précédent revient à l’accueil de l’aperçu et conserve 2 000 élèves et 30 autres adultes.
- Aucun vrai courriel envoyé. Le relayage vers le destinataire et les états succès/échec sont vérifiés par fetch simulé, sans service externe.
- Aucun nouveau paramètre commercial, modification APP/API/middleware/vercel.json, ni données de participants. Réduction des mouvements : tests simulés/CSS ; pas de réglage système réel ni de téléphone physique.

## Fichiers principaux

index.html ; pour-les-ecoles.html (compatibilité) ; assets/school-home.js et .css ; assets/ecoles-contact.js ; assets/ecoles.css ; assets/site-translations.js ; tests commerciaux/proposition/animation et single-page-public.test.mjs ; documentation, captures et REPRISE-CODEX.md.

Exécution locale ; sauvegardée par commits et branche distante, sans promesse de continuation pendant la veille/arrêt du poste.
