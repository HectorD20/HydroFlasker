import { renderHeader, renderFooter, showToast } from './modules/layout.js';
import { Cart } from './modules/cart.js';
import { getProductById } from './modules/products.js';

// Read query parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || 'stanley-quencher-40'; // Fallback product

const product = getProductById(productId);

function initProductDetails(p) {
  if (!p) {
    showToast('Producto no encontrado. Redirigiendo...');
    setTimeout(() => {
      window.location.href = 'catalog.html';
    }, 1500);
    return;
  }

  // 1. Update Title and Metadata
  document.title = `${p.name} — HYDROFLASKER`;

  // 2. Render Text Fields
  document.getElementById('product-brand-link').textContent = p.brand.toUpperCase();
  document.getElementById('product-brand-link').href = `catalog.html?brand=${p.brand}`;
  document.getElementById('product-title').textContent = p.name;
  document.getElementById('product-price').textContent = `$${p.price.toFixed(2)}`;
  document.getElementById('product-desc').textContent = p.description;

  // 3. Render Gallery Main Image
  const mainImg = document.getElementById('gallery-main-img');
  if (mainImg) {
    mainImg.src = p.img;
    mainImg.alt = p.name;
  }

  // 4. Render Gallery Thumbnails
  const thumbsContainer = document.getElementById('product-thumbs-container');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = p.images.map((imgUrl, i) => `
      <button class="gallery__thumb ${i === 0 ? 'gallery__thumb--active' : ''}">
        <img src="${imgUrl}" alt="${p.name} vista ${i + 1}" data-src="${imgUrl}" />
      </button>
    `).join('') + `
      <button class="gallery__thumb" title="Cámara">
        <span class="material-symbols-outlined" style="color:var(--outline)">photo_camera</span>
      </button>
      <button class="gallery__thumb" title="Vista 360°">
        <span class="material-symbols-outlined" style="color:var(--outline)">360</span>
      </button>
    `;

    // Thumbnails Click Interactive Event
    thumbsContainer.addEventListener('click', e => {
      const thumb = e.target.closest('.gallery__thumb');
      if (!thumb) return;
      document.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('gallery__thumb--active'));
      thumb.classList.add('gallery__thumb--active');
      const newSrc = thumb.querySelector('img')?.dataset.src;
      if (newSrc && mainImg) mainImg.src = newSrc;
    });
  }

  // 5. Render Color Swatches
  const colorsContainer = document.getElementById('product-colors-container');
  const colorLabel = document.getElementById('selected-color-label');
  if (colorsContainer) {
    colorsContainer.innerHTML = p.colors.map((color, i) => `
      <button class="color-swatch ${i === 0 ? 'color-swatch--active' : ''}" 
              style="background:${color.hex}" 
              data-color="${color.name}" 
              aria-label="${color.name}"></button>
    `).join('');

    // Default label color
    if (colorLabel) colorLabel.textContent = p.colors[0]?.name || '';

    // Color Swatches Click Interactive Event
    colorsContainer.addEventListener('click', e => {
      const swatch = e.target.closest('.color-swatch');
      if (!swatch) return;
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('color-swatch--active'));
      swatch.classList.add('color-swatch--active');
      if (colorLabel) colorLabel.textContent = swatch.dataset.color;
    });
  }

  // 6. Render Size Buttons
  const sizesContainer = document.getElementById('product-sizes-container');
  if (sizesContainer) {
    sizesContainer.innerHTML = p.sizes.map((size, i) => `
      <button class="size-btn ${i === 0 ? 'size-btn--active' : ''}" data-size="${size}">
        ${size} oz ${i === 0 ? '<span class="size-btn__check"></span>' : ''}
      </button>
    `).join('');

    // Size Buttons Click Interactive Event
    sizesContainer.addEventListener('click', e => {
      const btn = e.target.closest('.size-btn');
      if (!btn) return;
      document.querySelectorAll('.size-btn').forEach(b => {
        b.classList.remove('size-btn--active');
        b.innerHTML = `${b.dataset.size} oz`;
      });
      btn.classList.add('size-btn--active');
      btn.innerHTML = `${btn.dataset.size} oz <span class="size-btn__check"></span>`;
    });
  }

  // 7. Render Specs Bento Cards
  const specsContainer = document.getElementById('product-specs-container');
  if (specsContainer) {
    specsContainer.innerHTML = (p.specs || []).map(spec => `
      <div class="spec-card">
        <div class="spec-card__icon-wrap">
          <span class="material-symbols-outlined">${spec.icon}</span>
        </div>
        <h3 class="spec-card__title">${spec.title}</h3>
        <p class="spec-card__body">${spec.body}</p>
      </div>
    `).join('');
  }

  // 8. Add to Cart Button Logic
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const color = colorLabel ? colorLabel.textContent : (p.colors[0]?.name || '');
      const size = document.querySelector('.size-btn--active')?.dataset.size || p.sizes[0] || '40';

      Cart.addItem({
        id: `${p.id}-${size}-${color.replace(/\s+/g, '-').toLowerCase()}`,
        name: p.name,
        variant: `Color: ${color} — ${size} oz`,
        price: p.price,
        img: p.img
      });
      showToast(`${p.name} (${color}) agregado al carrito.`);
    });
  }
}

/* Initialize Page */
renderHeader('product');
renderFooter();
initProductDetails(product);
