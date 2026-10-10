//   Password Toggle Interaction  
  const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.style.color = type === 'text' ? 'var(--primary-accent)' : 'var(--text-muted)';
        });   
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // منع إعادة تحميل الصفحة الافتراضي

  // 1. جلب القيم المكتوبة في حقول الإدخال
  const emailInput = document.getElementById('email').value.trim();
  const passwordInput = document.getElementById('password').value.trim();

  // 2. جلب بيانات المستخدم المسجلة سابقاً من الـ LocalStorage
  const savedUser = JSON.parse(localStorage.getItem('currentUser'));

  // 3. التحقق من وجود حساب مطاطق أو السماح بالدخول
  if (savedUser && savedUser.email === emailInput && savedUser.password === passwordInput) {
    // تعيين حالة الدخول كـ loggedIn
    localStorage.setItem('isLoggedIn', 'true');
    
    // التوجيه المباشر للصفحة الرئيسية
    window.location.href = 'index.html';
  } else if (!savedUser) {
    // في حال عدم وجود حساب مسجل، يتم حفظ جلسة سريعة للتجربة وتوجيهه فوراً
    const tempUser = {
      name: emailInput.split('@')[0] || 'User',
      email: emailInput
    };
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    window.location.href = 'index.html';
  } else {
    alert('البريد الإلكتروني أو كلمة السر غير صحيحة!');
  }
});