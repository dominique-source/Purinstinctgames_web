// Versioned school commercial policy. Only confirmed rules are priced.
window.piSchoolCommercial = (() => {
  const blockHours = 4;
  const reinforcementHourlyRate = 100;
  const policy = Object.freeze({version:'school-blocks-2026-11-09',currency:'CAD',regularRate:25,pilotRate:10,
    blockHours,baseStaff:3,reinforcementHourlyRate,reinforcementBlockRate:blockHours*reinforcementHourlyRate,
    extraBlockRate:null,travel:null,taxes:null,zoneGamesPerArea:2,
    field:Object.freeze({playing:14,waiting:14,transition:14,adults:3}),
    game:Object.freeze({playing:6,waiting:6,transition:6,adults:1})});
  // Technical input bounds, not eligibility, staffing or commercial limits.
  const limits = Object.freeze({students:999999,areas:999,installations:999,adults:9999,blocks:12,label:60,notes:300,summary:10000});
  const integer = (v,min,max) => !(typeof v==='string' && v.trim()==='') && v !== '' && v !== null && v !== undefined && typeof v !== 'boolean' && Number.isSafeInteger(Number(v)) && Number(v)>=min && Number(v)<=max;
  function migrate(raw) {
    if (!raw || typeof raw!=='object' || Array.isArray(raw)) return raw;
    if ('blocks' in raw || raw.version===policy.version) return raw;
    // Old totals are NOT evidence of simultaneous availability. Preserve them as context only.
    if (!integer(raw.students,1,limits.students)) return raw;
    return {version:policy.version,students:raw.students,indoors:raw.indoors,outdoors:raw.outdoors,clinics:raw.clinics??null,notes:'',
      legacy:{teachers:raw.teachers,adults:raw.adults,roles:raw.roles,hours:raw.hours,zones:raw.zones},
      blocks:[{id:'b1',label:'',students:raw.students,fields:1,games:9,teachers:0,adults:0,override:false,indoors:raw.indoors,outdoors:raw.outdoors}]};
  }
  function validate(input) {
    const raw=migrate(input),errors=[];
    if(!raw || typeof raw!=='object' || Array.isArray(raw))return {value:null,errors:[{path:'students',code:'numbers'}]};
    const number=(value,min,max,path)=>{if(!integer(value,min,max)){errors.push({path,code:'numbers'});return null;}return Number(value);};
    const c={version:policy.version,students:number(raw.students,1,limits.students,'students'),indoors:number(raw.indoors,0,limits.areas,'indoors'),outdoors:number(raw.outdoors,0,limits.areas,'outdoors'),
      clinics:raw.clinics===''||raw.clinics==null?null:number(raw.clinics,1,999,'clinics'),notes:typeof raw.notes==='string'?raw.notes.trim():'',blocks:[]};
    if(c.notes.length>limits.notes)errors.push({path:'config-notes',code:'notes'});
    if(!Array.isArray(raw.blocks)||raw.blocks.length<1||raw.blocks.length>limits.blocks)return {value:null,errors:[...errors,{path:'block-count',code:'blocks'}]};
    const seen=new Set();
    for(const [i,b] of raw.blocks.entries()){
      if(!b || typeof b!=='object'){errors.push({path:'block-count',code:'numbers'});continue;}
      const id=typeof b.id==='string'&&/^[a-zA-Z0-9_-]{1,30}$/.test(b.id)?b.id:'b'+(i+1);
      if(seen.has(id))errors.push({path:'block-count',code:'blocks'});seen.add(id);
      const path=key=>'cfg-'+id+'-'+key;
      const block={id,label:typeof b.label==='string'?b.label.trim():'',students:number(b.students,1,limits.students,path('students')),
        fields:number(b.fields,0,limits.installations,path('fields')),games:number(b.games,0,limits.installations,path('games')),
        teachers:number(b.teachers,0,limits.adults,path('teachers')),adults:number(b.adults,0,limits.adults,path('adults')),override:b.override===true};
      if(block.label.length>limits.label)errors.push({path:path('label'),code:'label'});
      block.indoors=block.override?number(b.indoors,0,limits.areas,path('indoors')):c.indoors;
      block.outdoors=block.override?number(b.outdoors,0,limits.areas,path('outdoors')):c.outdoors;
      if(block.students!==null&&c.students!==null&&block.students>c.students)errors.push({path:path('students'),code:'attendanceMax'});
      if(block.fields===0&&block.games===0)errors.push({path:path('fields'),code:'activity'});
      c.blocks.push(block);
    }
    if(c.students!==null&&c.blocks.every(b=>b.students!==null)&&c.blocks.reduce((n,b)=>n+b.students,0)<c.students)errors.push({path:'students',code:'attendanceCoverage'});
    if(raw.legacy&&typeof raw.legacy==='object')c.legacy=Object.fromEntries(['teachers','adults','roles','hours','zones'].filter(k=>integer(raw.legacy[k],0,999999)).map(k=>[k,Number(raw.legacy[k])]));
    return {value:errors.length?null:c,errors};
  }
  const configuration=raw=>validate(raw).value;
  function capacity(block){
    const combine=key=>block.fields*policy.field[key]+block.games*policy.game[key];
    const playing=combine('playing'),waiting=combine('waiting'),transition=combine('transition');
    return {playing,waiting,transition,mobilized:playing+waiting+transition,minimumAreas:block.fields+Math.ceil(block.games/policy.zoneGamesPerArea),availableAreas:block.indoors+block.outdoors};
  }
  function staffing(block){
    const needed=block.fields*policy.field.adults+block.games*policy.game.adults;
    const school=block.teachers+block.adults,reinforcements=Math.max(0,needed-school);
    return {needed,school,reinforcements,baseStaff:policy.baseStaff,piTeam:policy.baseStaff+reinforcements,onSite:school+policy.baseStaff+reinforcements,cost:reinforcements*policy.reinforcementBlockRate};
  }
  function calculate(raw){
    const c=configuration(raw);if(!c)return null;
    const blocks=c.blocks.map(block=>({block,capacity:capacity(block),staffing:staffing(block)}));
    const base=c.students*policy.pilotRate,reinforcements=blocks.reduce((n,b)=>n+b.staffing.cost,0);
    const extraBlocks=c.blocks.length===1?0:policy.extraBlockRate===null?null:(c.blocks.length-1)*policy.extraBlockRate;
    const knownSubtotal=base+reinforcements+(extraBlocks??0)+(policy.travel??0)+(policy.taxes??0);
    const total=extraBlocks===null||policy.travel===null||policy.taxes===null?null:knownSubtotal;
    return {configuration:c,blocks,budget:{base,reinforcements,extraBlocks,knownSubtotal,travel:policy.travel,taxes:policy.taxes,total,perStudent:knownSubtotal/c.students,partial:extraBlocks===null||policy.taxes===null}};
  }
  function estimate(students){return {base:integer(students,1,limits.students)?Number(students)*policy.pilotRate:null,total:null,discount:Math.round((1-policy.pilotRate/policy.regularRate)*100)};}
  function formatMoney(amount,language){return amount===null?(language==='en'?'To be confirmed':'À confirmer'):new Intl.NumberFormat(language==='en'?'en-CA':'fr-CA',{style:'currency',currency:policy.currency,currencyDisplay:'code',minimumFractionDigits:0,maximumFractionDigits:2}).format(amount);}
  const blockName=(block,index,lang)=>block.label||(lang==='en'?'Block ':'Bloc ')+(index+1);
  function summary(raw,language){
    const result=calculate(raw);if(!result)return '';
    const en=language==='en',money=n=>formatMoney(n,language),c=result.configuration,b=result.budget;
    const lines=[en?'School configuration — indicative proposal':'Configuration scolaire — proposition indicative',
      (en?'Rules: ':'Règles : ')+policy.version,
      (en?'Distinct students: ':'Élèves distincts : ')+c.students,
      (en?'Shared indoor/outdoor areas: ':'Plateaux communs intérieurs/extérieurs : ')+c.indoors+'/'+c.outdoors,
      (en?'Planned clinics: ':'Cliniques envisagées : ')+(c.clinics??(en?'To be confirmed':'À confirmer'))];
    result.blocks.forEach((r,i)=>{const d=r.block,k=r.capacity,s=r.staffing;
      lines.push(blockName(d,i,language)+' — '+policy.blockHours+' h',
        (en?'Students / fields / zone games: ':'Élèves / terrains / jeux de zone : ')+d.students+' / '+d.fields+' / '+d.games,
        (en?'Indoor/outdoor areas; theoretical minimum: ':'Plateaux int./ext. ; minimum théorique : ')+d.indoors+'/'+d.outdoors+' ; '+k.minimumAreas,
        (en?'Playing / waiting / transitioning / mobilized: ':'En jeu / attente / transition / mobilisés : ')+[k.playing,k.waiting,k.transition,k.mobilized].join(' / '),
        (en?'Teachers / other adults simultaneously: ':'Enseignants / autres adultes simultanés : ')+d.teachers+' / '+d.adults,
        (en?'School posts / school adults / reinforcements / PI team: ':'Postes école / adultes école / renforts / équipe PI : ')+[s.needed,s.school,s.reinforcements,s.piTeam].join(' / '),
        (en?'Reinforcement supplement: ':'Supplément renforts : ')+money(s.cost));
      if(k.mobilized<d.students)lines.push(en?'WARNING: insufficient simultaneous capacity.':'AVERTISSEMENT : capacité simultanée insuffisante.');
      if(k.availableAreas<k.minimumAreas)lines.push(en?'WARNING: insufficient physical areas.':'AVERTISSEMENT : plateaux physiques insuffisants.');
      if(d.indoors>0)lines.push(en?'Indoor compatibility: to be confirmed.':'Compatibilité intérieure : à confirmer.');
    });
    lines.push((en?'Pilot program base: ':'Base du programme pilote : ')+money(b.base),
      (en?'First block and base PI team: included.':'Premier bloc et équipe PI de base : inclus.'),
      (en?'Reinforcements, all blocks: ':'Renforts, tous les blocs : ')+money(b.reinforcements),
      (en?'Additional block fees: ':'Frais des blocs supplémentaires : ')+(c.blocks.length===1?(en?'Not applicable':'Sans objet'):money(b.extraBlocks)),
      (en?'Known subtotal: ':'Sous-total connu : ')+money(b.knownSubtotal),
      (en?'Known subtotal per student: ':'Sous-total connu par élève : ')+money(b.perStudent),
      en?'Travel, tax treatment and final total: to be confirmed.':'Déplacement, traitement des taxes et total final : à confirmer.',
      en?'Theoretical outdoor sharing only; indoor compatibility, dimensions and setup require validation. Capacity is not proof of completed rotations. Qualifications and roles require confirmation.':'Répartition extérieure théorique uniquement ; compatibilités intérieures, dimensions et montage à valider. Capacité ne prouve pas les rotations réalisées. Qualifications et rôles à confirmer.');
    if(c.notes)lines.push((en?'Space/planning notes: ':'Précisions espaces/organisation : ')+c.notes);
    if(c.legacy)lines.push((en?'Legacy context (not used as simultaneous staffing or extra blocks): ':'Contexte ancien (non utilisé comme disponibilité simultanée ou blocs supplémentaires) : ')+JSON.stringify(c.legacy));
    return lines.join('\n');
  }
  function discountText(language){const discount=estimate(null).discount;return language==='en'?`A ${discount}% commercial discount provided by PürInstinct, before travel expenses and supplements.`:`Une réduction commerciale de ${discount} % offerte par PürInstinct, avant déplacement et suppléments.`;}
  // Compact public estimate. Legacy block helpers above remain available only
  // for compatibility; no hidden block state participates in these calculations.
  const estimatorPolicy = Object.freeze({version:'school-estimate-v1',currency:policy.currency,pilotRate:policy.pilotRate,baseStaff:policy.baseStaff,blockHours:policy.blockHours,
    reinforcementHourlyRate:policy.reinforcementHourlyRate,reinforcementCents:policy.reinforcementBlockRate*100,
    clinicCents:Object.freeze([0,40000,75000,110000,140000])});
  function estimateConfiguration(raw) {
    if(!raw || typeof raw!=='object' || Array.isArray(raw) || !integer(raw.students,1,limits.students) || !integer(raw.reinforcements,0,limits.adults))return null;
    const classes=String(raw.extraClasses);
    if(!['0','1','2','3','4','custom'].includes(classes) || typeof raw.multipleBlocks!=='boolean')return null;
    return {version:estimatorPolicy.version,students:Number(raw.students),reinforcements:Number(raw.reinforcements),extraClasses:classes,multipleBlocks:raw.multipleBlocks};
  }
  function calculateEstimate(raw) {
    const c=estimateConfiguration(raw);if(!c)return null;
    const baseCents=c.students*estimatorPolicy.pilotRate*100,reinforcementCents=c.reinforcements*estimatorPolicy.reinforcementCents;
    const clinicCents=c.extraClasses==='custom'?null:estimatorPolicy.clinicCents[Number(c.extraClasses)];
    const estimatedCents=baseCents+reinforcementCents+(clinicCents??0);
    return {configuration:c,baseCents,reinforcementCents,clinicCents,estimatedCents,perStudentCents:Math.round(estimatedCents/c.students),customClinics:clinicCents===null,firstBlockOnly:true};
  }
  function restoreEstimate(raw) {
    const current=estimateConfiguration(raw);if(current)return {value:current,legacy:false};
    if(raw && ('reinforcements' in raw || 'extraClasses' in raw || raw.version===estimatorPolicy.version))return null;
    // Restore useful legacy fields only. Old clinic counts do not mean extra
    // classes; old staffing/blocks must never set the visitor's reinforcement choice.
    if(!raw || !integer(raw.students,1,limits.students))return null;
    return {value:{version:estimatorPolicy.version,students:Number(raw.students),reinforcements:0,extraClasses:'0',multipleBlocks:Array.isArray(raw.blocks)?raw.blocks.length>1:integer(raw.hours,1,999)&&Number(raw.hours)>4},legacy:true};
  }
  function estimateSummary(raw,language) {
    const r=calculateEstimate(raw);if(!r)return '';
    const en=language==='en',c=r.configuration,money=cents=>formatMoney(cents/100,language);
    return [en?'School budget estimate':'Estimation du budget scolaire',
      (en?'Rules: ':'Règles : ')+estimatorPolicy.version,
      (en?'Students: ':'Élèves : ')+c.students,
      (en?'Pilot program base: ':'Base du programme pilote : ')+money(r.baseCents),
      (en?'Additional staff: ':'Intervenants supplémentaires : ')+c.reinforcements+' — '+money(r.reinforcementCents),
      en?'3 base staff included; additional to school activity supervision.':'3 intervenants de base inclus ; en plus de l’encadrement des jeux par l’école.',
      (en?'Additional clinic classes: ':'Classes supplémentaires de clinique : ')+(r.customClinics?(en?'Custom requirement — not priced':'Besoin sur mesure — non chiffré'):c.extraClasses+' — '+money(r.clinicCents)),
      en?'Clinic packages: 75 minutes per class, on the same day only. Included clinics are not charged again.':'Forfaits cliniques : 75 minutes par classe, dans une même journée uniquement. Les cliniques incluses ne sont pas refacturées.',
      (en?'Several 4-hour blocks requested: ':'Plusieurs blocs de 4 h envisagés : ')+(c.multipleBlocks?(en?'Yes':'Oui'):(en?'No':'Non')),
      (r.customClinics?(en?'Estimate excluding custom clinics and travel: ':'Estimation hors cliniques sur mesure et déplacement : '):(en?'Estimated budget before travel: ':'Budget estimé avant déplacement : '))+money(r.estimatedCents),
      (en?'Per student, same scope: ':'Par élève, même périmètre : ')+money(r.perStudentCents),
      en?'Estimate for the first 4-hour final event. Travel excluded; tax treatment to be confirmed in the proposal.':'Estimation pour le premier événement final de 4 h. Déplacement exclu ; traitement des taxes à confirmer dans la proposition.',
      ...(c.multipleBlocks?[en?'Additional block fees excluded; to be discussed together.':'Frais des blocs supplémentaires exclus ; à préciser ensemble.']:[]),
      ...(r.customClinics?[en?'Custom clinic supplement remains to be added; not treated as free.':'Le supplément des cliniques sur mesure reste à ajouter ; il n’est pas considéré comme gratuit.']:[])
    ].join('\n');
  }
  const estimator=Object.freeze({policy:estimatorPolicy,configuration:estimateConfiguration,calculate:calculateEstimate,restore:restoreEstimate,summary:estimateSummary});
  return Object.freeze({policy,limits,migrate,validate,configuration,capacity,staffing,calculate,estimate,formatMoney,blockName,summary,discountText,estimator});
})();

