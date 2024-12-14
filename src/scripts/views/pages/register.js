const RegisterPage = {
  async render() {
    return `
      <div class="register-page">
        <h1>Register</h1>
        <form id="register-form">
          <input type="text" id="register-name" placeholder="Name" required>
          <input type="text" id="register-username" placeholder="Username" required>
          <input type="password" id="register-password" placeholder="Password" required>
          <button type="submit">Register</button>
        </form>
        <p>Sudah punya akun? <a href="#/login">Login</a></p>
      </div>

      <!-- Popup Success -->
      <div class="popup popup-registration-success" id="popup-registration-success" style="display:none;">
        <p id="popup-message-success"></p>
        <button id="close-registration-success-popup">Tutup</button>
      </div>

      <!-- Popup Error -->
      <div class="popup popup-registration-error" id="popup-registration-error" style="display:none;">
        <p id="popup-message-error"></p>
        <button id="close-registration-error-popup">Tutup</button>
      </div>
    `;
  },

  async afterRender() {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;

      // Kirim data ke server Hapi
      const response = await fetch('https://datausertravelkuy-448b9311f98b.herokuapp.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      });

      if (response.ok) {
        this.showPopup('success', 'Registration successful! Please login.');
        setTimeout(() => {
          window.location.hash = '/login'; // Redirect ke halaman login setelah 3 detik
        }, 3000);
      } else {
        this.showPopup('error', 'Registration failed, please try again with another new username.');
      }
    });

    // Event listener untuk menutup popup saat tombol "Tutup" diklik
    document.getElementById('close-registration-success-popup')?.addEventListener('click', this.closePopup);
    document.getElementById('close-registration-error-popup')?.addEventListener('click', this.closePopup);
  },

  showPopup(type, message) {
    const popup = type === 'success' ? document.getElementById('popup-registration-success') : document.getElementById('popup-registration-error');
    const popupMessage = type === 'success' ? document.getElementById('popup-message-success') : document.getElementById('popup-message-error');
    
    popupMessage.textContent = message;
    popup.style.display = 'block'; // Show the popup
  },

  closePopup() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
  },
};

export default RegisterPage;
