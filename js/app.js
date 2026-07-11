/* ==========================================================================
   APP.JS
   Main application logic: loads every data/*.json file, renders each
   section, and wires up all interactivity (nav, cursor, filters, forms,
   sliders, modals, counters, FABs, etc).

   Everything here reads from JSON — there is no hardcoded content.
   To customize the site, edit the files in /data, not this script.
   ========================================================================== */

'use strict';

/* ---------------------------------------------------------------------------
   0. STATE
   ------------------------------------------------------------------------- */
const AppState = {
  config: null,
  skills: null,
  projects: [],
  certificates: [],
  experience: [],
  education: [],
  testimonials: [],
  gallery: [],
  blog: [],
  achievements: [],
  activeProjectFilter: 'All',
  activeSkillTab: null,
  activeGalleryFilter: 'All',
  testimonialIndex: 0
};

/* Simple i18n dictionary for the language switch (EN / TA).
   Extend this object to translate more strings — anything rendered
   through `t('key')` below will pick up the translation automatically. */
const I18N = {
  en: {
    navAbout: 'About', navSkills: 'Skills', navProjects: 'Projects',
    navExperience: 'Experience', navCertificates: 'Certificates', navBlog: 'Blog', navContact: 'Contact',
    heroBadge: 'Available for new opportunities', heroBuild: 'I build',
    resumeBtn: 'Download Resume', contactBtn: 'Contact Me'
  },
  ta: {
    navAbout: 'எனது பற்றி', navSkills: 'திறமைகள்', navProjects: 'திட்டங்கள்',
    navExperience: 'அனுபவம்', navCertificates: 'சான்றிதழ்கள்', navBlog: 'வலைப்பதிவு', navContact: 'தொடர்பு',
    heroBadge: 'புதிய வாய்ப்புகளுக்கு தயார்', heroBuild: 'நான் உருவாக்குகிறேன்',
    resumeBtn: 'ரெஸ்யூமே பதிவிறக்கம்', contactBtn: 'தொடர்பு கொள்ளவும்'
  }
};
let currentLang = 'en';
function t(key) { return I18N[currentLang][key] || I18N.en[key] || key; }

/* ---------------------------------------------------------------------------
   1. DATA LOADING
   ------------------------------------------------------------------------- */
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function loadAllData() {
  const [config, skills, projects, certificates, experience, education, testimonials, gallery, blog, achievements] =
    await Promise.all([
      loadJSON('data/config.json'),
      loadJSON('data/skills.json'),
      loadJSON('data/projects.json'),
      loadJSON('data/certificates.json'),
      loadJSON('data/experience.json'),
      loadJSON('data/education.json'),
      loadJSON('data/testimonials.json'),
      loadJSON('data/gallery.json'),
      loadJSON('data/blog.json'),
      loadJSON('data/achievements.json')
    ]);

  AppState.config = config;
  AppState.skills = skills;
  AppState.projects = projects || [];
  AppState.certificates = certificates || [];
  AppState.experience = experience || [];
  AppState.education = education || [];
  AppState.testimonials = testimonials || [];
  AppState.gallery = gallery || [];
  AppState.blog = blog || [];
  AppState.achievements = achievements || [];
}

/* ---------------------------------------------------------------------------
   2. HERO SECTION
   ------------------------------------------------------------------------- */
function renderHero() {
  const { site } = AppState.config;

  document.title = `${site.name} | ${site.title}`;
  document.getElementById('hero-name').textContent = site.name;
  document.getElementById('hero-intro').textContent = site.intro;
  document.getElementById('hero-photo').src = site.profileImage;
  document.getElementById('hero-photo').alt = site.name + ' — profile photo';

  const resumeLinks = document.querySelectorAll('a[href^="resume/"]');
  resumeLinks.forEach(a => a.setAttribute('href', site.resume));

  // Social icons (hero + footer)
  const iconMap = {
    github: 'fa-brands fa-github', linkedin: 'fa-brands fa-linkedin', twitter: 'fa-brands fa-x-twitter',
    instagram: 'fa-brands fa-instagram', leetcode: 'fa-solid fa-code'
  };
  const socialsHTML = Object.entries(site.socials).map(([key, url]) => `
    <a href="${url}" target="_blank" rel="noopener" class="social-icon" aria-label="${key}">
      <i class="${iconMap[key] || 'fa-solid fa-link'}"></i>
    </a>`).join('');
  document.getElementById('hero-socials').innerHTML = socialsHTML;
  document.getElementById('footer-socials').innerHTML = socialsHTML;

  // WhatsApp FAB
  document.getElementById('fab-whatsapp').setAttribute('href', site.whatsapp);

  // Typed.js
  if (typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
      strings: site.typedStrings,
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1400,
      loop: true,
      smartBackspace: true
    });
  }
}

