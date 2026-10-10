let products = [];
let chooseproducts = [];
let cartState = JSON.parse(localStorage.getItem("mycart")) || [];
async function fetchProducts() {
  try {
    const response = await fetch("../data/products.json");
    products = await response.json();
    getCartDetailedProducts();
    renderCart();
  } catch (error) {
    console.error("خطا في تحميل ملف البيانات");
  }
}
fetchProducts();
// Cart Reactive Engine
function getCartDetailedProducts() {
  chooseproducts = cartState
    .map((cartItem) => {
      const productInfo = products.find((product) => product.id == cartItem.id);
      if (productInfo) {
        return {
          ...productInfo,
          qty: cartItem.qty || 1,
          priceAfterdiscount: cartItem.price || productInfo.price,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
}

function renderCart() {
  const container = document.getElementById("cartItemList");
  container.innerHTML = "";
  if (cartState.length === 0) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-muted); padding: 2rem;">Your cart is empty.</p>`;
    calculateTotals();

    return;
  }
  chooseproducts.forEach((item, index) => {
    const itemEl = document.createElement("div");

    itemEl.className = "cart-item";

    itemEl.innerHTML = ` 
 
          <img src="${item.image}" alt="${item.title}" class="item-img"> 
 
          <div class="item-details"> 
 
            <h3>${item.title}</h3> 
 
            <p>${item.category}</p> 
 
            <p style="color: var(--primary-accent); margin-top: 0.25rem;">$${(Number(item.priceAfterdiscount) || 0).toFixed(2)}</p> 
 
          </div > 
 
          <div class="qty-controls"> 
 
            <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button> 
            <input type="text" class="qty-input" value="${item.qty}" readonly> 
            <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button> 
 
          </div> 
 
          <button class="remove-btn" onclick="removeItem(${index})" aria-label="Remove Item"> 
 
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" 
viewBox="0 0 24 24"> 
 
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 
4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/> 
 
            </svg> 
 
          </button> 
 
        `;

    container.appendChild(itemEl);
  });

  calculateTotals();
}

function updateQty(index, delta) {
  const newQty = cartState[index].qty + delta;

  if (newQty > 0) {
    cartState[index].qty = newQty;
    chooseproducts[index].qty = newQty;
    localStorage.setItem("mycart", JSON.stringify(cartState));
    renderCart();
    if (typeof updateCartCount === "function") {
      updateCartCount();
    }
  }
}

function removeItem(index) {
  cartState.splice(index, 1);
  chooseproducts.splice(index, 1);
  localStorage.setItem("mycart", JSON.stringify(cartState));

  renderCart();

  // document.getElementById("cart-count").innerText = cartState.length || "0";
  // تحديث العداد في الهيدر فوراً
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}

function calculateTotals() {
  const subtotal = chooseproducts.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const tax = subtotal * 0.08;

  const total = subtotal + tax;

  document.getElementById("subtotal-val").textContent = `$${subtotal.toFixed(
    2,
  )}`;

  document.getElementById("tax-val").textContent = `$${tax.toFixed(2)}`;

  document.getElementById("total-val").textContent = `$${total.toFixed(2)}`;
}

// Initialize View

renderCart();
