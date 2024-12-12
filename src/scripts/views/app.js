import DrawerInitiator from "../utils/drawer-initiator";
import UrlParser from "../routes/url-parser";
import routes from "../routes/routes";

class App {
  constructor({ button, drawer, content }) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;

    this._initialAppShell();
  }

  async _initialAppShell() {
    DrawerInitiator.init({
      button: this._button,
      drawer: this._drawer,
      content: this._content,
    });

    this._updateNavigation(); // Memperbarui navigasi saat inisialisasi
    await this.renderPage(); // Render halaman awal

    // Menambahkan event listener untuk tombol logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => this.handleLogout());
    }
  }

  _updateNavigation() {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const accountInfo = document.getElementById('account-info');
    const loginLink = document.getElementById('login-link');
    const agrowisataLink = document.getElementById('agrowisata-link');
    const desaWisataLink = document.getElementById('desaWisata-link');
    const aboutUsLink = document.getElementById('aboutUs-link');

    if (token && userName && this.isTokenValid(token)) { // Cek token dan userName
      accountInfo.style.display = 'block';
      loginLink.style.display = 'none';
      agrowisataLink.style.display = 'block';
      desaWisataLink.style.display = 'block';
      aboutUsLink.style.display = 'block';
      document.getElementById('user-name').innerText = userName;
    } else {
      accountInfo.style.display = 'none';
      loginLink.style.display = 'block';
      agrowisataLink.style.display = 'none';
      desaWisataLink.style.display = 'none';
      aboutUsLink.style.display = 'none';
    }
  }

  // Fungsi untuk memeriksa validitas token
  isTokenValid(token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      const expiryTime = decodedToken.exp * 1000; // Konversi dari detik ke milidetik
      const currentTime = new Date().getTime();

      return currentTime < expiryTime; // Token masih berlaku jika waktu sekarang kurang dari waktu kedaluwarsa
    } catch (error) {
      return false;
    }
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner(); // Dapatkan URL aktif
    let page = routes[url]; // Ambil halaman yang sesuai dengan URL

    // Memeriksa status login dengan token dan userName
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const restrictedPages = ['/agrowisata', '/desawisata', '/aboutus'];

    // Jika pengguna mencoba mengakses halaman yang dilindungi dan belum login atau token tidak valid
    if (restrictedPages.includes(url) && (!token || !userName || !this.isTokenValid(token))) {
      this._content.innerHTML = ` 
        <div id="login-restricted-message">
          <div>
            <h2>Anda harus login untuk mengakses halaman ini.</h2>
            <a href="#/login">Login</a>
          </div>
        </div>`;
      return;
    }

    // Jika sudah login, render halaman yang diakses
    if (page && typeof page.render === "function") {
      this._content.innerHTML = await page.render(); // Render halaman
      await page.afterRender(); // Jalankan afterRender pada halaman yang dirender
    } else {
      // Tangani kasus jika halaman tidak ditemukan
      this._content.innerHTML = `<h2>Halaman tidak ditemukan</h2>`;
    }

    // Perbarui navigasi setelah halaman dirender
    this._updateNavigation();
  }

  async handleLoginSuccess(userName, token) {
    // Setelah login berhasil, simpan token dan username yang diberikan
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);

    // Perbarui tampilan navigasi setelah login
    this._updateNavigation();

    // Render ulang halaman yang dilindungi atau halaman awal jika diperlukan
    await this.renderPage(); // Render ulang halaman setelah login tanpa perlu refresh

    // Gunakan setTimeout untuk memberi jeda waktu agar rendering selesai
    requestAnimationFrame(() => {
      history.pushState({}, '', window.location.href); // Halaman akan di-refresh setelah login
    });
  }

  handleLogout() {
    // Menghapus token dan username dari localStorage saat logout
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    this._updateNavigation(); // Perbarui tampilan navigasi setelah logout

    // Arahkan pengguna kembali ke halaman home
    window.location.href = '/'; // Ini akan mengarahkan pengguna ke halaman home
  }
}

export default App;