/* ---------------------------------------------------------------------------
   3. ABOUT SECTION (description, info cards, stats, timelines)
   ------------------------------------------------------------------------- */
function renderAbout() {
  const { about } = AppState.config;
  document.getElementById('about-description').textContent = about.description;

  document.getElementById('personal-info-grid').innerHTML = about.personalInfo.map(info => `
    <div class="info-card card">
      <i class="${info.icon}"></i>
      <div>
        <div class="info-label">${info.label}</div>
        <div class="info-value">${info.value}</div>
      </div>
    </div>`).join('');

  // Stats grid (with data-counter for the counter animation)
  const statsHTML = about.stats.map(s => `
    <div class="stat-card card" data-aos="fade-up">
      <i class="${s.icon}"></i>
      <div class="stat-number" data-counter="${s.value}">0</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');
  document.getElementById('stats-grid').innerHTML = statsHTML;

  renderTimeline('education-timeline', AppState.education.map(e => ({
    duration: e.year, title: e.degree, sub: `${e.institution} · ${e.marks}`, desc: '', current: false
  })));

  const expItems = AppState.experience.map(e => ({
    duration: e.duration, title: e.position, sub: e.company, desc: e.description, current: e.current
  }));
  renderTimeline('experience-timeline', expItems);
  renderTimeline('experience-timeline-full', expItems);
}

function renderTimeline(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(item => `
    <div class="timeline-item ${item.current ? 'current' : ''}" data-aos="fade-up">
      <span class="timeline-dot"></span>
      <div class="timeline-card card">
        <div class="timeline-duration">${item.duration}</div>
        <h4 class="timeline-title">${item.title}</h4>
        <div class="timeline-sub">${item.sub}</div>
        ${item.desc ? `<p class="timeline-desc">${item.desc}</p>` : ''}
      </div>
    </div>`).join('');
}

/* ---------------------------------------------------------------------------
   4. SKILLS SECTION (tabs + animated progress bars)
   ------------------------------------------------------------------------- */
function renderSkills() {
  const categories = AppState.skills.categories;
  AppState.activeSkillTab = categories[0].name;

  document.getElementById('skills-tabs').innerHTML = categories.map(cat => `
    <button class="skill-tab ${cat.name === AppState.activeSkillTab ? 'active' : ''}" data-cat="${cat.name}">
      <i class="${cat.icon} me-1"></i> ${cat.name}
    </button>`).join('');

  renderSkillsGrid();

  document.getElementById('skills-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.skill-tab');
    if (!btn) return;
    AppState.activeSkillTab = btn.dataset.cat;
    document.querySelectorAll('.skill-tab').forEach(b => b.classList.toggle('active', b === btn));
    renderSkillsGrid();
  });
}

function renderSkillsGrid() {
  const cat = AppState.skills.categories.find(c => c.name === AppState.activeSkillTab);
  const grid = document.getElementById('skills-grid');
  grid.innerHTML = cat.skills.map(skill => `
    <div class="skill-card card" data-aos="fade-up">
      <div class="skill-card-top">
        <div class="skill-card-name"><i class="${skill.icon}"></i> ${skill.name}</div>
        <div class="skill-percent">${skill.level}%</div>
      </div>
      <div class="skill-bar-track"><div class="skill-bar-fill" data-level="${skill.level}"></div></div>
    </div>`).join('');

  // Animate bars in on next frame + observe for scroll-into-view
  requestAnimationFrame(() => {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      observeAndFill(bar);
    });
  });
}

function observeAndFill(bar) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bar.style.width = bar.dataset.level + '%';
        io.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  io.observe(bar);
}

/* ---------------------------------------------------------------------------
   5. SERVICES SECTION
   ------------------------------------------------------------------------- */
function renderServices() {
  document.getElementById('services-grid').innerHTML = AppState.config.services.map(s => `
    <div class="service-card card" data-aos="fade-up">
      <div class="service-icon"><i class="${s.icon}"></i></div>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </div>`).join('');
}

/* ---------------------------------------------------------------------------
   6. PROJECTS SECTION (dynamic + category filter)
   ------------------------------------------------------------------------- */
function renderProjects() {
  const categories = ['All', ...new Set(AppState.projects.map(p => p.category))];
  document.getElementById('project-filter-bar').innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-filter="${cat}">${cat}</button>
  `).join('');

  renderProjectsGrid();

  document.getElementById('project-filter-bar').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    AppState.activeProjectFilter = btn.dataset.filter;
    document.querySelectorAll('#project-filter-bar .filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderProjectsGrid();
  });
}

