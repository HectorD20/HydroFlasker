/* ── Product Page ── */

/* Gallery thumbnails */
document.querySelectorAll('.gallery__thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    document.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('gallery__thumb--active'));
    thumb.classList.add('gallery__thumb--active');
    const newSrc = thumb.querySelector('img')?.dataset.src;
    if (newSrc) document.getElementById('gallery-main-img').src = newSrc;
  });
});

/* Color swatches */
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('color-swatch--active'));
    swatch.classList.add('color-swatch--active');
    document.getElementById('selected-color-label').textContent = swatch.dataset.color;
  });
});

/* Size buttons */
document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => {
      b.classList.remove('size-btn--active');
      b.innerHTML = b.dataset.size + ' oz';
    });
    btn.classList.add('size-btn--active');
    btn.innerHTML = btn.dataset.size + ' oz <span class="size-btn__check"></span>';
  });
});

/* Add to Cart */
document.getElementById('add-to-cart-btn').addEventListener('click', () => {
  const color = document.getElementById('selected-color-label').textContent;
  const size  = document.querySelector('.size-btn--active')?.dataset.size || '40';
  Cart.addItem({
    id:      `stanley-quencher-${size}-${color}`,
    name:    `Stanley Quencher H2.0 ${size} oz`,
    variant: `${color} — ${size} oz`,
    price:   45.00,
    img:     document.getElementById('gallery-main-img').src,
  });
  showToast('Producto agregado al carrito');
});

/* Init */
renderHeader('product');
renderFooter();
