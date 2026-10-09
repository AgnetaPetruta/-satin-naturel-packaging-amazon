const links = [...document.querySelectorAll('.nav-links a')];
const sections = links.map(link => document.querySelector(link.hash));
let scheduled = false;
function track() {
  scheduled = false;
  let current = sections[0];
  for (const section of sections) if (section.getBoundingClientRect().top <= innerHeight * .35) current = section;
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 3) current = sections.at(-1);
  for (const link of links) {
    const active = link.hash === '#' + current.id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(track); }
}, {passive:true});
addEventListener('resize', track);
track();
const video = document.querySelector('video');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function play() {
  video.muted = true; video.defaultMuted = true; video.playsInline = true; video.controls = false;
  if (!reducedMotion.matches && !document.hidden) video.play().catch(() => {});
}
video.addEventListener('loadeddata', () => {
  if (reducedMotion.matches) { video.pause(); video.currentTime = .1; }
  else play();
});
if (reducedMotion.matches) video.removeAttribute('autoplay');
else play();
reducedMotion.addEventListener('change', () => reducedMotion.matches ? video.pause() : play());
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    entries[0].isIntersecting ? play() : video.pause();
  }, {rootMargin:'200px 0px'}).observe(video);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) video.pause();
  else if (video.getBoundingClientRect().bottom > -200) play();
});