function renderProjectsGrid() {
  const grid = document.getElementById('projects-grid');
  const filter = AppState.activeProjectFilter;
  const list = filter === 'All' ? AppState.projects : AppState.projects.filter(p => p.category === filter);

  if (!list.length) {
    grid.innerHTML = `<p class="text-secondary" style="grid-column:1/-1; text-align:center;">No projects in this category yet.</p>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="project-card card" data-aos="fade-up">
      <div class="project-thumb">
        ${p.featured ? '<span class="featured-badge">Featured</span>' : ''}
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <div class="project-overlay">
          <a href="${p.live}" target="_blank" rel="noopener" aria-label="Live demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          <a href="${p.github}" target="_blank" rel="noopener" aria-label="GitHub repo"><i class="fa-brands fa-github"></i></a>
        </div>
      </div>
      <div class="project-body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tech-badges">${p.tech.map(tag => `<span class="tech-badge">${tag}</span>`).join('')}</div>
      </div>
    </div>`).join('');
}

/* ---------------------------------------------------------------------------
   7. CERTIFICATES SECTION (dynamic + lightbox preview)
   ------------------------------------------------------------------------- */
function renderCertificates() {
  document.getElementById('certificates-grid').innerHTML = AppState.certificates.map((c, i) => `
    <div class="certificate-card card" data-aos="fade-up">
      <div class="certificate-thumb" data-cert-index="${i}">
        <img src="${c.image}" alt="${c.title}" loading="lazy">
      </div>
      <div class="certificate-body">
        <h4>${c.title}</h4>
        <div class="certificate-meta"><span>${c.organization}</span><span>${c.date}</span></div>
        <a href="${c.file}" download class="btn btn-outline btn-sm w-100"><i class="fa-solid fa-download"></i> Download</a>
      </div>
    </div>`).join('');

  document.getElementById('certificates-grid').addEventListener('click', (e) => {
    const thumb = e.target.closest('.certificate-thumb');
    if (!thumb) return;
    const cert = AppState.certificates[thumb.dataset.certIndex];
    openLightbox(cert.image, `<h4>${cert.title}</h4><p class="text-secondary mb-0">${cert.organization} — ${cert.date}</p>`);
  });
}

/* ---------------------------------------------------------------------------
   8. ACHIEVEMENTS SECTION
   ------------------------------------------------------------------------- */
function renderAchievements() {
  document.getElementById('achievements-grid').innerHTML = AppState.achievements.map(a => `
    <div class="achievement-card card" data-aos="fade-up">
      <div class="achievement-icon"><i class="${a.icon}"></i></div>
      <div>
        <h4>${a.title}</h4>
        <span>${a.subtitle}</span>
      </div>
    </div>`).join('');
}

/* ---------------------------------------------------------------------------
   9. CODING PROFILES SECTION
   ------------------------------------------------------------------------- */
