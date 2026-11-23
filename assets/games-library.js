/* PürInstinct Games — educational library.
   Content slots are deliberately unpublished until the actual rules are approved.
   Fill approved games in the catalogue below; never infer game rules. */
(() => {
  "use strict";
  const zones = [
    {id:"vitesse",fr:"Vitesse",en:"Speed",image:"vitesse.png",introFr:"Réaction, accélération et vitesse de déplacement.",introEn:"Reaction, acceleration and movement speed."},
    {id:"agilite",fr:"Agilité",en:"Agility",image:"agilite.png",introFr:"Coordination, changements de direction et contrôle du mouvement.",introEn:"Coordination, changes of direction and movement control."},
    {id:"mains",fr:"Habiletés des mains",en:"Hand Skills",image:"habiletes-manuelles.png",introFr:"Contrôle, précision et coordination des mains.",introEn:"Control, accuracy and hand coordination."},
    {id:"pieds",fr:"Habiletés des pieds",en:"Foot Skills",image:"habiletes-au-pied.png",introFr:"Contrôle, précision et coordination des pieds.",introEn:"Control, accuracy and foot coordination."},
    {id:"iq",fr:"Game IQ",en:"Game IQ",image:"game-iq.png",introFr:"Observation, anticipation et prise de décision.",introEn:"Awareness, anticipation and decision making."},
  ];
  // Replace these slots ONLY when each game's title, rules, media and safety are approved.
  const catalogue = zones.flatMap(zone => Array.from({length:3},(_,index)=>({
    id:zone.id+"-"+String(index+1).padStart(2,"0"),
    zoneId:zone.id, number:index+1, status:"draft",
    title:{fr:"",en:""},summary:{fr:"",en:""},
    objective:{fr:"",en:""},equipment:{fr:[],en:[]},
    setup:{fr:"",en:""},steps:{fr:[],en:[]},scoring:{fr:"",en:""},
    levels:{fr:[],en:[]},safety:{fr:"",en:""},teacherTips:{fr:"",en:""},
    videoUrl:"",imageUrl:"",durationMinutes:null,diagrams:[],mediaType:"video",quickVideoUrl:"",fullVideoUrl:"",approvedAt:null
  })));
  const byId = id => catalogue.find(game=>game.id===id);
  const zoneById = id => zones.find(zone=>zone.id===id);
  const query = new URLSearchParams(location.search);
  let lang = query.get("lang") || (()=>{try{return localStorage.getItem("pi_lang")||"fr"}catch{return "fr"}})();
  if(lang!=="en") lang="fr";
  const label=(fr,en)=>lang==="en"?en:fr;
  const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const txt=obj=>escapeHtml(obj?.[lang]||obj?.fr||"");
  const href=(params={})=>{
    const q=new URLSearchParams();
    if(lang==="en")q.set("lang","en");
    for(const [k,v] of Object.entries(params))if(v)q.set(k,v);
    const base=params.jeu ? "/jeux/"+params.jeu.replace(/-\d+$/,"")+"/jeu-"+params.jeu.split("-").at(-1) : params.zone ? "/jeux/"+params.zone : "/jeux";
    return base+(q.size?"?"+q.toString():"");
  };
  function pageTitle(fr,en){document.title=label(fr,en)+" | PürInstinct Games";}
  function zoneCard(zone){
    return `<a class="library-zone" href="${href({zone:zone.id})}" aria-label="${escapeHtml(label(zone.fr,zone.en))}">
      <img src="/assets/homepage/${zone.image}" loading="lazy" alt="">
      <div class="library-zone-overlay"><span class="library-count">${label("03 JEUX","03 GAMES")}</span>
      <h2>${escapeHtml(label(zone.fr,zone.en))}</h2><span class="library-linktext">${label("EXPLORER LA ZONE","EXPLORE ZONE")} <span aria-hidden="true">↗</span></span></div>
    </a>`;
  }
  function gameCard(game){
    const approved=game.status==="published";
    const name=approved?txt(game.title):label("Jeu "+String(game.number).padStart(2,"0"),"Game "+String(game.number).padStart(2,"0"));
    return `<article class="library-game"><span class="library-count">${escapeHtml(game.id.toUpperCase())}</span>
    <h3>${name}</h3><p>${approved?txt(game.summary):label("Tutoriel en préparation. Règles à valider.","Tutorial in preparation. Rules pending approval.")}</p>
    <p class="library-game-meta">${game.durationMinutes?escapeHtml(game.durationMinutes)+" min · ":""}${label("Matériel","Equipment")} : ${approved&&game.equipment?.[lang]?.length?game.equipment[lang].map(escapeHtml).join(", "):label("À confirmer","To be confirmed")}</p>
    ${approved?`<a class="library-button" href="${href({jeu:game.id})}">${label("VOIR LE TUTORIEL","VIEW TUTORIAL")} ↗</a>`:`<a class="library-status library-draft-link" href="${href({jeu:game.id})}">${label("FICHE EN PRÉPARATION","DRAFT TUTORIAL")} ↗</a>`}</article>`;
  }
  function videoBlock(game){
    const video=game.fullVideoUrl || game.videoUrl;
    // Restrict embeds to secure hosts and local assets; never accept arbitrary HTML.
    if(video && (/^https:\/\/(www\.)?(youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|player\.vimeo\.com\/video\/)/.test(video))){
      return `<iframe loading="lazy" src="${escapeHtml(video)}" title="${label("Tutoriel vidéo","Video tutorial")}" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
    if(video && /^\/assets\/[a-z0-9/_\-.]+\.mp4$/i.test(video)){
      return `<video src="${escapeHtml(video)}" controls playsinline preload="metadata"></video>`;
    }
    return `<div class="library-video-placeholder"><span>${label("VIDÉO EN PRÉPARATION","VIDEO COMING SOON")}</span></div>`;
  }
  const section=(title,body)=>`<section class="library-tutorial-section"><h2>${title}</h2><div>${body||label("À confirmer après validation.","To be confirmed after approval.")}</div></section>`;
  function tutorial(game){
    const zone=zoneById(game.zoneId);
    const string=value=>txt(value)||label("À confirmer après validation.","To be confirmed after approval.");
    const steps=(game.steps?.[lang]||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join("");
    const equipment=(game.equipment?.[lang]||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join("");
    const levels=(game.levels?.[lang]||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join("");
    const siblings=catalogue.filter(g=>g.zoneId===game.zoneId);
    const pos=siblings.findIndex(g=>g.id===game.id);
    return `<div class="library-tutorial">
      <p class="library-eyebrow">${escapeHtml(label(zone.fr,zone.en))}</p>
      <h2>${txt(game.title)||label("Jeu ","Game ")+String(game.number).padStart(2,"0")}</h2><p class="library-status">${game.status==="published"?label("OFFICIEL","OFFICIAL"):label("BROUILLON — NON VALIDÉ","DRAFT — UNAPPROVED")}</p>
      <div class="library-video">${game.status==="published"?videoBlock(game):`<div class="library-video-placeholder">${label("VIDÉO EN PRÉPARATION","VIDEO COMING SOON")}</div>`}</div>
      ${section(label("OBJECTIF","OBJECTIVE"),`<p>${string(game.objective)}</p>`)}
      ${section(label("MATÉRIEL","EQUIPMENT"),equipment?`<ul>${equipment}</ul>`:"")}
      ${section(label("PRÉPARATION DU TERRAIN","FIELD SETUP"),`<p>${string(game.setup)}</p>`)}
      ${section(label("COMMENT JOUER","HOW TO PLAY"),steps?`<ol>${steps}</ol>`:"")}
      ${section(label("POINTAGE","SCORING"),`<p>${string(game.scoring)}</p>`)}
      ${section(label("NIVEAUX","LEVELS"),levels?`<ul>${levels}</ul>`:"")}
      ${section(label("SÉCURITÉ","SAFETY"),`<p>${string(game.safety)}</p>`)}
      ${section(label("CONSEILS POUR LES ENSEIGNANTS","TEACHER TIPS"),`<p>${string(game.teacherTips)}</p>`)}
      <div class="library-tutorial-nav">${pos>0?`<a href="${href({jeu:siblings[pos-1].id})}">← ${label("JEU PRÉCÉDENT","PREVIOUS GAME")}</a>`:""}
      <a href="${href({zone:zone.id})}">${label("RETOUR À LA ZONE","BACK TO ZONE")}</a>
      ${pos>=0 && pos<siblings.length-1?`<a href="${href({jeu:siblings[pos+1].id})}">${label("JEU SUIVANT","NEXT GAME")} →</a>`:""}</div></div>`;
  }
  function render(){
    const parts=location.pathname.split("/").filter(Boolean);
    const pathZone=parts[0]==="jeux"?parts[1]:null;
    const pathGame=parts[0]==="jeux" && /^jeu-\d{2}$/.test(parts[2]||"")?pathZone+"-"+parts[2].slice(4):null;
    const chosenGame=byId(pathGame||query.get("jeu")),chosenZone=zoneById(pathZone||query.get("zone"));
    const activeGame=chosenGame||null;
    const zone=activeGame?zoneById(activeGame.zoneId):chosenZone;
    const title=document.getElementById("library-title");
    const intro=document.getElementById("library-intro");
    const disclaimer=document.getElementById("library-disclaimer");
    const crumb=document.getElementById("library-breadcrumb");
    const root=document.getElementById("library-content");
    document.getElementById("library-eyebrow").textContent=label("BIBLIOTHÈQUE PÉDAGOGIQUE","LEARNING LIBRARY");
    if(activeGame){
      title.innerHTML=txt(activeGame.title);intro.textContent=txt(activeGame.summary);
      disclaimer.hidden=activeGame.status==="published";
      disclaimer.textContent=label("Fiche en préparation : les informations pédagogiques ne sont pas encore validées.","Draft tutorial: pedagogical information has not yet been approved.");
      root.innerHTML=tutorial(activeGame);
      crumb.innerHTML=`<a href="${href()}">${label("Jeux","Games")}</a> / <a href="${href({zone:zone.id})}">${escapeHtml(label(zone.fr,zone.en))}</a>`;
      pageTitle(activeGame.title.fr,activeGame.title.en);
    }else if(zone){
      title.textContent=label(zone.fr,zone.en).toUpperCase();
      intro.textContent=label(zone.introFr,zone.introEn);
      disclaimer.hidden=false;
      disclaimer.textContent=label("Les tutoriels apparaîtront après validation des jeux.","Tutorials will appear after the games have been approved.");
      crumb.innerHTML=`<a href="${href()}">${label("Jeux","Games")}</a> / ${escapeHtml(label(zone.fr,zone.en))}`;
      root.innerHTML=`<img class="library-zone-banner" src="/assets/homepage/${zone.image}" alt=""><div class="library-game-grid">${catalogue.filter(g=>g.zoneId===zone.id).map(gameCard).join("")}</div>`;
      pageTitle(zone.fr,zone.en);
    }else{
      title.innerHTML=label("15 JEUX. <em>5 ZONES.</em> UNE EXPÉRIENCE.","15 GAMES. <em>5 ZONES.</em> ONE EXPERIENCE.");
      intro.textContent=label("Découvre les jeux, apprends les règles et prépare-toi aux PürInstinct Games.","Discover the games, learn the rules and get ready for PürInstinct Games.");
      disclaimer.hidden=false;disclaimer.textContent=label("Bibliothèque en préparation : les règles et tutoriels seront publiés après leur validation.","Library in development: official rules and tutorials will be published after approval.");
      crumb.innerHTML="";root.innerHTML=`<div class="library-zone-grid">${zones.map(zoneCard).join("")}</div>`;
      pageTitle("Jeux et tutoriels","Games and tutorials");
    }
    document.querySelector('[data-library-nav-zones]').textContent=label("Les 5 zones","The 5 Zones");
    document.querySelector('[data-library-nav-games]').textContent=label("JEUX","GAMES");
    document.querySelector('[data-library-nav-program]').textContent=label("Le programme","The Program");
    document.querySelector('[data-library-nav-budget]').textContent=label("Estimer mon budget","Estimate My Budget");
    document.querySelector('[data-library-nav-contact]').textContent="Contact";
    document.querySelectorAll(".site-language button").forEach(b=>b.setAttribute("aria-pressed",String(b.lang===lang)));
    document.documentElement.lang=lang;
    document.querySelectorAll('a[href^="/"]').forEach(a=>{
      if(a.classList.contains("home-logo"))return;
      const u=new URL(a.href);if(u.origin!==location.origin)return;
      if(lang==="en")u.searchParams.set("lang","en");else u.searchParams.delete("lang");
      a.href=u.pathname+u.search+u.hash;
    });
  }
  document.querySelectorAll(".site-language button").forEach(button=>button.addEventListener("click",()=>{
    lang=button.lang;
    try{localStorage.setItem("pi_lang",lang)}catch{}
    if(lang==="en")query.set("lang","en");else query.delete("lang");
    history.replaceState(null,"",location.pathname+(query.size?"?"+query.toString():""));
    render();
  }));
  render();
})();
