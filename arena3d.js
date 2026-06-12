/* ======================================================
   PürInstinct Games — 3D Arena (Three.js)
   360° orbit view · 9 stations · 2 Moment Factory zones
   ====================================================== */
(function(){
  const host = document.getElementById("arena3d");
  if(!host || !window.THREE) return;

  let renderer;
  try{
    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:"high-performance"});
  }catch(e){ return; } /* no WebGL → SVG fallback stays visible */
  host.classList.add("on");

  const LIME = 0xCCFF00, RED = 0xFF4438, BLUE = 0x2D7DFF, GREEN = 0x2EE06A, YELLOW = 0xFFC400, PURPLE = 0xA45CFF;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16/9, 1, 500);
  camera.position.set(0, 62, 80);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 1);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = 0.35;
  controls.maxPolarAngle = 1.25;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.55;
  let resumeT;
  controls.addEventListener("start", ()=>{ controls.autoRotate = false; clearTimeout(resumeT); });
  controls.addEventListener("end", ()=>{ clearTimeout(resumeT); resumeT = setTimeout(()=>{ if(!reduceMotion) controls.autoRotate = true; }, 5000); });

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 0.85);
  sun.position.set(-40, 70, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -70; sc.right = 70; sc.top = 70; sc.bottom = -70; sc.far = 200;
  scene.add(sun);
  const limeFill = new THREE.PointLight(LIME, 0.5, 90);
  limeFill.position.set(0, 26, 14);
  scene.add(limeFill);

  /* ---------- helpers ---------- */
  function canvasTex(w, h, draw){
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }
  function mat(color, opts){ return new THREE.MeshStandardMaterial(Object.assign({color:color, roughness:0.85, metalness:0.05}, opts||{})); }

  function makeLabel(text, colorCss){
    const pad = 28, fs = 64;
    const c = document.createElement("canvas");
    const m = c.getContext("2d");
    m.font = `italic 900 ${fs}px 'Barlow Condensed', sans-serif`;
    c.width = Math.ceil(m.measureText(text.toUpperCase()).width) + pad*2;
    c.height = fs + pad*2;
    const x = c.getContext("2d");
    x.font = `italic 900 ${fs}px 'Barlow Condensed', sans-serif`;
    x.textAlign = "center"; x.textBaseline = "middle";
    x.shadowColor = colorCss; x.shadowBlur = 22;
    x.fillStyle = colorCss;
    x.fillText(text.toUpperCase(), c.width/2, c.height/2 + 4);
    const t = new THREE.CanvasTexture(c);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:t, transparent:true, depthWrite:false, opacity:0.95}));
    const k = 0.05;
    sp.scale.set(c.width*k, c.height*k, 1);
    return sp;
  }

  /* ---------- ground ---------- */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 160), mat(0x0B0B0B, {roughness:1}));
  ground.rotation.x = -Math.PI/2;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(220, 44, 0x161616, 0x111111);
  grid.position.y = 0.02;
  scene.add(grid);

  /* arena perimeter — lime frame */
  (function(){
    const g = new THREE.Group();
    const w = 96, d = 62, t = 0.5, h = 0.18;
    const m = new THREE.MeshBasicMaterial({color:LIME});
    [[0,-d/2, w, t],[0, d/2, w, t],[-w/2, 0, t, d],[w/2, 0, t, d]].forEach(([x,z,sx,sz])=>{
      const b = new THREE.Mesh(new THREE.BoxGeometry(sx, h, sz), m);
      b.position.set(x, h/2, z);
      g.add(b);
    });
    g.children.forEach(ch=>{ ch.material.transparent = true; ch.material.opacity = 0.5; });
    scene.add(g);
  })();

  const stations = {}; /* key → {root, highlight(on), label} */
  const pickables = [];
  function registerPick(key, x, z, sx, sz, sy){
    const pick = new THREE.Mesh(new THREE.BoxGeometry(sx, sy||6, sz), new THREE.MeshBasicMaterial({transparent:true, opacity:0, depthWrite:false}));
    pick.position.set(x, (sy||6)/2, z);
    pick.userData.zone = key;
    scene.add(pick);
    pickables.push(pick);
  }

  /* ---------- SPEED ZONE : long track, staggered handicap starts ---------- */
  (function(){
    const g = new THREE.Group();
    const L = 84, W = 10;
    const tex = canvasTex(2048, 256, (x,w,h)=>{
      x.fillStyle = "#0d0d0d"; x.fillRect(0,0,w,h);
      x.strokeStyle = "rgba(255,255,255,.75)"; x.lineWidth = 3; x.setLineDash([26,20]);
      for(let i=1;i<6;i++){ const y=h/6*i; x.beginPath(); x.moveTo(0,y); x.lineTo(w,y); x.stroke(); }
      x.setLineDash([]);
      x.strokeStyle = "#FF4438"; x.lineWidth = 10;
      x.strokeRect(5,5,w-10,h-10);
      /* staggered handicap start lines */
      x.strokeStyle = "rgba(255,255,255,.9)"; x.lineWidth = 6;
      for(let i=0;i<6;i++){
        const sx = 150 + i*52, y0 = h/6*i, y1 = h/6*(i+1);
        x.beginPath(); x.moveTo(sx,y0+6); x.lineTo(sx,y1-6); x.stroke();
      }
      /* finish */
      x.fillStyle = "rgba(255,255,255,.9)";
      for(let i=0;i<12;i++) x.fillRect(w-90+(i%2)*20, i*22, 20, 22);
      /* lightning bolt brand mark */
      x.fillStyle = "rgba(204,255,0,.5)";
      x.save(); x.translate(w*0.55,h*0.5); x.rotate(-0.08);
      x.beginPath(); x.moveTo(-30,-70); x.lineTo(8,-12); x.lineTo(-12,-12); x.lineTo(30,70); x.lineTo(-8,12); x.lineTo(12,12); x.closePath(); x.fill();
      x.restore();
    });
    const track = new THREE.Mesh(new THREE.PlaneGeometry(L, W), new THREE.MeshStandardMaterial({map:tex, roughness:0.92}));
    track.rotation.x = -Math.PI/2; track.position.y = 0.06;
    track.receiveShadow = true;
    g.add(track);
    /* start arch */
    const arch = new THREE.Group();
    const pm = mat(0x111111);
    [-1,1].forEach(s=>{
      const p = new THREE.Mesh(new THREE.BoxGeometry(1.1, 5, 1.1), pm);
      p.position.set(-L/2+1.5, 2.5, s*W/2);
      p.castShadow = true; arch.add(p);
    });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, W+2.2), pm);
    beam.position.set(-L/2+1.5, 5.4, 0); beam.castShadow = true; arch.add(beam);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.3, W+2.2), new THREE.MeshBasicMaterial({color:LIME}));
    stripe.position.set(-L/2+1.5, 4.9, 0); arch.add(stripe);
    g.add(arch);
    g.position.set(0, 0, -23.5);
    scene.add(g);
    const label = makeLabel("Vitesse", "#FF4438");
    label.position.set(0, 7.2, -23.5);
    scene.add(label);
    registerPick("vitesse", 0, -23.5, L, W, 7);
    stations.vitesse = {label:label, highlight:(on)=>{ label.material.opacity = on?1:0.85; label.scale.multiplyScalar(1); track.material.emissive = new THREE.Color(on?0x331008:0x000000); }};
  })();

  /* ---------- inflatable dodecagon arena (hand skills / agility) ---------- */
  function dodecagon(key, x, z, accent, accentCss, name){
    const g = new THREE.Group();
    const R = 9.2, H = 2.8;
    const wall = new THREE.Mesh(
      new THREE.CylinderGeometry(R, R, H, 12, 1, true),
      mat(0x101010, {side:THREE.DoubleSide, roughness:0.7})
    );
    wall.position.y = H/2; wall.castShadow = true; g.add(wall);
    /* inflated post bumps at the 12 seams */
    const postM = mat(0x161616, {roughness:0.6});
    for(let i=0;i<12;i++){
      const a = (i/12)*Math.PI*2 + Math.PI/12;
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, H+0.7, 10), postM);
      p.position.set(Math.cos(a)*R, (H+0.7)/2, Math.sin(a)*R);
      p.castShadow = true; g.add(p);
    }
    /* lime top rim */
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.16, 8, 48), new THREE.MeshBasicMaterial({color:accent}));
    rim.rotation.x = Math.PI/2; rim.position.y = H+0.05; g.add(rim);
    /* floor */
    const floor = new THREE.Mesh(new THREE.CircleGeometry(R-0.3, 24), mat(0x0e0e0e, {roughness:0.95}));
    floor.rotation.x = -Math.PI/2; floor.position.y = 0.07; floor.receiveShadow = true; g.add(floor);
    /* brand ring on floor */
    const ring = new THREE.Mesh(new THREE.RingGeometry(2.6, 3.0, 40), new THREE.MeshBasicMaterial({color:LIME, transparent:true, opacity:0.85}));
    ring.rotation.x = -Math.PI/2; ring.position.y = 0.09; g.add(ring);
    /* obstacle cubes */
    const cubeM = mat(0x131313, {roughness:0.65});
    const capM = new THREE.MeshBasicMaterial({color:accent});
    [[0,-5],[4.3,-2],[-4.3,-2],[2.6,3.6],[-2.6,3.6]].forEach(([cx,cz])=>{
      const cu = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), cubeM);
      cu.position.set(cx, 0.97, cz); cu.castShadow = true; g.add(cu);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 1.8), capM);
      cap.position.set(cx, 1.89, cz); g.add(cap);
    });
    g.position.set(x, 0, z);
    scene.add(g);
    const label = makeLabel(name, accentCss);
    label.position.set(x, 6.0, z);
    scene.add(label);
    registerPick(key, x, z, R*2+1, R*2+1, 5);
    stations[key] = {label:label, highlight:(on)=>{ rim.material.color.set(on?0xffffff:accent); ring.material.opacity = on?1:0.85; }};
  }
  dodecagon("mains", -32, -2, BLUE, "#2D7DFF", "Mains");
  dodecagon("agilite", 32, -2, YELLOW, "#FFC400", "Agilité");

  /* ---------- PürInstinct turf fields (signature, center) ---------- */
  function turfField(key, x, z, name){
    const g = new THREE.Group();
    const W = 16.6, D = 17;
    const tex = canvasTex(512, 524, (c,w,h)=>{
      for(let i=0;i<8;i++){ c.fillStyle = i%2 ? "#2c6b27" : "#347d2e"; c.fillRect(0, h/8*i, w, h/8); }
      c.strokeStyle = "rgba(255,255,255,.95)"; c.lineWidth = 7;
      c.strokeRect(14,14,w-28,h-28);
      /* end-zone lines */
      c.beginPath(); c.moveTo(14,80); c.lineTo(w-14,80); c.stroke();
      c.beginPath(); c.moveTo(14,h-80); c.lineTo(w-14,h-80); c.stroke();
      /* center circle */
      c.beginPath(); c.arc(w/2, h/2, 64, 0, 7); c.stroke();
      c.fillStyle = "#CCFF00";
      c.beginPath(); c.arc(w/2, h/2, 10, 0, 7); c.fill();
    });
    const turf = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({map:tex, roughness:0.95}));
    turf.rotation.x = -Math.PI/2; turf.position.y = 0.06; turf.receiveShadow = true; g.add(turf);
    /* perimeter boards */
    const bm = mat(0x101010, {roughness:0.7});
    const lm = new THREE.MeshBasicMaterial({color:LIME});
    const bh = 1.15;
    [[0,-D/2-0.2, W+0.9, 0.4],[0, D/2+0.2, W+0.9, 0.4],[-W/2-0.2, 0, 0.4, D],[W/2+0.2, 0, 0.4, D]].forEach(([bx,bz,sx,sz])=>{
      const b = new THREE.Mesh(new THREE.BoxGeometry(sx, bh, sz), bm);
      b.position.set(bx, bh/2, bz); b.castShadow = true; g.add(b);
      const top = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.07, sz), lm);
      top.position.set(bx, bh+0.04, bz); g.add(top);
    });
    g.position.set(x, 0, z);
    scene.add(g);
    const label = makeLabel(name, "#CCFF00");
    label.position.set(x, 4.6, z);
    scene.add(label);
    registerPick(key, x, z, W+2, D+2, 4);
    stations[key] = {label:label, highlight:(on)=>{ g.children.forEach(ch=>{ if(ch.material && ch.material.color && ch.material.type==="MeshBasicMaterial") ch.material.color.set(on?0xffffff:LIME); }); }};
  }
  turfField("pi1", -9.6, -2, "PürInstinct 1");
  turfField("pi2", 9.6, -2, "PürInstinct 2");

  /* ---------- flat courts (foot skills / IQ) ---------- */
  function court(key, x, z, accent, accentCss, name, padCorners){
    const g = new THREE.Group();
    const W = 16.6, D = 15.5;
    const tex = canvasTex(512, 480, (c,w,h)=>{
      c.fillStyle = "#0d0d0d"; c.fillRect(0,0,w,h);
      c.strokeStyle = accentCss; c.lineWidth = 8; c.globalAlpha = 0.8;
      c.strokeRect(10,10,w-20,h-20);
      c.globalAlpha = 0.25; c.lineWidth = 2.5;
      for(let i=0;i<9;i++){
        c.beginPath();
        c.moveTo(30, 50+i*44);
        for(let px=30; px<=w-30; px+=24) c.lineTo(px, 50+i*44 + Math.sin(px*0.06+i)*9);
        c.stroke();
      }
      c.globalAlpha = 1;
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({map:tex, roughness:0.9}));
    floor.rotation.x = -Math.PI/2; floor.position.y = 0.06; floor.receiveShadow = true; g.add(floor);
    /* low boards */
    const bm = mat(0x101010);
    const am = new THREE.MeshBasicMaterial({color:accent, transparent:true, opacity:0.9});
    const bh = 0.9;
    [[0,-D/2-0.15, W+0.6, 0.3],[0, D/2+0.15, W+0.6, 0.3],[-W/2-0.15, 0, 0.3, D],[W/2+0.15, 0, 0.3, D]].forEach(([bx,bz,sx,sz])=>{
      const b = new THREE.Mesh(new THREE.BoxGeometry(sx, bh, sz), bm);
      b.position.set(bx, bh/2, bz); b.castShadow = true; g.add(b);
      const top = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.06, sz), am);
      top.position.set(bx, bh+0.03, bz); g.add(top);
    });
    const padMs = [];
    if(padCorners){
      const colors = [LIME, accent===GREEN?RED:accent, LIME, BLUE];
      [[-W/2+2.2,-D/2+2.2],[W/2-2.2,-D/2+2.2],[-W/2+2.2,D/2-2.2],[W/2-2.2,D/2-2.2]].forEach(([px,pz],i)=>{
        const pm2 = new THREE.MeshBasicMaterial({color:colors[i], transparent:true, opacity:0.9});
        const pad = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), pm2);
        pad.rotation.x = -Math.PI/2; pad.position.set(px, 0.1, pz);
        g.add(pad); padMs.push(pm2);
      });
    }
    g.position.set(x, 0, z);
    scene.add(g);
    const label = makeLabel(name, accentCss);
    label.position.set(x, 4.2, z);
    scene.add(label);
    registerPick(key, x, z, W+2, D+2, 4);
    stations[key] = {label:label, pads:padMs, highlight:(on)=>{ am.color.set(on?0xffffff:accent); }};
    return g;
  }
  court("pieds", -32, 17, GREEN, "#2EE06A", "Pieds", true);
  court("iq", 32, 17, PURPLE, "#A45CFF", "IQ de jeu", false);

  /* ---------- Moment Factory augmented zones (animated light floors) ---------- */
  const mfTiles = [];
  function mfZone(key, x, z, name){
    const g = new THREE.Group();
    const W = 16.6, D = 15.5, N = 6;
    const base = new THREE.Mesh(new THREE.PlaneGeometry(W+1, D+1), mat(0x0a0a0a));
    base.rotation.x = -Math.PI/2; base.position.y = 0.05; base.receiveShadow = true; g.add(base);
    const tw = W/N, td = D/N;
    for(let i=0;i<N;i++)for(let j=0;j<N;j++){
      const m2 = new THREE.MeshBasicMaterial({color:(i+j)%3===0 ? PURPLE : LIME, transparent:true, opacity:0.25});
      const tile = new THREE.Mesh(new THREE.PlaneGeometry(tw-0.25, td-0.25), m2);
      tile.rotation.x = -Math.PI/2;
      tile.position.set(-W/2+tw/2+i*tw, 0.09, -D/2+td/2+j*td);
      g.add(tile);
      mfTiles.push({m:m2, phase:(i+j)*0.6 + (key==="mf2"?2.1:0)});
    }
    /* corner light pillars */
    for(const [cx,cz] of [[-W/2,-D/2],[W/2,-D/2],[-W/2,D/2],[W/2,D/2]]){
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.4, 0.5), mat(0x111111));
      p.position.set(cx, 2.2, cz); p.castShadow = true; g.add(p);
      const glow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 4.0, 0.18), new THREE.MeshBasicMaterial({color:LIME}));
      glow.position.set(cx+0.27, 2.2, cz); g.add(glow);
    }
    g.position.set(x, 0, z);
    scene.add(g);
    const label = makeLabel(name, "#CCFF00");
    label.position.set(x, 5.2, z);
    scene.add(label);
    registerPick(key, x, z, W+2, D+2, 5);
    stations[key] = {label:label, highlight:()=>{}};
  }
  mfZone("mf1", -9.6, 17, "Augmenté 1");
  mfZone("mf2", 9.6, 17, "Augmenté 2");

  /* ---------- scoreboard ---------- */
  (function(){
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 7, 10), mat(0x141414));
    pole.position.y = 3.5; pole.castShadow = true; g.add(pole);
    const tex = canvasTex(256, 128, (c,w,h)=>{
      c.fillStyle = "#050505"; c.fillRect(0,0,w,h);
      c.font = "900 44px 'Barlow Condensed', sans-serif"; c.textAlign = "center";
      c.fillStyle = "#FF4438"; c.fillText("10", 50, 62);
      c.fillStyle = "#CCFF00"; c.fillText("8:57", w/2, 62);
      c.fillStyle = "#2D7DFF"; c.fillText("14", w-50, 62);
      c.fillStyle = "rgba(255,255,255,.5)"; c.font = "700 18px 'Barlow', sans-serif";
      c.fillText("PÜRINSTINCT GAMES", w/2, 104);
    });
    const screen = new THREE.Mesh(new THREE.BoxGeometry(7, 3.4, 0.4), new THREE.MeshBasicMaterial({map:tex}));
    screen.position.y = 8.2; g.add(screen);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(7.4, 3.8, 0.3), mat(0x0c0c0c));
    frame.position.set(0, 8.2, -0.1); g.add(frame);
    g.position.set(48, 0, 8);
    g.rotation.y = -0.5;
    scene.add(g);
  })();

  /* ---------- interaction ---------- */
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  let hovered = null;
  function pick(clientX, clientY){
    const r = renderer.domElement.getBoundingClientRect();
    ptr.x = ((clientX - r.left)/r.width)*2 - 1;
    ptr.y = -((clientY - r.top)/r.height)*2 + 1;
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(pickables, false)[0];
    return hit ? hit.object.userData.zone : null;
  }
  function setActive(key){
    if(hovered && stations[hovered]) stations[hovered].highlight(false);
    hovered = key;
    if(key && stations[key]){
      stations[key].highlight(true);
      if(typeof renderZoneCard === "function"){ currentZone = key; renderZoneCard(key); }
    }
  }
  renderer.domElement.addEventListener("pointermove", e=>{
    if(e.pointerType !== "mouse") return;
    const k = pick(e.clientX, e.clientY);
    renderer.domElement.style.cursor = k ? "pointer" : "grab";
    if(k && k !== hovered) setActive(k);
  });
  let downX=0, downY=0;
  renderer.domElement.addEventListener("pointerdown", e=>{ downX=e.clientX; downY=e.clientY; });
  renderer.domElement.addEventListener("pointerup", e=>{
    if(Math.hypot(e.clientX-downX, e.clientY-downY) > 7) return; /* it was a drag */
    const k = pick(e.clientX, e.clientY);
    if(k) setActive(k);
  });

  /* ---------- language hook for labels ---------- */
  window.__arena3dSetLang = function(lng){
    const names = {
      fr:{vitesse:"Vitesse", mains:"Mains", pieds:"Pieds", agilite:"Agilité", iq:"IQ de jeu", pi1:"PürInstinct 1", pi2:"PürInstinct 2", mf1:"Augmenté 1", mf2:"Augmenté 2"},
      en:{vitesse:"Speed", mains:"Hands", pieds:"Feet", agilite:"Agility", iq:"Game IQ", pi1:"PürInstinct 1", pi2:"PürInstinct 2", mf1:"Augmented 1", mf2:"Augmented 2"}
    };
    const colors = {vitesse:"#FF4438", mains:"#2D7DFF", pieds:"#2EE06A", agilite:"#FFC400", iq:"#A45CFF", pi1:"#CCFF00", pi2:"#CCFF00", mf1:"#CCFF00", mf2:"#CCFF00"};
    Object.keys(stations).forEach(k=>{
      const old = stations[k].label;
      const fresh = makeLabel(names[lng][k], colors[k]);
      fresh.position.copy(old.position);
      scene.remove(old);
      old.material.map.dispose(); old.material.dispose();
      scene.add(fresh);
      stations[k].label = fresh;
    });
  };

  /* ---------- sizing + visibility-aware render loop ---------- */
  function resize(){
    const w = host.clientWidth, h = host.clientHeight;
    if(!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(host);

  let visible = false, rafId = null;
  const clock = new THREE.Clock();
  function loop(){
    rafId = visible ? requestAnimationFrame(loop) : null;
    const t = clock.getElapsedTime();
    if(!reduceMotion){
      for(let i=0;i<mfTiles.length;i++){
        const tile = mfTiles[i];
        tile.m.opacity = 0.18 + Math.max(0, Math.sin(t*1.8 + tile.phase))*0.55;
      }
    }
    controls.update();
    renderer.render(scene, camera);
  }
  new IntersectionObserver(es=>{
    es.forEach(e=>{
      visible = e.isIntersecting;
      if(visible && rafId === null) loop();
    });
  }, {threshold:0.05}).observe(host);
  /* first paint even if observer is late */
  loop(); if(!visible && rafId===null) renderer.render(scene, camera);
})();
