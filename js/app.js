/* =====================================================
   HYDROFLASKER — Lógica compartida de la aplicación
   ===================================================== */

/* ── Almacén del carrito (localStorage) ── */
const Cart = (() => {
  const KEY = 'hf_cart';

  // Lee el carrito guardado; devuelve [] si está vacío o corrupto
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const save = items => localStorage.setItem(KEY, JSON.stringify(items));

  // Devuelve todos los artículos del carrito
  function getItems() { return load(); }

  // Agrega un producto; si ya existe incrementa la cantidad
  function addItem(product) {
    const items = load();
    const idx = items.findIndex(i => i.id === product.id);
    if (idx > -1) { items[idx].qty += 1; }
    else          { items.push({ ...product, qty: 1 }); }
    save(items);
    Cart.emit('change');
  }

  // Elimina un artículo por su id
  function removeItem(id) {
    save(load().filter(i => i.id !== id));
    Cart.emit('change');
  }

  // Modifica la cantidad de un artículo (delta: +1 / -1), mínimo 1
  function updateQty(id, delta) {
    const items = load();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    items[idx].qty = Math.max(1, items[idx].qty + delta);
    save(items);
    Cart.emit('change');
  }

  // Cantidad total de unidades en el carrito
  const count = () => load().reduce((s, i) => s + i.qty, 0);

  // Precio total de todos los artículos
  const total = () => load().reduce((s, i) => s + i.price * i.qty, 0);

  // Mini bus de eventos para sincronizar pestañas y componentes
  const listeners = {};
  const on   = (ev, fn) => (listeners[ev] = listeners[ev] || []).push(fn);
  const emit = ev => (listeners[ev] || []).forEach(fn => fn());

  return { getItems, addItem, removeItem, updateQty, count, total, on, emit };
})();

/* ── Almacén de sesión de usuario (localStorage) ── */
const Auth = (() => {
  const KEY = 'hf_user';

  // Devuelve el usuario activo o null si no hay sesión
  const getUser = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } };

  // Guarda o elimina la sesión y notifica cambios
  function setUser(user) {
    user ? localStorage.setItem(KEY, JSON.stringify(user)) : localStorage.removeItem(KEY);
    Auth.emit('change');
  }

  const isLoggedIn = () => getUser() !== null;

  // Mini bus de eventos para reaccionar a cambios de sesión
  const listeners = {};
  const on   = (ev, fn) => (listeners[ev] = listeners[ev] || []).push(fn);
  const emit = ev => (listeners[ev] || []).forEach(fn => fn());

  return { getUser, setUser, isLoggedIn, on, emit };
})();

/* Página activa global (se actualiza en cada renderHeader) */
let CURRENT_ACTIVE_PAGE = 'home';

