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
  
      savedData.forEach((data) => {
        const listItem = document.createElement('li');
        listItem.className = 'agrowisata-item';
  
        // Pengecekan apakah data sudah tersimpan oleh user
        const isDataSavedByUser = data.userIds.includes(userId);
  
        listItem.innerHTML = `
          <h2>${data.name}</h2>
          <p><img src="${data.urlimg}" alt="${data.name}" class="agrowisata-img"></p>
          <p><strong>Lokasi:</strong> ${data.location}</p>
          <p><strong>URL Maps:</strong> <a href="${data.urlmaps}" target="_blank" rel="noopener noreferrer">Lihat di Maps</a></p>
          <p><strong>Fasilitas:</strong> ${data.fasilitas}</p>
          <button class="delete-btn">Hapus</button>
          <button class="save-btn" ${isDataSavedByUser ? 'disabled' : ''}>
            ${isDataSavedByUser ? 'Tersimpan' : 'Simpan Untuk Saya'}
          </button>
        `;
        agrowisataList.appendChild(listItem);
  
        const deleteButton = listItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
          this.deleteAgrowisata(data._id, agrowisataList);
        });
  
        const saveButton = listItem.querySelector('.save-btn');
        saveButton.addEventListener('click', () => {
          this.saveAgrowisataForUser(data, userId, saveButton);
        });
      });
    } catch (error) {
      console.error('Error fetching saved agrowisata data:', error);
      agrowisataList.innerHTML = `<li>Terjadi kesalahan saat mengambil data.</li>`;
    }
  },
  

  // Menyimpan data untuk pengguna dan mengganti tombol
  async saveAgrowisataForUser(data, userId, saveButton) {
    try {
      await SavedAgrowisataIdb.putAgrowisata(data, userId);
      saveButton.disabled = true;
      saveButton.textContent = 'Tersimpan';
      alert("Data berhasil disimpan untuk Anda!");
      
      // Pembaruan langsung tampilan tombol tanpa memanggil afterRender
      const saveButtonParent = saveButton.closest('li');
      if (saveButtonParent) {
        const newButton = document.createElement('button');
        newButton.classList.add('save-btn');
        newButton.disabled = true;
        newButton.textContent = 'Tersimpan';
        saveButtonParent.replaceChild(newButton, saveButton); // Gantikan tombol lama dengan yang baru
      }
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
