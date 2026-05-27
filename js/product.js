/* ── Product Page ── */

let currentProduct = null;

async function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    showError("No se especificó ningún producto.");
    return;
  }

  try {
    const res = await fetch('../api/products.php');
    if (!res.ok) throw new Error('Error al cargar la información de los productos');
    const products = await res.json();
    
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) {
      showError("El producto especificado no existe.");
      return;
    }

    renderProduct(currentProduct);
  } catch (err) {
    console.error(err);
    showError("Error al conectar con la base de datos de productos.");
  }
}

function showError(message) {
  const statusDiv = document.getElementById('product-loading-status');
  if (statusDiv) {
    statusDiv.innerHTML = `
      <div style="max-width:400px; margin:0 auto; padding:24px; background:var(--error-container); color:var(--on-error-container); border-radius:12px;">
        <span class="material-symbols-outlined" style="font-size:48px; margin-bottom:12px;">error</span>
        <p style="font-weight:600; margin-bottom:16px;">${message}</p>
        <a href="catalog.html" class="btn btn--primary" style="display:inline-flex;">Volver al Catálogo</a>
      </div>
    `;
  }
}

function renderProduct(p) {
  // Ocultar cargador y mostrar contenedor de detalles
  document.getElementById('product-loading-status').style.display = 'none';
  const detailsContainer = document.getElementById('product-details-container');
  detailsContainer.style.display = 'grid';

  // Título e información básica
  document.title = `${p.name} — HYDROFLASKER`;
  document.getElementById('product-title').textContent = p.name;
  document.getElementById('product-brand').textContent = p.brand.toUpperCase();
  document.getElementById('product-brand').href = `catalog.html?brand=${p.brand}`;
  document.getElementById('product-price').textContent = `$${Number(p.price).toFixed(2)}`;
  document.getElementById('product-desc').textContent = p.description || 'Sin descripción disponible por el momento.';

  // Imagen principal y Badge
  const mainImg = document.getElementById('gallery-main-img');
  mainImg.src = p.img;
  mainImg.alt = p.name;

  const badgeObj = p.badges && p.badges.length ? p.badges[0] : null;
  const badgeLabel = badgeObj ? badgeObj.label : (p.badge || '');
  const badgeType = badgeObj ? badgeObj.type : (p.badgeType || '');
  
  const badgeEl = document.getElementById('product-badge');
  if (badgeLabel) {
    badgeEl.textContent = badgeLabel;
    badgeEl.style.display = 'block';
    badgeEl.className = 'gallery__badge';
    if (badgeType === 'sale') badgeEl.classList.add('gallery__badge--sale');
  } else {
    badgeEl.style.display = 'none';
  }

  // Generar miniaturas (Thumbnails) de la galería
  const thumbsContainer = document.getElementById('gallery-thumbs');
  thumbsContainer.innerHTML = `
    <button class="gallery__thumb gallery__thumb--active" data-src="${p.img}">
      <img src="${p.img}" alt="Vista principal" />
    </button>
    <button class="gallery__thumb" data-src="${p.img}">
      <span class="material-symbols-outlined" style="color:var(--outline)">photo_camera</span>
    </button>
    <button class="gallery__thumb" data-src="${p.img}">
      <span class="material-symbols-outlined" style="color:var(--outline)">360</span>
    </button>
  `;

  // Event listener para las miniaturas
  thumbsContainer.querySelectorAll('.gallery__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbsContainer.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('gallery__thumb--active'));
      thumb.classList.add('gallery__thumb--active');
      const newSrc = thumb.dataset.src;
      if (newSrc) mainImg.src = newSrc;
    });
  });

  // Generar opciones de color
  const colorsContainer = document.getElementById('product-colors');
  if (p.colors && p.colors.length) {
    colorsContainer.innerHTML = p.colors.map((c, index) => {
      // Usar nombre descriptivo aproximado o el índice si no hay mapeo de nombres de color
      const colorName = getColorName(c);
      return `<button class="color-swatch ${index === 0 ? 'color-swatch--active' : ''}" style="background:${c}" data-color="${colorName}" aria-label="${colorName}"></button>`;
    }).join('');

    // Seleccionar color inicial
    document.getElementById('selected-color-label').textContent = getColorName(p.colors[0]);

    // Event listener para swatches de color
    colorsContainer.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        colorsContainer.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('color-swatch--active'));
        swatch.classList.add('color-swatch--active');
        document.getElementById('selected-color-label').textContent = swatch.dataset.color;
      });
    });
  } else {
    // Si no hay colores, mostrar variante principal o vacío
    document.getElementById('selected-color-label').textContent = p.variant || "Único";
    colorsContainer.innerHTML = `<button class="color-swatch color-swatch--active" style="background:var(--primary)" data-color="${p.variant || 'Único'}"></button>`;
  }

  // Generar tamaños
  const sizesContainer = document.getElementById('product-sizes');
  const sizes = p.sizes || [30, 40];
  sizesContainer.innerHTML = sizes.map((sz, index) => `
    <button class="size-btn ${index === sizes.length - 1 ? 'size-btn--active' : ''}" data-size="${sz}">
      ${sz} oz ${index === sizes.length - 1 ? '<span class="size-btn__check"></span>' : ''}
    </button>
  `).join('');

  // Event listener para los botones de tallas
  sizesContainer.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sizesContainer.querySelectorAll('.size-btn').forEach(b => {
        b.classList.remove('size-btn--active');
        b.innerHTML = b.dataset.size + ' oz';
      });
      btn.classList.add('size-btn--active');
      btn.innerHTML = btn.dataset.size + ' oz <span class="size-btn__check"></span>';
    });
  });
}

// Función auxiliar para retornar nombres descriptivos de color basados en hex
function getColorName(hex) {
  const colorsMap = {
    '#f4d9df': 'Cuarzo Rosa',
    '#d2dbd5': 'Eucalipto',
    '#2a2d34': 'Negro',
    '#e3dfd3': 'Crema',
    '#1e293b': 'Negro Mate',
    '#1e3a5f': 'Azul Marino',
    '#f5f5f5': 'Blanco Ártico',
    '#fe5e1e': 'Naranja Fuego',
    '#ff5722': 'Naranja Fuego',
    '#4cd7f6': 'Pacífico'
  };
  return colorsMap[hex.toLowerCase()] || 'Personalizado';
}

/* Add to Cart */
document.getElementById('add-to-cart-btn').addEventListener('click', () => {
  if (!currentProduct) return;

  const color = document.getElementById('selected-color-label').textContent;
  const size  = document.querySelector('.size-btn--active')?.dataset.size || '40';
  
  Cart.addItem({
    id:      `${currentProduct.id}-${size}-${color.replace(/\s+/g, '-').toLowerCase()}`,
    name:    `${currentProduct.name}`,
    variant: `${color} — ${size} oz`,
    price:   Number(currentProduct.price),
    img:     document.getElementById('gallery-main-img').src,
  });
  showToast('Producto agregado al carrito');
});

/* Init */
renderHeader('product');
renderFooter();
loadProductDetails();
