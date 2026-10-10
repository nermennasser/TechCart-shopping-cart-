  // Dynamic Inline Validation Engine 
        const regPassword = document.getElementById('regPassword');
        const lengthHint = document.getElementById('lengthHint');
        const numberHint = document.getElementById('numberHint');
        regPassword.addEventListener('input', () => {
            const val = regPassword.value;
            if (val.length >= 8) { lengthHint.classList.add('valid'); }
            else { lengthHint.classList.remove('valid'); }

            if (/\d/.test(val)) { numberHint.classList.add('valid'); }
            else { numberHint.classList.remove('valid'); }
        });  
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault(); // منع إعادة تحميل الصفحة

  // 1. تجميع البيانات من الحقول
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  // 2. إنشاء كائن المستخدم
  const userData = {
    name: `${firstName} ${lastName}`,
    email: email,
    password: password
  };

  // 3. حفظ البيانات في الـ LocalStorage الخاصة بالمتصفح
  localStorage.setItem('currentUser', JSON.stringify(userData));

  // 4. التوجيه المباشر للصفحة الرئيسية (index.html) أو صفحة الدخول (login.html)
  window.location.href = 'Login.html'; 
});

