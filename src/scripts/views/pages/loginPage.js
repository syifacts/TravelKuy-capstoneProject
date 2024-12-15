const LoginPage = {
  async render() {
    return `
      <div class="login-page">
        <div class="login-container">
          <h1 class="login-title">Login</h1>
          <form id="login-form" class="login-form">
            <input type="text" id="login-username" class="input-field" placeholder="Username" required>
            <input type="password" id="login-password" class="input-field" placeholder="Password" required>
            <button type="submit" class="login-button">Login</button>
          </form>
          <p class="register-link">Belum punya akun? <a href="#/register">Register</a></p>
        </div>

        <!-- Popup Success -->
        <div class="popup popup-success" id="popup-success" style="display:none;">
          <p id="popup-message"></p>
          <button id="close-success-popup" class="popup-button">Tutup</button>
        </div>

        <!-- Popup Error -->
        <div class="popup popup-error" id="popup-error" style="display:none;">
          <p id="popup-message-error"></p>
          <button id="close-error-popup" class="popup-button">Tutup</button>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Event listener for login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username')?.value;
      const password = document.getElementById('login-password')?.value;

      if (!username || !password) {
        this.showPopup('error', 'Harap isi semua kolom!');
        return;
      }

      try {
        const response = await fetch('https://datausertravelkuy-448b9311f98b.herokuapp.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.accessToken) {
          this.showPopup('success', `Login sukses! Selamat datang, ${data.username}`);
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('userName', data.username);
          localStorage.setItem('lastActivity', Date.now());

          this.setupAutoLogout();

          setTimeout(() => {
            window.location.hash = '/';
          }, 2000);
        } else {
          this.showPopup('error', 'Login gagal: periksa username dan password.');
        }
      } catch (error) {
        this.showPopup('error', 'Terjadi kesalahan saat login. Coba lagi nanti.');
        console.error('Login error:', error);
      }
    });

    document.getElementById('close-success-popup')?.addEventListener('click', this.closePopup);
    document.getElementById('close-error-popup')?.addEventListener('click', this.closePopup);

    this.setupAutoLogout();
  },

  setupAutoLogout() {
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now());
    };

    ['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      const now = Date.now();
      if (lastActivity && now - lastActivity > 5 * 60 * 1000) {
        this.logoutUser();
      }
    }, 1000);
  },

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('lastActivity');

    this.showPopup('error', 'Sesi berakhir. Harap login kembali.');
    setTimeout(() => {
      window.location.hash = '/login';
      window.location.reload();
    }, 2000);
  },

  showPopup(type, message) {
    const popup = type === 'success' ? document.getElementById('popup-success') : document.getElementById('popup-error');
    const popupMessage = type === 'success' ? document.getElementById('popup-message') : document.getElementById('popup-message-error');
    
    popupMessage.textContent = message;
    popup.style.display = 'block';
  },

  closePopup() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
  },
};

export default LoginPage;
