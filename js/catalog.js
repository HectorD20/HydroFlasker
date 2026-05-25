/* ── Catalog Page ── */

const ALL_PRODUCTS = [
  {
    id: 'commuter-30',
    name: 'The Commuter 30oz',
    variant: 'Edición Negro Mate',
    price: 35,
    brand: 'stanley',
    sizes: [30],
    badges: [{ label: 'Frío por 24h' }],
    colors: ['#1e293b','#1e3a5f'],
    moreColors: 2,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnMmgTJG17iNWyp2Tk_ZbNybk3FmB7WRESWF1AmAaPQmXNVr1k3n_oNUEGmnWDLGZFMT10V4SFOanFMVrQZSPtmTnJz9mHJnoq6jH6XAE1BPsK3Enj4nhwkLp4iIX-C6zZgf85ML1a4jSE_-Dli_LeP0GN2EFOW1_KtokrmP13j0bnqoBef5TajMk_2oUMgCouT1ZzFuyQnEpciV6D1FxamGF29Rgy7n7GmwPYVdriTHPNEszkMr7FGO7w-X-jjaBOmxzch3Dln7o',
  },
  {
    id: 'basecamp-40',
    name: 'Basecamp Flask 40oz',
    variant: 'Blanco Ártico',
    price: 45,
    brand: 'hydroflask',
    sizes: [40],
    colors: ['#f5f5f5','#fe5e1e'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg462SB--TbsuEiS2ns8KIEReup8LlAEiOPVffj7fQ-uLkLSQhcOmjvXXGAZXm5Ast6bJFi7g4XgJNIiFjxQvG4qyzcBdxtF-dnne6h-L72jHKnbjSh5l1gHSmzZQyftgnX2859_poApNfWRlqtasmHaYSSdR79BrQ1BFnr8g2d89z26RvWNhodtwcBz-xPCqRqzyZ8n-KRcxjpxUYMzOWHr0mS38O5CX8M015hcrS300eg9vWrCXoWu-_9FydVh-n1JwHJ6MERx0',
  },
  {
    id: 'trailblazer-20',
    name: 'Trailblazer 20oz',
    variant: 'Naranja Fuego',
    price: 28,
    brand: 'hydroflask',
    sizes: [20],
    badges: [{ label: 'Más Vendido', type: 'sold' }],
    colors: ['#ff5722'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqGIMtk4qhd5_JQyv3ToiiiOzmdr7gVCTqBFxWsEnN1PZM0G1qf_PChDv-YksK5pL8e9qK9VTdotHFNj4a2Y4RhWmgXrg9kVpqoBceQ71rs0hY4lPjE6v1qywcOM-XBUc434o-paydLR6z-4iwZqaikn3ysiqeo85e4yFNsO_F3WqD9UlL2BV9AJtGB2byxcvJi5k6WBSOGrq5AFhh_MmL2A0yRFr2cbsV4sWjSnv3mFF3IY-RhseAoy7ziqdK_nw7cwXqhMADtvM',
  },
  {
    id: 'yeti-rambler-20',
    name: 'Yeti Rambler 20 oz',
    variant: 'Azul Marino',
    price: 35,
    brand: 'yeti',
    sizes: [20],
    badges: [{ label: 'Más Vendido' }],
    colors: ['#1e3a5f'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0fdHdhpueYGWSKk3cGulsWZGMjt2-LUtHmNUORuX_eO31d3t4tZsBsQIsULIt5gHe-K_aAmH5wq8jP8xBNKU3T6AukrRos5b4D_ZSjyfm2QZCBitFvt2ma6g_n8Gpo_On1bpDute57G2VLqoBPBd6gmDExAUojOKLkb6L1cJb_RPiU6wHagQmyj8b1uFHipXh2vRRWo2e-BIn39P3Dk2NIt1_R_BG2HTLtr3VSf34dnS0t9WDs1HTSJwsW2Tzc3jGSlw0DACsECA',
  },
  {
    id: 'hf-wide-32',
    name: 'Hydro Flask Wide Mouth 32 oz',
    variant: 'Pacífico',
    price: 44.95,
    brand: 'hydroflask',
    sizes: [30],
    colors: ['#4cd7f6'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7RhSJtiO9TZNoEtM_5ScvXTttYtynrCzfJ_e0QfIHM3uWCYceO8-qViBEgBUb7ZRTRNIxhkUauUJytrMKNKF6g_yk2Uv3izIDpH6_LqS4Pvb32r5it3P9sFSgsE0PiyjEsz9I05WL109SWqy_cL6nsFZhPXtq5qYiRP7FnRVmUTPVpTdus1exqyTYk7bHY7Om103Cm5hqNlhpThdAXJQfBQwC3c0ybNk2gcjh5IWjFk5u50P5FNC65H57ObXewFVzNmptrCdhjVA',
  },
  {
    id: 'stanley-quencher-40',
    name: 'Stanley Quencher H2.0 40 oz',
    variant: 'Crema',
    price: 35,
    brand: 'stanley',
    sizes: [40],
    colors: ['#e3dfd3'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF2dT3YeEOr6mVoDRHJfVOICol2zkym_3Z5Q6aql4n5_THtwJHzuLQHD4-ZwtIfu9oIMSMrg-l5s7CIzjwtUmx5iR4rVRY7suyUO4mGLtC0xz3gQN0RwwnXmdXiQFb4jAYTOFMRAbT0I5pje3hq3utvS3CKsEybeSdi5Z_PiNHZmVcM13E2ne9nE5tN_Scu4D5ggHxm4tr4f3or41Z24FrZGqBkx7x7vdfsqTn9N_GfO0SUNJtTBytmxK8VUfqXA0j0H5YLc1c7SY',
  },
  {
    id: 'owala-freesip-24',
    name: 'Owala FreeSip 24 oz',
    variant: 'Malvavisco Tímido',
    price: 27.99,
    brand: 'owala',
    sizes: [20],
    colors: ['#f4d9df'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSbsH_DCG0WTQY4u7UIejp4Tk2C6zTzpSnk59JyKUkViPv6BUyU4zVL6wzBZ2hP7SBlLE4mgiHFZe2brkIWY19z21SwKc9ZX4J5JGfQUpCifd9SMdyX3slo5coD-9ld4CUhw1xu6YcAu_qJiIWlQ50qbAF20F5PDhSR9rp031_xWuHuhikafMA4YLXoRnkRyChMFYvS6HmEzowYbkq-_zOEM4MI4kygYKD_FmI70jGegTID0N9dhR8b06ppgxQakT53SplDfpluJ4',
  },
];

/* State */
let activeBrand = 'all';
let sortVal     = 'featured';

function getFilteredProducts() {
  let list = [...ALL_PRODUCTS];
  if (activeBrand !== 'all') list = list.filter(p => p.brand === activeBrand);
  if (sortVal === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (sortVal === 'price-desc') list.sort((a,b) => b.price - a.price);
  return list;
}

function cardHTML(p) {
  const badges = (p.badges || []).map(b =>
    `<span class="cat-card__badge ${b.type === 'sold' ? 'cat-card__badge--sold' : ''}">${b.label}</span>`
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
          <span class="cat-card__price">$${p.price % 1 === 0 ? p.price : p.price.toFixed(2)}</span>
        </div>
        <p class="cat-card__variant">${p.variant}</p>
        <div class="cat-card__colors">${colorDots}${moreColors}</div>
      </div>
    </div>`;
}

function renderGrid() {
  const grid = document.getElementById('catalog-grid');
  const prods = getFilteredProducts();
  grid.innerHTML = prods.length
    ? prods.map(cardHTML).join('')
    : `<p style="grid-column:1/-1;text-align:center;color:var(--on-surface-variant);padding:64px">No se encontraron productos.</p>`;
}

/* Brand nav links */
document.querySelectorAll('.sidebar__navlink').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    activeBrand = link.dataset.brand;
    document.querySelectorAll('.sidebar__navlink').forEach(l => l.classList.remove('sidebar__navlink--active'));
    link.classList.add('sidebar__navlink--active');
    renderGrid();
  });
});

/* Sort */
document.getElementById('sort-select').addEventListener('change', e => {
  sortVal = e.target.value;
  renderGrid();
});

/* Quick view → go to product */
document.getElementById('catalog-grid').addEventListener('click', e => {
  const btn = e.target.closest('.cat-card__quick-view');
  if (!btn) return;
  window.location.href = `product.html?id=${btn.dataset.id}`;
});

/* Load more (just shows toast in this demo) */
document.getElementById('load-more-btn').addEventListener('click', () => {
  showToast('No hay más productos por ahora.');
});

/* Apply color dots toggle */
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    dot.classList.toggle('color-dot--active');
  });
});

/* Check if brand passed in URL */
const urlBrand = new URLSearchParams(location.search).get('brand');
if (urlBrand && urlBrand !== 'all') {
  activeBrand = urlBrand;
  document.querySelectorAll('.sidebar__navlink').forEach(l => {
    l.classList.toggle('sidebar__navlink--active', l.dataset.brand === urlBrand);
  });
}

/* Init */
renderHeader('catalog');
renderFooter();
renderGrid();
