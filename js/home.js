/* ── Página de Inicio ── */

/* Lista de productos destacados cargados desde la API */
let BESTSELLERS = [];

/* ── Obtiene los productos de la API y filtra los más vendidos ── */
async function loadBestsellers() {
  try {
    const res = await fetch('api/products.php');
    if (!res.ok) throw new Error('Error al cargar productos');
    const all = await res.json();
    // Solo muestra los productos marcados como bestseller
    BESTSELLERS = all.filter(p => p.bestseller);
    renderBestsellers();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById('bestsellers-grid');
    if (grid) grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--on-surface-variant);padding:64px">No se pudieron cargar los productos en este momento.</p>`;
  }
}

/* ── Genera el HTML de cada tarjeta de producto y lo inyecta en el grid ── */
function renderBestsellers() {
  const grid = document.getElementById('bestsellers-grid');
  if (!grid) return;

  grid.innerHTML = BESTSELLERS.map(p => {
    // Obtiene el primer badge del array o usa los campos legacy
    const badgeObj   = p.badges && p.badges.length ? p.badges[0] : null;
    const badgeLabel = badgeObj ? badgeObj.label : (p.badge || '');
    const badgeType  = badgeObj ? badgeObj.type  : (p.badgeType || '');

    return `
      <div class="product-card">
        <div class="product-card__img-wrap">
          ${badgeLabel ? `<span class="product-card__badge ${badgeType === 'sale' ? 'product-card__badge--sale' : ''}">${badgeLabel}</span>` : ''}
          <img src="${p.img}" alt="${p.name}" class="product-card__img" loading="lazy" />
          <button class="product-card__add" data-id="${p.id}" title="Agregar al carrito">
            <span class="material-symbols-outlined" style="font-size:20px">add</span>
          </button>
        </div>
        <div class="product-card__body">
          <a href="pages/product.html?id=${p.id}" class="product-card__name">${p.name}</a>
          <p class="product-card__variant">${p.variant}</p>
          <div class="product-card__prices">
            <span class="product-card__price ${p.priceOld ? 'product-card__price--sale' : ''}">$${Number(p.price).toFixed(2)}</span>
            ${p.priceOld ? `<span class="product-card__price-old">$${Number(p.priceOld).toFixed(2)}</span>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  // Clonar el nodo elimina listeners anteriores antes de añadir los nuevos
  const newGrid = grid.cloneNode(true);
  grid.parentNode.replaceChild(newGrid, grid);

  // Escucha clics en los botones "Agregar al carrito" usando delegación de eventos
  newGrid.addEventListener('click', e => {
    const btn = e.target.closest('.product-card__add');
    if (!btn) return;
    const prod = BESTSELLERS.find(p => p.id === btn.dataset.id);
    if (prod) {
      Cart.addItem(prod);
      showToast(`${prod.name} agregado al carrito`);
    }
  });
}

/* ── Inicialización ── */
renderHeader('home');
renderFooter();
loadBestsellers();
