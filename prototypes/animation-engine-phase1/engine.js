/**
 * PÜRINSTINCT GAMES / ANIMATION ENGINE / PHASE 1
 * Pure Three.js, separate from the live site. Scenario is FICTIONAL.
 * No official field dimensions, mechanics, scoring or player counts are implied.
 */
const ROOT = document.getElementById('scene-container');
const loading = document.getElementById('loading');
const playButton = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const playLabel = document.getElementById('play-label');
const restartButton = document.getElementById('restart');
const isoButton = document.getElementById('camera-iso');
const aerialButton = document.getElementById('camera-aerial');
const cameraLabel = document.getElementById('camera-badge');
const progress = document.getElementById('track-progress');
const currentTimeLabel = document.getElementById('current-time');
const durationLabel = document.getElementById('duration');
const chapterLabel = document.getElementById('chapter-index');
const chapterDescription = document.getElementById('chapter-description');

function failure(message) {
  loading.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'error-message';
  box.style.cssText = 'max-width:500px;padding:24px;text-align:center;line-height:1.6;color:#f4f4ef';
  box.textContent = message;
  loading.append(box);
  playButton.disabled = true;
  restartButton.disabled = true;
  isoButton.disabled = true;
  aerialButton.disabled = true;
}

async function init() {
  // A pinned, unmodified ES module. The eventual website deployment may bundle locally.
  const [THREE, scenarioResponse] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'),
    fetch('./demo-scenario.json', {cache:'no-store'})
  ]);
  if (!scenarioResponse.ok) throw new Error('Scénario JSON introuvable.');
  const data = await scenarioResponse.json();
  validateScenario(data);
  if (data.status !== 'FICTIF_NON_OFFICIEL') throw new Error('La phase 1 requiert un scénario non officiel.');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({alpha:false, antialias:true, powerPreference:'high-performance'});
  } catch {
    throw new Error('WebGL n’est pas disponible sur ce navigateur.');
  }
  renderer.setClearColor(0x090c09);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.domElement.setAttribute('aria-hidden','true');
  ROOT.appendChild(renderer.domElement);
  loading.remove();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#090c09');
  scene.fog = new THREE.FogExp2('#090c09',0.017);
  scene.add(new THREE.AmbientLight(0xdfe8d2, 1.0));
  const hemi = new THREE.HemisphereLight(0xf0fbe8,0x262822,2.0);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xf9ffe9,3.1);
  key.position.set(-6,14,9); key.castShadow = true;
  key.shadow.mapSize.set(1024,1024);
  key.shadow.camera.left=-17;key.shadow.camera.right=17;
  key.shadow.camera.top=17;key.shadow.camera.bottom=-17;
  key.shadow.normalBias=0.025;
  scene.add(key);
  const rim = new THREE.PointLight(0xccff00,33,26,2.1);
  rim.position.set(8,6,-4);
  scene.add(rim);

  const width = data.dimensions.width;
  const depth = data.dimensions.depth;
  const floorMat = new THREE.MeshStandardMaterial({color:0x18231a,roughness:1,metalness:0});
  const deck = new THREE.Mesh(new THREE.BoxGeometry(width+1.0,0.43,depth+1.0),new THREE.MeshStandardMaterial({color:0x101310,roughness:.92}));
  deck.position.y=-.28;deck.receiveShadow=true;scene.add(deck);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(width,depth),floorMat);
  floor.rotation.x=-Math.PI/2;floor.position.y=-.045;floor.receiveShadow=true;scene.add(floor);
  const mint = new THREE.MeshBasicMaterial({color:0xccff00,transparent:true,opacity:.85,depthWrite:false});
  const faded = new THREE.MeshBasicMaterial({color:0x53694b,transparent:true,opacity:.34,depthWrite:false});
  const blackSteel = new THREE.MeshStandardMaterial({color:0x080a08,roughness:.5,metalness:.5});
  const limeSteel = new THREE.MeshStandardMaterial({color:0x8eb52b,roughness:.35,metalness:.55,emissive:0x243b03});

  function bar(w,h,d,x,y,z,material=blackSteel){
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;
  }
  // Fictional illustrative arena: not the official 45 x 13 m field.
  for (let i=-width/2+2;i<=width/2-2;i+=2){
    bar(.018,.012,depth-.6,i,.006,0,faded);
  }
  for (let i=-depth/2+2;i<=depth/2-2;i+=2){
    bar(width-.6,.012,.018,0,.009,i,faded);
  }
  bar(width+.4,.13,.15,0,.1,-depth/2-.1,limeSteel);
  bar(width+.4,.13,.15,0,.1,depth/2+.1,limeSteel);
  bar(.15,.13,depth+.4,-width/2-.1,.1,0,limeSteel);
  bar(.15,.13,depth+.4,width/2+.1,.1,0,limeSteel);
  for (let x=-width/2;x<=width/2+.01;x+=width/4){
    for(const z of [-depth/2-.13, depth/2+.13]){
      bar(.24,1.15,.24,x,.58,z,blackSteel);
      bar(.32,.14,.32,x,1.14,z,limeSteel);
    }
  }
  for (let z=-depth/2;z<=depth/2+.01;z+=depth/3){
    for(const x of [-width/2-.13,width/2+.13]){
      bar(.24,1.15,.24,x,.58,z,blackSteel);
      bar(.3,.14,.3,x,1.14,z,limeSteel);
    }
  }
  // Corner pylon accents.
  const pylonGeo = new THREE.CylinderGeometry(.22,.25,1.5,12);
  const pylons = [];
  for (const x of [-width/2-0.5,width/2+0.5]){
    for (const z of [-depth/2-.5,depth/2+.5]){
      const p=new THREE.Mesh(pylonGeo,blackSteel);
      p.position.set(x,.75,z);p.castShadow=true;scene.add(p);pylons.push(p);
      const cap=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.09,12),limeSteel);
      cap.position.set(x,1.53,z);scene.add(cap);
    }
  }

  function textPlane(text,color,planeWidth,planeHeight,fontSize=52){
    const c=document.createElement('canvas');c.width=1024;c.height=256;
    const cx=c.getContext('2d');
    cx.clearRect(0,0,1024,256);
    cx.fillStyle=color;cx.textAlign='center';cx.textBaseline='middle';
    cx.font=`italic 900 ${fontSize}px Impact, Arial Black, sans-serif`;
    cx.fillText(text,512,128,1000);
    const tex=new THREE.CanvasTexture(c);
    tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
    const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,opacity:.9});
    const plane=new THREE.Mesh(new THREE.PlaneGeometry(planeWidth,planeHeight),mat);
    plane.rotation.x=-Math.PI/2;return plane;
  }
  const logo=textPlane('PÜRINSTINCT  GAMES','#c8e69f',8.6,2.3,118);
  logo.position.set(0,.017,0);scene.add(logo);
  const edge1=textPlane('PROTOTYPE TECHNIQUE','#8cb33f',6.2,.8,72);
  edge1.position.set(0,.02,-4.35);scene.add(edge1);
  const edge2=textPlane('DEMO  /  NON OFFICIELLE','#718d49',7.3,.8,70);
  edge2.position.set(0,.02,4.3);scene.add(edge2);

  function drawPath(points,color){
    const vertices=[];
    for(let n=0;n<points.length-1;n++){
      const a=points[n],b=points[n+1];
      if(Math.hypot(b.x-a.x,b.z-a.z)<.15)continue;
      const count=Math.max(4,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)*4));
      for(let i=0;i<=count;i++){
        const s=i/count;vertices.push(new THREE.Vector3(a.x+(b.x-a.x)*s,.05,a.z+(b.z-a.z)*s));
      }
    }
    const pathGeom=new THREE.BufferGeometry().setFromPoints(vertices);
    const path=new THREE.Line(pathGeom,new THREE.LineDashedMaterial({color,transparent:true,opacity:.68,dashSize:.36,gapSize:.23,depthWrite:false}));
    path.computeLineDistances();scene.add(path);
    for(let i=0;i<points.length-1;i++){
      const a=points[i],b=points[i+1];
      const dx=b.x-a.x,dz=b.z-a.z;
      if(Math.hypot(dx,dz)<.5)continue;
      const arrow=new THREE.Mesh(new THREE.ConeGeometry(.14,.48,8),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9}));
      arrow.position.set(a.x+dx*.77,.08,a.z+dz*.77);
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(dx,0,dz).normalize());
      scene.add(arrow);
    }
  }
  const uniformColors=[0xff574b,0x4f91ff,0xccff00];
  data.athletes.forEach((a,i)=>drawPath(a.path,uniformColors[i]));

  function athleteRig(actor,index){
    const group=new THREE.Group();scene.add(group);
    const skin=new THREE.MeshStandardMaterial({color:actor.skin,roughness:.94});
    const jersey=new THREE.MeshStandardMaterial({color:actor.uniform,roughness:.88,metalness:.02});
    const shorts=new THREE.MeshStandardMaterial({color:0x101316,roughness:.9});
    const shoe=new THREE.MeshStandardMaterial({color:0xf1f2eb,roughness:.8});
    const hair=new THREE.MeshStandardMaterial({color:actor.hair,roughness:.9});
    const trim=new THREE.MeshStandardMaterial({color:0xf1f1eb,roughness:.7});
    function mesh(geo,mat,parent=group,x=0,y=0,z=0){const obj=new THREE.Mesh(geo,mat);obj.position.set(x,y,z);obj.castShadow=true;parent.add(obj);return obj;}
    mesh(new THREE.CylinderGeometry(.21,.19,.37,12),shorts,group,0,.99,0);
    mesh(new THREE.CylinderGeometry(.35,.26,.67,12),jersey,group,0,1.47,0);
    mesh(new THREE.CylinderGeometry(.235,.245,.05,12),trim,group,0,1.82,0);
    mesh(new THREE.CylinderGeometry(.095,.095,.2,10),skin,group,0,1.86,0);
    mesh(new THREE.SphereGeometry(.25,14,10),skin,group,0,2.13,0);
    // The hair detail is intentionally neutral and provisional.
    mesh(new THREE.SphereGeometry(.248,14,10,0,Math.PI*2,0,Math.PI*.35),hair,group,0,2.155,0);
    mesh(new THREE.SphereGeometry(.1,10,8),hair,group,0,2.08,-.24);
    const labelPlane=textPlane(actor.number,'#f4f4ef',.39,.22,180);
    // textPlane is horizontal by default, reverse orientation for a chest badge.
    labelPlane.rotation.set(0,0,0);labelPlane.position.set(0,1.49,.3);group.add(labelPlane);
    const legs=[],arms=[];
    for(const side of [-1,1]){
      const leg=new THREE.Group();leg.position.set(side*.155,.89,0);group.add(leg);
      mesh(new THREE.CylinderGeometry(.115,.095,.49,10),skin,leg,0,-.28,0);
      mesh(new THREE.SphereGeometry(.112,10,8),skin,leg,0,-.57,0);
      mesh(new THREE.CylinderGeometry(.082,.09,.39,10),skin,leg,0,-.72,0);
      mesh(new THREE.BoxGeometry(.17,.13,.32),shoe,leg,0,-.98,.085);
      legs.push(leg);
      const arm=new THREE.Group();arm.position.set(side*.37,1.75,0);group.add(arm);
      mesh(new THREE.SphereGeometry(.135,10,8),jersey,arm,0,-.07,0);
      mesh(new THREE.CylinderGeometry(.086,.067,.52,10),skin,arm,side*.035,-.37,.005);
      mesh(new THREE.SphereGeometry(.085,10,8),skin,arm,side*.05,-.67,.01);
      arms.push(arm);
    }
    // Circular shadow accent under each athlete.
    const ring=new THREE.Mesh(new THREE.RingGeometry(.49,.56,30),new THREE.MeshBasicMaterial({color:uniformColors[index],transparent:true,opacity:.65,side:THREE.DoubleSide}));
    ring.rotation.x=-Math.PI/2;ring.position.y=.025;group.add(ring);
    return {group,legs,arms,actor};
  }
  const rigs=data.athletes.map(athleteRig);
  const rigById=Object.fromEntries(rigs.map(r=>[r.actor.id,r]));
  const ball=new THREE.Group();scene.add(ball);
  const ballSurface=new THREE.Mesh(new THREE.SphereGeometry(data.ball.radius,20,14),new THREE.MeshStandardMaterial({color:0xf4f4ef,roughness:.62}));
  ballSurface.castShadow=true;ball.add(ballSurface);
  for(let i=0;i<3;i++){
    const band=new THREE.Mesh(new THREE.TorusGeometry(data.ball.radius*.85,.012,6,40),new THREE.MeshBasicMaterial({color:0x242c1d}));
    band.rotation.set(i*.65,i*1.25,0);ball.add(band);
  }

  function samplePath(path,t){
    if(t<=path[0].t)return {x:path[0].x,z:path[0].z};
    for(let i=0;i<path.length-1;i++){
      const a=path[i],b=path[i+1];
      if(t<=b.t){
        const u=Math.max(0,Math.min(1,(t-a.t)/(b.t-a.t)));
        const e=u*u*(3-2*u);
        return {x:a.x+(b.x-a.x)*e,z:a.z+(b.z-a.z)*e};
      }
    }
    const last=path[path.length-1];return {x:last.x,z:last.z};
  }
  function athletePosition(id,t){const rig=rigById[id];return samplePath(rig.actor.path,t);}
  function carriedBall(id,t){const p=athletePosition(id,t);return {x:p.x+.38,y:1.32,z:p.z+.33};}
  function getBall(t){
    for(const pass of data.ball.passes){
      if(t>=pass.start && t<=pass.end){
        const a=carriedBall(pass.from,pass.start);
        const b=carriedBall(pass.to,pass.end);
        const u=(t-pass.start)/(pass.end-pass.start);
        return {x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u+Math.sin(u*Math.PI)*pass.arc,z:a.z+(b.z-a.z)*u};
      }
    }
    const carrier=data.ball.carriers.find(c=>t>=c.from&&t<=c.to);
    if(carrier)return carriedBall(carrier.actor,t);
    return carriedBall('C',t);
  }

  const isoCamera=new THREE.OrthographicCamera(-12,12,9,-9,.1,120);
  const aerialCamera=new THREE.OrthographicCamera(-12,12,9,-9,.1,120);
  isoCamera.position.set(20,17,23);isoCamera.lookAt(0,.5,0);
  aerialCamera.position.set(0,34,.001);aerialCamera.lookAt(0,0,0);
  let activeCamera=isoCamera;
  let cameraMode='iso';
  function resize(){
    const w=Math.max(300,ROOT.clientWidth),h=Math.max(300,ROOT.clientHeight);
    renderer.setSize(w,h,false);
    const aspect=w/h;
    // Ensure the full field remains visible on narrow mobile screens.
    const portrait=aspect<1;
    const isoViewWidth=portrait?27:26;
    const aerialViewWidth=portrait?22.5:24;
    for(const [cam,worldWidth] of [[isoCamera,isoViewWidth],[aerialCamera,aerialViewWidth]]){
      const worldHeight=Math.max(worldWidth/aspect,cam===isoCamera?18:15);
      const trueWidth=Math.max(worldWidth,worldHeight*aspect);
      cam.left=-trueWidth/2;cam.right=trueWidth/2;
      cam.top=worldHeight/2;cam.bottom=-worldHeight/2;
      cam.updateProjectionMatrix();
    }
  }
  new ResizeObserver(resize).observe(ROOT);
  resize();

  let playing=false;
  let current=0;
  let lastTimestamp=0;
  durationLabel.textContent=timeLabel(data.durationSeconds);
  function setPlaybackUI(){
    playIcon.textContent=playing?'Ⅱ':'▶';
    playLabel.textContent=playing?'PAUSE':'LECTURE';
    playButton.setAttribute('aria-label',playing?'Mettre en pause':'Lire l’animation');
  }
  function setCamera(mode){
    cameraMode=mode;
    activeCamera=mode==='aerial'?aerialCamera:isoCamera;
    isoButton.classList.toggle('selected',mode==='iso');
    aerialButton.classList.toggle('selected',mode==='aerial');
    isoButton.setAttribute('aria-pressed',String(mode==='iso'));
    aerialButton.setAttribute('aria-pressed',String(mode==='aerial'));
    cameraLabel.textContent=mode==='aerial'?'VUE AÉRIENNE':'VUE ISOMÉTRIQUE';
  }
  playButton.addEventListener('click',()=>{
    if(current>=data.durationSeconds)current=0;
    playing=!playing;setPlaybackUI();
  });
  restartButton.addEventListener('click',()=>{current=0;playing=false;setPlaybackUI();update(0);renderer.render(scene,activeCamera);});
  isoButton.addEventListener('click',()=>setCamera('iso'));
  aerialButton.addEventListener('click',()=>setCamera('aerial'));
  function timeLabel(t){const n=Math.floor(t);return `00:${String(n).padStart(2,'0')}`;}
  function update(t){
    rigs.forEach((rig,i)=>{
      const p=samplePath(rig.actor.path,t);
      const previous=samplePath(rig.actor.path,Math.max(0,t-.05));
      const next=samplePath(rig.actor.path,Math.min(data.durationSeconds,t+.05));
      const dx=next.x-previous.x,dz=next.z-previous.z;
      const speed=Math.hypot(dx,dz)/.1;
      const effort=Math.min(1,speed/1.8);
      rig.group.position.set(p.x,Math.sin(t*12+i)*.022*effort,p.z);
      if(speed>.08)rig.group.rotation.y=Math.atan2(dx,dz);
      const gait=Math.sin(t*10.5+i*1.6);
      rig.legs[0].rotation.x=gait*.64*effort;
      rig.legs[1].rotation.x=-gait*.64*effort;
      rig.arms[0].rotation.x=-gait*.48*effort-.08;
      rig.arms[1].rotation.x=gait*.48*effort-.08;
      rig.group.rotation.z=Math.sin(t*10.5+i)*.022*effort;
    });
    const bp=getBall(t);
    ball.position.set(bp.x,bp.y,bp.z);
    ball.rotation.x=t*1.5;ball.rotation.y=t*.5;
    const chapter=data.chapters.find(c=>t>=c.from&&t<c.to)||data.chapters[data.chapters.length-1];
    chapterLabel.textContent=chapter.label;
    chapterDescription.textContent=chapter.description;
    currentTimeLabel.textContent=timeLabel(t);
    progress.style.width=`${100*t/data.durationSeconds}%`;
  }
  function frame(ts){
    const dt=lastTimestamp?Math.min(.08,(ts-lastTimestamp)/1000):0;
    lastTimestamp=ts;
    if(playing){current=Math.min(data.durationSeconds,current+dt);if(current>=data.durationSeconds){playing=false;setPlaybackUI();}}
    update(current);
    renderer.render(scene,activeCamera);
    requestAnimationFrame(frame);
  }
  setCamera(cameraMode);setPlaybackUI();update(0);requestAnimationFrame(frame);
  window.addEventListener('pagehide',()=>{playing=false;});
}

function validateScenario(d){
  const valid = d && Number.isFinite(d.durationSeconds) && d.durationSeconds>0 && d.durationSeconds<=120 &&
    Number.isFinite(d.dimensions?.width) && d.dimensions.width>0 &&
    Number.isFinite(d.dimensions?.depth) && d.dimensions.depth>0 &&
    Array.isArray(d.athletes) && d.athletes.length===3 &&
    d.athletes.every(a=>a.id && Array.isArray(a.path) && a.path.length>=2 && a.path.every(p=>Number.isFinite(p.t)&&Number.isFinite(p.x)&&Number.isFinite(p.z))) &&
    Array.isArray(d.chapters) && d.chapters.length>0 &&
    Array.isArray(d.ball?.passes) && Array.isArray(d.ball?.carriers);
  if(!valid)throw new Error('Le scénario de démonstration n’a pas le format attendu.');
}
init().catch(err=>{
  console.error('[Animation Engine phase 1]',err);
  failure('Impossible de charger le moteur 3D. Vérifiez la connexion Internet et ouvrez cette page depuis un serveur HTTP. Détail : '+(err?.message||'Erreur inconnue'));
});
