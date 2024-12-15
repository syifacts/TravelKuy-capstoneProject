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
      window.location.hash = '/';
      return;
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

          // Menambahkan delay sebelum redirect ke halaman home
          setTimeout(() => {
            window.location.hash = '/';
          }, 2000); // 2000 ms = 2 detik
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

    // Event listener untuk menutup popup saat tombol "Tutup" diklik
    document.getElementById('close-success-popup')?.addEventListener('click', this.closePopup);
    document.getElementById('close-error-popup')?.addEventListener('click', this.closePopup);

    // Event listener untuk logout otomatis saat halaman tidak aktif
    document.addEventListener('visibilitychange', this.autoLogout);
  },

  showPopup(type, message) {
    const popup = type === 'success' ? document.getElementById('popup-success') : document.getElementById('popup-error');
    const popupMessage = type === 'success' ? document.getElementById('popup-message') : document.getElementById('popup-message-error');
    
    popupMessage.textContent = message;
    popup.style.display = 'block'; // Show the popup
  },

  closePopup() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
  },

  autoLogout() {
    // Jika halaman menjadi tidak terlihat (background/tab berpindah), lakukan logout
    if (document.visibilityState === 'hidden') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      console.log('User otomatis logout karena meninggalkan halaman.');
    }
  },
};

export default LoginPage;
