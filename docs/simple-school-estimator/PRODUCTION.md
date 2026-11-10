# Mise en production — 10 novembre 2026

Autorisation : validation du nouvel estimateur et demande de fusion/publication sur purinstinctgames.com.
PR32 fusionnée : https://github.com/dominique-source/Purinstinctgames_web/pull/32
Commit main :40b6eaf1abb61b3638c708eafadfc6e12d060c8c.
Projet Vercel existant purinstinct-web, équipe dominique-soucy-s-projects.
Déploiement dpl_93ahFoTqsTJJmTXJpWWh7iaSrDGb READY ; alias purinstinctgames.com vérifié sur ce commit.
Accueil public sans session200 ; nouvel estimateur présent, ancien planner absent.

62 tests Node réussis, syntaxeJS et diffcheck réussis, buildsVercel réussis avant fusion.
Vérifications sur le vrai site,1440×900 et390×844 :
-200élèves,aucunsupplément :2000CAD et10CAD/élève.
-200élèves,2renforts :2800CAD et14CAD/élève.
-200élèves,2renforts,2classes :3550CAD et17,75CAD/élève.
-200élèves,0renfort,4classes :3400CAD et17CAD/élève.
-FR/EN conserve élèves/renforts/classes etNom/Commentaires fictifs ; calculinchangé,formatsmonétaireslocalisés.
-CTAouvreformulaireexistant, récapitulatifvisibleFR/ENcohérentavecquantités,forfait750CAD,montant3550CADetexclusions.
-Custom+multibloc :2800CADpostesconnus,cliniquessurmesureetdéplacementexclus, blocs supplémentaires restantàpréciser, premierblocuniquement, résuméidentiqueaupérimètre.
-Saisieélèvesvide :montant—,aria-invalidtrue,résumépérimémasqué ; restaurations200/2/2valides.
-Aucundébordementhorizontalmobile,consolefraîchesanserreur.
-Aucun clic Envoyer ni courriel réel. Donnéesfictivesdecontrôle retiréesdeschampsensuite.

Aucun changement supplémentaire du code après fusion. APP/protections etapplication/données préservés. Captures de production dans captures/production/.
