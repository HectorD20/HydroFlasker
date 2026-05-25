import { renderHeader, renderFooter, showToast } from './modules/layout.js';
import { PRODUCTS } from './modules/products.js';

/* State */
let activeBrand = 'all';
let sortVal = 'featured';
let activeSizes = [];
let activeColors = [];
let searchQuery = '';
let activeFilter = ''; // 'bestseller' | 'new' | 'sale' | ''

function getFilteredProducts() {
  let list = [...PRODUCTS];

  // 1. Filter by Brand
  if (activeBrand !== 'all') {
    list = list.filter(p => p.brand === activeBrand);
  }

  // 2. Filter by Search Query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.variant.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // 3. Filter by Size
  if (activeSizes.length > 0) {
    list = list.filter(p => {
      // Check if product has any size that is currently active in filters
      return p.sizes.some(size => activeSizes.includes(size.toString()));
    });
  }

  // 4. Filter by Color
  if (activeColors.length > 0) {
    list = list.filter(p => {
      // Map color names or match hexes
      // We will match if any of the product colors matches any activeColor string (e.g. 'black', 'white', 'orange', 'navy')
      const prodColorNames = p.colors.map(c => c.name.toLowerCase());
      return activeColors.some(colorName => {
        // Simple mapping between dot data-color and hex/names
        if (colorName === 'black') return prodColorNames.some(n => n.includes('negro') || n.includes('mate') || n.includes('eucalipto') || n.includes('dark'));
        if (colorName === 'white') return prodColorNames.some(n => n.includes('blanco') || n.includes('crema') || n.includes('ártico'));
        if (colorName === 'orange') return prodColorNames.some(n => n.includes('naranja') || n.includes('fuego') || n.includes('rosa'));
        if (colorName === 'navy') return prodColorNames.some(n => n.includes('azul') || n.includes('marino') || n.includes('pacífico'));
        return false;
      });
    });
  }

  // 5. Filter by preset (bestseller / new / sale)
  if (activeFilter === 'bestseller') {
    list = list.filter(p => p.isBestseller);
  } else if (activeFilter === 'sale') {
    list = list.filter(p => p.badges && p.badges.some(b => b.type === 'sale'));
  } else if (activeFilter === 'new') {
    // Treat items WITHOUT a sale badge and without isBestseller as "new arrivals"
    list = list.filter(p => !p.isBestseller && !(p.badges && p.badges.some(b => b.type === 'sale')));
  }

  // 6. Sort
  if (sortVal === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortVal === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

function cardHTML(p) {
  const mainBadge = p.badges && p.badges.length > 0 ? p.badges[0] : null;
  const badgesHTML = mainBadge
    ? `<div class="product-card__badges">
         <span class="product-card__badge ${mainBadge.type === 'sold' ? 'product-card__badge--sold' : mainBadge.type === 'sale' ? 'product-card__badge--sale' : ''}">${mainBadge.label}</span>
       </div>`
    : '';

  const colorDots = (p.colors || []).map(c =>
    `<span class="product-card__color-dot" style="background:${c.hex}" title="${c.name}"></span>`
  ).join('');

  // Showing total colors available
  const moreColors = p.colors && p.colors.length > 3
    ? `<span class="product-card__more">+${p.colors.length - 3} colores</span>`
    : '';

  const priceOldHTML = p.priceOld ? `<span class="product-card__price-old">$${p.priceOld.toFixed(2)}</span>` : '';
  const priceClass = p.priceOld ? 'product-card__price--sale' : '';

  return `
    <div class="product-card" data-id="${p.id}">
      ${badgesHTML}
      <div class="product-card__img-wrap">
        <img src="${p.img}" alt="${p.name}" class="product-card__img" loading="lazy" />
        <div class="product-card__overlay">
          <button class="product-card__quick-view" data-id="${p.id}">Vista Rápida</button>
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__row">
          <a href="product.html?id=${p.id}" class="product-card__name">${p.name}</a>
          <span class="product-card__price ${priceClass}">$${p.price.toFixed(2)}</span>
        </div>
        ${priceOldHTML ? `<div style="margin-top:-6px; margin-bottom:8px; display:flex; justify-content:flex-end;">${priceOldHTML}</div>` : ''}
        <p class="product-card__variant">${p.variant}</p>
        <div class="product-card__colors">${colorDots.slice(0, 3)}${moreColors}</div>
      </div>
    </div>`;
}

function renderGrid() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const prods = getFilteredProducts();
  grid.innerHTML = prods.length
    ? prods.map(cardHTML).join('')
    : `<div style="grid-column:1/-1;text-align:center;color:var(--on-surface-variant);padding:64px">
         <span class="material-symbols-outlined" style="font-size:48px;margin-bottom:16px;color:var(--outline-variant)">search_off</span>
         <p>No se encontraron productos con los filtros seleccionados.</p>
       </div>`;
}

/* Brand nav links click handler */
document.querySelectorAll('.sidebar__navlink').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    activeBrand = link.dataset.brand;
    document.querySelectorAll('.sidebar__navlink').forEach(l => l.classList.remove('sidebar__navlink--active'));
    link.classList.add('sidebar__navlink--active');

    // Clear URL query parameters for clean state, except search if active
    const url = new URL(window.location);
    url.searchParams.set('brand', activeBrand);
    window.history.pushState({}, '', url);

    renderGrid();
  });
});

