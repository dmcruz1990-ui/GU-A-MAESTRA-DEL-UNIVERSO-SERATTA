(() => {
  const tabs = document.querySelectorAll('.tab');
  const screens = document.querySelectorAll('.screen');

  const show = (name) => {
    screens.forEach(s => s.classList.toggle('hidden', s.dataset.screen !== name));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#' + name);
  };

  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.tab)));

  document.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      show(el.dataset.go);
    });
  });

  const territoryRoutes = {
    bogota: 'reservas',
    campo: 'reservas',
    atlantis: 'reservas',
    cartagena: 'reservas',
    medellin: 'reservas',
  };
  document.querySelectorAll('.t-shape').forEach(g => {
    const open = () => {
      const t = g.dataset.territory;
      show(territoryRoutes[t] || 'reservas');
    };
    g.addEventListener('click', open);
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  // Netflix-style carousels: arrow scrolls one viewport; flips at the end
  document.querySelectorAll('.carousel').forEach(car => {
    const row = car.querySelector('.rest-row--scroll');
    const arrow = car.querySelector('.carousel__arrow');
    if (!row || !arrow) return;
    arrow.addEventListener('click', () => {
      const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
      row.scrollBy({ left: atEnd ? -row.scrollWidth : row.clientWidth * 0.8, behavior: 'smooth' });
    });
    const sync = () => {
      const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
      arrow.classList.toggle('is-end', atEnd);
    };
    row.addEventListener('scroll', sync, { passive: true });
  });

  // Experience survey: star rating + submit acknowledgement
  const survey = document.getElementById('surveyForm');
  if (survey) {
    const stars = [...survey.querySelectorAll('.star')];
    const ratingInput = survey.querySelector('input[name="rating"]');
    const paint = (val) => stars.forEach(s => s.classList.toggle('on', +s.dataset.v <= val));
    stars.forEach(s => {
      s.addEventListener('mouseenter', () => paint(+s.dataset.v));
      s.addEventListener('click', () => { ratingInput.value = s.dataset.v; paint(+s.dataset.v); });
    });
    survey.querySelector('.rating').addEventListener('mouseleave', () => paint(+ratingInput.value || 0));

    survey.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(survey).entries());
      console.log('Encuesta enviada:', data); // hook a backend/Concierge here
      survey.querySelectorAll('.field, .survey__visit, .survey__submit').forEach(el => el.style.display = 'none');
      const thanks = survey.querySelector('.survey__thanks');
      thanks.hidden = false;
    });
  }

  const hash = window.location.hash.replace('#', '');
  if (hash && document.querySelector(`[data-screen="${hash}"]`)) show(hash);

  window.addEventListener('keydown', (e) => {
    if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    const order = ['home','pasaporte','reservas','misiones','concierge'];
    const cur = order.findIndex(n => !document.querySelector(`[data-screen="${n}"]`).classList.contains('hidden'));
    if (e.key === 'ArrowRight' && cur < order.length - 1) show(order[cur + 1]);
    if (e.key === 'ArrowLeft' && cur > 0) show(order[cur - 1]);
  });
})();
