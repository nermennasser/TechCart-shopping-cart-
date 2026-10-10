let allProducts = [];

// جلب وعرض المنتجات عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", async () => {
  await fetchProducts();
  setupSearch();
});

async function fetchProducts() {
  try {
    const response = await fetch("../data/products.json"); // أو مسار json الخاص بك
    if (!response.ok) throw new Error("تعذر جلب المنتجات");

    allProducts = await response.json();
    renderProducts(allProducts);
  } catch (error) {
    console.error("خطأ في جلب بيانات المنتجات:", error);
  }
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<p class="no-products">No products found.</p>`;
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.title}" class="product-image">
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">$${Number(product.price).toFixed(2)}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `,
    )
    .join("");
}

function filterCategory(category) {
  // تحديث الزر النشط
  const buttons = document.querySelectorAll(".pill-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  if (category === "all") {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
    renderProducts(filtered);
  }
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = allProducts.filter((p) =>
      p.title.toLowerCase().includes(term),
    );
    renderProducts(filtered);
  });
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("mycart")) || [];
  const existingItem = cart.find(
    (item) => Number(item.id) === Number(productId),
  );

  if (existingItem) {
    existingItem.qty = (Number(existingItem.qty) || 1) + 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  localStorage.setItem("mycart", JSON.stringify(cart));

  // تحديث العداد في الهيدر فوراً
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}
