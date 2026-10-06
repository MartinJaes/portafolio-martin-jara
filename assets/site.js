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

/* Animación: fondo del perfil, contadores y aparición al desplazarse */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cv = document.querySelector('.hero-net');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), hero = cv.parentElement, W = 0, H = 0, nodes = [], running = false, raf = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var mouse = {x: -9999, y: -9999, on: false};
    var line = {pts: [], t0: 0, dur: 4200, hold: 1800, fade: 900};

    function makeLine(){
      var n = 40, raw = [], v = 0, i, mn, mx;
      for (i = 0; i < n; i++) { v += 0.35 + (Math.random() - 0.45) * 1.6; raw.push(v); }   // serie con tendencia al alza
      mn = Math.min.apply(null, raw); mx = Math.max.apply(null, raw);
      line.pts = raw.map(function(r){ return 1 - (r - mn) / ((mx - mn) || 1); });      // 0 = arriba, 1 = abajo
      line.t0 = performance.now();
    }
    function size(){
      W = hero.clientWidth; H = hero.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(80, Math.max(26, W * H / 14000)));
      nodes = [];
      for (var i = 0; i < n; i++) nodes.push({x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, c: Math.random() < .2});
    }
    function drawLine(now){
      if (!line.pts.length) return;
      var wide = W >= 900, x0 = wide ? W * 0.60 : 0, x1 = wide ? W * 0.97 : W, top = wide ? H * 0.56 : H * 0.80, h = wide ? H * 0.26 : H * 0.14, el = now - line.t0, total = line.dur + line.hold + line.fade;
      if (el > total) { makeLine(); el = 0; }
      var p = reduce ? 1 : Math.min(1, el / line.dur), alpha = 1;
      if (!reduce && el > line.dur + line.hold) alpha = 1 - (el - line.dur - line.hold) / line.fade;
      var n = line.pts.length, last = Math.max(1, Math.floor(p * (n - 1))), frac = p * (n - 1) - last;
      var xs = function(i){ return x0 + (i / (n - 1)) * (x1 - x0); }, ys = function(i){ return top + line.pts[i] * h; };
      ctx.save(); ctx.globalAlpha = Math.max(0, alpha);
      // área
      var g = ctx.createLinearGradient(0, top, 0, top + h);
      g.addColorStop(0, 'rgba(232,96,74,0.22)'); g.addColorStop(1, 'rgba(232,96,74,0)');
      ctx.beginPath(); ctx.moveTo(xs(0), top + h); ctx.lineTo(xs(0), ys(0));
      for (var i = 1; i <= last; i++) ctx.lineTo(xs(i), ys(i));
      var ex = xs(last), ey = ys(last);
      if (last < n - 1 && frac > 0) { ex = xs(last) + (xs(last + 1) - xs(last)) * frac; ey = ys(last) + (ys(last + 1) - ys(last)) * frac; ctx.lineTo(ex, ey); }
      ctx.lineTo(ex, top + h); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
      // línea
      ctx.beginPath(); ctx.moveTo(xs(0), ys(0));
      for (i = 1; i <= last; i++) ctx.lineTo(xs(i), ys(i));
      if (last < n - 1 && frac > 0) ctx.lineTo(ex, ey);
      ctx.strokeStyle = 'rgba(255,140,120,0.9)'; ctx.lineWidth = 2; ctx.shadowColor = 'rgba(232,96,74,0.9)'; ctx.shadowBlur = 10; ctx.stroke();
      // punto guía
      ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI * 2); ctx.fillStyle = '#ffd1c9'; ctx.fill();
      ctx.restore();
    }
    function draw(now){
      ctx.clearRect(0, 0, W, H);
      var max = 150, i, j, a, b, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < max) { ctx.strokeStyle = 'rgba(120,180,225,' + (0.42 * (1 - d / max)).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        if (mouse.on) {
          dx = a.x - mouse.x; dy = a.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < 190) { ctx.strokeStyle = 'rgba(255,150,130,' + (0.7 * (1 - d / 190)).toFixed(3) + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        }
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i]; ctx.beginPath(); ctx.arc(a.x, a.y, a.c ? 2.6 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = a.c ? 'rgba(255,120,100,.95)' : 'rgba(255,255,255,.7)'; ctx.fill();
      }
      drawLine(now);
    }
    function step(now){
      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        if (mouse.on) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120 && d2 > 1) { var f = 0.6 / Math.sqrt(d2); p.x += dx * f; p.y += dy * f; }
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      draw(now); raf = requestAnimationFrame(step);
    }
    function start(){ if (!running && !reduce) { running = true; raf = requestAnimationFrame(step); } }
    function stop(){ running = false; cancelAnimationFrame(raf); }
    function setMouse(e){ var r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true; }
    hero.addEventListener('pointermove', setMouse);
    hero.addEventListener('pointerdown', setMouse);
    hero.addEventListener('pointerleave', function(){ mouse.on = false; });
    size(); makeLine(); draw(performance.now());
    window.addEventListener('resize', function(){ size(); draw(performance.now()); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(e){ e[0].isIntersecting ? start() : stop(); }).observe(hero);
    } else { start(); }
    document.addEventListener('visibilitychange', function(){ document.hidden ? stop() : start(); });
  }

  // Contadores
  document.querySelectorAll('.hero-stat-num').forEach(function(el){
    var txt = el.textContent.trim(), m = txt.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!m || reduce) return;
    var pre = m[1], val = parseFloat(m[2]), dec = (m[2].split('.')[1] || '').length, suf = m[3], t0 = null, dur = 1400;
    el.textContent = pre + (0).toFixed(dec) + suf;
    function tick(ts){
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (val * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(tick); else el.textContent = txt;
    }
    setTimeout(function(){ requestAnimationFrame(tick); }, 350);
  });

  // Aparición al desplazarse
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    var sel = '.vcard,.devblock,.pcard,.tl-item,.stack-strip,.exp-item,.study-card,.cert-row,.teach-card,.cta-block';
    var items = document.querySelectorAll(sel);
    items.forEach(function(el){
      var sib = Array.prototype.filter.call(el.parentElement.children, function(c){ return c.matches(sel); });
      el.style.setProperty('--rd', (Math.min(sib.indexOf(el), 6) * 0.08) + 's');
      el.classList.add('reveal');
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {rootMargin: '0px 0px -8% 0px'});
    items.forEach(function(el){ io.observe(el); });
  }
})();
