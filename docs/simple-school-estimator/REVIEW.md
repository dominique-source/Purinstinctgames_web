# Estimateur scolaire compact — revue

Dépôt : dominique-source/Purinstinctgames_web.
Dossier : /Users/client/Documents/ChatGPT/purinstinct-web-app-review.
Branche : codex/simple-school-estimator, base main34a899f.
Aucune fusion ni production. Le configurateur existant reste en ligne.

## Résultat
Un seul estimateur remplace les trois étapes de planification. Trois réglages directement utilisables : élèves, intervenants supplémentaires, classes supplémentaires de clinique. Résultat en deux colonnes sur ordinateur, réglages puis résultat sur téléphone. Bouton DISCUTER DE MON PROJET vers le formulaire existant, financement séparé ensuite. Aide textuelle fermée par défaut, sans nouveau mini-configurateur.
Maquette jointe utilisée comme référence, composants HTML/SVG/CSS réels. Le sélecteur clinique remplace le compteur dessiné, conformément au prompt qui prime. Le logo officiel reste dans la navigation, sans duplication au-dessus de la section.

## Calculs confirmés
Paramètres regroupés dans piSchoolCommercial.estimator.policy :10CAD/élève,3intervenants inclus,4h,100CAD/h soit400CAD/renfort ; forfaits de classes supplémentaires d’une même journée0/400/750/1100/1400CAD. Montants calculés en centimes, ratio élève arrondi au centime, format FR/EN sans décimales inutiles.
Exemples vérifiés :200élèves→2000/10parélève ;+2renforts→2800/14 ;+2classes→3550/17,75 ;0renfort+4classes→3400/17. Aucun total au tarif25CAD. Le compteur commercial reste indépendant.
Autre besoin : forfait clinique null, postes connus affichés avec libellé hors cliniques sur mesure et déplacement ; supplément clairement restant à ajouter. Plusieursblocs : simple besoin transmis, premierblocuniquement, pas de nouveau prix ni doublefacturation.

## Reprise et formulaire
Aucun brouillon commercial localStorage trouvé ; liens ?configuration existants lus sans écrasement/suppression. Ancien effectif repris ; ancien multibloc/horaire transformé en simple besoin. Ni ancien staffing ni ancien nombre de cliniques (qui ne désignait pas des classes supplémentaires) n’imposent de suppléments cachés. Notice invitant à vérifier les choix. L’ancien objet reste dans l’URL, inchangé.
Le nouvel estimateur est un calcul indépendant ; les fonctions historiques restent disponibles pour compatibilité/test, sans interface ni influence cachée. Pas d’interface interne ajoutée.
Formulaire/endpoint/destinataire inchangés. Résumé courant FR/EN joint à Commentaires, avec quantités, forfait, besoin multibloc, montants et exclusions. Une saisie invalide masque le budget et bloque la transmission du résumé périmé. Nom et commentaires conservés au changement de langue. Aucun courriel réel envoyé.

## Vérifications
62 tests Node réussis : grille complète, exemples, précision, entrées invalides/vides, zéro, modèlehistorique ignoré, reprisesmalformées, périmètre custom/multibloc, résumésFR/EN, formulaire simulé, indépendancecompteur et scopeglobaldes scriptsclassiques. Tests historiques du site/APP/animations passent. SyntaxeJS et diffcheck.
Navigateur local :1440×900 et390×844 ; chaque forfait, +/−, saisiedirecte, vide—, FR/ENconservantchoixetcontact, menu/CTA/récapitulatif, custom+multibloc, repriseancienlien400élèves→4000sanssupplémentcaché. Pas de débordement. Aucune nouvelle erreur JS après correction de la collision globale commercial/contactCommercial trouvée pendant la QA.
Captures : captures/desktop-fr.jpg, captures/mobile-controls-fr.jpg, captures/mobile-result-fr.jpg. Le mobile utilise un défilement pour passer des réglages au résultat ; aucun panneau fixe ni défilement imbriqué.

## Périmètre préservé
Accueil/arène/zones, vidéos, trois cartes, animation25→10 inchangés. Financement déplacé après l’estimateur avec texte identique, jamais intégré aux calculs. APP, middleware, vercel.json, API de contact et dépôt technologique inchangés.
Code : index.html ; assets/ecoles.css, assets/school-home.js, assets/site-translations.js, assets/ecoles-contact.js ; tests et documentation associés. Aucun nouveau média ni service externe.

## Points restant à définir commercialement
Tarif des cliniques au-delà de4classes ou réparties sur plusieurs journées, blocs supplémentaires, déplacement, traitement des taxes. Le nombre de cliniques incluses n’est pas inventé. Ces postes ne sont pas présentés comme compris dans le montant.
Aperçu local : http://127.0.0.1:4184/#configuration (ordinateur nécessaire). Aperçu distant et PR à consigner après le push ; la branche ne doit pas être fusionnée sans validation.

## Aperçu hébergé vérifié
PR32 : https://github.com/dominique-source/Purinstinctgames_web/pull/32
Aperçu Vercel protégé existant : https://purinstinct-keh1b4jmt-dominique-soucy-s-projects.vercel.app/#configuration
Déploiement dpl_DpzCDniQAFsKHkChNYhxqbn5hpZj READY, code7329dd9. Visite dans la session Vercel déjà autorisée, sans partage ni contournement. CalculFR3550/17,75 et résumé généré ; ENconserve200/2/2, montant3550/17.75, boutonCTA et résumé visibles. Commandes +/− déclenchées par Entrée et résultat ajusté puis rétabli. Mobile390 sans débordement ; console fraîche sans erreur. Aucun formulaire soumis.
Production contrôlée séparément : purinstinctgames.com reste au commit34a899f, dpl_5ctqPh41M7srPz7T6TZNPBs93MVS. Aucune fusion ni publication de l’estimateur.

Publication validée et réalisée le10novembre2026 :PR32fusionnée,main40b6eaf,dpl_93ahFoTqsTJJmTXJpWWh7iaSrDGbREADYsurpurinstinctgames.com. Cette miseàjour remplace les mentions «enrevue/sansproduction» ci-dessus. Voir PRODUCTION.md pour contrôlesréelsordinateur/mobileFR/ENetformulaire,sansmail.
