let allProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
  await fetchProducts();
});

// جلب المنتجات من ملف JSON
async function fetchProducts() {
  try {
    const response = await fetch("../data/products.json");
    if (!response.ok) throw new Error("تعذر جلب البيانات");

    allProducts = await response.json();
    renderProducts(allProducts);
  } catch (error) {
    console.error("خطأ:", error);
    document.getElementById("categoryProductGrid").innerHTML =
      `<p class="no-products">Failed to load products.</p>`;
  }
}

// عرض المنتجات في الشبكة
function renderProducts(products) {
  const grid = document.getElementById("categoryProductGrid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<p class="no-products">No products found in this category.</p>`;
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

// التصفية بحسب القسم
function filterCategory(category, element) {
  // تحديث الزر النشط في القائمة الجانبية
  const buttons = document.querySelectorAll(".category-item-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  if (element) element.classList.add("active");

  if (category === "all") {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
    renderProducts(filtered);
  }
}

// إضافة للسلة
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

  // تحديث عداد السلة في الهيدر مباشرة
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}
