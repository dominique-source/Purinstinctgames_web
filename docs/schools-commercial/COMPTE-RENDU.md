# Livraison de revue —9novembre2026

Dépôt `dominique-source/Purinstinctgames_web`, branche existante `feat/schools-pilot-pricing-20261109`, PR25 reprise sans doublon. Base main bd04e63. **Aucune fusion ou publication production.** Le travail RFID reste dans une branche indépendante du dépôt app ;aucun code applicatif ni donnée participant touché dans cette mission.

## Ce qui a changé

- Accueil :expérience et parcours sur plus d’un mois conservés, tarifs et financement placés avant le configurateur, puis demande de proposition. Page écoles :programme, services, photo et formulaire existants préservés ;accès au même configurateur depuis la section commerciale.
- Deux cartes :tarif régulier25$CA/élève, base cohorte pilote10$CA/élève. Réduction60% offerte par PürInstinct, avant déplacement **et suppléments**, sans faux prix barré ni promotion inventée. Aucun financement hypothétique déduit.
- Résultat :« Base du programme », référence régulière, équivalent par élève portant uniquement sur la base, personnel supplémentaire à confirmer, déplacement à confirmer, total à confirmer. Pas de total taxes comprises inventé. Aucun ratio d’encadrement, effectif inclus, heure incluse ou taux de vente supposé.
- L’implication de l’école ne réduit jamais la base sous10$/élève. Les réglages d’adultes, de rôles simultanés, d’espaces et de calendrier préparent la proposition ;ils ne simulent pas des économies ou du personnel gratuit. Les bénévoles ne sont pas automatiquement assimilés à des intervenants spécialisés.
- Les champs utiles restent présents. Les créneaux individuels d’adultes sont explicitement à préciser lors de la proposition. Le nombre de séances de cliniques est optionnel et vide par défaut :« À préciser », puis « À confirmer » dans le récapitulatif ;aucun zéro fictif ne supprime une composante du programme.
- Paramètres de vente et validation dans **piSchoolCommercial**, au début de `assets/site-translations.js`, partagé par les deux pages. Fichier déjà public :aucune ouverture d’accès requise.25/10/CAD, coûts inconnus null. Le moteur ne lit aucun coût interne de mission-control.
- Proposition :le lien transporte uniquement des réglages numériques validés, sans données nominatives, dans l’URL de la page écoles existante. Un récapitulatif visible est joint au champ `Commentaires` du formulaire existant, dans sa limite2000caractères. Les coordonnées saisies restent dans les champs habituels. Aucune API, destination, intégration externe ou deuxième formulaire créé.
- FR/EN :nouveaux textes, états inconnus, libellés, erreurs et récapitulatif traduits avec le mécanisme existant ;formatCAD selon langue ;les valeurs restent en place pendant le changement de langue.
- Visuel :blocs commerciaux noir#0A0A0A/blanc#F4F4EF/lime#CCFF00, cartes empilées sur téléphone, focus visible et ancre directe du budget. Photos/terrain/animations existants conservés.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| index.html | Ordre des sections, tarifs, champs clarifiés, ventilation et lien proposition |
| pour-les-ecoles.html | Offre/financement et conteneur de récapitulatif dans le contact existant |
| assets/site-translations.js | Politique commerciale commune, validation/synthèse et nouvelles traductions |
| assets/school-home.js | Calcul basé sur la politique, validité des réglages et URL de proposition |
| assets/ecoles-contact.js | Récapitulatif visible, limite du commentaire et transmission à l’endpoint existant |
| assets/ecoles.css | Styles commerciaux responsive et focus |
| tests/school-commercial.test.mjs | Vérifications du vrai calcul UI et des contenus conservés |
| tests/school-proposal.test.mjs | Paramètres, coûts inconnus, transmission, succès/échec du contact simulé |
| tests/school-contact-api.test.mjs | Relais de l’API existante avec fetch simulé, aucun courriel réel |
| docs/schools-commercial | Audit, textes du deck à corriger, compte rendu, progression et captures |

