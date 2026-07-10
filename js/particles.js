/* ==========================================================================
   PARTICLES CONFIG
   Initializes the particles.js background inside the hero section.
   Colors are pulled from the CSS custom properties so it stays on-theme.
   Set `enabled = false` below to turn this off entirely (it's marked
   optional in the project brief).
   ========================================================================== */

(function initParticles() {
  const enabled = true;
  if (!enabled) return;

  window.addEventListener('DOMContentLoaded', () => {
    if (typeof particlesJS === 'undefined' || !document.getElementById('particles-js')) return;

    particlesJS('particles-js', {
      particles: {
        number: { value: 55, density: { enable: true, value_area: 900 } },
        color: { value: ['#4F46E5', '#06B6D4', '#22C55E'] },
        shape: { type: 'circle' },
        opacity: { value: 0.35, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true, distance: 140, color: '#4F46E5', opacity: 0.18, width: 1
        },
        move: {
          enable: true, speed: 1.2, direction: 'none', random: true,
          straight: false, out_mode: 'out', bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 160, line_linked: { opacity: 0.4 } },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  });
})();
