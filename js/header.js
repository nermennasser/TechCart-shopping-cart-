async function loadHeader() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) return;

  try {
    const response = await fetch("header.html?v=" + new Date().getTime());
    if (!response.ok) throw new Error("تعذر جلب header.html");

    const htmlData = await response.text();
    headerContainer.innerHTML = htmlData;

    // 1. فحص وتسجيل حالة الدخول
    renderUserSection();
    // 2. تفعيل الميزات الأخرى
    setupActiveLink();
    updateCartCount();
  } catch (error) {
    console.error("خطأ في تحميل الهيدر:", error);
  }
}

// دالة فحص حالة المستخدم من localStorage
function renderUserSection() {
  const userSection = document.getElementById("userSection");
  if (!userSection) return;

  // جلب بيانات المستخدم المكتوبة عند الـ Login
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log(currentUser);

  if (currentUser && currentUser.name) {
    console.log("ok");
    // حالة: تسجل الدخول
    userSection.innerHTML = `
      <div class="profile-dropdown-container">
        <button class="profile-trigger" id="profileBtn">
          <img src="${currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}" alt="Profile" class="profile-avatar">
          <span class="user-name">${currentUser.name}</span>
        </button>

        <div class="dropdown-menu" id="profileDropdown">
          <a href="profile.html" class="dropdown-item">My Account</a>
          <a href="orders.html" class="dropdown-item">Orders</a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item logout-btn" id="logoutBtn">Logout</button>
        </div>
      </div>
    `;

    setupUserDropdown();
  } else {
    // حالة: زائر غير مسجل
    userSection.innerHTML = `
      <a href="login.html" class="login-btn">Login</a>
    `;
  }
}

// التحكم في القائمة المنسدلة وتسجيل الخروج
function setupUserDropdown() {
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("show");
    });

    profileDropdown.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", () => {
      profileDropdown.classList.remove("show");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload(); // إعادة التحميل للعودة لحالة الزائر
    });
  }
}

// تحديد الرابط النشط
function setupActiveLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkPage = link.getAttribute("href")?.split("/").pop();
    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

// تحديث عداد السلة
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;
  const cart = JSON.parse(localStorage.getItem("mycart")) || [];
  cartCount.innerText = cart.reduce(
    (sum, item) => sum + (Number(item.qty) || 1),
    0,
  );
}

document.addEventListener("DOMContentLoaded", loadHeader);
