document.addEventListener('DOMContentLoaded', () => {
    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
  
    showLogin.onclick = () => {
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
      showLogin.classList.add('active');
      showRegister.classList.remove('active');
    };
  
    showRegister.onclick = () => {
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
      showRegister.classList.add('active');
      showLogin.classList.remove('active');
    };
  
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const username = loginForm.querySelector('input[type="text"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;
  
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
  
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          alert('Đăng nhập thành công');
          window.location.href = 'home.html'; // chuyển trang
        } else {
          alert(data.message || 'Đăng nhập thất bại');
        }
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi đăng nhập');
      }
    };
  
    registerForm.onsubmit = async (e) => {
      e.preventDefault();
      const inputs = registerForm.querySelectorAll('input');
      const username = inputs[0].value;
      const email = inputs[1].value;
      const password = inputs[2].value;
  
      try {
        const res = await fetch('/api/admin/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
  
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          alert('Tạo tài khoản thành công');
        } else {
          alert(data.message || 'Đăng ký thất bại');
        }
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi đăng ký');
      }
    };
  });
  