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
    this._initDrawer();
    this._updateNavigation(); 
    await this.renderPage();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => this.handleLogout());
    }
  }

  _initDrawer() {
    DrawerInitiator.init({
      button: this._button,
      drawer: this._drawer,
      content: this._content,
    });
  }

  _updateNavigation() {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const navigationDrawer = document.querySelector('#navigationDrawer');

    // Perbarui navigasi berdasarkan status login
    if (token && userName && this.isTokenValid(token)) {
      navigationDrawer.innerHTML = `
        <ul>
          <li><a href="#/home">Home</a></li>
          <li><a href="#/agrowisata" id="agrowisata-link">Agrowisata</a></li>
          <li><a href="#/desawisata" id="desaWisata-link">Desa Wisata</a></li>
          <li><a href="#/aboutus" id="aboutUs-link">About Us</a></li>
          <li id="username-display" style="font-weight: bold;">${userName}</li>
          <li><a href="#" id="logout-button">Logout</a></li>
        </ul>
      `;
    } else {
      navigationDrawer.innerHTML = `
        <ul>
          <li><a href="#/home">Home</a></li>
          <li><a href="#/login" id="login-link">Login</a></li>
        </ul>
      `;
    }

    // Re-inisialisasi DrawerInitiator
    const hamburgerButton = document.querySelector('#hamburgerButton');
    this._initDrawer();

    // Tambahkan event listener logout jika tombol logout ada
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => this.handleLogout());
    }
}


  // Fungsi validasi token
  isTokenValid(token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = decodedToken.exp * 1000;
      return new Date().getTime() < expiryTime;
    } catch (error) {
      return false;
    }
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];
    const restrictedPages = ['/agrowisata', '/desawisata', '/aboutus'];
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    if (restrictedPages.includes(url) && (!token || !userName || !this.isTokenValid(token))) {
      this._content.innerHTML = `
        <h2>Anda harus login untuk mengakses halaman ini.</h2>
        <a href="#/login">Login</a>
      `;
      return;
    }

    if (page && typeof page.render === 'function') {
      this._content.innerHTML = await page.render();
      await page.afterRender();
    } else {
      this._content.innerHTML = '<h2>Halaman tidak ditemukan</h2>';
    }

    this._updateNavigation();
  }

  handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this._updateNavigation();
    window.location.href = '#/home';
  }
}

export default App;
