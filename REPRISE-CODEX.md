# Reprise — publication calendrier et bracelet

14 novembre 2026. Dépôt dominique-source/Purinstinctgames_web, dossier /Users/client/Documents/ChatGPT/purinstinct-web-app-review.
Branche codex/calendar-wristband-release : intégration de codex/calendar-oidc et codex/wristband-app-preview, héritant du calendrier de PR40.

## Terminé
- Calendrier et gestion privée, rôle serveur limité à dominique@purinstinct.com.
- Firebase calendrier dédié sans facturation, OIDC strictement purinstinct-web/production, aucune clé permanente.
- Connexion réelle et persistance d’un brouillon vérifiées sur déploiement isolé; données publiques filtrées.
- Nouvelle section bracelet avec maquettes de téléphones explicitement illustratives et données fictives; FR/EN HTML.
- Réunion des branches validées; seul conflit : ce document de reprise, actualisé sans toucher aux fonctionnalités.

## Vérifications
Voir docs/school-calendar/OIDC-STATUS.md, CONFIGURATION.md et BRACELET-APP.md. Refaire la suite complète sur la branche intégrée avant fusion. Le domaine public est encore sur b3e3e52 au début de cette publication.

## Autorisation
Le propriétaire a demandé de tout publier, puis a demandé expressément pourquoi calendrier et bracelet ne sont pas en ligne. La mise en ligne de ces éléments validés est autorisée. Le serveur scolaire de répétition du dépôt purinstinct-app reste séparé et ne doit pas être présenté comme un backend de production.

## Prochaine action
Valider tests et ressources publiques de la version combinée, fusionner dans main via GitHub, surveiller le déploiement du projet Vercel EXISTANT purinstinct-web, puis vérifier purinstinctgames.com/#bracelet et /#school-calendar sans connexion, ainsi que /calendar-admin.html après connexion normale. Consigner SHA et URL exacts.

## Limites
Pas de dates inventées : Vanier seule, aucune activité publiée au dernier contrôle. Les téléphones illustrés gardent leurs libellés français incrustés; les textes HTML et alternatives sont bilingues. Aucun besoin de clé permanente. Ne jamais reprendre l’ancienne proposition de clé JSON, remplacée par OIDC.

## Publication terminée et vérifiée
PR43 fusionnée dans main b49bd86ce1d718420efde99aebcc5b266e63955b. Projet Vercel purinstinct-web, déploiement READY dpl_4c8evckeDRE48NEkMXhLCDSPo3PT, alias purinstinctgames.com vérifié. Bracelet/téléphones et calendrier accessibles sans connexion; API privée401sanssession, gestion ouverte après authentification normale de Dominique. FR/EN et390×844 vérifiés;96tests réussis. Voir docs/school-calendar/PRODUCTION-20261114.md.
Prochaine action : ajouter les dates réelles via la gestion privée lorsque Dominique les fournit; ne pas recréer le calendrier ou son OIDC. Les corrections de compétition sont dans un autre dépôt, non publiées.