function renderCodingProfiles() {
  document.getElementById('profiles-grid').innerHTML = AppState.config.codingProfiles.map(p => `
    <a href="${p.url}" target="_blank" rel="noopener" class="profile-card card" data-aos="fade-up">
      <i class="${p.icon}"></i>
      <h4>${p.platform}</h4>
      <div class="profile-stat">${p.stat}</div>
    </a>`).join('');
}

/* ---------------------------------------------------------------------------
   10. TESTIMONIALS SLIDER
   ------------------------------------------------------------------------- */
function renderTestimonials() {
  const list = AppState.testimonials;
  document.getElementById('testimonial-track').innerHTML = list.map(item => `
    <div class="testimonial-slide">
      <div class="testimonial-card card">
        <i class="fa-solid fa-quote-left"></i>
        <p class="testimonial-review">${item.review}</p>
        <div class="testimonial-photo"><img src="${item.photo}" alt="${item.name}"></div>
        <div class="testimonial-name">${item.name}</div>
        <div class="testimonial-role">${item.designation}</div>
      </div>
    </div>`).join('');

  document.getElementById('testimonial-dots').innerHTML = list.map((_, i) =>
    `<span class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('');

  updateTestimonialSlide();

  document.getElementById('testimonial-prev').addEventListener('click', () => {
    AppState.testimonialIndex = (AppState.testimonialIndex - 1 + list.length) % list.length;
    updateTestimonialSlide();
  });
  document.getElementById('testimonial-next').addEventListener('click', () => {
    AppState.testimonialIndex = (AppState.testimonialIndex + 1) % list.length;
    updateTestimonialSlide();
  });
  document.getElementById('testimonial-dots').addEventListener('click', (e) => {
    const dot = e.target.closest('.slider-dot');
    if (!dot) return;
    AppState.testimonialIndex = parseInt(dot.dataset.index, 10);
    updateTestimonialSlide();
  });

  // Auto-advance every 6s
  setInterval(() => {
    AppState.testimonialIndex = (AppState.testimonialIndex + 1) % list.length;
    updateTestimonialSlide();
  }, 6000);
}

function updateTestimonialSlide() {
  const track = document.getElementById('testimonial-track');
  track.style.transform = `translateX(-${AppState.testimonialIndex * 100}%)`;
  document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === AppState.testimonialIndex));
}

/* ---------------------------------------------------------------------------
   11. GALLERY SECTION (masonry + filter + lightbox)
   ------------------------------------------------------------------------- */
function renderGallery() {
  const categories = ['All', ...new Set(AppState.gallery.map(g => g.category))];
  document.getElementById('gallery-filter').innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-filter="${cat}">${cat}</button>
  `).join('');

  renderGalleryGrid();

  document.getElementById('gallery-filter').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    AppState.activeGalleryFilter = btn.dataset.filter;
    document.querySelectorAll('#gallery-filter .filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderGalleryGrid();
  });
}

function renderGalleryGrid() {
  const grid = document.getElementById('gallery-grid');
  const filter = AppState.activeGalleryFilter;
  const list = filter === 'All' ? AppState.gallery : AppState.gallery.filter(g => g.category === filter);

  grid.innerHTML = list.map((g, i) => `
    <div class="gallery-item" data-gallery-index="${i}" data-aos="fade-up">
      <img src="${g.image}" alt="${g.caption}" loading="lazy">
      <div class="gallery-caption">${g.caption}</div>
    </div>`).join('');

  grid.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => {
      const g = list[i];
      openLightbox(g.image, `<p class="mb-0">${g.caption}</p>`);
    });
  });
}

/* ---------------------------------------------------------------------------
   12. BLOG SECTION
   ------------------------------------------------------------------------- */
function renderBlog() {
  document.getElementById('blog-grid').innerHTML = AppState.blog.map(post => `
    <a href="${post.link}" class="blog-card card" data-aos="fade-up">
      <div class="blog-thumb"><img src="${post.image}" alt="${post.title}" loading="lazy"></div>
      <div class="blog-body">
        <div class="blog-meta"><span><i class="fa-regular fa-calendar"></i> ${post.date}</span><span><i class="fa-regular fa-clock"></i> ${post.readTime}</span></div>
        <h3>${post.title}</h3>
      </div>
    </a>`).join('');
}