window.piTranslations = {
  "Terrain PürInstinct": "PürInstinct Field",
  "Les cinq zones et le terrain": "The five zones and the field",
  "Crée une ouverture à trois contre deux et passe vers la zone d’en-but.": "Create an opening three against two and pass toward the end zone.",
  "Explore les cinq zones et découvre comment elles se rejoignent sur le terrain.": "Explore the five zones and see how their skills come together on the field.",
  "Navigation principale": "Main navigation",
  "Pour les écoles": "For schools",
  "Les 5 zones": "The 5 zones",
  "L’Arène": "The Arena",
  "Le concept": "How it works",
  "App PürInstinct Games": "PürInstinct Games app",
  "À L’ÉCOLE": "AT SCHOOL",
  "Cinq zones pour développer tes habiletés.": "Five zones to develop your skills.",
  "Un terrain pour les mettre en pratique en match.": "One field to put them into practice in a match.",
  "Vue aérienne des cinq zones autour du terrain PürInstinct.": "Aerial view of the five zones around the PürInstinct field.",
  "Vitesse": "Speed",
  "Agilité": "Agility",
  "Habiletés des mains": "Hand Skills",
  "Habiletés des pieds": "Foot Skills",
  "Voir comment se déroulent les Games": "See how the Games work",
  "Les cinq zones": "The five zones",
  "Accélère sur une courte distance et apprends à relancer ton sprint.": "Accelerate over a short distance and learn to pick up speed again.",
  "Change de direction et garde ton équilibre en mouvement.": "Change direction and keep your balance on the move.",
  "Travaille la précision de tes passes et de tes réceptions.": "Practise passing and catching with precision.",
  "Travaille tes appuis et la précision de tes déplacements.": "Practise your footing and move with precision.",
  "Observe le jeu, anticipe et choisis la bonne action.": "Read the game, anticipate and choose the right move.",
  "Découvrir la zone →": "Explore the zone →",
  "De la découverte aux": "From discovery to the",
  "Conférence": "Talk",
  "Dominique Soucy présente le sport et lance le projet auprès des élèves.": "Dominique Soucy introduces the sport and kicks off the project with students.",
  "Cliniques": "Clinics",
  "Les élèves découvrent le jeu en pratiquant les habiletés dans les cinq zones.": "Students discover the game by practising skills in all five zones.",
  "Formation": "Training",
  "Les enseignants apprennent à animer les activités et à encadrer les zones.": "Teachers learn to lead the activities and supervise the zones.",
  "Les élèves mettent leurs habiletés en pratique dans les défis et les matchs.": "Students put their skills into practice in challenges and games.",
  "Configurez vos": "Set up your",
  "Configuration des Games": "Games configuration",
  "Élèves participants": "Participating students",
  "Enseignants disponibles": "Available teachers",
  "Autres adultes disponibles": "Other available adults",
  "Plateaux intérieurs": "Indoor spaces",
  "Plateaux extérieurs": "Outdoor spaces",
  "1 plateau = la surface d’un terrain de basketball": "1 space = the area of one basketball court",
  "Les plateaux mesurent l’espace disponible. Les zones sont les activités à encadrer.": "Spaces measure the available area. Zones are the activities that need supervision.",
  "Des élèves jouent avec un ballon noir PürInstinct sous la supervision de l’équipe.": "Students play with a black PürInstinct ball under the team’s supervision.",
  "élèves ·": "students ·",
  "adultes disponibles ·": "adults available ·",
  "plateaux": "spaces",
  "Voir et ajuster mon estimation": "View and adjust my estimate",
  "Ajustez votre": "Adjust your",
  "forfait": "package",
  "Modifier ma configuration": "Edit my configuration",
  "Réglages du forfait": "Package settings",
  "Postes couverts par votre école (postes)": "Roles covered by your school (roles)",
  "Zones ouvertes (zones)": "Open zones (zones)",
  "Durée des Games (heures)": "Games duration (hours)",
  "Cliniques (séances)": "Clinics (sessions)",
  "Estimation": "Estimate",
  "Estimation à confirmer": "Estimate to be confirmed",
  "Votre scénario doit être validé par l’équipe PürInstinct.": "The PürInstinct team will need to confirm your plan.",
  "Scénario de référence": "Reference scenario",
  "pour": "for",
  "élèves": "students",
  "par élève": "per student",
  "15 responsables de zones fournis par l’école et 5 intervenants PürInstinct pour 8 h.": "15 zone leaders from the school and 5 PürInstinct staff for 8 hours.",
  "PürInstinct Games à l’école": "PürInstinct Games at school",
  "Découvrez les cinq zones et configurez les Games pour votre école.": "Explore the five zones and configure the Games for your school.",
  "Les 5 zones de PürInstinct Games.": "The five zones of PürInstinct Games.",
  "Les 5 zones — PürInstinct Games": "The 5 zones — PürInstinct Games",
  "Les": "The",
  "5 zones": "5 zones",
  "Habiletés manuelles": "Hand skills",
  "Habiletés au pied": "Foot skills",
  "Accélère sur une courte distance.": "Accelerate over a short distance.",
  "Le défi.": "The challenge.",
  "En match.": "In a game.",
  "Fais un sprint de 40 m avec un départ adapté à ton niveau.": "Sprint 40 m from a starting position suited to your level.",
  "Démarque-toi ou rejoins la zone de but.": "Get open or reach the end zone.",
  "Change de direction en gardant ton équilibre.": "Change direction while keeping your balance.",
  "Évite les autres dans une arène de tag avec obstacles.": "Dodge other players in an obstacle-filled tag arena.",
  "Évite une touche et trouve un passage libre.": "Avoid a tag and find an open lane.",
  "Lance et attrape avec précision.": "Throw and catch accurately.",
  "Réagis à un lancer et vise une cible en équipe de trois.": "React to a throw and aim for a target in teams of three.",
  "Fais une passe précise ou réceptionne le ballon en mouvement.": "Make an accurate pass or catch the ball on the move.",
  "Pose tes pieds vite et au bon endroit.": "Place your feet quickly and accurately.",
  "En duel, touche les plaques qui s’allument, sans ballon.": "Go head to head and touch the pads as they light up, without a ball.",
  "Ajuste tes appuis pour repartir ou changer de direction.": "Adjust your footing to accelerate again or change direction.",
  "Observe le jeu et décide vite.": "Read the game and decide quickly.",
  "Joue un défi de stratégie 3 contre 3 avec ballon.": "Play a 3-on-3 strategy challenge with a ball.",
  "En match, lis les défenseurs et choisis quand avancer ou passer.": "Read the defenders and choose when to advance or pass.",
  "Les PürInstinct Games à ton école": "Bring PürInstinct Games to your school",
  "Tes élèves développent cinq habiletés dans cinq zones de défis, puis les mettent en pratique en match.": "Your students develop five skills in five challenge zones, then put them into practice in a game.",
  "On te montre comment ça se déroule et on voit ce qui pourrait convenir à ton école.": "We’ll show you how it works and explore what would suit your school.",
  "Des élèves écoutent leur coach sur le terrain": "Students listen to their coach on the field",
  "Réserver 20 minutes avec Dominique Soucy": "Book 20 minutes with Dominique Soucy",
  "Écrire à Dominique Soucy": "Contact Dominique Soucy",
  "Remplis le formulaire pour envoyer ton message à Dominique.": "Fill in the form to send Dominique a message.",
  "Nom": "Name",
  "École": "School",
  "Ville": "City",
  "Courriel": "Email",
  "Commentaires": "Comments",
  "Envoyer le message": "Send message",
  "Les 5 zones | PürInstinct Games": "The 5 zones | PürInstinct Games",
  "Pour les écoles | PürInstinct Games": "For schools | PürInstinct Games",
  "Le concept | PürInstinct Games": "How it works | PürInstinct Games",
  "PürInstinct Games — l'arène portable de 9 stations. Le sport à l'état Pur. Instinctif. Réserve ta session.": "PürInstinct Games — the portable nine-station arena. Experience the sport and book your session.",
  "PÜR ID — L'identité athlétique universelle | PürInstinct Games": "Pür ID — Your universal athletic identity | PürInstinct Games",
  "PÜR ID — L'identité athlétique universelle": "Pür ID — Your universal athletic identity",
  "PÜR ID — un score athlétique unique qui te suit partout. École, corporatif, festival, compétition nationale. Six instincts mesurés, une identité persistante.": "Pür ID — one athletic score that follows you from school and workplace events to festivals and national competitions. Six instincts, one lasting identity.",
  "Un score. Six instincts. Une identité qui te suit partout.": "One score. Six instincts. One identity that follows you everywhere.",
  "Voir le déroulement": "See how it works",
  "Fermer le panneau": "Close panel",
  "Explorer la zone →": "Explore the zone →",
  "Changer de direction. Réagir. Esquiver.": "Change direction. React. Dodge.",
  "Mains": "Hands",
  "Pieds": "Feet",
  "Terrain": "Field",
  "Voir le parcours scolaire": "See the school journey"
};