## Vérifications exécutées

- `node --test tests/*.test.mjs` :**18/18 réussis**.200élèves→base2 000/reference5 000 ;2 000élèves→20 000/50 000 ;réduction60 ;pas de prix négatif/NaN/zéro trompeur pour effectif invalide ;staff supplémentaire inconnu≠gratuit ;aucune remise liée à davantage d’adultes ;nombre de cliniques inconnu explicite.
- Contact :succès et échec simulés, réponses conservées sur échec, bouton réactivé, message initial conservé, récapitulatif transmis dans Commentaires, API reçoit les données et vise la destination existante. **Aucun message réel envoyé et aucune nouvelle vérification de délivrabilité en production.**
- Syntaxe JS et `git diff --check` réussis. Identifiants HTML uniques. Aucun script build dans ce site statique ;aperçu via serveur HTTP local. L’intégration Git pourra créer un preview Vercel, sans publication production.
- Navigateur1440×900 et390×844 :tarifs, budget2 000élèves, états à confirmer et absence de débordement.200élèves saisis, enseignants25/autres5/simultanés18/durée6 conservés au passageEN. Budget2 000/référence5 000 confirmé ;configuration retrouvée dans la page de contact. Champs nom/commentaires conservés lors du retourFR.
- Saisie0élève :erreur FR explicite, aucun faux montant et lien de proposition inactif jusqu’à correction.200enseignants avec2 000élèves :base toujours20 000. Paramètre séances non rempli :lien valide, résumé« À confirmer ».
- Six zones du terrain ouvertes dans le navigateur, panneaux et fermetureÉchap fonctionnels. Photos et scripts d’animation conservés ;aucun nouveau visuel généré.
- Diff contre main vide pour middleware.js,vercel.json,API,app-portal.js et games-menu.js. Les sept tests de navigation/accès d’origine passent. Aucune route bloquée ou bouton temporairement fermé réactivé. Le serveur statique d’aperçu ne reproduit pas les protections serveur :ne pas s’en servir comme preuve d’autorisation.
- Réduction des animations :nouveaux styles sans mouvement imposé, défilement fluide sous mediaquery no-preference ;pas de validation physique du réglage système par l’outil disponible. Pas de test tactile matériel.

## Aperçu et captures

Depuis le dépôt :`python3 -m http.server 4182 --bind 127.0.0.1`.

- http://127.0.0.1:4182/?lang=fr#tarifs
- http://127.0.0.1:4182/?lang=fr#budget
- http://127.0.0.1:4182/pour-les-ecoles.html?lang=en#tarifs

Voir captures/. Le serveur local ne fonctionne pas pendant l’arrêt du Mac. Le formulaire ne peut pas envoyer via ce serveur statique ;ses scénarios sont testés avec transport simulé. Ne pas annoncer un envoi réel depuis cet aperçu.

## Paramètres encore à définir

1. Configuration d’encadrement comprise dans la base et compétences/rôles attendus ;aucun ratio ou effectif fixe supposé.
2. Prix de **vente** du personnel additionnel et conditions de facturation ;aucun coût de rémunération interne utilisé comme tarif public.
3. Règle de déplacement selon lieu, calendrier et logistique.
4. Traitement des taxes et conditions contractuelles.
5. Nombre/durée des cliniques, créneaux réels des adultes, contraintes et capacité du déploiement, admission à la cohorte et assiette d’élèves facturés.
6. Offre régulière25$ réellement prévue et périmètre comparable, à confirmer avant publication ;l’instruction utilisateur est la source de prix, pas une preuve de ventes antérieures.
7. Source éditable finale de la présentation et identification non ambiguë de la seconde image commerciale. La référence financière historique a été inspectée ;aucune archive ou PDF modifié. PRESENTATION.md donne les corrections et placements, sans recréer le deck.

Ces inconnues n’empêchent pas la revue :elles restent explicites et ne donnent pas lieu à des montants inventés. Attendre validation avant fusion et production.
