const state = {
  selectedCategory: "Semua",
  searchQuery: "",
  activeDetailProductId: null,
  activeDetailVariantId: null,
  cart: JSON.parse(localStorage.getItem("katalog_cart_v2") || "{}"),
};

const el = {
  storeName: document.getElementById("store-name"),
  heroTitle: document.getElementById("hero-title"),
  storeTagline: document.getElementById("store-tagline"),
  searchInput: document.getElementById("search-input"),
  categoryFilters: document.getElementById("category-filters"),
  productGrid: document.getElementById("product-grid"),
  emptyState: document.getElementById("empty-state"),
  detailModal: document.getElementById("detail-modal"),
  detailImage: document.getElementById("detail-image"),
  detailCategory: document.getElementById("detail-category"),
  detailName: document.getElementById("detail-name"),
  detailUnit: document.getElementById("detail-unit"),
  detailDescription: document.getElementById("detail-description"),
  detailVariants: document.getElementById("detail-variants"),
  detailStock: document.getElementById("detail-stock"),
  detailPrice: document.getElementById("detail-price"),
  detailAddBtn: document.getElementById("detail-add-btn"),
  closeDetailBtn: document.getElementById("close-detail-btn"),
  closeDetailDesktopBtn: document.getElementById("close-detail-desktop-btn"),
  cartBadge: document.getElementById("cart-badge"),
  openCartBtn: document.getElementById("open-cart-btn"),
  closeCartBtn: document.getElementById("close-cart-btn"),
  cartBackdrop: document.getElementById("cart-backdrop"),
  cartDrawer: document.getElementById("cart-drawer"),
  cartItemsContainer: document.getElementById("cart-items-container"),
  cartTotal: document.getElementById("cart-total"),
  buyerName: document.getElementById("buyer-name"),
  buyerNote: document.getElementById("buyer-note"),
  copyOrderBtn: document.getElementById("copy-order-btn"),
  waOrderBtn: document.getElementById("wa-order-btn"),
  toast: document.getElementById("toast"),
};

function formatRupiah(amount) {
  return "Rp " + Number(amount || 0).toLocaleString("id-ID");
}

function saveCart() {
  localStorage.setItem("katalog_cart_v2", JSON.stringify(state.cart));
}

function getCartKey(productId, variantId) {
  return `${productId}__${variantId}`;
}

function getProductAndVariant(productId, variantId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return { product: null, variant: null };
  const variant =
    product.variants.find((v) => v.id === variantId) || product.variants[0] || null;
  return { product, variant };
}

function getPriceRangeText(product) {
  const prices = product.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatRupiah(min) : `${formatRupiah(min)} - ${formatRupiah(max)}`;
}

function getTotalStock(product) {
  return product.variants.reduce((acc, v) => acc + Number(v.stock || 0), 0);
}

let toastTimer = null;
function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.toast.classList.add("hidden");
  }, 2000);
}

function initStoreInfo() {
  if (typeof STORE_INFO !== "undefined") {
    el.storeName.textContent = STORE_INFO.name;
    el.heroTitle.textContent = STORE_INFO.name;
    el.storeTagline.textContent = STORE_INFO.tagline;
    document.title = STORE_INFO.name;
  }
}

