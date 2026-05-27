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
    const idx = items.findIndex(i => i.id === product.id);
    if (idx > -1) { items[idx].qty += 1; }
    else { items.push({ ...product, qty: 1 }); }
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
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    items[idx].qty = Math.max(1, items[idx].qty + delta);
    save(items);
    Cart.emit('change');
  }

  function count() { return load().reduce((s, i) => s + i.qty, 0); }
  function total() { return load().reduce((s, i) => s + i.price * i.qty, 0); }

  /* tiny event bus */
  const listeners = {};
  function on(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); }
  function emit(ev) { (listeners[ev] || []).forEach(fn => fn()); }

  return { getItems, addItem, removeItem, updateQty, count, total, on, emit };
})();

/* ── Auth Store ── */
const Auth = (() => {
  const KEY = 'hf_user';

  function getUser() {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; }
    catch { return null; }
  }

  function setUser(user) {
    if (user) { localStorage.setItem(KEY, JSON.stringify(user)); }
    else      { localStorage.removeItem(KEY); }
    Auth.emit('change');
  }

  function isLoggedIn() { return getUser() !== null; }

  const listeners = {};
  function on(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); }
  function emit(ev)   { (listeners[ev] || []).forEach(fn => fn()); }

  return { getUser, setUser, isLoggedIn, on, emit };
})();

let CURRENT_ACTIVE_PAGE = 'home';

/* ── Render Shared Header ── */
function renderHeader(activePage) {
  CURRENT_ACTIVE_PAGE = activePage;

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
  const user = Auth.getUser();

  let userIconHtml = '';
  let dropdownHtml = '';

  if (user) {
    // Iniciales del usuario para un avatar estilizado
    const initials = user.nombre
      ? user.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'U';

    userIconHtml = `
      <button class="topnav__icon-btn" id="user-menu-btn" title="Mi Cuenta" style="display:flex;align-items:center;justify-content:center;">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--surface-container-highest);color:var(--on-surface);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--secondary);">${initials}</div>
      </button>
    `;

    dropdownHtml = `
      <div class="user-dropdown__header">
        <div class="user-dropdown__avatar">
          <span class="material-symbols-outlined" style="font-size:20px;">person</span>
        </div>
        <div class="user-dropdown__info">
          <span class="user-dropdown__name">${user.nombre}</span>
          <span class="user-dropdown__email">${user.email}</span>
        </div>
      </div>
      <button class="user-dropdown__btn" id="view-purchases-btn">
        <span class="material-symbols-outlined" style="font-size:18px">receipt_long</span>
        Mis Compras
      </button>
      <button class="user-dropdown__btn user-dropdown__btn--logout" id="logout-btn">
        <span class="material-symbols-outlined" style="font-size:18px">logout</span>
        Cerrar Sesión
      </button>
    `;
  } else {
    userIconHtml = `
      <button class="topnav__icon-btn" id="user-menu-btn" title="Mi Cuenta">
        <span class="material-symbols-outlined">person</span>
      </button>
    `;

    dropdownHtml = `
      <p style="font-size:11px;color:var(--on-surface-variant);text-align:center;margin-bottom:4px;">Inicia sesión para gestionar tus compras.</p>
      <button class="user-dropdown__btn" id="login-trigger-btn">
        <span class="material-symbols-outlined" style="font-size:18px">login</span>
        Iniciar Sesión
      </button>
      <button class="user-dropdown__btn" id="register-trigger-btn">
        <span class="material-symbols-outlined" style="font-size:18px">person_add</span>
        Registrarse
      </button>
    `;
  }

  document.getElementById('app-header').innerHTML = `
    <nav class="topnav">
      <div class="container topnav__inner">
        <a href="${rootPath}index.html" class="topnav__logo">HYDROFLASKER</a>
        <div class="topnav__nav">${navLinks}</div>
        <div class="topnav__actions">
          <a href="${rootPath}pages/cart.html" class="topnav__icon-btn" id="cart-btn" title="Carrito">
            <span class="material-symbols-outlined">shopping_cart</span>
            <span id="cart-count-badge" style="display:none">0</span>
          </a>
          <div class="topnav__user-wrapper">
            ${userIconHtml}
            <div class="user-dropdown" id="user-dropdown">
              ${dropdownHtml}
            </div>
          </div>
        </div>
      </div>
    </nav>`;

  updateCartBadge();
  Cart.on('change', updateCartBadge);

  // Registrar listeners de clics
  if (user) {
    const viewPurchases = document.getElementById('view-purchases-btn');
    if (viewPurchases) {
      viewPurchases.onclick = () => {
        document.getElementById('user-dropdown').classList.remove('user-dropdown--active');
        openPurchasesModal();
      };
    }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        Auth.setUser(null);
        showToast('Sesión cerrada correctamente');
      };
    }
  } else {
    const loginTrigger = document.getElementById('login-trigger-btn');
    if (loginTrigger) {
      loginTrigger.onclick = () => {
        document.getElementById('user-dropdown').classList.remove('user-dropdown--active');
        openAuthModal('login');
      };
    }
    const registerTrigger = document.getElementById('register-trigger-btn');
    if (registerTrigger) {
      registerTrigger.onclick = () => {
        document.getElementById('user-dropdown').classList.remove('user-dropdown--active');
        openAuthModal('register');
      };
    }
  }
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

