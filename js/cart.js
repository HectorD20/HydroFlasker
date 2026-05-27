/* ── Cart Page ── */

const SHIPPING = 5.00;
const PROMO_CODES = { 'HYDRO10': .10, 'AVENTURA': .15 };
let discount = 0;

function formatPrice(n) { return '$' + n.toFixed(2); }

function itemHTML(item) {
  return `
    <div class="cart-item" data-id="${item.id}" style="animation-delay:${Math.random()*.15}s">
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

function updateSummary() {
  const items    = Cart.getItems();
  const subtotal = Cart.total();
  const shipping = items.length > 0 ? SHIPPING : 0;
  const discountAmt = subtotal * discount;
  const total    = subtotal - discountAmt + shipping;
  const count    = Cart.count();

  document.getElementById('cart-count-text').textContent =
    `${count} artículo${count !== 1 ? 's' : ''} listo${count !== 1 ? 's' : ''} para tu próxima aventura.`;
  document.getElementById('item-count-label').textContent = count;
  document.getElementById('subtotal-label').textContent   = formatPrice(subtotal);
  document.getElementById('shipping-label').textContent   = items.length > 0 ? formatPrice(shipping) : '$0.00';
  document.getElementById('total-label').textContent      = formatPrice(total);
}

function renderCart() {
  const items     = Cart.getItems();
  const container = document.getElementById('cart-items-container');
  const empty     = document.getElementById('cart-empty');
  const layout    = document.querySelector('.cart-layout');

  if (items.length === 0) {
    container.innerHTML = '';
    empty.style.display  = 'flex';
    layout.style.display = 'none';
  } else {
    empty.style.display  = 'none';
    layout.style.display = '';
    container.innerHTML  = items.map(itemHTML).join('');
  }
  updateSummary();
}

/* Item actions */
document.getElementById('cart-items-container').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;

  if (action === 'inc')    Cart.updateQty(id, 1);
  if (action === 'dec')    Cart.updateQty(id, -1);
  if (action === 'remove') Cart.removeItem(id);

  renderCart();
});

/* Promo code */
document.getElementById('apply-promo-btn').addEventListener('click', () => {
  const code    = document.getElementById('promo-code').value.trim().toUpperCase();
  const msgEl   = document.getElementById('promo-msg');
  const rate    = PROMO_CODES[code];

  if (rate) {
    discount = rate;
    msgEl.textContent  = `✓ Código "${code}" aplicado — ${rate * 100}% de descuento`;
    msgEl.className    = 'order-summary__promo-msg order-summary__promo-msg--ok';
  } else {
    msgEl.textContent  = 'Código inválido. Intenta HYDRO10 o AVENTURA.';
    msgEl.className    = 'order-summary__promo-msg order-summary__promo-msg--error';
  }
  updateSummary();
});

/* Checkout */
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (Cart.count() === 0) {
    showToast('Tu carrito está vacío.');
    return;
  }
  showToast('¡Redirigiendo al pago seguro…!');
});

/* Cart changes from other tabs */
Cart.on('change', renderCart);

/* Init */
renderHeader('cart');
renderFooter();
renderCart();

/* Demo: add default items if cart is empty */
if (Cart.count() === 0) {
  Cart.addItem({
    id: 'hf-wide-32',
    name: 'Boca Ancha de 32 oz',
    variant: 'Color: Azul Pacífico',
    price: 44.95,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb1X7l7fvY6B80QPIHhuSwuxendsyq26z_RXegSyEcntlWzpuYGkBT9kpb51yEzaSs2Q2mVC7y6sPji06FdOq5sKSw3DBjVlgVHeugJ7qgCT0VughVZ-J0BiHMc6JQBOfW0I8H_GfyBPYNg6FbfFmyY49plIV1JVCYTE7LoJrGqz2b939RnaYM02FpFEK-TEf55xpnpfn1eQD0xBT880G2cMvBxxNIPexfnHuv6dGSnhU1EXjY98u9tnyivRwSb4nZ3N5uliJXZ4E',
  });
  Cart.addItem({
    id: 'sport-cap',
    name: 'Tapa Deportiva Aislada',
    variant: 'Color: Negro',
    price: 12.95,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6cbKHvrzWs3pbNhYfgD-pEIegQTJd9bIKuu19wVJyX8tIWfoxj4JNrG7x0l9ropTKYQDonrG_jgms-C18Wp7kFrJ0bePR6M_6nnjmXvpP7Ym9Hh7exnQ-OpLUHS8diSACh96unGd69NBWqnoC1s0fh6F2wW77RZeYQ39nr549V1f5x-3optlSdEISgJQEWyz5XuwdmSRjNXe_zsI5iZlIx3RM4ozHNR5Mxe57GgnSygX_spFoVHpyzChB35Q7wY_Oju1cUO2wHDU',
  });
  renderCart();
}