function renderCategories() {
  const categories = ["Semua", ...new Set(PRODUCTS.map((p) => p.category))];
  el.categoryFilters.innerHTML = categories
    .map((cat) => {
      const active = state.selectedCategory === cat;
      const cls = active
        ? "bg-slate-900 text-white border-slate-900"
        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400";
      return `
        <button
          type="button"
          data-category="${cat}"
          class="category-btn shrink-0 text-xs sm:text-sm font-medium px-4 py-2 rounded-full border transition ${cls}"
        >
          ${cat}
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedCategory = btn.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const query = state.searchQuery.trim().toLowerCase();
  const filtered = PRODUCTS.filter((product) => {
    const matchCategory =
      state.selectedCategory === "Semua" || product.category === state.selectedCategory;
    const matchVariant = product.variants.some((v) => v.label.toLowerCase().includes(query));
    const matchQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      matchVariant;
    return matchCategory && matchQuery;
  });

  if (filtered.length === 0) {
    el.productGrid.innerHTML = "";
    el.emptyState.classList.remove("hidden");
    return;
  }

  el.emptyState.classList.add("hidden");
  el.productGrid.innerHTML = filtered
    .map((item) => {
      const firstVariant = item.variants[0];
      const totalStock = getTotalStock(item);
      const isOut = totalStock <= 0;
      const variantPills = item.variants
        .map(
          (v) =>
            `<span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">${v.label}</span>`
        )
        .join("");

      return `
        <article class="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition">
          <div>
            <button
              type="button"
              data-open-detail="${item.id}"
              class="block w-full text-left aspect-[4/3] bg-slate-100 overflow-hidden relative group"
            >
              <img
                src="${item.image}"
                alt="${item.name}"
                class="w-full h-full object-cover group-hover:scale-[1.02] transition duration-200"
                loading="lazy"
              />
              <span class="absolute top-3 left-3 bg-white/95 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                ${item.category}
              </span>
            </button>

            <div class="p-4">
              <button
                type="button"
                data-open-detail="${item.id}"
                class="text-left text-base font-bold text-slate-900 hover:underline leading-snug"
              >
                ${item.name}
              </button>
              <p class="text-xs text-slate-500 mt-0.5">${item.unit} • Total Stok ${totalStock}</p>
              <div class="flex flex-wrap gap-1.5 mt-2.5">${variantPills}</div>
              <p class="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                ${item.description}
              </p>
            </div>
          </div>

          <div class="px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            <div>
              <span class="block text-[11px] text-slate-400">Harga</span>
              <span class="text-sm font-bold text-slate-900">${getPriceRangeText(item)}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button
                type="button"
                data-open-detail="${item.id}"
                class="text-xs font-semibold px-2.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                Varian
              </button>
              <button
                type="button"
                data-quick-add="${item.id}"
                data-variant-id="${firstVariant ? firstVariant.id : ""}"
                ${isOut ? "disabled" : ""}
                class="text-xs font-semibold px-3 py-2 rounded-xl transition ${
                  isOut
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }"
              >
                ${isOut ? "Habis" : "+ Keranjang"}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("[data-open-detail]").forEach((btn) => {
    btn.addEventListener("click", () => openDetailModal(btn.dataset.openDetail));
  });

  document.querySelectorAll("[data-quick-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      modifyCartItem(btn.dataset.quickAdd, btn.dataset.variantId, 1);
    });
  });
}

function openDetailModal(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const availableVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];
  state.activeDetailProductId = product.id;
  state.activeDetailVariantId = availableVariant ? availableVariant.id : null;

  el.detailImage.src = product.image;
  el.detailImage.alt = product.name;
  el.detailCategory.textContent = product.category;
  el.detailName.textContent = product.name;
  el.detailUnit.textContent = `Satuan: ${product.unit}`;
  el.detailDescription.textContent = product.description;

  renderDetailVariants(product);
  el.detailModal.classList.add("is-open");
  el.detailModal.classList.remove("hidden");
}

function renderDetailVariants(product) {
  el.detailVariants.innerHTML = product.variants
    .map((v) => {
      const selected = v.id === state.activeDetailVariantId;
      const disabled = v.stock <= 0;
      let cls = "border-slate-200 bg-white text-slate-700 hover:border-slate-400";
      if (disabled) {
        cls = "border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed";
      } else if (selected) {
        cls = "border-slate-900 bg-slate-900 text-white";
      }
      return `
        <button
          type="button"
          data-variant-choice="${v.id}"
          ${disabled ? "disabled" : ""}
          class="text-xs font-semibold px-3 py-2 rounded-xl border transition ${cls}"
        >
          ${v.label} • ${formatRupiah(v.price)}
        </button>
      `;
    })
    .join("");

  const activeVariant =
    product.variants.find((v) => v.id === state.activeDetailVariantId) || product.variants[0];

  if (activeVariant) {
    el.detailPrice.textContent = formatRupiah(activeVariant.price);
    el.detailStock.textContent =
      activeVariant.stock > 0 ? `Stok varian: ${activeVariant.stock}` : "Varian ini habis";
    el.detailAddBtn.disabled = activeVariant.stock <= 0;
    el.detailAddBtn.className =
      activeVariant.stock <= 0
        ? "bg-slate-200 text-slate-400 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl cursor-not-allowed"
        : "bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition";
  }

  document.querySelectorAll("[data-variant-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeDetailVariantId = btn.dataset.variantChoice;
      renderDetailVariants(product);
    });
  });
}

function closeDetailModal() {
  el.detailModal.classList.remove("is-open");
  el.detailModal.classList.add("hidden");
  state.activeDetailProductId = null;
  state.activeDetailVariantId = null;
}

el.detailAddBtn.addEventListener("click", () => {
  if (!state.activeDetailProductId || !state.activeDetailVariantId) return;
  modifyCartItem(state.activeDetailProductId, state.activeDetailVariantId, 1);
  closeDetailModal();
});

el.closeDetailBtn.addEventListener("click", closeDetailModal);
el.closeDetailDesktopBtn.addEventListener("click", closeDetailModal);
el.detailModal.addEventListener("click", (e) => {
  if (e.target === el.detailModal) closeDetailModal();
});

function modifyCartItem(productId, variantId, delta) {
  const { product, variant } = getProductAndVariant(productId, variantId);
  if (!product || !variant) return;

  const key = getCartKey(product.id, variant.id);
  const currentQty = state.cart[key] || 0;
  const nextQty = currentQty + delta;

  if (nextQty <= 0) {
    delete state.cart[key];
  } else if (nextQty > variant.stock) {
    state.cart[key] = variant.stock;
    showToast(`Stok ${product.name} (${variant.label}) maksimal ${variant.stock}`);
  } else {
    state.cart[key] = nextQty;
    if (delta > 0) {
      showToast(`${product.name} - ${variant.label} masuk keranjang`);
    }
  }

  saveCart();
  updateCartUI();
  renderProducts();
}

function getCartDetails() {
  const items = [];
  let totalQty = 0;
  let totalPrice = 0;

  for (const [key, qty] of Object.entries(state.cart)) {
    if (qty <= 0) continue;
    const [productId, variantId] = key.split("__");
    const { product, variant } = getProductAndVariant(productId, variantId);
    if (!product || !variant) continue;

    const subtotal = variant.price * qty;
    totalQty += qty;
    totalPrice += subtotal;
    items.push({ key, product, variant, qty, subtotal });
  }

  return { items, totalQty, totalPrice };
}

function updateCartUI() {
  const { items, totalQty, totalPrice } = getCartDetails();
  el.cartBadge.textContent = totalQty;
  el.cartTotal.textContent = formatRupiah(totalPrice);

  if (items.length === 0) {
    el.cartItemsContainer.innerHTML = `
      <div class="text-center py-12 text-slate-500">
        <p class="text-sm font-medium text-slate-700">Keranjang masih kosong</p>
        <p class="text-xs mt-1">Pilih produk atau varian di katalog untuk mulai memesan.</p>
      </div>
    `;
    return;
  }

  el.cartItemsContainer.innerHTML = items
    .map(
      ({ product, variant, qty, subtotal }) => `
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-semibold text-slate-900 truncate">${product.name}</p>
          <p class="text-xs text-slate-600 truncate">${variant.label}</p>
          <p class="text-[11px] text-slate-500 mt-0.5">${formatRupiah(variant.price)} x ${qty}</p>
          <p class="text-xs font-bold text-slate-800 mt-0.5">${formatRupiah(subtotal)}</p>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            data-product-id="${product.id}"
            data-variant-id="${variant.id}"
            data-delta="-1"
            class="qty-btn w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100"
          >-</button>
          <span class="w-6 text-center text-xs font-bold">${qty}</span>
          <button
            type="button"
            data-product-id="${product.id}"
            data-variant-id="${variant.id}"
            data-delta="1"
            class="qty-btn w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100"
          >+</button>
        </div>
      </div>
    `
    )
    .join("");

  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      modifyCartItem(btn.dataset.productId, btn.dataset.variantId, Number(btn.dataset.delta));
    });
  });
}

function buildOrderMessage() {
  const { items, totalPrice } = getCartDetails();
  if (items.length === 0) return "";

  const name = el.buyerName.value.trim() || "-";
  const note = el.buyerNote.value.trim() || "-";

  const itemLines = items.map(
    ({ product, variant, qty, subtotal }, idx) =>
      `${idx + 1}. ${product.name} [${variant.label}] (${qty}x) - ${formatRupiah(subtotal)}`
  );

  return [
    `Halo, saya ingin memesan dari *${STORE_INFO.name}*:`,
    "",
    ...itemLines,
    "",
    `*Total: ${formatRupiah(totalPrice)}*`,
    `Nama: ${name}`,
    `Catatan: ${note}`,
  ].join("\n");
}

function openCart() {
  el.cartBackdrop.classList.add("is-open");
  el.cartBackdrop.classList.remove("hidden");
  el.cartDrawer.classList.add("is-open");
}

function closeCart() {
  el.cartBackdrop.classList.remove("is-open");
  el.cartBackdrop.classList.add("hidden");
  el.cartDrawer.classList.remove("is-open");
}

el.openCartBtn.addEventListener("click", openCart);
el.closeCartBtn.addEventListener("click", closeCart);
el.cartBackdrop.addEventListener("click", closeCart);

el.searchInput.addEventListener("input", (e) => {
  state.searchQuery = e.target.value;
  renderProducts();
});

el.copyOrderBtn.addEventListener("click", async () => {
  const msg = buildOrderMessage();
  if (!msg) {
    showToast("Keranjang masih kosong");
    return;
  }
  await navigator.clipboard.writeText(msg);
  showToast("Format pesanan disalin");
});

el.waOrderBtn.addEventListener("click", () => {
  const msg = buildOrderMessage();
  if (!msg) {
    showToast("Keranjang masih kosong");
    return;
  }
  const phone = STORE_INFO.whatsappNumber || "";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});

initStoreInfo();
renderCategories();
renderProducts();
updateCartUI();