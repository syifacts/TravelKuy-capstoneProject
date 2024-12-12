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
    `;
  },

  async afterRender() {
    const token = localStorage.getItem('token');

    if (token) {
      // Jika pengguna sudah login, arahkan langsung ke halaman home
      window.location.hash = '/';
      return;
    }

    // Event listener untuk form login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username')?.value;
      const password = document.getElementById('login-password')?.value;

      if (!username || !password) {
        alert('Harap isi semua kolom!');
        return;
      }

      try {
        const response = await fetch('https://datausertravelkuy-448b9311f98b.herokuapp.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json(); // Parse respons

        if (response.ok && data.accessToken) {
          // Validasi bahwa `accessToken` ada
          alert(`Login sukses! Selamat datang, ${data.username}`);
          localStorage.setItem('token', data.accessToken); // Simpan token
          localStorage.setItem('refreshToken', data.refreshToken); // Simpan refresh token
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('userName', data.username); // Simpan nama pengguna
          window.location.hash = '/'; // Redirect ke halaman utama setelah login
        } else {
          alert(`Login gagal: ${data.message || 'Periksa username dan password Anda.'}`);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat login. Coba lagi nanti.');
        console.error('Login error:', error);
      }
    });
  },
};

export default LoginPage;
