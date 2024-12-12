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
        alert('Register sukses! Silakan login.');
        window.location.hash = '/login'; // Redirect ke halaman login
      } else {
        alert('Register gagal, coba lagi.');
      }
    });
  },
};

export default RegisterPage;