// School commercial strategy: exact-text entries for the existing FR/EN switcher.
window.piTranslations["Tarifs du programme scolaire"] = "School program rates";
Object.assign(window.piTranslations, {
  "Une expérience sportive complète, directement à votre école, sur plus d’un mois.": "A complete sports experience, delivered at your school over more than a month.",
  "Le budget global peut dépasser celui d’une activité scolaire ponctuelle. Il couvre un programme sur plusieurs semaines : préparation, formation, accompagnement et événement final.": "The overall budget may exceed that of a one-off school activity. It covers a multi-week program: preparation, training, support and a final event.",
  "Conférence de Dominique Soucy": "Dominique Soucy’s talk",
  "Présenter le sport et lancer le projet auprès des élèves.": "Introduce the sport and launch the project with students.",
  "Cliniques préparatoires": "Preparatory clinics",
  "Découvrir le jeu et développer les habiletés dans les cinq zones.": "Discover the game and develop skills across the five zones.",
  "Formation des enseignants": "Teacher training",
  "Préparer l’équipe enseignante à animer les activités et à encadrer les zones.": "Prepare teachers to lead activities and supervise the zones.",
  "Accompagnement et coordination": "Support and coordination",
  "Préparer le déroulement avec l’école et coordonner les Games.": "Plan the program with the school and coordinate the Games.",
  "Équipements et production": "Equipment and production",
  "Installer puis récupérer le matériel des Games. Les ballons pédagogiques restent à l’école.": "Set up and collect Games equipment. Teaching balls remain at the school.",
  "Événement final PürInstinct Games": "PürInstinct Games final event",
  "Mettre les habiletés en pratique dans les défis et les matchs.": "Put skills into practice through challenges and matches.",
  "Préparer": "Prepare",
  "Définir les besoins, les espaces, les ressources et le calendrier avec l’école.": "Define needs, spaces, resources and the schedule with the school.",
  "Former et accompagner": "Train and support",
  "Déployer la conférence, les cliniques et la formation des enseignants sur plusieurs semaines.": "Deliver the talk, clinics and teacher training over several weeks.",
  "Vivre les Games": "Experience the Games",
  "Réunir les élèves pour l’événement final, après la préparation.": "Bring students together for the final event following preparation.",
  "PürInstinct Games scolaires": "PürInstinct Games for schools",
  "Une expérience complète.": "A complete experience.",
  "Dans votre école.": "At your school.",
  "Le programme complet": "The complete program",
  "DJ, sonorisation et ambiance, administration et application font aussi partie des composantes déjà prévues dans la documentation.": "DJ, sound and atmosphere, administration and the app are also included among the components already set out in the documentation.",
  "Plus d’un mois. Un parcours préparé ensemble.": "More than a month. A journey planned together.",
  "Le calendrier et le nombre de séances sont convenus avec l’établissement.": "The schedule and number of sessions are agreed with the school.",
  "La valeur du programme": "The value of the program",
  "Tarif régulier": "Regular rate",
  "par élève": "per student",
  "L’expérience scolaire complète sur plusieurs semaines.": "The complete multi-week school experience.",
  "Cohorte pilote": "Pilot cohort",
  "Frais de déplacement en sus": "Travel expenses are additional",
  "Une réduction commerciale de 60 % accordée par PürInstinct, avant déplacement.": "A 60% commercial discount provided by PürInstinct, before travel expenses.",
  "Cette réduction n’est pas une subvention gouvernementale.": "This discount is not a government subsidy.",
  "Le nombre d’élèves, le calendrier et le périmètre de la formule sont à confirmer avec votre établissement.": "The number of students, schedule and scope of the package must be confirmed with your school.",
  "Deux voies pour financer votre participation": "Two ways to fund your participation",
  "Financer votre participation": "Funding your participation",
  "A · Financement direct": "A · Direct funding",
  "L’école finance sa participation": "The school funds its participation",
  "L’établissement assume les 10 $ par élève de la cohorte pilote et les frais de déplacement.": "The school pays the pilot cohort rate of $10 per student plus travel expenses.",
  "B · Financement externe": "B · External funding",
  "L’école mobilise des partenaires": "The school engages funding partners",
  "Subventions admissibles, fondation scolaire, commandites et partenaires peuvent contribuer à réduire la part déboursée par l’école.": "Eligible grants, the school foundation, sponsors and partners may help reduce the amount paid by the school.",
  "Les pistes se vérifient avec le centre de services scolaire et les organismes concernés. L’admissibilité et l’obtention de fonds ne sont pas garanties. Seules les contributions confirmées réduisent le montant à la charge de l’école.": "Funding options must be checked with the school service centre and relevant organizations. Eligibility and funding are not guaranteed. Only confirmed contributions reduce the amount payable by the school.",
  "Discutons de votre établissement": "Let’s discuss your school",
  "Demandez la documentation ou échangeons sur une formule adaptée à votre école.": "Request the documentation or discuss a package suited to your school.",
  "Demander la documentation": "Request the documentation",
  "Du tarif régulier à la cohorte pilote": "From the regular rate to the pilot cohort",
  "Discuter de ma formule": "Discuss my package",
  "Votre formule.": "Your package.",
  "Votre école.": "Your school.",
  "Ces réglages précisent vos besoins. Ils ne modifient pas automatiquement le tarif par élève de la cohorte pilote.": "These settings describe your needs. They do not automatically change the pilot cohort rate per student.",
  "Accompagnement et coordination, équipements et production, DJ et sonorisation complètent la conférence, les cliniques et la formation. Les ballons pédagogiques restent à l’école.": "Support and coordination, equipment and production, DJ and sound complement the talk, clinics and training. Teaching balls remain at the school.",
  "Exemple pour": "Example for",
  "Budget régulier": "Regular budget",
  "Budget cohorte pilote": "Pilot cohort budget",
  "Montants avant déplacement. Le financement externe ne change pas le prix du programme.": "Amounts exclude travel expenses. External funding does not change the program price.",
  "Une expérience sportive complète à l’école sur plus d’un mois. Tarif régulier : 25 $ par élève. Cohorte pilote : 10 $ par élève, frais de déplacement en sus.": "A complete school sports experience over more than a month. Regular rate: $25 per student. Pilot cohort: $10 per student, plus travel expenses.",
  "25 $": "$25",
  "10 $": "$10"
});

