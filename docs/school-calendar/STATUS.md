# Livraison de revue — bracelet, écoles et calendrier

Branche : `codex/school-calendar-wristband`. Base : main `b3e3e52`. Aucun changement dans le dépôt de compétition. Aucune fusion, aucun déploiement de production, aucune modification d’environnement Vercel, aucun courriel de test.

## Réalisé
- Section bracelet avant l’offre commerciale : produit officiel sans bras et scènes extraites des images fournies, texte HTML bilingue et sources conservées.
- Deux cohortes distinctes et configurables. École secondaire Vanier à Québec, participante, sans date inventée. Comptage des participantes, y compris cachées ; doublons de nom/ville normalisés ; places restantes bornées à zéro.
- Calendrier mensuel, agenda mobile, filtre/réinitialisation, navigation mensuelle, détails, étoile et panneau final, export ICS. Disponibilités publiées explicites seulement. Les demandes rejoignent le formulaire existant sans réserver ni envoyer.
- Gestion privée persistante des écoles, cohortes, événements et plages. Brouillon/publication distincts de provisoire/confirmé. Notes et contacts privés exclus de la projection publique. Rôle serveur explicite et règles client fermées.
- Stockage local de test et adaptateur Firestore distant avec écriture conditionnelle. Initialisation sans écrasement ; démo interdite dans l’adaptateur distant.

## Vérifications exécutées
- `node --test tests/*.test.mjs` : **92 réussites, 0 échec**.
- `node --check` sur les trois modules navigateur, l’API et le script d’initialisation : réussi.
- Le dépôt est statique, sans script de compilation dans package.json : aucun build de framework à lancer. Les modules ES sont servis et exécutés dans le navigateur local.
- Tests automatisés : comptage/complétude/doublons, plusieurs cliniques, confidentialité, publication/dépublication/suppression, plages explicites, conflits et pannes, sessions expirées/mauvais rôle/CSRF, persistance après réouverture, Toronto/changements d’heure, préconditions REST simulées.
- Test de non-régression : retrait des seuls ajouts à index.html puis comparaison SHA-256 avec la version de base : toutes les sections, le calculateur et le formulaire préexistants restent identiques.
- Navigateur 1440×1000 et 390×844 : bracelet, global, filtre Horizon fictif, événement final, agenda, gestion FR/EN ; aucun débordement constaté.
- Clinique fictive créée en brouillon, retrouvée après rechargement, publiée, dépubliée, puis supprimée avec confirmation. Note privée conservée côté gestion seulement.
- Passage EN : filtre, mois et événement final conservés. Saisies de l’estimateur (350 élèves) et du formulaire conservées. Champ privé non enregistré conservé au passage FR dans la gestion.
- Fenêtre d’activité : Échap ferme et restaure le focus au déclencheur. Boutons de place libre/disponibilité : commentaire existant conservé, demande ajoutée, aucun envoi.
- Après redémarrage : API réelle 200, seulement Vanier, zéro événement, places 9/10 ; API démo 200, six événements, pas de clinique QA résiduelle. GET de gestion sans session : 401 sur les deux serveurs. Aucun champ privé dans les réponses publiques.

## Limite distante — à configurer et vérifier
La gestion distante n’est **pas encore opérationnelle**. Il manque `CALENDAR_ADMIN_EMAILS`, `CALENDAR_FIRESTORE_PROJECT_ID`, `CALENDAR_SERVICE_ACCOUNT_KEY`. Le stockage Firestore n’a pas été joint avec des identifiants réels. Les tests de son transport sont simulés et ne remplacent pas une vérification sur Preview. Voir [CONFIGURATION.md](CONFIGURATION.md). Aucun contournement de sécurité ni fausse réussite.

L’environnement utilisé est l’ordinateur local, pas une exécution cloud autonome. Les aperçus dépendent de ses serveurs. La branche distante conserve le code et les captures ; elle n’héberge pas les fichiers de données locaux.

## Aperçus et captures
- Réel : http://127.0.0.1:4184/#school-calendar (Vanier, dates à venir).
- Démonstration fictive : http://127.0.0.1:4185/#school-calendar ; gestion `/calendar-admin.html` avec connexion locale de démonstration.
- [Bracelet ordinateur](captures/bracelet-ordinateur.png), [bracelet mobile](captures/bracelet-mobile.png).
- [Global](captures/calendrier-global.png), [école](captures/calendrier-ecole.png), [final](captures/calendrier-final.png).
- [Agenda mobile](captures/agenda-mobile.png), [final mobile](captures/final-mobile.png), [Vanier mobile](captures/vanier-mobile.png).
- [Gestion ordinateur](captures/admin-ordinateur.png), [gestion mobile](captures/admin-mobile.png).
- [Guide court : Ajouter une école et ses dates](GUIDE.md).

Les captures du calendrier peuplé et de la gestion utilisent exclusivement les données fictives signalées. Noms propres et lieu saisi restent tels qu’enregistrés lorsque la langue change. Les trois états de maquette sont de vrais composants, pas des captures utilisées comme interface. La grille finale emploie des libellés courts dans les petites cellules ; leurs noms accessibles restent complets. Sur mobile, la grille disparaît au profit de l’agenda.

## Fichiers
`index.html`, traductions et whitelist middleware reçoivent les seuls raccords au site existant. Nouveaux modules/CSS dans `assets/`, images dans `assets/school-calendar/`, API `api/school-calendar.js`, modèle/stockages `lib/calendar/`, page privée `calendar-admin.html`, outils locaux et initialisation `scripts/`. Tests adaptés pour cibler précisément leurs sections historiques, sans retirer leurs assertions fonctionnelles. Sources, règles, guide et captures dans `docs/school-calendar/`.
