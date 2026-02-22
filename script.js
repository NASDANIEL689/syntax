/**
 * Syntax Health — Landing page animations
 * Count-up for floating stats, subtle fade-in on scroll
 */

(function () {
  'use strict';

  // Count up animation for stat numbers
  function animateValue(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 2);
      var current = Math.round(start + (target - start) * easeOut);
      el.textContent = current;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  // Run count-up when hero enters view
  function initCountUp() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var stats = hero.querySelectorAll('.floating-stat .stat-value');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        stats.forEach(function (el, i) {
          var target = parseInt(el.getAttribute('data-target'), 10);
          if (isNaN(target) || el.getAttribute('data-animated') === 'true') return;
          el.setAttribute('data-animated', 'true');
          setTimeout(function () {
            animateValue(el, target, 1400);
          }, i * 120);
        });
      });
    }, { threshold: 0.4 });
    observer.observe(hero);
  }

  // Fade-in sections on scroll
  function initFadeIn() {
    var sections = document.querySelectorAll('.section');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    sections.forEach(function (section) {
      section.classList.add('fade-in-section');
      observer.observe(section);
    });
  }

  // Nav dropdown: toggle on click, close when clicking outside
  function initNavDropdown() {
    var trigger = document.querySelector('.nav-dropdown-trigger');
    var dropdown = document.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCountUp();
      initFadeIn();
      initNavDropdown();
    });
  } else {
    initCountUp();
    initFadeIn();
    initNavDropdown();
  }
})();