/* Sort handler */
const sortSelect = document.getElementById('sort-select');
if (sortSelect) {
  sortSelect.addEventListener('change', e => {
    sortVal = e.target.value;
    renderGrid();
  });
}

/* Quick view click redirect to dynamic product page */
const gridContainer = document.getElementById('catalog-grid');
if (gridContainer) {
  gridContainer.addEventListener('click', e => {
    const btn = e.target.closest('.product-card__quick-view');
    if (!btn) return;
    window.location.href = `product.html?id=${btn.dataset.id}`;
  });
}

/* Load more toast */
const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    showToast('No hay más productos por ahora.');
  });
}

/* Active interactive color dots */
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    dot.classList.toggle('color-dot--active');
  });
});

/* Sidebar Apply Filters Handler */
const btnApply = document.querySelector('.btn-apply');
if (btnApply) {
  btnApply.addEventListener('click', () => {
    // 1. Gather active sizes
    activeSizes = [];
    document.querySelectorAll('.sidebar__check input:checked').forEach(input => {
      activeSizes.push(input.value);
    });

    // 2. Gather active colors
    activeColors = [];
    document.querySelectorAll('.color-dot.color-dot--active').forEach(dot => {
      activeColors.push(dot.dataset.color);
    });

    renderGrid();
    showToast('Filtros aplicados correctamente.');
  });
}

/* Read parameters from URL (On Page Load) */
const urlParams = new URLSearchParams(window.location.search);

// Brand URL parameter
const urlBrand = urlParams.get('brand');
if (urlBrand && urlBrand !== 'all') {
  activeBrand = urlBrand;
  document.querySelectorAll('.sidebar__navlink').forEach(l => {
    l.classList.toggle('sidebar__navlink--active', l.dataset.brand === urlBrand);
  });
}

// Search URL parameter
const urlSearch = urlParams.get('search');
if (urlSearch) {
  searchQuery = urlSearch;
}

// Filter URL parameter (?filter=bestseller|new|sale)
const urlFilter = urlParams.get('filter');
const FILTER_META = {
  bestseller: {
    title: 'Más Vendidos',
    sub: 'Los termos favoritos de nuestra comunidad.'
  },
  new: {
    title: 'Novedades',
    sub: 'Las últimas incorporaciones a nuestra colección.'
  },
  sale: {
    title: 'Ofertas',
    sub: 'Precios especiales por tiempo limitado.'
  }
};

if (urlFilter && FILTER_META[urlFilter]) {
  activeFilter = urlFilter;
  const meta = FILTER_META[urlFilter];
  const titleEl = document.querySelector('.catalog-head__title');
  const subEl   = document.querySelector('.catalog-head__sub');
  const crumbEl = document.querySelector('.breadcrumb__current');
  if (titleEl) titleEl.textContent = meta.title;
  if (subEl)   subEl.textContent   = meta.sub;
  if (crumbEl) crumbEl.textContent = meta.title;
  document.title = `${meta.title} — HYDROFLASKER`;
}

/* Initialize Page */
renderHeader('catalog');
renderFooter();
renderGrid();
