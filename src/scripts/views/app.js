import DrawerInitiator from '../utils/drawer-initiator';
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import Agrowisata from './pages/agrowisata';
 
class App {
  constructor({ button, drawer, content }) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;

    this._initialAppShell();
  }

  // Perbarui menjadi async agar kita bisa menggunakan await di sini
  async _initialAppShell() {
    DrawerInitiator.init({
      button: this._button,
      drawer: this._drawer,
      content: this._content,
    });

    // Menginisialisasi halaman AgrowisataPage dan merendernya ke dalam konten
    const page = new AgrowisataPage(); // Buat instansi dari AgrowisataPage
    this._content.innerHTML = await page.render(); // Render halaman dan sisipkan ke dalam konten
    await page.afterRender(); // Jalankan afterRender setelah render selesai
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner(); // Dapatkan URL aktif
    let page = routes[url]; // Ambil halaman yang sesuai dengan URL
  
    // Periksa apakah page adalah instance yang valid (misalnya AgrowisataPage)
    if (page && typeof page.render === 'function') {
      this._content.innerHTML = await page.render(); // Render halaman
      await page.afterRender(); // Jalankan afterRender pada halaman yang dirender
    } else {
      // Jika page tidak memiliki render(), coba buat instance halaman secara manual
      if (url === '/agrowisata') {
        page = new Agrowisata();
        this._content.innerHTML = await page.render();
        await page.afterRender();
      } else {
        // Tangani kasus jika halaman tidak ditemukan
        this._content.innerHTML = `<h2>Halaman tidak ditemukan</h2>`;
      }
    }
  }
}
export default App;
