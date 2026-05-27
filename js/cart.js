/* ── Página del Carrito ── */

/* Costo de envío fijo y códigos de promoción disponibles */
const SHIPPING     = 99.00;
const PROMO_CODES  = { 'HYDRO10': .10, 'AVENTURA': .15 };
let   discount     = 0;

/* Formatea un número como precio en MXN con dos decimales */
const formatPrice = n => '$' + n.toFixed(2);

/* ── Genera el HTML de un artículo del carrito ── */
function itemHTML(item) {
  return `
    <div class="cart-item" data-id="${item.id}" style="animation-delay:${Math.random() * .15}s">
      <div class="cart-item__img-wrap">
        <img src="${item.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0fdHdhpueYGWSKk3cGulsWZGMjt2-LUtHmNUORuX_eO31d3t4tZsBsQIsULIt5gHe-K_aAmH5wq8jP8xBNKU3T6AukrRos5b4D_ZSjyfm2QZCBitFvt2ma6g_n8Gpo_On1bpDute57G2VLqoBPBd6gmDExAUojOKLkb6L1cJb_RPiU6wHagQmyj8b1uFHipXh2vRRWo2e-BIn39P3Dk2NIt1_R_BG2HTLtr3VSf34dnS0t9WDs1HTSJwsW2Tzc3jGSlw0DACsECA'}"
             alt="${item.name}" class="cart-item__img" />
      </div>
      <div class="cart-item__body">
        <div class="cart-item__head">
          <div>
            <span class="cart-item__badge">Más Vendido</span>
            <h3 class="cart-item__name">${item.name}</h3>
            <p class="cart-item__variant">${item.variant || ''}</p>
            <p class="cart-item__stock">
              <span class="material-symbols-outlined icon-fill" style="font-size:16px">check_circle</span>
              En Stock — Se envía mañana
            </p>
          </div>
          <div class="cart-item__price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item__footer">
          <!-- Controles de cantidad: disminuir / valor / aumentar -->
          <div class="cart-item__qty">
            <button class="cart-item__qty-btn" data-action="dec" data-id="${item.id}" aria-label="Disminuir">
              <span class="material-symbols-outlined" style="font-size:20px">remove</span>
            </button>
            <span class="cart-item__qty-val">${item.qty}</span>
            <button class="cart-item__qty-btn" data-action="inc" data-id="${item.id}" aria-label="Aumentar">
              <span class="material-symbols-outlined" style="font-size:20px">add</span>
            </button>
          </div>
          <button class="cart-item__remove" data-action="remove" data-id="${item.id}">
            <span class="material-symbols-outlined" style="font-size:18px">delete</span>
            <span class="hide-xs">Eliminar</span>
          </button>
        </div>
      </div>
    </div>`;
}

/* ── Recalcula y actualiza el resumen del pedido ── */
function updateSummary() {
  const items       = Cart.getItems();
  const subtotal    = Cart.total();
  const shipping    = items.length > 0 ? SHIPPING : 0;
  const discountAmt = subtotal * discount;
  const total       = subtotal - discountAmt + shipping;
  const count       = Cart.count();

  // Actualiza cada celda del resumen con los valores calculados
  document.getElementById('cart-count-text').textContent =
    `${count} artículo${count !== 1 ? 's' : ''} listo${count !== 1 ? 's' : ''} para tu próxima aventura.`;
  document.getElementById('item-count-label').textContent  = count;
  document.getElementById('subtotal-label').textContent    = formatPrice(subtotal);
  document.getElementById('shipping-label').textContent    = items.length > 0 ? formatPrice(shipping) : '$0.00';
  document.getElementById('total-label').textContent       = formatPrice(total);
}