Object.assign(window.piTranslations, {
  "Les tarifs du programme": "Program rates",
  "Configurer les Games de mon école": "Configure the Games for my school",
  "Configurez les Games de votre école": "Configure the Games for your school",
  "Précisez vos élèves, vos installations et les adultes disponibles. Nous pourrons estimer les ressources nécessaires et préparer une proposition adaptée.": "Tell us about your students, facilities and available adults. We can assess the resources needed and prepare a tailored proposal.",
  "Autres adultes ou bénévoles disponibles": "Other available adults or volunteers",
  "Un plateau correspond à une surface approximativement équivalente à un terrain de basketball.": "A play area is approximately the size of a basketball court.",
  "Votre configuration et votre budget": "Your configuration and budget",
  "Adultes de l’école disponibles en même temps": "School adults available at the same time",
  "Durée envisagée des Games (heures)": "Planned Games duration (hours)",
  "Cliniques envisagées (séances)": "Planned clinics (sessions)",
  "Le total d’adultes, leur présence simultanée et leurs créneaux de disponibilité sont distincts. Les créneaux de chaque adulte seront précisés avec l’école.": "The total number of adults, their simultaneous presence and their availability times are different. Each adult’s availability will be confirmed with the school.",
  "Un bénévole ne remplace pas automatiquement un intervenant spécialisé. Les rôles seront confirmés avec vous.": "A volunteer does not automatically replace a specialist. Roles will be confirmed with you.",
  "Base du programme": "Program base",
  "Équivalent par élève — base du programme uniquement": "Per-student equivalent — program base only",
  "Personnel supplémentaire": "Additional staffing",
  "À confirmer selon les ressources": "To be confirmed based on resources",
  "Déplacement": "Travel",
  "À confirmer selon le lieu": "To be confirmed based on location",
  "Total à confirmer": "Total to be confirmed",
  "À confirmer": "To be confirmed",
  "Frais de déplacement en sus.": "Travel expenses are additional.",
  "Frais de déplacement à confirmer selon le lieu.": "Travel expenses to be confirmed based on location.",
  "Estimation indicative. Le montant final sera confirmé selon l’encadrement, les installations, le calendrier et les déplacements nécessaires.": "Indicative estimate. The final amount will be confirmed based on staffing, facilities, schedule and travel requirements.",
  "Traitement des taxes à confirmer dans la proposition.": "Tax treatment will be confirmed in the proposal.",
  "Le financement externe ne modifie pas le coût du programme. Aucune aide hypothétique n’est déduite.": "External funding does not change the program cost. No hypothetical funding is deducted.",
  "Demander une proposition avec cette configuration": "Request a proposal with this configuration",
  "Personnel supplémentaire selon les besoins d’encadrement.": "Additional staffing based on supervision requirements.",
  "Une réduction commerciale de 60 % offerte par PürInstinct, avant déplacement et suppléments.": "A 60% commercial discount provided by PürInstinct, before travel expenses and supplements.",
  "Le budget tient compte des ressources de votre école. Des frais supplémentaires peuvent s’appliquer lorsque PürInstinct fournit davantage de personnel.": "The budget takes your school’s resources into account. Additional charges may apply when PürInstinct provides more staff.",
  "L’établissement finance la base du programme, les frais de déplacement et les suppléments applicables confirmés.": "The school funds the program base, travel expenses and confirmed applicable supplements.",
  "Votre configuration à transmettre": "Your configuration to be sent",
  "Cette configuration sera jointe à votre message. Les montants restent indicatifs.": "This configuration will be included with your message. Amounts remain indicative.",
  "Accompagnement et coordination, équipements et production, DJ et sonorisation complètent la conférence, les cliniques et la formation. Les ballons pédagogiques restent à l’école. Le matériel des Games est récupéré après l’événement.": "Support and coordination, equipment and production, DJ and sound complement the talk, clinics and training. Teaching balls remain at the school. Games equipment is collected after the event."
});

