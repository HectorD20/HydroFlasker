/* ============================================
   HYDROFLASKER — Shared App Logic
   ============================================ */

/* ── Cart Store ── */
const Cart = (() => {
  const KEY = 'hf_cart';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function save(items) { localStorage.setItem(KEY, JSON.stringify(items)); }

  function getItems() { return load(); }

  function addItem(product) {
    const items = load();
    const idx   = items.findIndex(i => i.id === product.id);
    if (idx > -1) { items[idx].qty += 1; }
    else          { items.push({ ...product, qty: 1 }); }
    save(items);
    Cart.emit('change');
  }

  function removeItem(id) {
    const items = load().filter(i => i.id !== id);
    save(items);
    Cart.emit('change');
  }

  function updateQty(id, delta) {
    const items = load();
    const idx   = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    items[idx].qty = Math.max(1, items[idx].qty + delta);
    save(items);
    Cart.emit('change');
  }

  function count()  { return load().reduce((s, i) => s + i.qty, 0); }
  function total()  { return load().reduce((s, i) => s + i.price * i.qty, 0); }

  /* tiny event bus */
  const listeners = {};
  function on(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); }
  function emit(ev)   { (listeners[ev] || []).forEach(fn => fn()); }

  return { getItems, addItem, removeItem, updateQty, count, total, on, emit };
})();

/* ── Render Shared Header ── */
function renderHeader(activePage) {
  const pages = {
    home:    'index.html',
    catalog: 'pages/catalog.html',
    cart:    'pages/cart.html',
    product: 'pages/product.html',
  };

  const links = [
    { label: 'Comprar Todo', page: 'catalog' },
    { label: 'Marcas',       page: 'home' },
    { label: 'Más Vendidos', page: 'catalog' },
    { label: 'Novedades',    page: 'catalog' },
    { label: 'Ofertas',      page: 'catalog' },
  ];

  const isRoot   = !location.pathname.includes('/pages/');
  const rootPath = isRoot ? '' : '../';

  const navLinks = links.map(l => {
    const href    = rootPath + (l.page === 'home' ? 'index.html' : `pages/${l.page}.html`);
    const active  = l.page === activePage ? 'topnav__link--active' : '';
    return `<a href="${href}" class="topnav__link ${active}">${l.label}</a>`;
  }).join('');

  const cartHref = rootPath + 'pages/cart.html';

  document.getElementById('app-header').innerHTML = `
    <nav class="topnav">
      <div class="container topnav__inner">
        <a href="${rootPath}index.html" class="topnav__logo">HYDROFLASKER</a>
        <div class="topnav__nav">${navLinks}</div>
        <div class="topnav__actions">
          ${activePage !== 'cart' ? `
          <div class="topnav__search">
            <span class="material-symbols-outlined" style="font-size:20px;color:var(--on-tertiary-container);">search</span>
            <input type="text" placeholder="Buscar equipo…" />
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

  updateCartBadge();
  Cart.on('change', updateCartBadge);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;
  const n = Cart.count();
  badge.textContent = n;
  badge.style.display = n > 0 ? 'flex' : 'none';
  badge.classList.remove('bump');
  void badge.offsetWidth;
  if (n > 0) badge.classList.add('bump');
}

/* ── Render Shared Footer ── */
function renderFooter() {
  const isRoot   = !location.pathname.includes('/pages/');
  const rootPath = isRoot ? '' : '../';

  document.getElementById('app-footer').innerHTML = `
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

/* ── Toast ── */
function showToast(msg) {
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
