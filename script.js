const body = document.body;
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const menuText = menuButton?.querySelector('.sr-only');

const closeMenu = () => {
  body.classList.remove('nav-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuText) menuText.textContent = 'Abrir menú';
  if (nav && window.matchMedia('(max-width: 980px)').matches) {
    nav.inert = true;
    nav.setAttribute('aria-hidden', 'true');
  }
};

const syncMenuState = () => {
  if (!nav) return;
  if (window.matchMedia('(max-width: 980px)').matches) {
    if (!body.classList.contains('nav-open')) {
      nav.inert = true;
      nav.setAttribute('aria-hidden', 'true');
    }
  } else {
    body.classList.remove('nav-open');
    nav.inert = false;
    nav.removeAttribute('aria-hidden');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuText) menuText.textContent = 'Abrir menú';
  }
};

syncMenuState();
window.addEventListener('resize', syncMenuState);

menuButton?.addEventListener('click', () => {
  const open = body.classList.toggle('nav-open');
  menuButton.setAttribute('aria-expanded', String(open));
  nav.inert = !open;
  if (open) nav.removeAttribute('aria-hidden');
  else nav.setAttribute('aria-hidden', 'true');
  if (menuText) menuText.textContent = open ? 'Cerrar menú' : 'Abrir menú';
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && body.classList.contains('nav-open')) {
    closeMenu();
    menuButton?.focus();
  }
});

const comparison = document.querySelector('.comparison');
const range = document.querySelector('.comparison-range');
range?.addEventListener('input', (event) => {
  comparison?.style.setProperty('--position', `${event.target.value}%`);
});

const swatches = document.querySelectorAll('.swatch');
const materialName = document.querySelector('.material-name');
const materialPreview = document.querySelector('#material-preview');
swatches.forEach((swatch) => {
  if (swatch.dataset.image) {
    const preload = new Image();
    preload.src = swatch.dataset.image;
  }
});
swatches.forEach((swatch) => {
  swatch.addEventListener('click', async () => {
    swatches.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });
    swatch.classList.add('is-active');
    swatch.setAttribute('aria-pressed', 'true');
    if (materialName) materialName.textContent = swatch.dataset.material;
    if (materialPreview && swatch.dataset.image) {
      materialPreview.classList.add('is-changing');
      materialPreview.src = swatch.dataset.image;
      materialPreview.alt = swatch.dataset.alt || `Vista del material ${swatch.dataset.material}`;
      try { await materialPreview.decode(); } catch (error) { /* Keep the selected image even if decode is unsupported. */ }
      materialPreview.classList.remove('is-changing');
    }
  });
});

const photos = document.querySelector('#photos');
const uploadCopy = document.querySelector('.upload-field small');
photos?.addEventListener('change', () => {
  const count = photos.files.length;
  if (uploadCopy) uploadCopy.textContent = count ? `${count} ${count === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}` : 'JPG, PNG o WEBP · demostración local';
});

const form = document.querySelector('#quote-form');
const status = document.querySelector('#form-status');
form?.querySelectorAll('input, select, textarea, button').forEach((control) => {
  control.disabled = false;
});
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  if (status) status.textContent = 'Demostración completada. Tus datos no fueron enviados ni almacenados.';
  const button = form.querySelector('button[type="submit"]');
  if (button) {
    const original = button.textContent;
    button.textContent = 'Solicitud preparada';
    setTimeout(() => { button.textContent = original; }, 3500);
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px' });
  reveals.forEach((el) => observer.observe(el));
}

document.querySelector('#year').textContent = new Date().getFullYear();