/* ---------------------------------------------------------------------------
   13. CONTACT SECTION (info cards + EmailJS form)
   ------------------------------------------------------------------------- */
function renderContact() {
  const { site } = AppState.config;
  const items = [
    { icon: 'fa-solid fa-envelope', label: 'Email', value: site.email, copy: true },
    { icon: 'fa-solid fa-phone', label: 'Phone', value: site.phone },
    { icon: 'fa-solid fa-location-dot', label: 'Location', value: site.location },
    { icon: 'fa-solid fa-circle-check', label: 'Availability', value: site.availability }
  ];
  document.getElementById('contact-info-list').innerHTML = items.map(item => `
    <div class="contact-info-card card">
      <i class="${item.icon}"></i>
      <div>
        <h4>${item.label}</h4>
        <p>${item.value}</p>
        ${item.copy ? `<button class="copy-email-btn" id="copy-email-btn"><i class="fa-regular fa-copy"></i> Copy email</button>` : ''}
      </div>
    </div>`).join('');

  document.getElementById('copy-email-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(site.email).then(() => showToast('Email copied to clipboard!'));
  });

  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { emailjs: cfg } = site;

    if (!cfg || cfg.serviceId === 'YOUR_EMAILJS_SERVICE_ID') {
      statusEl.textContent = 'Contact form is not configured yet — add your EmailJS keys in data/config.json.';
      statusEl.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    emailjs.init(cfg.publicKey);
    emailjs.sendForm(cfg.serviceId, cfg.templateId, form)
      .then(() => {
        statusEl.textContent = 'Message sent — thanks for reaching out! I\'ll reply soon.';
        statusEl.className = 'form-status success';
        form.reset();
      })
      .catch((err) => {
        console.error(err);
        statusEl.textContent = 'Something went wrong sending your message. Please try again or email me directly.';
        statusEl.className = 'form-status error';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      });
  });
}

/* ---------------------------------------------------------------------------
   14. LIGHTBOX (shared modal for certificates + gallery)
   ------------------------------------------------------------------------- */
function openLightbox(imgSrc, bodyHTML) {
  const overlay = document.getElementById('lightbox-overlay');
  document.getElementById('lightbox-img').src = imgSrc;
  document.getElementById('lightbox-body').innerHTML = bodyHTML;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox-overlay').classList.remove('active');
  document.body.style.overflow = '';
}
function initLightbox() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox-overlay') closeLightbox();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

/* ---------------------------------------------------------------------------
   15. TOAST NOTIFICATIONS
   ------------------------------------------------------------------------- */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ---------------------------------------------------------------------------
   16. NAVBAR: scroll state, mobile menu, scrollspy, smooth scroll + transition
   ------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = [...links].map(link => document.querySelector(link.getAttribute('href')));

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateScrollProgress();
    updateBackToTop();
    updateScrollSpy();
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  links.forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    triggerPageTransition();
  }));

  function updateScrollSpy() {
    let current = sections[0];
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => { if (sec && sec.offsetTop <= scrollPos) current = sec; });
    links.forEach(link => link.classList.toggle('active', current && link.getAttribute('href') === '#' + current.id));
  }
}

function triggerPageTransition() {
  const el = document.getElementById('page-transition');
  el.classList.remove('active');
  void el.offsetWidth; // restart animation
  el.classList.add('active');
}

/* ---------------------------------------------------------------------------
   17. SCROLL PROGRESS BAR + BACK TO TOP
   ------------------------------------------------------------------------- */
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  document.getElementById('scroll-progress').style.width = pct + '%';
}
function updateBackToTop() {
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 500);
}
function initBackToTop() {
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------------------------
   18. CUSTOM CURSOR (dot + trailing glow ring)
   ------------------------------------------------------------------------- */
function initCustomCursor() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch devices
  const dot = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  document.querySelectorAll('a, button, .card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('hovering'));
    el.addEventListener('mouseleave', () => glow.classList.remove('hovering'));
  });
}

