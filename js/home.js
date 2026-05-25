/* ── Home Page ── */

const BESTSELLERS = [
  {
    id: 'yeti-rambler-20',
    name: 'Yeti Rambler 20 oz',
    variant: 'Azul Marino',
    price: 35.00,
    badge: 'Más Vendido',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0fdHdhpueYGWSKk3cGulsWZGMjt2-LUtHmNUORuX_eO31d3t4tZsBsQIsULIt5gHe-K_aAmH5wq8jP8xBNKU3T6AukrRos5b4D_ZSjyfm2QZCBitFvt2ma6g_n8Gpo_On1bpDute57G2VLqoBPBd6gmDExAUojOKLkb6L1cJb_RPiU6wHagQmyj8b1uFHipXh2vRRWo2e-BIn39P3Dk2NIt1_R_BG2HTLtr3VSf34dnS0t9WDs1HTSJwsW2Tzc3jGSlw0DACsECA',
  },
  {
    id: 'hf-wide-32',
    name: 'Hydro Flask Wide Mouth 32 oz',
    variant: 'Pacífico',
    price: 44.95,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7RhSJtiO9TZNoEtM_5ScvXTttYtynrCzfJ_e0QfIHM3uWCYceO8-qViBEgBUb7ZRTRNIxhkUauUJytrMKNKF6g_yk2Uv3izIDpH6_LqS4Pvb32r5it3P9sFSgsE0PiyjEsz9I05WL109SWqy_cL6nsFZhPXtq5qYiRP7FnRVmUTPVpTdus1exqyTYk7bHY7Om103Cm5hqNlhpThdAXJQfBQwC3c0ybNk2gcjh5IWjFk5u50P5FNC65H57ObXewFVzNmptrCdhjVA',
  },
  {
    id: 'stanley-quencher-40',
    name: 'Stanley Quencher H2.0 40 oz',
    variant: 'Crema',
    price: 35.00,
    priceOld: 45.00,
    badge: 'Oferta',
    badgeType: 'sale',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF2dT3YeEOr6mVoDRHJfVOICol2zkym_3Z5Q6aql4n5_THtwJHzuLQHD4-ZwtIfu9oIMSMrg-l5s7CIzjwtUmx5iR4rVRY7suyUO4mGLtC0xz3gQN0RwwnXmdXiQFb4jAYTOFMRAbT0I5pje3hq3utvS3CKsEybeSdi5Z_PiNHZmVcM13E2ne9nE5tN_Scu4D5ggHxm4tr4f3or41Z24FrZGqBkx7x7vdfsqTn9N_GfO0SUNJtTBytmxK8VUfqXA0j0H5YLc1c7SY',
  },
  {
    id: 'owala-freesip-24',
    name: 'Owala FreeSip 24 oz',
    variant: 'Malvavisco Tímido',
    price: 27.99,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSbsH_DCG0WTQY4u7UIejp4Tk2C6zTzpSnk59JyKUkViPv6BUyU4zVL6wzBZ2hP7SBlLE4mgiHFZe2brkIWY19z21SwKc9ZX4J5JGfQUpCifd9SMdyX3slo5coD-9ld4CUhw1xu6YcAu_qJiIWlQ50qbAF20F5PDhSR9rp031_xWuHuhikafMA4YLXoRnkRyChMFYvS6HmEzowYbkq-_zOEM4MI4kygYKD_FmI70jGegTID0N9dhR8b06ppgxQakT53SplDfpluJ4',
  },
];

function renderBestsellers() {
  const grid = document.getElementById('bestsellers-grid');
  if (!grid) return;
  grid.innerHTML = BESTSELLERS.map(p => `
    <div class="product-card">
      <div class="product-card__img-wrap">
        ${p.badge ? `<span class="product-card__badge ${p.badgeType === 'sale' ? 'product-card__badge--sale' : ''}">${p.badge}</span>` : ''}
        <img src="${p.img}" alt="${p.name}" class="product-card__img" loading="lazy" />
        <button class="product-card__add" data-id="${p.id}" title="Agregar al carrito">
          <span class="material-symbols-outlined" style="font-size:20px">add</span>
        </button>
      </div>
      <div class="product-card__body">
        <a href="pages/product.html?id=${p.id}" class="product-card__name">${p.name}</a>
        <p class="product-card__variant">${p.variant}</p>
        <div class="product-card__prices">
          <span class="product-card__price ${p.priceOld ? 'product-card__price--sale' : ''}">$${p.price.toFixed(2)}</span>
          ${p.priceOld ? `<span class="product-card__price-old">$${p.priceOld.toFixed(2)}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.product-card__add');
    if (!btn) return;
    const id = btn.dataset.id;
    const prod = BESTSELLERS.find(p => p.id === id);
    if (prod) {
      Cart.addItem(prod);
      showToast(`${prod.name} agregado al carrito`);
    }
  });
}

/* Init */
renderHeader('home');
renderFooter();
renderBestsellers();
