(() => {
  const tabs = document.querySelectorAll('.tab');
  const screens = document.querySelectorAll('.screen');

  const show = (name) => {
    screens.forEach(s => s.classList.toggle('hidden', s.dataset.screen !== name));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.tab)));

  // Open passport from CTA
  document.querySelectorAll('.btn--passport').forEach(b => b.addEventListener('click', () => show('pasaporte')));

  // Honor URL hash
  const hash = window.location.hash.replace('#', '');
  if (hash && document.querySelector(`[data-screen="${hash}"]`)) show(hash);

  window.addEventListener('keydown', (e) => {
    const order = ['home','pasaporte','reservas','misiones','concierge'];
    const cur = order.findIndex(n => !document.querySelector(`[data-screen="${n}"]`).classList.contains('hidden'));
    if (e.key === 'ArrowRight' && cur < order.length - 1) show(order[cur + 1]);
    if (e.key === 'ArrowLeft' && cur > 0) show(order[cur - 1]);
  });
})();
