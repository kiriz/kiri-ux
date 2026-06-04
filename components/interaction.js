/* kiri-ux · components/interaction.js
 * Progressive-enhancement behaviors for dropdown, modal, accordion, tabs,
 * and toasts. Vanilla JS, no dependencies. Auto-inits on DOMContentLoaded;
 * also exports kiriUX for manual control. Components work visually without
 * this file — JS only adds interactivity.
 */
(function (global) {
  'use strict';

  /* ── focus trap helper ──────────────────────────────────── */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    const items = container.querySelectorAll(FOCUSABLE);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  /* ── Dropdown ───────────────────────────────────────────── */
  function initDropdown(root) {
    const trigger = root.querySelector('[data-dropdown-trigger]');
    const panel = root.querySelector('.dropdown__panel');
    if (!trigger || !panel) return;
    const close = () => { panel.removeAttribute('data-open'); trigger.setAttribute('aria-expanded', 'false'); };
    const open = () => { panel.setAttribute('data-open', ''); trigger.setAttribute('aria-expanded', 'true'); };
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.hasAttribute('data-open') ? close() : open();
    });
    panel.addEventListener('keydown', (e) => {
      const items = [...panel.querySelectorAll('.dropdown__item')];
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
      if (e.key === 'Escape') { close(); trigger.focus(); }
    });
    document.addEventListener('click', (e) => { if (!root.contains(e.target)) close(); });
  }

  /* ── Modal ──────────────────────────────────────────────── */
  function openModal(backdrop) {
    const prevFocus = document.activeElement;
    backdrop.hidden = false;
    const modal = backdrop.querySelector('.modal');
    (modal.querySelector(FOCUSABLE) || modal).focus();
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal(backdrop, prevFocus, onKey);
      if (e.key === 'Tab') trapFocus(modal, e);
    };
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(backdrop, prevFocus, onKey); });
    backdrop.querySelectorAll('[data-modal-close]').forEach((b) =>
      b.addEventListener('click', () => closeModal(backdrop, prevFocus, onKey)));
    document.addEventListener('keydown', onKey);
  }
  function closeModal(backdrop, prevFocus, onKey) {
    backdrop.hidden = true;
    document.removeEventListener('keydown', onKey);
    if (prevFocus) prevFocus.focus();
  }
  function initModalTriggers() {
    document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const target = document.getElementById(trigger.getAttribute('data-modal-open'));
        if (target) openModal(target);
      });
    });
  }

  /* ── Accordion ──────────────────────────────────────────── */
  function initAccordion(root) {
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
        if (isOpen) {
          panel.style.height = panel.scrollHeight + 'px';
          requestAnimationFrame(() => { panel.style.height = '0'; });
        } else {
          panel.style.height = panel.scrollHeight + 'px';
          panel.addEventListener('transitionend', function done() {
            panel.style.height = 'auto'; panel.removeEventListener('transitionend', done);
          });
        }
      });
    });
  }

  /* ── Tabs ───────────────────────────────────────────────── */
  function initTabs(root) {
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
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const el = document.createElement('div');
    el.className = 'toast toast--' + (opts.variant || 'info');
    el.setAttribute('role', 'status');
    el.textContent = message;
    region.appendChild(el);
    setTimeout(() => el.remove(), opts.duration || 4000);
    return el;
  }

  /* ── Auto-init ──────────────────────────────────────────── */
  function init(scope) {
    scope = scope || document;
    scope.querySelectorAll('.dropdown').forEach(initDropdown);
    scope.querySelectorAll('.accordion').forEach(initAccordion);
    scope.querySelectorAll('.tabs').forEach(initTabs);
    initModalTriggers();
  }

  global.kiriUX = { init, openModal, closeModal, toast };
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', () => init());
})(typeof window !== 'undefined' ? window : this);
