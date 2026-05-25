/* ============================================
   HYDROFLASKER — Shared Layout Components
   ============================================ */

import { Cart } from './cart.js';

/* Helper to get root path relative to the current page location */
function getRootPath() {
  const isRoot = !location.pathname.includes('/pages/');
  return isRoot ? '' : '../';
}

export function renderHeader(activePage) {
  const rootPath = getRootPath();
  const links = [
    { label: 'Comprar Todo',  href: `${rootPath}pages/catalog.html` },
    { label: 'Marcas',        href: `${rootPath}index.html#brands` },
    { label: 'Más Vendidos',  href: `${rootPath}pages/catalog.html?filter=bestseller` },
    { label: 'Novedades',     href: `${rootPath}pages/catalog.html?filter=new` },
    { label: 'Ofertas',       href: `${rootPath}pages/catalog.html?filter=sale` }
  ];

  const navLinks = links.map(l => {
    // Mark active: match on pathname + filter param
    const lUrl = new URL(l.href, location.href);
    const curUrl = new URL(location.href);
    const sameFile = lUrl.pathname === curUrl.pathname;
    const sameFilter = (lUrl.searchParams.get('filter') || '') === (curUrl.searchParams.get('filter') || '');
    const isActive = sameFile && sameFilter ? 'topnav__link--active' : '';
    return `<a href="${l.href}" class="topnav__link ${isActive}">${l.label}</a>`;
  }).join('');

  const headerEl = document.getElementById('app-header');
  if (!headerEl) return;

  headerEl.innerHTML = `
    <nav class="topnav">
      <div class="container topnav__inner">
        <a href="${rootPath}index.html" class="topnav__logo">HYDROFLASKER</a>
        <div class="topnav__nav">${navLinks}</div>
        <div class="topnav__actions">
          ${activePage !== 'cart' ? `
          <div class="topnav__search" id="topnav-search-container">
            <span class="material-symbols-outlined" style="font-size:20px;color:var(--on-tertiary-container);cursor:pointer;" id="topnav-search-btn">search</span>
            <input type="text" id="topnav-search-input" placeholder="Buscar equipo…" />
          </div>` : ''}
          <a href="${rootPath}pages/cart.html" class="topnav__icon-btn" id="cart-btn" title="Carrito">
            <span class="material-symbols-outlined">shopping_cart</span>
            <span id="cart-count-badge" style="display:none">0</span>
          </a>
          <button class="topnav__icon-btn" title="Mi Cuenta">
            <span class="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </nav>`;

  // Initialize Search Input Events
  const searchInput = document.getElementById('topnav-search-input');
  const searchBtn = document.getElementById('topnav-search-btn');

  function handleSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
      location.href = `${rootPath}pages/catalog.html?search=${encodeURIComponent(query)}`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSearch();
    });
    // Populate with current search if we are on catalog and there's a search param
    const urlParams = new URLSearchParams(location.search);
    const currentSearch = urlParams.get('search');
    if (currentSearch) {
      searchInput.value = currentSearch;
    }
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
  }

  // Set up Cart count badge reactivity
  updateCartBadge();
  Cart.on('change', updateCartBadge);
}

export function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;
  const n = Cart.count();
  badge.textContent = n;
  badge.style.display = n > 0 ? 'flex' : 'none';
  badge.classList.remove('bump');
  void badge.offsetWidth; // Trigger reflow for animation
  if (n > 0) badge.classList.add('bump');
}

export function renderFooter() {
  const rootPath = getRootPath();
  const footerEl = document.getElementById('app-footer');
  if (!footerEl) return;

  footerEl.innerHTML = `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <span class="footer__logo">HYDROFLASKER</span>
          <p class="footer__copy">© 2024 HYDROFLASKER. Diseñado para el profesional exigente.</p>
        </div>
        <div>
          <p class="footer__heading">Comprar</p>
          <div class="footer__links">
            <a href="${rootPath}pages/catalog.html" class="footer__link">Todas las Botellas</a>
            <a href="${rootPath}pages/catalog.html" class="footer__link">Accesorios</a>
            <a href="#" class="footer__link">Venta al por Mayor</a>
          </div>
        </div>
        <div>
          <p class="footer__heading">Soporte</p>
          <div class="footer__links">
            <a href="#" class="footer__link">Política de Envíos</a>
            <a href="#" class="footer__link">Contactar Soporte</a>
            <a href="#" class="footer__link">Devoluciones</a>
          </div>
        </div>
        <div>
          <p class="footer__heading">Acerca de</p>
          <div class="footer__links">
            <a href="#" class="footer__link">Sostenibilidad</a>
            <a href="#" class="footer__link">Localizador de Tiendas</a>
          </div>
        </div>
        <div class="footer__bottom">© 2024 HYDROFLASKER. Todos los derechos reservados.</div>
      </div>
    </footer>`;
}

export function showToast(msg) {
  let toast = document.getElementById('hf-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'hf-toast';
    Object.assign(toast.style, {
      position: 'fixed', bottom: '24px', right: '24px', zIndex: '9999',
      background: 'var(--on-surface)', color: 'var(--surface)',
      padding: '12px 20px', borderRadius: '8px',
      fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '600',
      boxShadow: '0 8px 24px rgba(11,28,48,.18)',
      transform: 'translateY(80px)', opacity: '0',
      transition: 'all .3s cubic-bezier(.16,1,.3,1)',
      display: 'flex', alignItems: 'center', gap: '8px',
      maxWidth: '320px',
    });
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined icon-fill" style="color:var(--tertiary-fixed);font-size:18px">check_circle</span> ${msg}`;
  
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity   = '1';
  });
  
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity   = '0';
  }, 2800);
}
