# PÜRINSTINCT GAMES — Animation Engine / Phase 1

## Statut

**Prototype technique isolé.** Démonstration fictive, **pas** un jeu officiel PürInstinct. Ne pas intégrer au catalogue JEUX ni publier en tant que tutoriel sans approbation.

## Lancer localement

```bash
cd purinstinct-animation-engine-phase1
python3 -m http.server 8080
```

Ouvrir http://localhost:8080 sur l'ordinateur. Le navigateur doit avoir accès à Internet pour charger la bibliothèque Three.js épinglée en version `0.180.0` via jsDelivr et, facultativement, les fontes Barlow. Aucune API, clé, compte, génération vidéo ou service payant n'est utilisé. Si WebGL est absent, un message explicite s'affiche.

## Contenu

- `index.html` : interface autonome, sans dépendance à la navigation de production.
- `styles.css` : direction artistique PürInstinct et disposition responsive.
- `engine.js` : rendu Three.js, scène de démonstration, avatars techniques, contrôles, caméras, mouvements, ballon, chronologie.
- `demo-scenario.json` : **toutes les positions, séquences, identités fictives des avatars et passes de cette démonstration**. Le moteur lit les valeurs et ne prétend pas reproduire un match officiel.

## Fonctionnalités de la phase 1

- Un environnement fictif sombre avec une enceinte stylisée, repères et éclairage 3D.
- Trois mannequins sportifs articulés provisoires, visuellement variés, qui se déplacent sur des trajectoires indépendantes.
- Un ballon avec deux passes paraboliques fictives, associées aux personnages.
- Une vue isométrique et une vue aérienne programmables.
- Lecture, pause, recommencer, chapitres explicatifs synchronisés.
- Mobile / tablette / ordinateur : disposition adaptative, résolution WebGL plafonnée pour limiter la consommation.
- Aucun changement au site public.

## Limites / décisions à approuver

1. Les figurines sont paramétriques (qualité de **prototype technique**, pas photoréalisme ou animation biomécanique finale). Les modèles 3D GLB, les animations motion-capture et les portraits fidèles nécessiteront la phase 2.
2. L'enceinte est une **géométrie illustrative de 20 × 12 unités graphiques**. Ce n'est **pas** un terrain PürInstinct officiel et aucune échelle de mètres n'est revendiquée.
3. Les règles illustrées dans les captures sont considérées comme références à confirmer avant toute modélisation officielle.
4. Aucun export MP4, aucun son et aucun tutoriel de l'un des 15 jeux n'a été créé.
5. Le rendu n'a pas encore fait l'objet d'une recette visuelle sur l'ensemble des appareils et des navigateurs cibles. Vérifier la fluidité réelle sur iPhone/iPad et ordinateurs avant validation.
6. Les chemins utilisent une interpolation lissée; les pas et les mouvements des bras sont approximatifs. Ils ne valident aucune biomécanique ni consigne de sécurité.
7. La phase 1 charge Three.js depuis un CDN. Lors d'une intégration future, il faudra le versionner localement ou bundler pour garantir la disponibilité.

## Architecture des phases futures (non réalisées)

Une bibliothèque d'environnements et d'assets mutualisés, puis un moteur de scénarios JSON versionnés, puis **un seul** jeu officiel validé, puis intégration JEUX, puis ajout progressif des 15 jeux. Aucun travail des phases 2 à 6 n'est inclus ici.

## Validation minimale technique

```bash
node --check engine.js
python3 -m json.tool demo-scenario.json >/dev/null
```

Le test syntaxique ne prouve **pas** qu'un rendu WebGL a été exécuté sur l'appareil de l'utilisateur.