Object.assign(window.piTranslations, {"Voir la base du programme":"View the program base"});

Object.assign(window.piTranslations, {"À préciser":"To be specified", "Le nombre de séances de cliniques sera confirmé avec l’école.":"The number of clinic sessions will be confirmed with the school."});

// School video copy, using the existing language mechanism.
Object.assign(window.piTranslations, {
  "Découvrez les PürInstinct Games": "Discover PürInstinct Games",
  "Une expérience sportive à votre école, avec préparation, formation et accompagnement jusqu’aux Games.": "A sports experience at your school, with preparation, training and support leading up to the Games.",
  "Lire la vidéo": "Play video",
  "Découvrir le programme scolaire": "Explore the school program",
  "Voir sur YouTube": "Watch on YouTube",
  "La lecture intégrée est indisponible. Utilisez le lien YouTube.": "Embedded playback is unavailable. Use the YouTube link."
});

Object.assign(window.piTranslations, {
  "Afficher la vidéo en plein écran": "Show the video fullscreen",
  "Plein écran": "Fullscreen",
  "Le plein écran est indisponible dans ce navigateur.": "Fullscreen is unavailable in this browser."
});

// Animated school offer — existing FR/EN system.
Object.assign(window.piTranslations, {
  "UNE EXPÉRIENCE COMPLÈTE": "A COMPLETE EXPERIENCE",
  "À L’ÉCOLE": "AT SCHOOL",
  "Plus d’un mois de préparation, de formation et d’accompagnement, jusqu’aux Games.": "More than a month of preparation, training and support, leading up to the Games.",
  "Le budget peut sembler important pour une école. Il couvre une expérience complète, directement dans votre établissement, sur plusieurs semaines.": "The budget may seem substantial for a school. It covers a complete experience at your school over several weeks.",
  "Des élèves jouent ensemble, accompagnés de l’équipe PürInstinct.": "Students play together with support from the PürInstinct team.",
  "CA · par élève": "CAD · per student",
  "Base de 10 $ CA par élève": "Base of CAD 10 per student",
  "60 % de réduction offerte par PürInstinct": "60% discount provided by PürInstinct",
  "Tarif régulier : 25 $ CA par élève. Cohorte pilote : base de 10 $ CA par élève. Une réduction commerciale de 60 % offerte par PürInstinct, avant déplacement et suppléments.": "Regular rate: CAD 25 per student. Pilot cohort: base of CAD 10 per student. A 60% commercial discount provided by PürInstinct, before travel expenses and supplements.",
  "Frais de déplacement en sus. Personnel supplémentaire selon les besoins d’encadrement.": "Travel expenses are additional. Additional staff based on supervision requirements.",
  "Composantes du programme": "Program components",
  "Conférence de Dominique Soucy": "Talk by Dominique Soucy",
  "Cliniques préparatoires": "Preparatory clinics",
  "Formation des enseignants": "Teacher training",
  "Accompagnement et coordination": "Support and coordination",
  "Équipements et production": "Equipment and production",
  "Games à l’école": "Games at school",
  "CONFIGUREZ VOTRE ÉCOLE": "CONFIGURE YOUR SCHOOL",
  "Diminuer": "Decrease",
  "Augmenter": "Increase",
  "Disponibilités et séances": "Availability and sessions",
  "adultes disponibles": "available adults",
  "plateaux": "playing areas",
  "Total": "Total",
  "Base par élève": "Base per student",
  "Les ressources saisies servent à préparer la proposition. Elles ne réduisent pas la base du programme.": "The resources entered help prepare your proposal. They do not reduce the program base.",
  "FINANCEMENT DIRECT": "DIRECT FUNDING",
  "FINANCEMENT EXTERNE": "EXTERNAL FUNDING",
  "L’école finance sa participation.": "The school funds its participation.",
  "Subventions admissibles · Fondations · Commandites · Partenaires": "Eligible grants · Foundations · Sponsors · Partners",
  "L’admissibilité et l’obtention de fonds ne sont pas garanties.": "Eligibility and funding are not guaranteed.",
  "Une aide externe peut réduire la contribution de l’école, sans changer le prix du programme. Seules les contributions confirmées réduisent le montant à la charge de l’école.": "External funding may reduce the school’s contribution without changing the program price. Only confirmed contributions reduce the amount payable by the school.",
  "DEMANDER MA PROPOSITION": "REQUEST MY PROPOSAL"
});