/* ---------------------------------------------------------------------------
   19. MAGNETIC BUTTONS
   ------------------------------------------------------------------------- */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
}

/* ---------------------------------------------------------------------------
   20. HOVER TILT ON CARDS
   ------------------------------------------------------------------------- */
function initTiltEffect() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.body.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.project-card, .service-card, .skill-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--tiltX', (-py * 6) + 'deg');
    card.style.setProperty('--tiltY', (px * 6) + 'deg');
    card.classList.add('tilt');
  });
  document.body.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.project-card, .service-card, .skill-card');
    if (card) { card.style.setProperty('--tiltX', '0deg'); card.style.setProperty('--tiltY', '0deg'); }
  });
}

/* ---------------------------------------------------------------------------
   21. ANIMATED COUNTERS (About stats + GitHub stats)
   ------------------------------------------------------------------------- */
function initCounters() {
  const animate = (el) => {
    const target = parseInt(el.dataset.counter, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else { el.textContent = target.toLocaleString(); el.classList.add('pop-once'); }
    }
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animate(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });

  function observeAll() {
    document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
  }
  observeAll();
  // GitHub stats render asynchronously after the API responds — re-scan then.
  window.addEventListener('gh-stats-rendered', observeAll);
}

/* ---------------------------------------------------------------------------
   22. LANGUAGE SWITCH (EN / TA) — extend I18N above to add more strings
   ------------------------------------------------------------------------- */
function initLanguageSwitch() {
  const btn = document.getElementById('lang-toggle');
  const label = document.getElementById('lang-label');
  btn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ta' : 'en';
    label.textContent = currentLang.toUpperCase();
    applyTranslations();
  });
}
function applyTranslations() {
  const map = {
    '.nav-links a[href="#about"]': 'navAbout', '.nav-links a[href="#skills"]': 'navSkills',
    '.nav-links a[href="#projects"]': 'navProjects', '.nav-links a[href="#experience"]': 'navExperience',
    '.nav-links a[href="#certificates"]': 'navCertificates', '.nav-links a[href="#blog"]': 'navBlog',
    '.nav-links a[href="#contact"]': 'navContact'
  };
  Object.entries(map).forEach(([selector, key]) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = t(key);
  });
}

/* ---------------------------------------------------------------------------
   23. BACKGROUND MUSIC TOGGLE
   ------------------------------------------------------------------------- */
function initMusicToggle() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  let playing = false;
  btn.addEventListener('click', () => {
    if (!audio.src || audio.readyState === 0) {
      // No audio file provided by default — inform the user instead of failing silently.
      showToast('Add a track at assets/audio/ambient.mp3 to enable music.');
      return;
    }
    playing = !playing;
    if (playing) { audio.play().catch(() => showToast('Could not play audio track.')); }
    else audio.pause();
    btn.classList.toggle('active', playing);
  });
}





const visitStart = Date.now();

let viewedProjects = 0;
let certificatesOpened = 0;
let resumeDownloaded = false;
let githubClicked = false;
let linkedinClicked = false;
let whatsappClicked = false;
let contactSubmitted = false;



function getFormattedTime() {
    return new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
}

