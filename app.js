/* A-CONSTRUCTION – subtle motion layer */

(function () {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Load micro-animation for logo/slogan
  window.addEventListener('DOMContentLoaded', () => {
    // next paint
    requestAnimationFrame(() => {
      document.body.classList.add('is-loaded');
    });

    if (prefersReduced) {
      // If reduced motion, just show immediately
      document.querySelectorAll('.brand strong, .brand span').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.animation = 'none';
      });
      return;
    }

    // Prepare blueprint "draw" lines
    const drawSvgs = Array.from(document.querySelectorAll('.bp-draw'));
    drawSvgs.forEach(svg => {
      const drawables = svg.querySelectorAll('[data-draw]');
      drawables.forEach(el => {
        // Works for <path>, <line>, <rect>
        let len = 0;
        try {
          // Some SVG elements don't implement getTotalLength in older browsers
          if (typeof el.getTotalLength === 'function') {
            len = el.getTotalLength();
          } else if (el.tagName.toLowerCase() === 'line') {
            const x1 = parseFloat(el.getAttribute('x1') || '0');
            const y1 = parseFloat(el.getAttribute('y1') || '0');
            const x2 = parseFloat(el.getAttribute('x2') || '0');
            const y2 = parseFloat(el.getAttribute('y2') || '0');
            len = Math.hypot(x2 - x1, y2 - y1);
          } else if (el.tagName.toLowerCase() === 'rect') {
            const w = parseFloat(el.getAttribute('width') || '0');
            const h = parseFloat(el.getAttribute('height') || '0');
            len = 2 * (w + h);
          }
        } catch (_) {
          len = 220;
        }

        if (!len || !isFinite(len)) len = 220;

        el.style.setProperty('--bp-len', String(Math.ceil(len)));
      });
    });

    // Scroll-reveal: draw blueprint lines when svg enters view
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-drawn');
            // one-shot
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    drawSvgs.forEach(svg => io.observe(svg));
  });
})();
