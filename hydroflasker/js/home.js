/* ============================================
   HYDROFLASKER — Home Page Logic
   ============================================ */

import { renderHeader, renderFooter, showToast } from './modules/layout.js';
import { Cart } from './modules/cart.js';
import { PRODUCTS } from './modules/products.js';

function renderBestsellers() {
  const grid = document.getElementById('bestsellers-grid');
  if (!grid) return;

  // Filter only bestsellers
  const bestsellers = PRODUCTS.filter(p => p.isBestseller);

  grid.innerHTML = bestsellers.map(p => {
    const mainBadge = p.badges && p.badges.length > 0 ? p.badges[0] : null;
    const badgeHTML = mainBadge 
      ? `<span class="product-card__badge ${mainBadge.type === 'sale' ? 'product-card__badge--sale' : ''}">${mainBadge.label}</span>`
      : '';
    const priceOldHTML = p.priceOld ? `<span class="product-card__price-old">$${p.priceOld.toFixed(2)}</span>` : '';
    const priceClass = p.priceOld ? 'product-card__price--sale' : '';

    return `
      <div class="product-card">
        <div class="product-card__img-wrap">
          ${badgeHTML}
          <img src="${p.img}" alt="${p.name}" class="product-card__img" loading="lazy" />
          <button class="product-card__add" data-id="${p.id}" title="Agregar al carrito">
            <span class="material-symbols-outlined" style="font-size:20px">add</span>
          </button>
        </div>
        <div class="product-card__body">
          <a href="pages/product.html?id=${p.id}" class="product-card__name">${p.name}</a>
          <p class="product-card__variant">${p.variant}</p>
          <div class="product-card__prices">
            <span class="product-card__price ${priceClass}">$${p.price.toFixed(2)}</span>
            ${priceOldHTML}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Handle direct Add to Cart click on home grid
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.product-card__add');
    if (!btn) return;
    
    const id = btn.dataset.id;
    const prod = PRODUCTS.find(p => p.id === id);
    if (prod) {
      Cart.addItem({
        id: prod.id,
        name: prod.name,
        variant: prod.variant,
        price: prod.price,
        img: prod.img
      });
      showToast(`${prod.name} agregado al carrito`);
    }
  });
}

/* Initialize Page */
renderHeader('home');
renderFooter();
renderBestsellers();