function getTimeSpent() {
    const seconds = Math.floor((Date.now() - visitStart) / 1000);

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes} min ${secs} sec`;
}

function getPageName() {
    const page = location.pathname.split("/").pop();

    if (page === "" || page === "index.html")
        return "Home";

    return document.title || page;
}

function getReferrer() {

    if (!document.referrer)
        return "Direct Visit";

    if (document.referrer.includes("google"))
        return "Google Search";

    if (document.referrer.includes("bing"))
        return "Bing Search";

    if (document.referrer.includes("facebook"))
        return "Facebook";

    if (document.referrer.includes("linkedin"))
        return "LinkedIn";

    return document.referrer;
}

function getBrowser() {

    const ua = navigator.userAgent;

    if (/Edg/.test(ua))
        return "Microsoft Edge";

    if (/Chrome/.test(ua) && !/Edg/.test(ua))
        return "Google Chrome " + ua.match(/Chrome\/(\d+)/)[1];

    if (/Firefox/.test(ua))
        return "Mozilla Firefox";

    if (/Safari/.test(ua) && !/Chrome/.test(ua))
        return "Safari";

    return "Unknown";
}

function getOS() {

    const ua = navigator.userAgent;

    if (/Windows NT 10.0/.test(ua))
        return "Windows 11";

    if (/Windows/.test(ua))
        return "Windows";

    if (/Android/.test(ua))
        return "Android";

    if (/iPhone|iPad/.test(ua))
        return "iOS";

    if (/Mac/.test(ua))
        return "macOS";

    if (/Linux/.test(ua))
        return "Linux";

    return "Unknown";
}

function getDevice() {

    const ua = navigator.userAgent;

    if (/Android/.test(ua))
        return "Android Phone 📱";

    if (/iPhone|iPad/.test(ua))
        return "iPhone 🍎";

    if (/Windows/.test(ua))
        return "Windows Laptop 💻";

    if (/Mac/.test(ua))
        return "MacBook 💻";

    if (/Linux/.test(ua))
        return "Linux PC 🐧";

    return "Unknown";
}



async function notifyTelegram() {
    const BOT_TOKEN = "8756055732:AAE4Pw6qDDZHQBMcGwSlsdofZsXVZsAP-5Y";
    const CHAT_ID = "8146091850";

    const message = `
🚀 New Portfolio Visitor

👤 Visitor: ${visitorName}
🕒 Time: ${getFormattedTime()}
🌐 Website: https://sridharvpr7.github.io/portfolio/
📱 Device: ${getDevice()}
🖥 Browser: ${getBrowser()}
🔗 Referrer: ${getReferrer()}
📄 Resume Downloaded: ${resumeDownloaded ? "✅ Yes" : "❌ No"}
`;

    try {
        await fetch(`https://api.telegram.org/bot8756055732:AAE4Pw6qDDZHQBMcGwSlsdofZsXVZsAP-5Y/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });
    } catch (err) {
        console.error("Telegram Error:", err);
    }
}





/* ---------------------------------------------------------------------------
   25. LOADING SCREEN + AOS + FOOTER YEAR
   ------------------------------------------------------------------------- */
function hideLoadingScreen() {
  const el = document.getElementById('loading-screen');
  setTimeout(() => el.classList.add('hidden'), 400);
}
function initFooterYear() {
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

function askVisitorName() {
    visitorName = prompt("👋 Welcome!\n\nPlease enter your name:", "") || "Anonymous";
    visitorName = visitorName.trim();

    if (visitorName === "") {
        visitorName = "Anonymous";
    }
}

/* ---------------------------------------------------------------------------
   26. BOOTSTRAP EVERYTHING
   ------------------------------------------------------------------------- */
async function init() {
  await loadAllData();
  if (!AppState.config) {
    console.error('config.json failed to load — check that you are serving this over http(s), not file://');
    hideLoadingScreen();
    return;
  }

  renderHero();
  renderAbout();
  renderSkills();
  renderServices();
  renderProjects();
  renderCertificates();
  renderAchievements();
  renderCodingProfiles();
  renderTestimonials();
  renderGallery();
  renderBlog();
  renderContact();

  initNavbar();
  initBackToTop();
  initCustomCursor();
  initMagneticButtons();
  initTiltEffect();
  initCounters();
  initLightbox();
  initLanguageSwitch();
  initMusicToggle();
  initFooterYear();

  notifyTelegram();
  askVisitorName();

  updateScrollProgress();
  hideLoadingScreen();

  // GitHub dashboard (separate module in js/github.js)
  GitHubDashboard.init(AppState.config.site.githubUsername);

  // AOS scroll-reveal library
  if (typeof AOS !== 'undefined') AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });

  // GSAP subtle parallax on the hero photo ring
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-photo-wrap', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  updateScrollProgress();
  hideLoadingScreen();
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', hideLoadingScreen);