/* ── Renderiza todos los artículos o muestra el estado vacío ── */
function renderCart() {
  const items     = Cart.getItems();
  const container = document.getElementById('cart-items-container');
  const empty     = document.getElementById('cart-empty');
  const layout    = document.querySelector('.cart-layout');

  if (items.length === 0) {
    // Carrito vacío: oculta el layout y muestra el mensaje de carrito vacío
    container.innerHTML     = '';
    empty.style.display     = 'flex';
    layout.style.display    = 'none';
  } else {
    // Carrito con artículos: oculta el mensaje vacío y renderiza las tarjetas
    empty.style.display     = 'none';
    layout.style.display    = '';
    container.innerHTML     = items.map(itemHTML).join('');
  }
  updateSummary();
}

/* ── Maneja las acciones sobre los artículos (incrementar, decrementar, eliminar) ── */
document.getElementById('cart-items-container').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === 'inc')    Cart.updateQty(id, 1);
  if (action === 'dec')    Cart.updateQty(id, -1);
  if (action === 'remove') Cart.removeItem(id);
  renderCart();
});

/* ── Valida y aplica un código de descuento al total ── */
document.getElementById('apply-promo-btn').addEventListener('click', () => {
  const code  = document.getElementById('promo-code').value.trim().toUpperCase();
  const msgEl = document.getElementById('promo-msg');
  const rate  = PROMO_CODES[code];

  if (rate) {
    discount = rate;
    msgEl.textContent = `✓ Código "${code}" aplicado — ${rate * 100}% de descuento`;
    msgEl.className   = 'order-summary__promo-msg order-summary__promo-msg--ok';
  } else {
    msgEl.textContent = 'Código inválido. Intenta HYDRO10 o AVENTURA.';
    msgEl.className   = 'order-summary__promo-msg order-summary__promo-msg--error';
  }
  updateSummary();
});

/* ── Procesa la compra: valida sesión, datos de envío y llama al backend ── */
document.getElementById('checkout-btn').addEventListener('click', async () => {
  // Verificar que haya artículos en el carrito
  if (Cart.count() === 0) { showToast('Tu carrito está vacío.'); return; }

  // Verificar que el usuario tenga sesión iniciada
  const user = Auth.getUser();
  if (!user) {
    alert('Debes iniciar sesión para poder realizar una compra. Por favor, inicia sesión o crea una cuenta en la ventana que aparecerá a continuación.');
    openAuthModal('login');
    return;
  }

  // Leer y validar los campos del formulario de envío
  const fullname = document.getElementById('shipping-fullname').value.trim();
  const address  = document.getElementById('shipping-address').value.trim();
  const city     = document.getElementById('shipping-city').value.trim();
  const zip      = document.getElementById('shipping-zip').value.trim();
  if (!fullname || !address || !city || !zip) {
    alert('Por favor, completa todos los datos de envío antes de proceder al pago.');
    return;
  }

  const btn = document.getElementById('checkout-btn');
  try {
    // Deshabilita el botón durante el proceso para evitar doble envío
    btn.disabled    = true;
    btn.textContent = 'Procesando compra...';

    const res  = await fetch('../api/checkout.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: user.id, items: Cart.getItems(), shipping: { fullname, address, city, zip } }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al procesar la compra.');

    // Limpia el carrito y los campos de envío tras una compra exitosa
    localStorage.removeItem('hf_cart');
    ['shipping-fullname', 'shipping-address', 'shipping-city', 'shipping-zip']
      .forEach(id => { document.getElementById(id).value = ''; });

    Cart.emit('change');
    renderCart();
    showToast('¡Compra realizada con éxito! Revisa "Mis Compras".');
  } catch (err) {
    alert(err.message);
  } finally {
    // Restaura el botón sin importar si hubo error
    if (btn) { btn.disabled = false; btn.textContent = 'Proceder al Pago'; }
  }
});

/* Vuelve a renderizar cuando el carrito cambia desde otra pestaña */
Cart.on('change', renderCart);

/* ── Inicialización ── */
renderHeader('cart');
renderFooter();
renderCart();
