/* Native modal + Web Animations; no navigation, network gate or shared app state. */
(() => {
  const cards=[...document.querySelectorAll('[data-service]')];
  const dialog=document.getElementById('service-dialog');
  if(!cards.length||!dialog)return;
  const close=dialog.querySelector('[data-service-close]');
  const photo=dialog.querySelector('img');
  const title=dialog.querySelector('h2');
  const description=dialog.querySelector('#service-dialog-description');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let trigger,scrollPosition=0,savedStyles,animation,closing=false;
  const properties=['position','top','left','width','overflow','paddingRight'];
  function translate(){
    if(!trigger)return;
    title.textContent=trigger.querySelector('.service-card-title').textContent;
    description.textContent=document.querySelector('[data-service-description="'+trigger.dataset.service+'"]').textContent;
    photo.alt=trigger.querySelector('img').alt;
    for(const button of dialog.querySelectorAll('[data-service-language]'))button.setAttribute('aria-pressed',String(button.dataset.serviceLanguage===document.documentElement.lang));
  }
  function cardTransform(){
    const card=trigger.getBoundingClientRect(),target=dialog.getBoundingClientRect();
    const scale=Math.max(.18,Math.min(.85,card.width/target.width,card.height/target.height));
    return 'translate('+(card.left+card.width/2-target.left-target.width/2)+'px,'+(card.top+card.height/2-target.top-target.height/2)+'px) scale('+scale+')';
  }
  function animate(out){
    animation?.cancel();
    if(reduced.matches||!dialog.animate)return Promise.resolve();
    const from={transform:cardTransform(),opacity:0},to={transform:'translate(0px,0px) scale(1)',opacity:1};
    animation=dialog.animate(out?[to,from]:[from,to],{duration:out?160:240,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
    return animation.finished.catch(()=>{});
  }
  function open(card){
    if(dialog.open)return;
    trigger=card;closing=false;scrollPosition=window.scrollY;
    const image=card.querySelector('img');
    photo.src=image.getAttribute('src');photo.width=Number(image.getAttribute('width'));photo.height=Number(image.getAttribute('height'));
    translate();
    const scrollbar=window.innerWidth-document.documentElement.clientWidth;
    savedStyles=Object.fromEntries(properties.map(p=>[p,document.body.style[p]]));
    const padding=parseFloat(getComputedStyle(document.body).paddingRight)||0;
    Object.assign(document.body.style,{position:'fixed',top:-scrollPosition+'px',left:'0',width:'100%',overflow:'hidden',paddingRight:padding+scrollbar+'px'});
    dialog.showModal();close.focus({preventScroll:true});
    animate(false);
  }
  async function dismiss(){
    if(!dialog.open||closing)return;
    closing=true;await animate(true);dialog.close();
  }
  cards.forEach(card=>card.addEventListener('click',()=>open(card)));
  close.addEventListener('click',dismiss);
  for(const button of dialog.querySelectorAll('[data-service-language]'))button.addEventListener('click',()=>document.querySelector('.site-language button[lang="'+button.dataset.serviceLanguage+'"]').click());
  dialog.addEventListener('cancel',event=>{event.preventDefault();dismiss();});
  dialog.addEventListener('keydown',event=>{
    if(event.key==='Escape')event.stopPropagation();
    if(event.key!=='Tab')return;
    const controls=[...dialog.querySelectorAll('button:not([disabled])')];
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  dialog.addEventListener('click',event=>{
    const r=dialog.getBoundingClientRect();
    if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dismiss();
  });
  dialog.addEventListener('close',()=>{
    animation?.cancel();
    if(savedStyles)for(const p of properties)document.body.style[p]=savedStyles[p];
    window.scrollTo({left:0,top:scrollPosition,behavior:'instant'});
    trigger?.focus({preventScroll:true});closing=false;
  });
  document.addEventListener('pi:language',translate);
  reduced.addEventListener('change',()=>{if(reduced.matches)animation?.cancel();});
})();