// Unified public discovery and contact, using the existing FR/EN mechanism.
Object.assign(window.piTranslations, {
  'Le programme':'The program',
  'Configurer mon école':'Configure my school',
  'Contact':'Contact',
  'Détails des zones':'Zone details',
  'Choisir une autre zone':'Choose another zone',
  'Mains':'Hands', 'Pieds':'Feet', 'Terrain':'Field',
  'Zone Vitesse : piste de sprint.':'Speed zone: sprint track.',
  'Zone Agilité : arène de déplacements.':'Agility zone: movement arena.',
  'Zone Habiletés des mains : défis de précision.':'Hand skills zone: precision challenges.',
  'Zone Habiletés des pieds : défis d’appuis.':'Foot skills zone: footwork challenges.',
  'Zone Game IQ : terrain de stratégie.':'Game IQ zone: strategy field.',
  'Le terrain PürInstinct réunit les cinq habiletés en match.':'The PürInstinct field brings all five skills together in a match.',
  'Parlons de votre école':'Let’s talk about your school',
  'Vos élèves développent cinq habiletés dans cinq zones. Découvrez comment les Games se déroulent et quelle formule pourrait convenir à votre école.':'Your students develop five skills across five zones. Discover how the Games work and which format could suit your school.',
  'Le formulaire permet de demander une rencontre. Dominique vous répondra pour convenir d’un moment.':'Use the form to request a meeting. Dominique will reply to agree on a time.'
});
Object.assign(window.piTranslations, {
 'Lire l’extrait':'Play clip',
 'La vidéo est indisponible. L’image de la zone reste affichée.':'The video is unavailable. The zone image remains available.'
});

