const LoginPage = {
  async render() {
    return `
      <div class="login-page">
        <h1>Login</h1>
        <form id="login-form">
          <input type="text" id="login-username" placeholder="Username" required>
          <input type="password" id="login-password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <p>Belum punya akun? <a href="#/register">Register</a></p>
      </div>
      
      <!-- Popup Success -->
      <div class="popup popup-success" id="popup-success" style="display:none;">
        <p id="popup-message"></p>
        <button id="close-success-popup">Tutup</button>
      </div>

      <!-- Popup Error -->
      <div class="popup popup-error" id="popup-error" style="display:none;">
        <p id="popup-message-error"></p>
        <button id="close-error-popup">Tutup</button>
      </div>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem('token');

    if (token) {
      this.setupAutoLogout();
    }

    // Event listener untuk form login
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
          this.showPopup('error', `Login failed: error in username or password. Please try again.`);
        }
      } catch (error) {
        this.showPopup('error', 'Terjadi kesalahan saat login. Coba lagi nanti.');
        console.error('Login error:', error);
      }
    });

    // Attach global functions for popup close
    window.closePopup = this.closePopup;

    document.getElementById('close-success-popup')?.addEventListener('click', this.closePopup);
    document.getElementById('close-error-popup')?.addEventListener('click', this.closePopup);

    // Setup event listeners for session tracking
    this.setupAutoLogout();
  },

  setupAutoLogout() {
    // Update last activity timestamp
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now());
    };

    // Event listeners to track activity
    ['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // Check session timeout every second
    setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      const now = Date.now();

      // Jika lebih dari 5 menit (300,000 ms)
      if (lastActivity && now - lastActivity > 5 * 60 * 1000) {
        this.logoutUser();
      }
    }, 1000);
  },

  logoutUser() {
    // Hapus data session
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
