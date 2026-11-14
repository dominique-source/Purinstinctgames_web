# Publication effective —14novembre2026

Le calendrier scolaire et le nouveau visuel bracelet sont en production sur le site public.
- Dépôt dominique-source/Purinstinctgames_web.
- PR43 fusionnée : https://github.com/dominique-source/Purinstinctgames_web/pull/43
- Main : b49bd86ce1d718420efde99aebcc5b266e63955b.
- Vercel existant purinstinct-web, équipe dominique-soucy-s-projects.
- Déploiement READY : dpl_4c8evckeDRE48NEkMXhLCDSPo3PT.
- Alias purinstinctgames.com vérifié sur ce déploiement.

Liens : https://purinstinctgames.com/#bracelet ; https://purinstinctgames.com/#school-calendar ; gestion privée https://purinstinctgames.com/calendar-admin.html.

Vérifications :96tests Node réussis; syntaxe modules/API;4images WebP HTTP200 sans cookie; accueil HTTP200 avec les deux sections; API calendrier publique200 avec champs autorisés seulement; API gestion sans session401; page gestion sans session302versaccess.html. Lecture normale après authentification courriel de dominique@purinstinct.com réussie sur le domaine public; Vanier retrouvée. Aucun faux cookie ou clé permanente.

Navigateur ordinateur et téléphone390×844 : bracelet, téléphones empilés, calendrier/agenda, filtre Vanier et navigation au mois suivant. FR/EN fonctionnel;325élèves et commentaire non envoyé conservés au changement de langue; notes privées non enregistrées conservées au changement de langue dans la gestion mobile puis effacées du champ sans sauvegarde. Pas de débordement global constaté. Captures PNG dans ce dossier.

Données réelles : Vanier seule, aucune activité/date publiée; affichage Dates à venir correct. Aucune date fictive ajoutée pour remplir le calendrier. Les écrans de téléphones sont explicitement des maquettes de démonstration; leurs libellés incrustés restent français.

Observabilité : aucune erreur runtime remontée pour /api/school-calendar dans la fenêtre1h au contrôle. Aucun monitoring nouveau configuré.

L’app de compétition n’a pas été republiée : son nouveau serveur scolaire est local et distinct. Ne pas confondre sa préparation avec cette publication commerciale.
