/* Funding notices and manual inquiry only: never calculate or submit. */
(() => {
  const inquiry=document.querySelector('[data-multiple-blocks-inquiry]');
  const comments=document.querySelector('#schools-contact-form [name="Commentaires"]');
  const phrase='Je souhaite discuter de plusieurs blocs de 4 heures dans une même journée.';
  const english=()=>document.documentElement.lang==='en';
  const translated=fr=>english()?window.piTranslations?.[fr]||fr:fr;
  let inserted=false,lastPhrase='';
  inquiry?.addEventListener('click',()=>{
    const text=translated(phrase),alternatives=[phrase,window.piTranslations?.[phrase]].filter(Boolean);
    if(!comments.value.trim())inserted=false;
    if(!inserted&&!alternatives.some(value=>comments.value.includes(value))){
      comments.value=[comments.value,text].filter(Boolean).join('\n\n');
      comments.dispatchEvent(new Event('input',{bubbles:true}));
      inserted=true;lastPhrase=text;
    }
    // Native anchor preserves history and scroll-margin; no estimate event or submit.
  });
  const dialog=document.getElementById('funding-dialog');
  if(!dialog)return;
  const close=dialog.querySelector('[data-funding-close]');
  let trigger,scrollPosition=0,savedStyles;
  const properties=['position','top','left','width','overflow','paddingRight'];
  function translate(){
    if(inserted&&lastPhrase&&comments.value.includes(lastPhrase)){
      const next=translated(phrase);comments.value=comments.value.replace(lastPhrase,next);lastPhrase=next;
    }
    if(!trigger)return;
    dialog.querySelector('h2').textContent=trigger.querySelector('.funding-label').textContent;
    dialog.querySelector('#funding-dialog-description').textContent=document.querySelector('[data-funding-description="'+trigger.dataset.funding+'"]').textContent;
    for(const button of dialog.querySelectorAll('[data-funding-language]'))button.setAttribute('aria-pressed',String(button.dataset.fundingLanguage===document.documentElement.lang));
  }
  for(const button of document.querySelectorAll('[data-funding]'))button.addEventListener('click',()=>{
    if(dialog.open)return;
    trigger=button;translate();scrollPosition=window.scrollY;
    savedStyles=Object.fromEntries(properties.map(p=>[p,document.body.style[p]]));
    const padding=parseFloat(getComputedStyle(document.body).paddingRight)||0;
    Object.assign(document.body.style,{position:'fixed',top:-scrollPosition+'px',left:'0',width:'100%',overflow:'hidden',paddingRight:padding+window.innerWidth-document.documentElement.clientWidth+'px'});
    dialog.showModal();close.focus({preventScroll:true});
  });
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',event=>{
    if(event.key==='Escape')event.stopPropagation();
    if(event.key!=='Tab')return;
    const controls=[...dialog.querySelectorAll('button')],first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  dialog.addEventListener('click',event=>{
    const r=dialog.getBoundingClientRect();
    if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();
  });
  dialog.addEventListener('close',()=>{
    if(savedStyles)for(const p of properties)document.body.style[p]=savedStyles[p];
    window.scrollTo({left:0,top:scrollPosition,behavior:'instant'});trigger?.focus({preventScroll:true});
  });
  for(const button of dialog.querySelectorAll('[data-funding-language]'))button.addEventListener('click',()=>document.querySelector('.site-language button[lang="'+button.dataset.fundingLanguage+'"]').click());
  document.addEventListener('pi:language',translate);
})();
