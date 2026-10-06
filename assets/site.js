function openLightbox(src){document.getElementById('lightboxImg').src=src;document.getElementById('lightbox').classList.add('open');}
function closeLightbox(){document.getElementById('lightbox').classList.remove('open');}
(function(){
  var t=document.getElementById('navToggle'),l=document.getElementById('navLinks');
  if(t&&l){t.addEventListener('click',function(){l.classList.toggle('open');});
    l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open');});});}
  var b=document.body;
  if(b.dataset.page==='home'){
    var h=location.hash;
    if(['#experiencia','#formacion','#docencia'].indexOf(h)>-1){location.replace('/trayectoria/');return;}
    if(['#proyectos','#portafolio','#stack','#servicios','#consultoria'].indexOf(h)>-1){location.replace('/proyectos/');return;}
  }
  function setLang(lang,persist){
    if(lang!=='es'&&lang!=='en')lang='es';
    document.documentElement.lang=lang;
    var title=b.getAttribute('data-title-'+lang),desc=b.getAttribute('data-desc-'+lang);
    if(title)document.title=title;
    var md=document.querySelector('meta[name="description"]');if(md&&desc)md.setAttribute('content',desc);
    document.querySelectorAll('.lang-switch button').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.set===lang?'true':'false');});
    if(persist){
      try{localStorage.setItem('lang',lang);}catch(e){}
      try{var u=new URL(location.href);if(lang==='en')u.searchParams.set('lang','en');else u.searchParams.delete('lang');history.replaceState(null,'',u);}catch(e){}
    }
  }
  document.querySelectorAll('.lang-switch button').forEach(function(x){x.addEventListener('click',function(){setLang(x.dataset.set,true);});});
  var p=null;try{p=new URLSearchParams(location.search).get('lang');}catch(e){}
  if(p==='en'||p==='es'){try{localStorage.setItem('lang',p);}catch(e){}}
  setLang(document.documentElement.lang,false);
})();
