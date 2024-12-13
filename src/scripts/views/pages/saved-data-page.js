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

      // Ambil daftar ID agrowisata yang sudah tersimpan di localStorage
      const savedAgrowisataIds = JSON.parse(localStorage.getItem('savedAgrowisataIds')) || [];

      savedData.forEach((data) => {
        const listItem = document.createElement('li');
        listItem.className = 'agrowisata-item';

        const isDataSavedByUser = data.userIds.includes(userId);

        listItem.innerHTML = `
          <h2>${data.name}</h2>
          <p><img src="${data.urlimg}" alt="${data.name}" class="agrowisata-img"></p>
          <p><strong>Lokasi:</strong> ${data.location}</p>
          <p><strong>URL Maps:</strong> <a href="${data.urlmaps}" target="_blank" rel="noopener noreferrer">Lihat di Maps</a></p>
          <p><strong>Fasilitas:</strong> ${data.fasilitas}</p>
        `;

        // Tombol hanya ada di halaman Beranda
        if (!window.location.hash.includes('saved-data-page')) {
          const saveButton = document.createElement('button');
          saveButton.className = 'save-btn';

          // Periksa apakah agrowisata sudah tersimpan oleh user berdasarkan localStorage
          if (savedAgrowisataIds.includes(data._id) || isDataSavedByUser) {
            saveButton.disabled = true;
            saveButton.textContent = 'Tersimpan';
          } else {
            saveButton.disabled = false;
            saveButton.textContent = 'Simpan Untuk Saya';
          }

          listItem.appendChild(saveButton);

          saveButton.addEventListener('click', () => {
            this.saveAgrowisataForUser(data, userId, saveButton);
          });
        }

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Hapus';
        listItem.appendChild(deleteButton);

        deleteButton.addEventListener('click', () => {
          this.deleteAgrowisata(data._id, agrowisataList);
        });

        agrowisataList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching saved agrowisata data:', error);
      agrowisataList.innerHTML = `<li>Terjadi kesalahan saat mengambil data.</li>`;
    }
  },

  // Menyimpan data untuk pengguna dan mengganti tombol
  async saveAgrowisataForUser(data, userId, saveButton) {
    try {
      // Simpan data ke IndexedDB untuk user ini
      await SavedAgrowisataIdb.putAgrowisata(data, userId);

      // Simpan ID agrowisata yang telah disimpan di localStorage
      const savedAgrowisataIds = JSON.parse(localStorage.getItem('savedAgrowisataIds')) || [];
      savedAgrowisataIds.push(data._id);
      localStorage.setItem('savedAgrowisataIds', JSON.stringify(savedAgrowisataIds));

      // Update status tombol menjadi "Tersimpan"
      saveButton.disabled = true;
      saveButton.textContent = 'Tersimpan';

      alert("Data berhasil disimpan untuk Anda!");
    } catch (error) {
      console.error('Error saving agrowisata data for user:', error);
      alert("Gagal menyimpan data.");
    }
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

  async deleteAgrowisata(id, container) {
    try {
      await SavedAgrowisataIdb.deleteAgrowisata(id);

      // Perbarui tampilan setelah penghapusan
      container.innerHTML = '';
      await this.afterRender();
      alert("Data berhasil dihapus!");
    } catch (error) {
      console.error('Error deleting agrowisata data:', error);
      alert("Gagal menghapus data.");
    }
  },
};

export default SavedDataPage;