/* ── Funciones Auxiliares para APIs ── */
function getApiPath() {
  const isRoot = !location.pathname.includes('/pages/');
  return isRoot ? '' : '../';
}

/* ── Lógica de Autenticación Frontend ── */

async function handleStandardLogin(email, password) {
  try {
    const res = await fetch(getApiPath() + 'api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    
    Auth.setUser(data.user);
    closeAuthModal();
    showToast(`¡Hola de nuevo, ${data.user.nombre}!`);
  } catch (err) {
    alert(err.message);
  }
}

async function handleStandardRegister(nombre, email, password) {
  try {
    const res = await fetch(getApiPath() + 'api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', nombre, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear la cuenta');
    
    Auth.setUser(data.user);
    closeAuthModal();
    showToast(`¡Cuenta creada! Bienvenido, ${data.user.nombre}`);
  } catch (err) {
    alert(err.message);
  }
}

function openAuthModal(defaultTab = 'login') {
  let modalOverlay = document.getElementById('auth-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'auth-modal-overlay';
    modalOverlay.className = 'auth-modal-overlay';
    document.body.appendChild(modalOverlay);
  }
  
  modalOverlay.innerHTML = `
    <div class="auth-modal">
      <div class="auth-modal__header">
        <h3 class="auth-modal__title">Mi Cuenta</h3>
        <button class="auth-modal__close" id="close-auth-modal-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="auth-modal__body">
        <div class="auth-tabs">
          <button class="auth-tab ${defaultTab === 'login' ? 'auth-tab--active' : ''}" id="tab-login-btn">Iniciar Sesión</button>
          <button class="auth-tab ${defaultTab === 'register' ? 'auth-tab--active' : ''}" id="tab-register-btn">Crear Cuenta</button>
        </div>
        
        <!-- Login Form -->
        <form class="auth-form" id="login-form" style="display: ${defaultTab === 'login' ? 'flex' : 'none'};">
          <div class="auth-field">
            <label for="login-email">Correo Electrónico</label>
            <input type="email" id="login-email" required placeholder="correo@ejemplo.com" />
          </div>
          <div class="auth-field">
            <label for="login-password">Contraseña</label>
            <input type="password" id="login-password" required placeholder="••••••••" />
          </div>
          <button type="submit" class="btn btn--primary electric-button" style="width:100%; padding-block:10px; margin-top: 8px;">Ingresar</button>
        </form>
        
        <!-- Register Form -->
        <form class="auth-form" id="register-form" style="display: ${defaultTab === 'register' ? 'flex' : 'none'};">
          <div class="auth-field">
            <label for="register-name">Nombre Completo</label>
            <input type="text" id="register-name" required placeholder="Tu nombre" />
          </div>
          <div class="auth-field">
            <label for="register-email">Correo Electrónico</label>
            <input type="email" id="register-email" required placeholder="correo@ejemplo.com" />
          </div>
          <div class="auth-field">
            <label for="register-password">Contraseña</label>
            <input type="password" id="register-password" required placeholder="••••••••" />
          </div>
          <button type="submit" class="btn btn--primary electric-button" style="width:100%; padding-block:10px; margin-top: 8px;">Registrarse</button>
        </form>
      </div>
    </div>
  `;
  
  requestAnimationFrame(() => {
    modalOverlay.classList.add('auth-modal-overlay--active');
  });
  
  document.getElementById('close-auth-modal-btn').onclick = closeAuthModal;
  
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  tabLoginBtn.onclick = () => {
    tabLoginBtn.classList.add('auth-tab--active');
    tabRegisterBtn.classList.remove('auth-tab--active');
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
  };
  
  tabRegisterBtn.onclick = () => {
    tabRegisterBtn.classList.add('auth-tab--active');
    tabLoginBtn.classList.remove('auth-tab--active');
    registerForm.style.display = 'flex';
    loginForm.style.display = 'none';
  };
  
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    handleStandardLogin(email, pass);
  };
  
  registerForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const pass = document.getElementById('register-password').value;
    handleStandardRegister(name, email, pass);
  };
}

