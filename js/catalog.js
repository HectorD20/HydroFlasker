/* ── Página del Catálogo ── */

/* Lista completa de productos cargados desde la API */
let ALL_PRODUCTS = [];

/* ── Estado de los filtros activos ── */
let activeBrand  = 'all';
let activeSizes  = new Set(); // Ej: Set([20, 40])
let activeColors = new Set(); // Ej: Set(['black', 'orange'])
let sortVal      = 'featured';

/* Mapeo de clave de color del sidebar → valores hex en los datos del producto */
const COLOR_MAP = {
  black:  ['#1e293b', '#2a2d34'],
  white:  ['#f5f5f5', '#f1f1f1', '#e3dfd3', '#d2dbd5', '#f4d9df'],
  orange: ['#fe5e1e', '#ff5722'],
  navy:   ['#1e3a5f', '#001f26', '#4cd7f6'],
};

/* ── Filtra y ordena los productos según el estado activo de los filtros ── */
function getFilteredProducts() {
  let list = [...ALL_PRODUCTS];

  // Filtro por marca
  if (activeBrand !== 'all') list = list.filter(p => p.brand === activeBrand);

  // Filtro por tamaño: el producto debe incluir al menos uno de los tamaños seleccionados
  if (activeSizes.size > 0)
    list = list.filter(p => (p.sizes || []).some(sz => activeSizes.has(sz)));

  // Filtro por color: el producto debe tener al menos un hex que coincida con la clave de color
  if (activeColors.size > 0)
    list = list.filter(p => {
      const hexes = (p.colors || []).map(c => c.toLowerCase());
      return [...activeColors].some(key => (COLOR_MAP[key] || []).some(h => hexes.includes(h)));
    });

  // Ordenamiento por precio
  if (sortVal === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (sortVal === 'price-desc') list.sort((a, b) => b.price - a.price);

  return list;
}

/* ── Genera el HTML de una tarjeta de catálogo ── */
function cardHTML(p) {
  const badges = (p.badges || []).map(b =>
    `<span class="cat-card__badge ${b.type === 'sold' ? 'cat-card__badge--sold' : b.type === 'sale' ? 'cat-card__badge--sale' : ''}">${b.label}</span>`
  ).join('');
  const colorDots = (p.colors || []).map(c =>
    `<span class="cat-card__color-dot" style="background:${c}"></span>`
  ).join('');
  const moreColors = p.moreColors ? `<span class="cat-card__more">+${p.moreColors} colores</span>` : '';

  return `
    <div class="cat-card" data-id="${p.id}">
      ${badges ? `<div class="cat-card__badges">${badges}</div>` : ''}
      <div class="cat-card__img-wrap">
        <img src="${p.img}" alt="${p.name}" class="cat-card__img" loading="lazy" />
        <div class="cat-card__overlay">
          <button class="cat-card__quick-view" data-id="${p.id}">Vista Rápida</button>
        </div>
      </div>
      <div class="cat-card__body">
        <div class="cat-card__row">
          <a href="product.html?id=${p.id}" class="cat-card__name">${p.name}</a>
          <span class="cat-card__price">$${p.price % 1 === 0 ? p.price : Number(p.price).toFixed(2)}</span>
        </div>
        <p class="cat-card__variant">${p.variant}</p>
        <div class="cat-card__colors">${colorDots}${moreColors}</div>
      </div>
    </div>`;
}

/* ── Renderiza el grid de productos con los filtros vigentes ── */
function renderGrid() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  const prods = getFilteredProducts();
  grid.innerHTML = prods.length
    ? prods.map(cardHTML).join('')
    : `<p style="grid-column:1/-1;text-align:center;color:var(--on-surface-variant);padding:64px">No se encontraron productos con los filtros seleccionados.</p>`;
}

/* ── Filtro de marca: clics en el menú lateral ── */
document.querySelectorAll('.sidebar__navlink').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    activeBrand = link.dataset.brand;
    // Marca el enlace activo y quita el de los demás
    document.querySelectorAll('.sidebar__navlink').forEach(l => l.classList.remove('sidebar__navlink--active'));
    link.classList.add('sidebar__navlink--active');
    renderGrid();
  });
});

/* ── Filtro de tamaño: checkboxes del sidebar ── */
document.querySelectorAll('.sidebar__check input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', () => {
    const sz = Number(cb.value);
    cb.checked ? activeSizes.add(sz) : activeSizes.delete(sz);
  });
});

/* ── Filtro de color: puntos de color del sidebar ── */
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const key = dot.dataset.color;
    // Alterna el estado activo del punto y actualiza el Set de colores
    dot.classList.toggle('color-dot--active');
    dot.classList.contains('color-dot--active') ? activeColors.add(key) : activeColors.delete(key);
  });
});

/* ── Botón "Aplicar Filtros": aplica todos los filtros y muestra el resultado ── */
const applyBtn = document.querySelector('.btn-apply');
if (applyBtn) {
  applyBtn.addEventListener('click', () => {
    renderGrid();
    showToast(`Filtros aplicados — ${getFilteredProducts().length} producto(s) encontrado(s).`);
  });
}

/* ── Selector de orden: ordena el grid en tiempo real ── */
const sortSelect = document.getElementById('sort-select');
if (sortSelect) sortSelect.addEventListener('change', e => { sortVal = e.target.value; renderGrid(); });

/* ── Clic en "Vista Rápida": navega a la página del producto ── */
const catalogGrid = document.getElementById('catalog-grid');
if (catalogGrid) {
  catalogGrid.addEventListener('click', e => {
    const btn = e.target.closest('.cat-card__quick-view');
    if (btn) window.location.href = `product.html?id=${btn.dataset.id}`;
  });
}

/* ── Botón "Cargar Más": por ahora solo muestra un toast informativo ── */
const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => showToast('No hay más productos por ahora.'));

/* ── Aplica el filtro de marca si viene en la URL (?brand=...) ── */
const urlBrand = new URLSearchParams(location.search).get('brand');
if (urlBrand && urlBrand !== 'all') {
  activeBrand = urlBrand;
  document.querySelectorAll('.sidebar__navlink').forEach(l =>
    l.classList.toggle('sidebar__navlink--active', l.dataset.brand === urlBrand)
  );
}

/* ── Carga el catálogo desde la API e inicia el renderizado ── */
async function loadCatalog() {
  try {
    const res = await fetch('../api/products.php');
    if (!res.ok) throw new Error('Error al cargar catálogo');
    ALL_PRODUCTS = await res.json();
    renderGrid();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById('catalog-grid');
    if (grid) grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--on-surface-variant);padding:64px">Error al conectar con la API de productos.</p>`;
  }
}

/* ── Inicialización ── */
renderHeader('catalog');
renderFooter();
loadCatalog();
