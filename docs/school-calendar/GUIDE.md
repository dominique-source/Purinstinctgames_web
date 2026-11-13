# Ajouter une école et ses dates

## Accès privé
Ouvrir `/calendar-admin.html` sur le même domaine que le site, se connecter par le parcours par courriel existant, puis rouvrir cette adresse. Seules les adresses explicitement autorisées dans `CALENDAR_ADMIN_EMAILS` peuvent lire ou modifier les données administratives. Une simple session du site ne suffit pas. Aucun lien de gestion n’est ajouté au menu public.

## Ajouter ou modifier une école
1. Onglet **Écoles**, rechercher la fiche avant de cliquer sur **Ajouter**. Vanier existe déjà.
2. Renseigner nom, ville, région et une seule cohorte.
3. Choisir **Participante** et **Visible au public** pour afficher l’école. Une participante occupe une place même sans dates et même si sa visibilité est désactivée.
4. Les coordonnées et notes privées sont réservées aux administrateurs. Enregistrer et attendre **Enregistrement confirmé**.

## Ajouter ses dates
1. Sur la fiche de l’école, cliquer sur **Ajouter une activité**.
2. Choisir conférence, clinique préparatoire, formation ou événement final. Plusieurs cliniques sont possibles.
3. Renseigner début et fin dans le fuseau **America/Toronto**. La fin doit suivre le début. Les heures impossibles ou ambiguës au changement d’heure sont refusées : choisir une heure non ambiguë.
4. Choisir **Provisoire** ou **Confirmé**, indépendamment de la publication.
5. **Brouillon privé** ne sort jamais dans le calendrier public. **Publié** apparaît après actualisation, au plus tard au prochain rafraîchissement visible (60 secondes), sans déploiement.
6. Pour retirer une date, revenir en brouillon. La suppression demande confirmation. Les chevauchements sont signalés, sans bloquer automatiquement.

## Disponibilités et cohortes
Dans **Disponibilités**, créer une plage explicite, ses types possibles, son statut disponible/indisponible et sa publication. Seules les plages disponibles publiées sont publiques. Un jour vide ne signifie jamais disponible. Un clic public prépare une demande dans le formulaire : aucune réservation automatique.

Dans **Cohortes**, modifier intitulé, capacité, période et visibilité. Hypothèse retenue : Région de Québec et Ailleurs au Québec sont deux groupes distincts, chacun de 10 initialement. Aucun total provincial additionné n’est affiché. Les compteurs ne deviennent pas négatifs.

## Test local
- `node scripts/calendar-dev.mjs` : aperçu Vanier sans dates sur http://127.0.0.1:4184/.
- `node scripts/calendar-dev.mjs --demo` : http://127.0.0.1:4185/, écoles et dates explicitement fictives.
- Gestion : `/calendar-admin.html`. Le lien de connexion de démonstration n’existe que dans le serveur local et utilise un compte fictif.
- Persistance locale : fichiers `/tmp/purinstinct-calendar-local.json` et `/tmp/purinstinct-calendar-demo.json` (non versionnés). Ne pas les utiliser comme sauvegarde durable. Le serveur conserve le fichier existant au redémarrage.

## Avant une utilisation distante
Suivre [CONFIGURATION.md](CONFIGURATION.md). Sans ces paramètres, l’interface signale l’indisponibilité ; elle ne prétend pas avoir enregistré. Ne pas publier cette branche comme un calendrier opérationnel avant vérification du stockage et de la connexion réelle de l’administrateur.
