/* kiri-ux · components/interaction.js
 * Progressive-enhancement behaviors for dropdown, modal, accordion, tabs,
 * and toasts. Vanilla JS, no dependencies. Auto-inits on DOMContentLoaded;
 * also exports kiriUX for manual control. Components work visually without
 * this file — JS only adds interactivity.
 *
 * init() is IDEMPOTENT (Cato audit 2026-06-04): nodes are tagged data-kx-init
 * so re-running init() on dynamic content never double-binds. A single shared
 * document click listener closes open dropdowns rather than one-per-dropdown.
 */
(function (global) {
  'use strict';

  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function trapFocus(container, e) {
    const items = container.querySelectorAll(FOCUSABLE);
    if (!items.length) { e.preventDefault(); return; }  // nothing to tab to → keep focus in dialog
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  /* ── Dropdown (shared document handler, registered once) ── */
  const openDropdowns = new Set();
  let dropdownDocBound = false;
  function bindDropdownDocHandler() {
    if (dropdownDocBound) return;
    dropdownDocBound = true;
    document.addEventListener('click', (e) => {
      openDropdowns.forEach((d) => { if (!d.root.contains(e.target)) d.close(); });
    });
  }
  function initDropdown(root) {
    if (root.dataset.kxInit) return;
    root.dataset.kxInit = '1';
    const trigger = root.querySelector('[data-dropdown-trigger]');
    const panel = root.querySelector('.dropdown__panel');
    if (!trigger || !panel) return;
    const api = {
      root,
      close: () => { panel.removeAttribute('data-open'); trigger.setAttribute('aria-expanded', 'false'); openDropdowns.delete(api); },
      open: () => { panel.setAttribute('data-open', ''); trigger.setAttribute('aria-expanded', 'true'); openDropdowns.add(api); },
    };
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.hasAttribute('data-open') ? api.close() : api.open();
    });
    panel.addEventListener('keydown', (e) => {
      const items = [...panel.querySelectorAll('.dropdown__item')];
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
      if (e.key === 'Escape') { api.close(); trigger.focus(); }
    });
    bindDropdownDocHandler();
  }

  /* ── Modal ──────────────────────────────────────────────── */
  function openModal(backdrop) {
    const prevFocus = document.activeElement;
    backdrop.hidden = false;
    const modal = backdrop.querySelector('.modal');
    if (!modal.hasAttribute('tabindex')) modal.setAttribute('tabindex', '-1');  // focusable fallback
    (modal.querySelector(FOCUSABLE) || modal).focus();
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal(backdrop, prevFocus, onKey);
      if (e.key === 'Tab') trapFocus(modal, e);
    };
    const onBackdrop = (e) => { if (e.target === backdrop) closeModal(backdrop, prevFocus, onKey, onBackdrop); };
    backdrop.addEventListener('click', onBackdrop);
    backdrop._kxBackdrop = onBackdrop;
    backdrop.querySelectorAll('[data-modal-close]').forEach((b) =>
      b.addEventListener('click', () => closeModal(backdrop, prevFocus, onKey, onBackdrop)));
    document.addEventListener('keydown', onKey);
  }
  function closeModal(backdrop, prevFocus, onKey, onBackdrop) {
    backdrop.hidden = true;
    document.removeEventListener('keydown', onKey);
    if (onBackdrop) backdrop.removeEventListener('click', onBackdrop);
    if (prevFocus && prevFocus.focus) prevFocus.focus();
  }
  function initModalTriggers(scope) {
    scope.querySelectorAll('[data-modal-open]').forEach((trigger) => {
      if (trigger.dataset.kxInit) return;
      trigger.dataset.kxInit = '1';
      trigger.addEventListener('click', () => {
        const target = document.getElementById(trigger.getAttribute('data-modal-open'));
        if (target) openModal(target);
      });
    });
  }

  /* ── Accordion (interruption-safe) ──────────────────────── */
  function initAccordion(root) {
    if (root.dataset.kxInit) return;
    root.dataset.kxInit = '1';
    root.querySelectorAll('.accordion__trigger').forEach((trigger) => {
      const panel = trigger.nextElementSibling;
      if (!panel) return;
      const id = panel.id || ('kx-acc-' + Math.random().toString(36).slice(2));
      panel.id = id;
      trigger.setAttribute('aria-controls', id);
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      panel.style.height = expanded ? 'auto' : '0';
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        // cancel any in-flight transition handler (rapid-click guard)
        if (panel._kxDone) { panel.removeEventListener('transitionend', panel._kxDone); panel._kxDone = null; }
        // normalize from 'auto' to a pixel height so the transition always runs
        if (panel.style.height === 'auto') panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(() => {
          if (isOpen) {
            panel.style.height = '0';
          } else {
            panel.style.height = panel.scrollHeight + 'px';
            panel._kxDone = function done() {
              panel.style.height = 'auto';
              panel.removeEventListener('transitionend', done);
              panel._kxDone = null;
            };
            panel.addEventListener('transitionend', panel._kxDone);
          }
        });
      });
    });
  }

  /* ── Tabs ───────────────────────────────────────────────── */
  function initTabs(root) {
    if (root.dataset.kxInit) return;
    root.dataset.kxInit = '1';
    const tabs = [...root.querySelectorAll('.tabs__tab')];
    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => selectTab(tabs, idx));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); selectTab(tabs, (idx + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); selectTab(tabs, (idx - 1 + tabs.length) % tabs.length, true); }
      });
    });
  }
  function selectTab(tabs, idx, focus) {
    tabs.forEach((t, i) => {
      const selected = i === idx;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tabs[idx].focus();
  }

  /* ── Toast ──────────────────────────────────────────────── */
  function toast(message, opts) {
    opts = opts || {};
    let region = document.querySelector('.toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('aria-live', opts.variant === 'error' ? 'assertive' : 'polite');
      document.body.appendChild(region);
    }
    const el = document.createElement('div');
    el.className = 'toast toast--' + (opts.variant || 'info');
    el.textContent = message;            // region announces; no redundant role
    region.appendChild(el);
    // errors persist (WCAG 2.2.1) unless an explicit duration is given
    const persist = opts.variant === 'error' && opts.duration == null;
    if (!persist) setTimeout(() => el.remove(), opts.duration || 4000);
    return el;
  }

  /* ── Auto-init (idempotent) ─────────────────────────────── */
  function init(scope) {
    scope = scope || document;
    scope.querySelectorAll('.dropdown').forEach(initDropdown);
    scope.querySelectorAll('.accordion').forEach(initAccordion);
    scope.querySelectorAll('.tabs').forEach(initTabs);
    initModalTriggers(scope);
  }

  global.kiriUX = { init, openModal, closeModal, toast };
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', () => init());
})(typeof window !== 'undefined' ? window : this);
