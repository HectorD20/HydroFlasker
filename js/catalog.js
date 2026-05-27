/* ── Catalog Page ── */

let ALL_PRODUCTS = [];

/* ── Filter State ── */
let activeBrand  = 'all';
let activeSizes  = new Set();   // e.g. Set([20, 40])
let activeColors = new Set();   // e.g. Set(['black', 'orange'])
let sortVal      = 'featured';

/* Map sidebar color keys → hex values that appear in product data */
const COLOR_MAP = {
  black:  ['#1e293b', '#2a2d34'],
  white:  ['#f5f5f5', '#f1f1f1', '#e3dfd3', '#d2dbd5', '#f4d9df'],
  orange: ['#fe5e1e', '#ff5722'],
  navy:   ['#1e3a5f', '#001f26', '#4cd7f6'],
};

/* ── Core Filter Logic ── */
function getFilteredProducts() {
  let list = [...ALL_PRODUCTS];

  // Brand
  if (activeBrand !== 'all') {
    list = list.filter(p => p.brand === activeBrand);
  }

  // Size  — product must include AT LEAST ONE of the selected sizes
  if (activeSizes.size > 0) {
    list = list.filter(p =>
      (p.sizes || []).some(sz => activeSizes.has(sz))
    );
  }

  // Color — product must include AT LEAST ONE hex that maps to a selected color key
  if (activeColors.size > 0) {
    list = list.filter(p => {
      const productHexes = (p.colors || []).map(c => c.toLowerCase());
      return [...activeColors].some(colorKey => {
        const hexValues = COLOR_MAP[colorKey] || [];
        return hexValues.some(hex => productHexes.includes(hex.toLowerCase()));
      });
    });
  }

  // Sort
  if (sortVal === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (sortVal === 'price-desc') list.sort((a, b) => b.price - a.price);

  return list;
}

/* ── Card HTML ── */
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

/* ── Render Grid ── */
function renderGrid() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  const prods = getFilteredProducts();
  grid.innerHTML = prods.length
    ? prods.map(cardHTML).join('')
    : `<p style="grid-column:1/-1;text-align:center;color:var(--on-surface-variant);padding:64px">No se encontraron productos con los filtros seleccionados.</p>`;
}

/* ── Brand nav links ── */
document.querySelectorAll('.sidebar__navlink').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    activeBrand = link.dataset.brand;
    document.querySelectorAll('.sidebar__navlink').forEach(l =>
      l.classList.remove('sidebar__navlink--active')
    );
    link.classList.add('sidebar__navlink--active');
    renderGrid();
  });
});

/* ── Size checkboxes ── */
document.querySelectorAll('.sidebar__check input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', () => {
    const sz = Number(cb.value);
    if (cb.checked) {
      activeSizes.add(sz);
    } else {
      activeSizes.delete(sz);
    }
  });
});

/* ── Color dots ── */
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const colorKey = dot.dataset.color;
    if (dot.classList.contains('color-dot--active')) {
      dot.classList.remove('color-dot--active');
      activeColors.delete(colorKey);
    } else {
      dot.classList.add('color-dot--active');
      activeColors.add(colorKey);
    }
  });
});

/* ── "Aplicar Filtros" button ── */
const applyBtn = document.querySelector('.btn-apply');
if (applyBtn) {
  applyBtn.addEventListener('click', () => {
    renderGrid();
    showToast(`Filtros aplicados — ${getFilteredProducts().length} producto(s) encontrado(s).`);
  });
}

/* ── Sort ── */
const sortSelect = document.getElementById('sort-select');
if (sortSelect) {
  sortSelect.addEventListener('change', e => {
    sortVal = e.target.value;
    renderGrid();
  });
}

/* ── Quick view → product page ── */
const catalogGrid = document.getElementById('catalog-grid');
if (catalogGrid) {
  catalogGrid.addEventListener('click', e => {
    const btn = e.target.closest('.cat-card__quick-view');
    if (!btn) return;
    window.location.href = `product.html?id=${btn.dataset.id}`;
  });
}

/* ── Load More ── */
const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    showToast('No hay más productos por ahora.');
  });
}

/* ── Brand passed via URL param ── */
const urlBrand = new URLSearchParams(location.search).get('brand');
if (urlBrand && urlBrand !== 'all') {
  activeBrand = urlBrand;
  document.querySelectorAll('.sidebar__navlink').forEach(l => {
    l.classList.toggle('sidebar__navlink--active', l.dataset.brand === urlBrand);
  });
}

/* ── Load catalog from API ── */
async function loadCatalog() {
  try {
    const res = await fetch('../api/products.php');
    if (!res.ok) throw new Error('Error al cargar catálogo');
    ALL_PRODUCTS = await res.json();
    renderGrid();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById('catalog-grid');
    if (grid) {
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--on-surface-variant);padding:64px">Error al conectar con la API de productos.</p>`;
    }
  }
}

/* ── Init ── */
renderHeader('catalog');
renderFooter();
loadCatalog();
