document.addEventListener("DOMContentLoaded", () => {
  renderOrders();
});

function renderOrders() {
  const ordersContainer = document.getElementById("ordersList");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // التحقق من تسجيل الدخول
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // جلب طلبات المستخدم من localStorage
  const orders = JSON.parse(localStorage.getItem("myOrders")) || [];

  if (orders.length === 0) {
    // حالة عدم وجود طلبات سابقة (بيانات تجريبية إضافية للاختبار والتوضيح)
    ordersContainer.innerHTML = `
                    <div class="empty-orders">
                        <h3>No orders found</h3>
                        <p>You haven't placed any orders yet.</p>
                        <a href="index.html" class="btn-shop">Start Shopping</a>
                    </div>
                `;
    return;
  }

  ordersContainer.innerHTML = orders
    .map(
      (order) => `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <span class="order-id">Order #${order.id || Math.floor(100000 + Math.random() * 900000)}</span>
                            <div class="order-date">${order.date || new Date().toLocaleDateString()}</div>
                        </div>
                        <span class="order-status ${order.status === "Processing" ? "status-pending" : "status-completed"}">
                            ${order.status || "Delivered"}
                        </span>
                    </div>

                    <ul class="order-items-list">
                        ${(order.items || [])
                          .map(
                            (item) => `
                            <li class="order-item">
                                <div class="item-details">
                                    <span class="item-qty-badge">${item.qty || 1}x</span>
                                    <span>${item.title || "Tech Product"}</span>   
                               </div>                         
                       <span>$${((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
                            </li> `,
                          )
                          .join("")}
                    </ul>

                    <div class="order-footer">
                        <span class="total-label">Total Amount:</span>
                        <span class="total-amount">$${Number(order.totalAmount || 0).toFixed(2)}</span>
                    </div>
                </div>`,
    )
    .join("");
}
