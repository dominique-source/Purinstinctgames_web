# Calendrier déployable — publication autorisée le16novembre2026

Branche codex/calendar-deployable, base main b49bd86. Modification limitée à la présentation publique du calendrier et à sa représentation HTML de secours.

Bande compacte fermée par défaut, bouton unique accessible, aria-expanded/controls, contenu inert fermé, focus restauré sans scroll. Ligne cyan, déploiement naturel CSS Grid560ms, fermeture360ms, fondu/translation courts, interruption fluide des clics rapides. Pas de hauteur maximale arbitraire, pas de démontage des sélections ou de requête déclenchée par l’ouverture. La minuterie de rafraîchissement existante reste inchangée.

FR/EN par le système existant. Reduced-motion : transitions supprimées et activation désactivée, couvert par tests; bascule réelle du réglage système non exercée dans l’outil.

Sans JavaScript : lien vers la représentation HTML GET du même calendrier public, filtrée par publicView avant rendu, avec mois et école en formulaire natif. Aucune nouvelle route de gestion, écriture, variable ou permission. Les réponses JSON et protections existantes sont conservées.

Validation avant fusion :102tests Node réussis; contrôles syntaxiques modules/API; git diff --check. Recette locale précédente :1440×1000 et390×844, Enter/Espace/Échap, focus, huit clics rapides, conservation école/mois/journée finale, FR/EN et hauteurs naturelles. Captures/GIF dans le dossier de visualisations calendrier-deployable-20261114.

Suite :fusionner dans main via GitHub; vérifier le déploiement du projet Vercel existant purinstinct-web, puis ouvrir/fermer sur le domaine public ordinateur/mobile, vérifier les filtres/mois et les refus d’accès privé. Aucun vrai élève ni date fictive publiée.
