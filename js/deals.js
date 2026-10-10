let allProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
  await fetchDeals();
});

// جلب المنتجات وتطبيق نسبة خصم عشوائية أو محددة
async function fetchDeals() {
  try {
    const response = await fetch("../data/products.json");
    if (!response.ok) throw new Error("تعذر جلب البيانات");

    allProducts = await response.json();

    // اختيار جزء من المنتجات لعرضها كعروض (أو استخدام جميع المنتجات بخصومات)
    const deals = allProducts.map((product, index) => {
      // إعطاء خصم 15% أو 25% بحسب ترتيب المنتج
      const discountRate = index % 2 === 0 ? 0.2 : 0.15;
      const originalPrice = Number(product.price);
      const discountedPrice = originalPrice * (1 - discountRate);

      return {
        ...product,
        originalPrice: originalPrice,
        discountedPrice: discountedPrice,
        discountPercent: Math.round(discountRate * 100),
      };
    });

    renderDeals(deals);
  } catch (error) {
    console.error("خطأ:", error);
    document.getElementById("dealsProductGrid").innerHTML =
      `<p class="no-products">Failed to load deals.</p>`;
  }
}

// عرض بطاقات العروض
function renderDeals(products) {
  const grid = document.getElementById("dealsProductGrid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<p class="no-products">No active deals found right now.</p>`;
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
                <div class="product-card">
                  <span class="deal-badge">-${product.discountPercent}% OFF</span>
                  <img src="${product.image}" alt="${product.title}" class="product-image">
                  <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    
                    <div class="deal-price-container">
                        <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                        <span class="product-price" style="margin: 0; color: #ef4444;">$${product.discountedPrice.toFixed(2)}</span>
                    </div>

                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, ${product.discountedPrice})">Add to Cart</button>
                  </div>
                </div>
              `,
    )
    .join("");
}

// إضافة للسلة بالسعر المخفض
function addToCart(productId, price) {
  let cart = JSON.parse(localStorage.getItem("mycart")) || [];
  const existingItem = cart.find(
    (item) => Number(item.id) === Number(productId),
  );

  if (existingItem) {
    existingItem.qty = (Number(existingItem.qty) || 1) + 1;
  } else {
    cart.push({ id: productId, qty: 1, price: price });
  }

  localStorage.setItem("mycart", JSON.stringify(cart));

  // تحديث عداد السلة في الهيدر فوراً
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}
