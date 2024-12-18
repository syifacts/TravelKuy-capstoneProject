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
          localStorage.setItem('userId', data.userId);  // Simpan userId
          localStorage.setItem('userName', data.username);
          localStorage.setItem('name', data.name); // Simpan name ke localStorage
          localStorage.setItem('lastActivity', Date.now());

          this.setupAutoLogout();

          setTimeout(() => {
            window.location.hash = '/';
          }, 2000);
        } else {
          this.showPopup('error', 'Login failed: error in username or password. Please try again.');
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

      // Timeout in 15 minutes (900000 ms)
      if (lastActivity && now - lastActivity > 900000) {
        this.logout();
      }
    }, 1000);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('lastActivity');

    window.location.hash = '/login';
  },

  showPopup(type, message) {
    const popupId = type === 'error' ? 'popup-error' : 'popup-success';
    const messageId = type === 'error' ? 'popup-message-error' : 'popup-message';
    
    document.getElementById(messageId).textContent = message;
    document.getElementById(popupId).style.display = 'block';
  },

  closePopup() {
    document.getElementById('popup-success').style.display = 'none';
    document.getElementById('popup-error').style.display = 'none';
  }
};

export default LoginPage;
