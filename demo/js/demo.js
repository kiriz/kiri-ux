/* demo-only behavior: theme toggle, live hue rotation, swatch generation */
(function () {
  'use strict';
  const root = document.documentElement;

  // theme toggle
  document.getElementById('theme-toggle').addEventListener('change', (e) => {
    root.setAttribute('data-theme', e.target.value);
  });

  // live brand-hue rotation (proves ISC-3: one variable re-tints everything)
  const slider = document.getElementById('hue-slider');
  const hueVal = document.getElementById('hue-val');
  slider.addEventListener('input', (e) => {
    const h = e.target.value;
    root.style.setProperty('--primary-hue', h);
    hueVal.textContent = h;
    renderSwatches();
  });

  // generate the 12-step swatch rows from computed token values
  function renderSwatches() {
    const styles = getComputedStyle(root);
    [['primary', 'primary-swatches'], ['neutral', 'neutral-swatches']].forEach(([scale, id]) => {
      const row = document.getElementById(id);
      row.innerHTML = '';
      for (let i = 1; i <= 12; i++) {
        const v = styles.getPropertyValue(`--${scale}-${i}`).trim();
        const sw = document.createElement('div');
        sw.className = 'swatch';
        sw.style.background = v || `var(--${scale}-${i})`;
        sw.innerHTML = `<span>${i}</span>`;
        row.appendChild(sw);
      }
    });
  }
  renderSwatches();
})();