/* ── Construye y renderiza el encabezado compartido ── */
function renderHeader(activePage) {
  CURRENT_ACTIVE_PAGE = activePage;

  // Determina si estamos en la raíz o en /pages/ para ajustar las rutas
  const isRoot   = !location.pathname.includes('/pages/');
  const rootPath = isRoot ? '' : '../';

  // Elementos del menú de navegación principal
  const links = [
    { label: 'Comprar Todo', page: 'catalog' },
    { label: 'Marcas',       page: 'home'    },
    { label: 'Más Vendidos', page: 'catalog' },
    { label: 'Novedades',    page: 'catalog' },
    { label: 'Ofertas',      page: 'catalog' },
  ];

  // Genera los <a> del menú marcando el enlace activo
  const navLinks = links.map(l => {
    const href   = rootPath + (l.page === 'home' ? 'index.html' : `pages/${l.page}.html`);
    const active = l.page === activePage ? 'topnav__link--active' : '';
    return `<a href="${href}" class="topnav__link ${active}">${l.label}</a>`;
  }).join('');

  const user = Auth.getUser();
  let userIconHtml, dropdownHtml;

  if (user) {
    // Avatar con iniciales del nombre (máx. 2 letras)
    const initials = user.nombre
      ? user.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'U';

    userIconHtml = `
      <button class="topnav__icon-btn" id="user-menu-btn" title="Mi Cuenta" style="display:flex;align-items:center;justify-content:center;">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--surface-container-highest);color:var(--on-surface);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--secondary);">${initials}</div>
      </button>`;

    // Menú desplegable para usuario autenticado
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
      </button>`;
  } else {
    // Ícono genérico y menú para usuario no autenticado
    userIconHtml = `
      <button class="topnav__icon-btn" id="user-menu-btn" title="Mi Cuenta">
        <span class="material-symbols-outlined">person</span>
      </button>`;

    dropdownHtml = `
      <p style="font-size:11px;color:var(--on-surface-variant);text-align:center;margin-bottom:4px;">Inicia sesión para gestionar tus compras.</p>
      <button class="user-dropdown__btn" id="login-trigger-btn">
        <span class="material-symbols-outlined" style="font-size:18px">login</span>
        Iniciar Sesión
      </button>
      <button class="user-dropdown__btn" id="register-trigger-btn">
        <span class="material-symbols-outlined" style="font-size:18px">person_add</span>
        Registrarse
      </button>`;
  }

  // Inyecta el HTML completo del encabezado en el DOM
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

  // Actualiza el badge del carrito y suscribe futuros cambios
  updateCartBadge();
  Cart.on('change', updateCartBadge);

  // Enlaza los botones del dropdown según el estado de sesión
  if (user) {
    const viewPurchases = document.getElementById('view-purchases-btn');
    if (viewPurchases) viewPurchases.onclick = () => {
      document.getElementById('user-dropdown').classList.remove('user-dropdown--active');
      openPurchasesModal();
    };
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.onclick = () => {
      Auth.setUser(null);
      showToast('Sesión cerrada correctamente');
    };
  } else {
    // Helper reutilizable: cierra el dropdown y abre el modal en la pestaña indicada
    const openModal = tab => () => {
      document.getElementById('user-dropdown').classList.remove('user-dropdown--active');
      openAuthModal(tab);
    };
    const loginTrigger    = document.getElementById('login-trigger-btn');
    const registerTrigger = document.getElementById('register-trigger-btn');
    if (loginTrigger)    loginTrigger.onclick    = openModal('login');
    if (registerTrigger) registerTrigger.onclick = openModal('register');
  }
}

/* ── Actualiza el contador visual del carrito en el navbar ── */
function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;
  const n = Cart.count();
  badge.textContent  = n;
  badge.style.display = n > 0 ? 'flex' : 'none';
  // Reinicia la animación de rebote
  badge.classList.remove('bump');
  void badge.offsetWidth;
  if (n > 0) badge.classList.add('bump');
}

/* ── Construye y renderiza el pie de página compartido ── */
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

/* ── Muestra una notificación flotante (toast) en la esquina inferior derecha ── */
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
  requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
  clearTimeout(toast._t);
  // Oculta el toast después de 2.8 segundos
  toast._t = setTimeout(() => { toast.style.transform = 'translateY(80px)'; toast.style.opacity = '0'; }, 2800);
}

/* ── Devuelve el prefijo de ruta correcto para llamar a la API ── */
function getApiPath() {
  return location.pathname.includes('/pages/') ? '../' : '';
}

/* ── Envía credenciales al backend y abre sesión ── */
async function handleStandardLogin(email, password) {
  try {
    const res  = await fetch(getApiPath() + 'api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    Auth.setUser(data.user);
    closeAuthModal();
    showToast(`¡Hola de nuevo, ${data.user.nombre}!`);
  } catch (err) { alert(err.message); }
}

/* ── Crea una cuenta nueva y abre sesión automáticamente ── */
async function handleStandardRegister(nombre, email, password) {
  try {
    const res  = await fetch(getApiPath() + 'api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', nombre, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear la cuenta');
    Auth.setUser(data.user);
    closeAuthModal();
    showToast(`¡Cuenta creada! Bienvenido, ${data.user.nombre}`);
  } catch (err) { alert(err.message); }
}

/* ── Abre el modal de autenticación (login / registro) ── */
function openAuthModal(defaultTab = 'login') {
  // Reutiliza el overlay si ya existe en el DOM
  let overlay = document.getElementById('auth-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'auth-modal-overlay';
    overlay.className = 'auth-modal-overlay';
    document.body.appendChild(overlay);
  }

  const isLogin = defaultTab === 'login';
  overlay.innerHTML = `
    <div class="auth-modal">
      <div class="auth-modal__header">
        <h3 class="auth-modal__title">Mi Cuenta</h3>
        <button class="auth-modal__close" id="close-auth-modal-btn">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="auth-modal__body">
        <div class="auth-tabs">
          <button class="auth-tab ${isLogin ? 'auth-tab--active' : ''}" id="tab-login-btn">Iniciar Sesión</button>
          <button class="auth-tab ${!isLogin ? 'auth-tab--active' : ''}" id="tab-register-btn">Crear Cuenta</button>
        </div>
        <!-- Formulario de inicio de sesión -->
        <form class="auth-form" id="login-form" style="display:${isLogin ? 'flex' : 'none'};">
          <div class="auth-field">
            <label for="login-email">Correo Electrónico</label>
            <input type="email" id="login-email" required placeholder="correo@ejemplo.com" />
          </div>
          <div class="auth-field">
            <label for="login-password">Contraseña</label>
            <input type="password" id="login-password" required placeholder="••••••••" />
          </div>
          <button type="submit" class="btn btn--primary electric-button" style="width:100%;padding-block:10px;margin-top:8px;">Ingresar</button>
        </form>
        <!-- Formulario de registro -->
        <form class="auth-form" id="register-form" style="display:${!isLogin ? 'flex' : 'none'};">
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
          <button type="submit" class="btn btn--primary electric-button" style="width:100%;padding-block:10px;margin-top:8px;">Registrarse</button>
        </form>
      </div>
    </div>`;

  requestAnimationFrame(() => overlay.classList.add('auth-modal-overlay--active'));
  document.getElementById('close-auth-modal-btn').onclick = closeAuthModal;

  // Referencias a los elementos del modal
  const tabLogin    = document.getElementById('tab-login-btn');
  const tabRegister = document.getElementById('tab-register-btn');
  const formLogin   = document.getElementById('login-form');
  const formReg     = document.getElementById('register-form');

  // Cambio entre pestañas: muestra el formulario correspondiente
  tabLogin.onclick = () => {
    tabLogin.classList.add('auth-tab--active');
    tabRegister.classList.remove('auth-tab--active');
    formLogin.style.display = 'flex';
    formReg.style.display   = 'none';
  };
  tabRegister.onclick = () => {
    tabRegister.classList.add('auth-tab--active');
    tabLogin.classList.remove('auth-tab--active');
    formReg.style.display   = 'flex';
    formLogin.style.display = 'none';
  };

  // Envío del formulario de login
  formLogin.onsubmit = e => {
    e.preventDefault();
    handleStandardLogin(
      document.getElementById('login-email').value,
      document.getElementById('login-password').value
    );
  };

  // Envío del formulario de registro
  formReg.onsubmit = e => {
    e.preventDefault();
    handleStandardRegister(
      document.getElementById('register-name').value,
      document.getElementById('register-email').value,
      document.getElementById('register-password').value
    );
  };
}

/* ── Cierra el modal de autenticación con animación ── */
function closeAuthModal() {
  const overlay = document.getElementById('auth-modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('auth-modal-overlay--active');
  // Limpia el contenido tras la transición de salida (300 ms)
  setTimeout(() => { if (!overlay.classList.contains('auth-modal-overlay--active')) overlay.innerHTML = ''; }, 300);
}

/* ── Abre el modal del historial de compras del usuario ── */
async function openPurchasesModal() {
  const user = Auth.getUser();
  if (!user) return;

  // Reutiliza el overlay existente o lo crea si no existe
  let overlay = document.getElementById('auth-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'auth-modal-overlay';
    overlay.className = 'auth-modal-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
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
    </div>`;

  requestAnimationFrame(() => overlay.classList.add('auth-modal-overlay--active'));
  document.getElementById('close-auth-modal-btn').onclick = closeAuthModal;

  const container = document.getElementById('purchases-list-container');
  try {
    const res  = await fetch(getApiPath() + 'api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_purchases', usuario_id: user.id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al cargar compras');

    if (data.purchases && data.purchases.length > 0) {
      // Renderiza cada compra con su fecha formateada
      container.innerHTML = data.purchases.map(p => {
        const date = new Date(p.fecha_compra).toLocaleDateString('es-ES', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
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
          </div>`;
      }).join('');
    } else {
      container.innerHTML = `<p style="text-align:center;color:var(--on-surface-variant);padding:32px;">No tienes compras registradas aún.</p>`;
    }
  } catch (err) {
    container.innerHTML = `<p style="text-align:center;color:var(--error);padding:32px;">Error: ${err.message}</p>`;
  }
}

/* ── Re-renderiza el encabezado cuando cambia la sesión ── */
Auth.on('change', () => renderHeader(CURRENT_ACTIVE_PAGE));

/* ── Abre/cierra el dropdown de usuario al hacer clic ── */
document.addEventListener('click', e => {
  const dropdown = document.getElementById('user-dropdown');
  const btn      = document.getElementById('user-menu-btn');
  if (!dropdown || !btn) return;
  if (btn.contains(e.target)) {
    e.stopPropagation();
    dropdown.classList.toggle('user-dropdown--active');
  } else if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('user-dropdown--active');
  }
});
