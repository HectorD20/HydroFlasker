/* ============================================
   HYDROFLASKER — React Cart Store Module
   ============================================ */

const KEY = 'hf_cart';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

const listeners = {};

export const Cart = {
  getItems() {
    return load();
  },

  addItem(product) {
    const items = load();
    const idx = items.findIndex(i => i.id === product.id);
    if (idx > -1) {
      items[idx].qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    save(items);
    this.emit('change');
  },

  removeItem(id) {
    const items = load().filter(i => i.id !== id);
    save(items);
    this.emit('change');
  },

  updateQty(id, delta) {
    const items = load();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    items[idx].qty = Math.max(1, items[idx].qty + delta);
    save(items);
    this.emit('change');
  },

  count() {
    return load().reduce((s, i) => s + i.qty, 0);
  },

  total() {
    return load().reduce((s, i) => s + i.price * i.qty, 0);
  },

  /* event bus */
  on(ev, fn) {
    (listeners[ev] = listeners[ev] || []).push(fn);
  },

  emit(ev) {
    (listeners[ev] || []).forEach(fn => fn());
  }
};
