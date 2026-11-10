import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html');
const journey=html.slice(html.indexOf('<section class="school-section school-journey"'),html.indexOf('<section class="school-offer"'));
const normal=s=>s.replace(/\s+/g,' ').trim();
test('one journey contains exactly the three approved phases and descriptions',()=>{
 assert.equal((html.match(/id="parcours"/g)||[]).length,1);
 assert.equal((journey.match(/<article /g)||[]).length,3);
 for(const copy of ['DE LA DÉCOUVERTE AUX','Un programme déployé sur plus d’un mois, selon le calendrier de votre école.','AVANT LES GAMES','LE JOUR DES GAMES','APRÈS LES GAMES','Conférence, cliniques et formation des enseignants.','Installation, activités, matchs et animation.','Photos, vidéos et mini-documentaire : le projet raconté par les élèves.'])assert.ok(normal(journey).includes(copy),copy);
 assert.doesNotMatch(html,/Plus d’un mois\. Un parcours (préparé|planifié) ensemble\./);
 assert.match(journey,/id="deploiement"/);
});
test('the illustrative portfolio is a four-image mosaic with no fake controls or empty links',()=>{
 const mosaic=journey.match(/<div class="journey-visual journey-mosaic"[\s\S]*?<\/div>/)[0];
 assert.equal((mosaic.match(/<figure /g)||[]).length,4);
 assert.equal((mosaic.match(/<img /g)||[]).length,4);
 assert.match(mosaic,/data-portfolio-state="illustrative"/);
 assert.match(mosaic,/Visuels illustratifs/);
 assert.doesNotMatch(journey,/<a\b|<button\b|<iframe\b|<video\b|onclick|pointer-surface/);
 assert.doesNotMatch(journey,/ballons pédagogiques|récupéré après/);
 for(const img of journey.matchAll(/<img ([^>]+)>/g)){
  assert.match(img[1],/loading="lazy"/);assert.match(img[1],/width="\d+" height="\d+"/);assert.match(img[1],/alt="[^"]+"/);
  const path=img[1].match(/src="\/([^"]+)"/)[1];assert.ok(readFileSync(new URL('../'+path,import.meta.url)).length>0);
 }
});
test('logistics remain within the existing package details rather than under the cards',()=>{
 const details=html.match(/<details class="config-method">[\s\S]*?<\/details>/)[0];
 for(const copy of ['Définir les besoins, les espaces, les ressources et le calendrier avec l’école.','Accompagnement et coordination','équipements et production','DJ et sonorisation','Les ballons pédagogiques restent à l’école.','Le matériel des Games est récupéré après l’événement.'])assert.ok(details.includes(copy),copy);
});
test('all approved English copy and new accessible descriptions use the existing dictionary',()=>{
 const context={window:{}};runInNewContext(read('assets/site-translations.js'),context);
 const map=context.window.piTranslations;
 const expected={'DE LA DÉCOUVERTE AUX':'FROM DISCOVERY TO THE','Un programme déployé sur plus d’un mois, selon le calendrier de votre école.':'A program delivered over more than a month, according to your school’s schedule.','AVANT LES GAMES':'BEFORE THE GAMES','LE JOUR DES GAMES':'GAMES DAY','APRÈS LES GAMES':'AFTER THE GAMES','Conférence, cliniques et formation des enseignants.':'Talk, clinics and teacher training.','Installation, activités, matchs et animation.':'Setup, activities, matches and entertainment.','Photos, vidéos et mini-documentaire\u00a0: le projet raconté par les élèves.':'Photos, videos and a mini-documentary: the project told by students.'};
 for(const [fr,en] of Object.entries(expected))assert.equal(map[fr],en);
 for(const attr of journey.matchAll(/(?:alt|aria-label)="([^"]+)"/g))assert.ok(map[attr[1]],attr[1]);
});