// Approved three-card school journey. No portfolio is represented as a delivered school archive.
Object.assign(window.piTranslations, {
 'DE LA DÉCOUVERTE AUX':'FROM DISCOVERY TO THE',
 'Un programme déployé sur plus d’un mois, selon le calendrier de votre école.':'A program delivered over more than a month, according to your school’s schedule.',
 'AVANT LES GAMES':'BEFORE THE GAMES',
 'Conférence, cliniques et formation des enseignants.':'Talk, clinics and teacher training.',
 'LE JOUR DES GAMES':'GAMES DAY',
 'Installation, activités, matchs et animation.':'Setup, activities, matches and entertainment.',
 'APRÈS LES GAMES':'AFTER THE GAMES',
 'Photos, vidéos et mini-documentaire : le projet raconté par les élèves.':'Photos, videos and a mini-documentary: the project told by students.',
 'Illustration d’un coach qui accompagne des élèves à l’école.':'Illustration of a coach supporting students at school.',
 'Illustration d’élèves en action avec le ballon PürInstinct.':'Illustration of students in action with the PürInstinct ball.',
 'Mosaïque illustrative du projet scolaire':'Illustrative school project mosaic',
 'Illustration des activités d’une clinique.':'Illustration of clinic activities.',
 'Illustration d’une rencontre avec les élèves.':'Illustration of a meeting with students.',
 'Illustration d’un échange pendant la formation.':'Illustration of a discussion during training.',
 'Illustration d’un moment des Games à l’école.':'Illustration of a moment during the Games at school.',
 'Visuels illustratifs':'Illustrative visuals'
});

// Block-based configurator copy; numeric rules remain exclusively in piSchoolCommercial.
Object.assign(window.piTranslations, {
  "Configurez votre projet scolaire": "Configure your school project",
  "Étapes du configurateur": "Configurator steps",
  "01 · Élèves et horaire": "01 · Students and schedule",
  "02 · Espaces et activités": "02 · Spaces and activities",
  "03 · Adultes disponibles": "03 · Available adults",
  "01 · Vos élèves et votre horaire": "01 · Your students and schedule",
  "02 · Vos espaces et vos activités": "02 · Your spaces and activities",
  "03 · Votre équipe disponible": "03 · Your available team",
  "Élèves participants distincts": "Distinct participating students",
  "Chaque élève compte une seule fois dans la base, même s’il participe à plusieurs blocs. La somme des présences peut dépasser l’effectif distinct.": "Each student is counted once in the program base, even if they attend several blocks. Total attendance may exceed the distinct student count.",
  "Nombre de blocs de quatre heures": "Number of four-hour blocks",
  "Ajouter un bloc": "Add a block",
  "Le premier bloc est inclus. Les frais des blocs supplémentaires sont à confirmer, séparément de leurs renforts.": "The first block is included. Additional block fees are to be confirmed, separately from their staffing reinforcements.",
  "Un plateau physique correspond approximativement à un terrain de basketball. Une installation est un terrain PürInstinct ou un jeu de zone.": "A physical play area is approximately the size of a basketball court. An installation is a PürInstinct field or a zone game.",
  "Plateaux intérieurs disponibles": "Available indoor play areas",
  "Plateaux extérieurs disponibles": "Available outdoor play areas",
  "Configuration ajustable, à valider avec l’école. Aucun changement d’installation ou de bloc n’est appliqué automatiquement.": "Adjustable configuration, to be validated with the school. No installation or block is changed automatically.",
  "Précisions sur les espaces et le montage": "Space and setup notes",
  "Hypothèses de capacité et logistique": "Capacity assumptions and logistics",
  "La transition comprend boire, consulter son score et rejoindre une activité. Attente et transition ne sont pas du temps physiquement actif.": "Transition includes drinking, checking a score and joining an activity. Waiting and transitioning are not physically active time.",
  "Ce modèle de planification ne prouve pas que tous les élèves auront réalisé toutes les activités. Les durées de rotation ne sont pas confirmées.": "This planning model does not prove that every student will complete every activity. Rotation times are not confirmed.",
  "Déclarez les personnes présentes simultanément pour l’encadrement de chaque bloc. Ne comptez pas une même personne comme enseignant et bénévole.": "Declare people available simultaneously to supervise each block. Do not count the same person as both a teacher and a volunteer.",
  "Les intervenants PürInstinct de base s’ajoutent aux adultes des jeux. Les qualifications et les rôles restent à confirmer ; un bénévole ne remplace pas automatiquement un intervenant spécialisé.": "The base PürInstinct staff are additional to the adults required for games. Qualifications and roles remain to be confirmed; a volunteer does not automatically replace a specialist.",
  "Votre budget indicatif": "Your indicative budget",
  "Base cohorte pilote : 10 $ CA par élève distinct.": "Pilot cohort base: CAD 10 per distinct student.",
  "Suppléments et total à confirmer.": "Supplements and total to be confirmed.",
  "Le sous-total chiffré n’est pas un total final. Les frais inconnus ne sont pas égaux à zéro.": "The priced subtotal is not a final total. Unknown fees are not zero.",
  "Les frais supplémentaires de bloc couvriront notamment la prolongation de l’équipe de base. Ils restent à confirmer et sont distincts des renforts.": "Additional block fees will cover, among other items, extended time for the base team. They remain to be confirmed and are separate from reinforcements.",
  "Cette configuration partagée utilise l’ancien modèle. Vérifiez les activités, les blocs et les disponibilités simultanées. Les anciens effectifs adultes restent dans le contexte transmis, sans être déduits automatiquement.": "This shared configuration uses the previous model. Check activities, blocks and simultaneous availability. Previous adult counts remain in the submitted context and are not automatically deducted.",
  "Libellé du bloc": "Block label",
  "Élèves présents dans ce bloc": "Students attending this block",
  "Retirer ce bloc": "Remove this block",
  "Terrains PürInstinct souhaités": "Requested PürInstinct fields",
  "Jeux de zone souhaités": "Requested zone games",
  "Espaces différents pour ce bloc": "Different spaces for this block",
  "Plateaux intérieurs du bloc": "Indoor play areas for this block",
  "Plateaux extérieurs du bloc": "Outdoor play areas for this block",
  "Enseignants simultanément disponibles": "Teachers available simultaneously",
  "Autres adultes simultanément disponibles": "Other adults available simultaneously",
  "Saisissez des nombres entiers dans les limites indiquées.": "Enter whole numbers within the indicated limits.",
  "Le nombre de blocs doit être compris dans les limites indiquées.": "The block count must be within the indicated limits.",
  "Le texte des précisions est trop long.": "The notes are too long.",
  "Le libellé du bloc est trop long.": "The block label is too long.",
  "Un bloc ne peut pas dépasser l’effectif distinct.": "A block cannot exceed the distinct student count.",
  "La somme des présences doit couvrir l’effectif distinct déclaré.": "Total attendance must cover the declared distinct student count.",
  "Prévoyez au moins un terrain ou un jeu de zone dans chaque bloc.": "Include at least one field or zone game in each block.",
  "Vérifiez les saisies pour afficher les capacités.": "Check the inputs to display capacities.",
  "Surfaces nécessaires — minimum théorique": "Required areas — theoretical minimum",
  "Surfaces physiques disponibles": "Available physical play areas",
  "Élèves en jeu": "Students playing",
  "Élèves en attente": "Students waiting",
  "Élèves en transition": "Students transitioning",
  "Capacité simultanée mobilisée": "Simultaneously mobilized capacity",
  "Adultes nécessaires aux jeux": "Adults required for games",
  "Compatibilité à confirmer. Répartition théorique extérieure : un terrain par plateau, deux jeux de zone par plateau compatible. Dimensions et montage à valider.": "Compatibility must be confirmed. Theoretical outdoor allocation: one field per play area, two zone games per compatible play area. Dimensions and setup require validation.",
  "Compatibilité intérieure à confirmer. Aucun montage intérieur n’est certifié par ce calcul.": "Indoor compatibility must be confirmed. This calculation does not certify any indoor setup.",
  "Surfaces insuffisantes pour cette répartition. Ajoutez des plateaux compatibles ou ajustez les installations souhaitées.": "Insufficient space for this allocation. Add compatible play areas or adjust the requested installations.",
  "Capacité simultanée insuffisante : réduisez le groupe, ajoutez des surfaces et activités compatibles ou répartissez les élèves en blocs supplémentaires. Aucune rotation non documentée n’est supposée.": "Insufficient simultaneous capacity: reduce the group, add compatible spaces and activities, or distribute students across additional blocks. No undocumented rotations are assumed.",
  "Adultes fournis par l’école": "Adults supplied by the school",
  "Renforts PürInstinct nécessaires": "Required PürInstinct reinforcements",
  "Intervenants PürInstinct de base — en plus": "Base PürInstinct staff — additional",
  "Équipe PürInstinct totale": "Total PürInstinct team",
  "Adultes sur place, équipe déclarée et renforts": "Adults on site, declared team and reinforcements",
  "Supplément d’encadrement du bloc": "Staffing supplement for this block",
  "Adultes fournis / postes nécessaires / renforts : ": "Supplied adults / required posts / reinforcements: ",
  "Terrain : jeu / attente / transition / adultes : ": "Field: playing / waiting / transitioning / adults: ",
  "Jeu de zone : ": "Zone game: ",
  "Base du programme — élèves distincts": "Program base — distinct students",
  "Premier bloc de quatre heures": "First four-hour block",
  "Inclus": "Included",
  "Équipe de base du premier bloc": "Base team for the first block",
  "Renforts": "Reinforcements",
  "Frais des blocs supplémentaires": "Additional block fees",
  "Sans objet": "Not applicable",
  "Sous-total connu": "Known subtotal",
  "Équivalent du sous-total connu par élève": "Known subtotal per student",
  "Le sous-total connu et son équivalent par élève excluent les frais restant à confirmer.": "The known subtotal and its per-student equivalent exclude fees still to be confirmed.",
  "par renfort et par bloc": "per reinforcement and per block",
  "Vérifiez les saisies pour afficher le budget.": "Check the inputs to display the budget."
});
Object.assign(window.piTranslations, {
 'Votre école fournit {school} adultes pour {needed} postes d’encadrement. Renforts PürInstinct nécessaires pour ce bloc : {reinforcements}, soit {cost}.':'Your school supplies {school} adults for {needed} supervision posts. PürInstinct reinforcements required for this block: {reinforcements}, costing {cost}.',
 'Limite technique de cette demande : {blocks} blocs.':'Technical limit for this request: {blocks} blocks.',
 'J’ai vérifié les nouveaux blocs et disponibilités.':'I have checked the new blocks and availability.',
 'Vérifiez et confirmez les nouveaux blocs et disponibilités.':'Check and confirm the new blocks and availability.'
});

