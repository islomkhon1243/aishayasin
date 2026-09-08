(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];
  const intro = $('#intro');
  const site = $('#site');
  const openBtn = $('#openInvitation');
  const music = $('#bgMusic');
  const musicBtn = $('#musicToggle');
  let opened = false;

  if (window.gsap) gsap.registerPlugin(ScrollTrigger);

  function tryPlayMusic(){
    music.volume = 0.55;
    const p = music.play();
    if (p && typeof p.then === 'function') {
      p.then(() => musicBtn.classList.add('playing')).catch(() => musicBtn.classList.remove('playing'));
    }
  }

  openBtn.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    tryPlayMusic();

    const tl = gsap.timeline({defaults:{ease:'power3.out'}});
    tl.to('.intro-copy', {y:-32, opacity:0, duration:.45})
      .to('#giftImg', {scale:1.12, rotate:-5, y:-18, duration:.32}, '<')
      .to('#giftImg', {scale:.7, y:80, opacity:0, rotate:7, duration:.46, ease:'back.in(1.8)'})
      .set('.burst-item', {opacity:1}, '<+.16')
      .to('.b1', {x:-320, y:-430, rotate:-20, scale:1.25, duration:1.1}, '<')
      .to('.b2', {x:300, y:-440, rotate:18, scale:1.2, duration:1.1}, '<')
      .to('.b3', {x:-250, y:-260, rotate:-70, scale:1.1, duration:.95}, '<')
      .to('.b4', {x:230, y:-280, rotate:65, scale:1.1, duration:.95}, '<')
      .to('.b5', {x:20, y:-420, rotate:120, scale:1.25, duration:.95}, '<')
      .to(intro, {opacity:0, scale:1.04, duration:.72, ease:'power2.inOut'}, '-=.18')
      .set(intro, {display:'none'})
      .set(site, {autoAlpha:1})
      .add(() => {
        document.body.classList.remove('locked');
        site.setAttribute('aria-hidden','false');
        musicBtn.classList.add('visible');
        initScenes();
        ScrollTrigger.refresh();
      });
  });

  musicBtn.addEventListener('click', () => {
    if (music.paused) tryPlayMusic();
    else { music.pause(); musicBtn.classList.remove('playing'); }
  });

  function initScenes(){
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.set('.hero-content', {opacity:1, visibility:'visible'});
    gsap.fromTo('.hero-content', {y:34, scale:.97}, {y:0, scale:1, duration:1.05, ease:'power3.out', clearProps:'transform'});
    gsap.from('.pink-balloons', {x:-120, opacity:0, duration:1.3, ease:'back.out(1.2)'});
    gsap.from('.blue-balloons', {x:120, opacity:0, duration:1.3, ease:'back.out(1.2)'});

    gsap.to('.pink-balloons', {y:-90, rotate:-5, scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub:1}});
    gsap.to('.blue-balloons', {y:-140, rotate:6, scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub:1}});
    // Keep the hero names fully visible when the user scrolls back up.
    // Only apply a light depth movement; opacity is never animated by ScrollTrigger.
    gsap.fromTo('.hero-content',
      {y:0, scale:1, opacity:1},
      {y:-34, scale:.985, opacity:1, ease:'none', immediateRender:false,
       scrollTrigger:{trigger:'#hero', start:'45% center', end:'bottom top', scrub:.65, invalidateOnRefresh:true}}
    );

    gsap.from('.number-three', {x:-180, rotateY:28, rotateZ:-10, opacity:0, scale:.8, scrollTrigger:{trigger:'#ages', start:'top 72%', end:'45% 55%', scrub:1}});
    gsap.from('.number-one', {x:180, rotateY:-28, rotateZ:10, opacity:0, scale:.8, scrollTrigger:{trigger:'#ages', start:'top 72%', end:'45% 55%', scrub:1}});
    gsap.from('.center-emblem', {scale:.2, rotate:-70, opacity:0, scrollTrigger:{trigger:'#ages', start:'20% 80%', end:'55% 55%', scrub:1}});
    gsap.from('.age-copy', {y:45, opacity:0, stagger:.14, scrollTrigger:{trigger:'#ages', start:'36% 76%', toggleActions:'play none none reverse'}});

    gsap.from('.invitation-card', {y:90, scale:.92, opacity:0, rotateX:8, duration:1.2, scrollTrigger:{trigger:'#invitation', start:'top 72%', toggleActions:'play none none reverse'}});
    gsap.from('.invitation-decor img', {scale:.2, opacity:0, rotate:60, stagger:.11, duration:.8, scrollTrigger:{trigger:'#invitation', start:'top 65%', toggleActions:'play none none reverse'}});

    gsap.from('.time-cell', {y:60, opacity:0, scale:.9, stagger:.1, duration:.8, ease:'back.out(1.4)', scrollTrigger:{trigger:'#countdown', start:'top 70%', toggleActions:'play none none reverse'}});
    gsap.to('.cb1', {y:-120, rotate:-4, scrollTrigger:{trigger:'#countdown', start:'top bottom', end:'bottom top', scrub:1}});
    gsap.to('.cb2', {y:140, rotate:4, scrollTrigger:{trigger:'#countdown', start:'top bottom', end:'bottom top', scrub:1}});

    gsap.from('.finale-content > *', {y:36, opacity:0, stagger:.12, duration:.85, scrollTrigger:{trigger:'#finale', start:'top 66%', toggleActions:'play none none reverse'}});
    gsap.from('.finale-particles img', {scale:.1, opacity:0, rotate:80, stagger:.09, duration:.8, scrollTrigger:{trigger:'#finale', start:'top 60%', toggleActions:'play none none reverse'}});

    if (matchMedia('(pointer:fine)').matches) {
      const depths = $$('.depth');
      window.addEventListener('pointermove', (e) => {
        const nx = (e.clientX / innerWidth - .5) * 2;
        const ny = (e.clientY / innerHeight - .5) * 2;
        depths.forEach(el => {
          const d = parseFloat(el.dataset.depth || .2);
          gsap.to(el, {x:nx*34*d, y:ny*24*d, rotateY:nx*3*d, rotateX:-ny*3*d, duration:1.1, ease:'power2.out', overwrite:'auto'});
        });
      }, {passive:true});
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, 180);
  }, {passive:true});

  function updateCountdown(){
    const target = new Date(2026, 8, 20, 18, 30, 0); // 20 Sep 2026, local time
    const now = new Date();
    let diff = target - now;
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    $('#days').textContent = String(d).padStart(2,'0');
    $('#hours').textContent = String(h).padStart(2,'0');
    $('#minutes').textContent = String(m).padStart(2,'0');
    $('#seconds').textContent = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
