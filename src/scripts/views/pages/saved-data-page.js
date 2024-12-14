import SavedAgrowisataIdb from "../../data/saved-agrowisata";
import { jwtDecode } from 'jwt-decode';

const SavedDataPage = {
  async render() {
    return `
      <nav>
        <ul>
          <li><a href="#/agrowisata" id="nav-home">Beranda</a></li>
          <li><a href="#/saved-data-page" id="nav-saved">Data Tersimpan</a></li>
        </ul>
      </nav>
      <h1>Daftar Agrowisata</h1>
      <ul id="agrowisata-list" class="agrowisata-list"></ul>

      <!-- Popup Konfirmasi Hapus -->
      <div id="popup-savedpage" class="popup-savedpage">
        <div class="popup-content">
          <p>Apakah Anda yakin ingin menghapus data ini?</p>
          <button id="confirm-delete-btn">Ya</button>
          <button id="cancel-delete-btn" class="cancel-btn">Batal</button>
        </div>
      </div>

      <!-- Popup Berhasil Menghapus Data -->
      <div id="popup-delete-success" class="popup-savedpage">
        <div class="popup-content">
          <p>Data berhasil dihapus!</p>
          <button id="close-popup-btn">Tutup</button>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const agrowisataList = document.getElementById('agrowisata-list');
    const userId = this.getUserIdFromToken();

    if (!userId) {
      agrowisataList.innerHTML = `<li>Anda belum login.</li>`;
      return;
    }

    try {
      const savedData = await SavedAgrowisataIdb.getAllAgrowisata(userId);

      if (savedData.length === 0) {
        agrowisataList.innerHTML = `<li>Belum ada agrowisata yang tersimpan.</li>`;
        return;
      }

      savedData.forEach((data) => {
        const listItem = document.createElement('li');
        listItem.className = 'agrowisata-item';

        listItem.innerHTML = `
          <h2>${data.name}</h2>
          <p><img src="${data.urlimg}" alt="${data.name}" class="agrowisata-img"></p>
          <p><strong>Lokasi:</strong> ${data.location}</p>
          <p><strong>URL Maps:</strong> <a href="${data.urlmaps}" target="_blank" rel="noopener noreferrer">Lihat di Maps</a></p>
          <p><strong>Fasilitas:</strong> ${data.fasilitas}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Hapus';
        listItem.appendChild(deleteButton);

        deleteButton.addEventListener('click', () => {
          this.showDeletePopup(data._id, agrowisataList);
        });

        agrowisataList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching saved agrowisata data:', error);
      agrowisataList.innerHTML = `<li>Terjadi kesalahan saat mengambil data.</li>`;
    }
  },

  showDeletePopup(id, container) {
    const popup = document.getElementById('popup-savedpage');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    popup.style.display = 'flex';

    confirmDeleteBtn.addEventListener('click', async () => {
      await this.deleteAgrowisata(id, container);
      popup.style.display = 'none'; // Menutup pop-up setelah konfirmasi
    });

    cancelDeleteBtn.addEventListener('click', () => {
      popup.style.display = 'none'; // Menutup pop-up saat dibatalkan
    });
  },

  async deleteAgrowisata(id, container) {
    try {
      await SavedAgrowisataIdb.deleteAgrowisata(id);

      // Perbarui tampilan setelah penghapusan
      container.innerHTML = '';
      await this.afterRender();
      this.showDeleteSuccessPopup(); // Menampilkan popup sukses
    } catch (error) {
      console.error('Error deleting agrowisata data:', error);
      alert("Gagal menghapus data.");
    }
  },

  // Menampilkan popup sukses setelah penghapusan
  showDeleteSuccessPopup() {
    const successPopup = document.getElementById('popup-delete-success');
    const closeButton = document.getElementById('close-popup-btn');
    
    // Tampilkan popup sukses
    successPopup.style.display = 'flex';

    closeButton.addEventListener('click', () => {
      // Tutup popup ketika tombol tutup diklik
      successPopup.style.display = 'none';
    });
  },

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken?.userId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },
};

export default SavedDataPage;