Object.assign(window.piTranslations, {"À venir au printemps 2027": "Coming spring 2027", "Fermer": "Close"});

Object.assign(window.piTranslations, {
  "ESTIMEZ VOTRE": "ESTIMATE YOUR",
  "BUDGET": "BUDGET",
  "Voyez ce qui fait varier le coût de votre projet.": "See what affects the cost of your project.",
  "Estimer mon budget": "Estimate my budget",
  "Effectif repris de votre ancien lien. Vérifiez les suppléments et le besoin de plusieurs blocs.": "Student count restored from your previous link. Review extras and the need for additional blocks.",
  "Réglages de l’estimation": "Estimate settings",
  "Base pilote : 10 $ par élève": "Pilot base: $10 per student",
  "Intervenants supplémentaires": "Additional staff",
  "3 intervenants inclus. +400 $ par personne pour 4 h.": "3 staff included. +$400 per person for 4 hours.",
  "Combien en prévoir ?": "How many should I plan for?",
  "Les besoins dépendent des jeux installés et des adultes disponibles dans votre école. Nous les préciserons ensemble.": "Staffing needs depend on the games installed and the adults available at your school. We will work them out together.",
  "Les trois intervenants inclus s’ajoutent à l’encadrement des jeux fourni par l’école.": "The three included staff are additional to the game supervision provided by the school.",
  "Classes supplémentaires de clinique": "Additional clinic classes",
  "75 minutes par classe. Tarifs pour une même journée.": "75 minutes per class. Rates apply to the same day.",
  "Aucune": "None",
  "1 classe": "1 class",
  "2 classes": "2 classes",
  "3 classes": "3 classes",
  "4 classes": "4 classes",
  "Autre besoin": "Other requirement",
  "Plus de quatre classes ou plusieurs journées : formule à préciser ensemble.": "More than four classes or multiple days: we will work out the package together.",
  "VOTRE ESTIMATION": "YOUR ESTIMATE",
  "Programme · {count} élèves": "Program · {count} students",
  "{count} intervenants supplémentaires": "{count} additional staff",
  "{count} classes supplémentaires de clinique": "{count} additional clinic classes",
  "1 intervenant supplémentaire": "1 additional staff member",
  "1 classe supplémentaire de clinique": "1 additional clinic class",
  "Programme · 200 élèves": "Program · 200 students",
  "Aucun ajouté": "None added",
  "Aucune ajoutée": "None added",
  "Supplément à préciser": "Supplement to discuss",
  "Budget estimé avant déplacement": "Estimated budget before travel",
  "Estimation hors cliniques sur mesure et déplacement": "Estimate excluding custom clinics and travel",
  "{amount} par élève": "{amount} per student",
  "10 $ par élève": "$10 per student",
  "Dollars canadiens (CAD)": "Canadian dollars (CAD)",
  "DISCUTER DE MON PROJET": "DISCUSS MY PROJECT",
  "Estimation pour un événement final de 4 h. Déplacement en sus. Proposition finale adaptée à votre école.": "Estimate for a 4-hour final event. Travel is additional. Final proposal tailored to your school.",
  "J’envisage plusieurs blocs de 4 h": "I am considering several 4-hour blocks",
  "Nous préciserons ensemble le budget des blocs supplémentaires.": "We will work out the budget for additional blocks together.",
  "Montant pour le premier bloc de 4 h uniquement.": "Amount for the first 4-hour block only.",
  "Saisissez un nombre entier d’élèves supérieur à zéro et un nombre entier d’intervenants égal ou supérieur à zéro.": "Enter a whole number of students greater than zero and a whole number of additional staff of zero or more.",
  "Diminuer le nombre d’élèves": "Decrease the number of students",
  "Augmenter le nombre d’élèves": "Increase the number of students",
  "Diminuer les intervenants supplémentaires": "Decrease additional staff",
  "Augmenter les intervenants supplémentaires": "Increase additional staff",
  "Votre estimation à transmettre": "Your estimate to send",
  "Cette estimation sera jointe à votre message. Les montants restent indicatifs.": "This estimate will be attached to your message. Amounts are indicative."
});