function closeAuthModal() {
  const modalOverlay = document.getElementById('auth-modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('auth-modal-overlay--active');
    setTimeout(() => {
      if (!modalOverlay.classList.contains('auth-modal-overlay--active')) {
        modalOverlay.innerHTML = '';
      }
    }, 300);
  }
}

async function openPurchasesModal() {
  const user = Auth.getUser();
  if (!user) return;
  
  let modalOverlay = document.getElementById('auth-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'auth-modal-overlay';
    modalOverlay.className = 'auth-modal-overlay';
    document.body.appendChild(modalOverlay);
  }
  
  modalOverlay.innerHTML = `
    <div class="auth-modal purchases-modal">
      <div class="auth-modal__header">
        <h3 class="auth-modal__title">Mis Compras</h3>
        <button class="auth-modal__close" id="close-auth-modal-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="auth-modal__body">
        <div class="purchases-list" id="purchases-list-container">
          <p style="text-align:center;color:var(--on-surface-variant);padding:32px;">Cargando historial...</p>
        </div>
      </div>
    </div>
  `;
  
  requestAnimationFrame(() => {
    modalOverlay.classList.add('auth-modal-overlay--active');
  });
  
  document.getElementById('close-auth-modal-btn').onclick = closeAuthModal;
  
  try {
    const res = await fetch(getApiPath() + 'api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_purchases', usuario_id: user.id })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al cargar compras');
    
    const container = document.getElementById('purchases-list-container');
    if (data.purchases && data.purchases.length > 0) {
      container.innerHTML = data.purchases.map(p => {
        const date = new Date(p.fecha_compra).toLocaleDateString('es-ES', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        return `
          <div class="purchase-item">
            <img src="${p.imagen_url || 'https://via.placeholder.com/150'}" alt="${p.producto_nombre}" class="purchase-item__img" />
            <div class="purchase-item__details">
              <span class="purchase-item__name">${p.producto_nombre}</span>
              <span class="purchase-item__meta">Marca: ${p.marca.toUpperCase()}</span>
              <span class="purchase-item__meta">${date}</span>
            </div>
            <div class="purchase-item__total">
              <span class="purchase-item__price">$${Number(p.total).toFixed(2)}</span>
              <span class="purchase-item__qty">Cant: ${p.cantidad}</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `<p style="text-align:center;color:var(--on-surface-variant);padding:32px;">No tienes compras registradas aún.</p>`;
    }
  } catch (err) {
    document.getElementById('purchases-list-container').innerHTML = 
      `<p style="text-align:center;color:var(--error);padding:32px;">Error: ${err.message}</p>`;
  }
}

// Escuchar cambios de autenticación para re-renderizar el Header dinámicamente
Auth.on('change', () => {
  renderHeader(CURRENT_ACTIVE_PAGE);
});

// Registrar eventos de apertura y cierre de dropdown al hacer clic en el botón de usuario
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('user-dropdown');
  const btn = document.getElementById('user-menu-btn');
  if (!dropdown || !btn) return;
  
  if (btn.contains(e.target)) {
    e.stopPropagation();
    dropdown.classList.toggle('user-dropdown--active');
  } else if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('user-dropdown--active');
  }
});
