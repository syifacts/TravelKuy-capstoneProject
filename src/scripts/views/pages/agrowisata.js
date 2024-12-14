import SavedAgrowisataIdb from "../../data/saved-agrowisata";  // Import modul untuk IndexedDB
import { jwtDecode } from 'jwt-decode';

const Agrowisata = {
    API_URL: 'https://agrowisataapi-1aaac8500e71.herokuapp.com/agrowisata',
    itemsPerPage: 12,
    currentPage: 1,
    filteredData: [],

    // Fungsi untuk mendapatkan userId dari token
    getUserIdFromToken() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const decodedToken = jwtDecode(token);
            return decodedToken?.userId || null; // Mengembalikan userId atau null jika tidak ada
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },

    // Menampilkan pop-up dengan pesan
    showPopupAgrowisata(message) {
        const popupAgrowisata = document.createElement('div');
        popupAgrowisata.className = 'popup-agrowisata';
        popupAgrowisata.innerHTML = `
            <div class="popup-content">${message}</div>
            <button class="close-btn">Tutup</button>
        `;
        
        document.body.appendChild(popupAgrowisata);

        const closePopupAgrowisata = () => {
            popupAgrowisata.classList.remove('show');
            popupAgrowisata.remove();
        };

        popupAgrowisata.querySelector('.close-btn').addEventListener('click', closePopupAgrowisata);
        
        popupAgrowisata.classList.add('show');
        
        // Menutup pop-up secara otomatis setelah 3 detik
        setTimeout(closePopupAgrowisata, 3000);
    },

    async render() {
        return `
            <nav>
                <ul>
                    <li><a href="#/agrowisata" id="nav-home">Beranda</a></li>
                    <li><a href="#/saved-data-page" id="nav-saved">Data Tersimpan</a></li>
                </ul>
            </nav>
            <h1>Daftar Agrowisata</h1>
            <div>
                <label for="filter-location">Filter berdasarkan lokasi:</label>
                <select id="filter-location">
                    <option value="">Pilih lokasi</option>
                    <option value="Jakarta Timur">Jakarta Timur</option>
                    <option value="Jakarta Barat">Jakarta Barat</option>
                    <option value="Jakarta Utara">Jakarta Utara</option>
                    <option value="Jakarta Selatan">Jakarta Selatan</option>
                    <option value="Jakarta Pusat">Jakarta Pusat</option>
                    <option value="Wilayah Lainnya">Wilayah Lainnya</option>
                </select>
            </div>
            <ul id="agrowisata-list" class="agrowisata-list"></ul>
            <div id="pagination-controls"></div>
        `;
    },

    async afterRender() {
        const agrowisataList = document.getElementById('agrowisata-list');
        const filterLocation = document.getElementById('filter-location');
        const paginationControls = document.getElementById('pagination-controls');

        try {
            const data = await this.fetchData();
            console.log('Data dari API:', data);

            // Simpan data asli dan data yang sudah difilter
            this.filteredData = data;
            this.displayAgrowisata(this.filteredData, agrowisataList);

            filterLocation.addEventListener('change', (event) => {
                const location = event.target.value;
                this.filteredData = this.filterDataByLocation(data, location);
                
                // Jika data hasil filter kosong, set halaman ke 1
                this.currentPage = 1;

                this.displayAgrowisata(this.filteredData, agrowisataList);
                this.createPaginationControls(this.filteredData.length, paginationControls);
            });

            this.createPaginationControls(this.filteredData.length, paginationControls);
        } catch (error) {
            console.error('Error fetching agrowisata data:', error);
            agrowisataList.innerHTML = `<li>Error fetching data. Please try again later.</li>`;
        }
    },

    async fetchData() {
        const response = await fetch(this.API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async displayAgrowisata(data, container) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPageData = data.slice(startIndex, endIndex);

        if (currentPageData.length === 0) {
            container.innerHTML = `<li>No agrowisata found.</li>`;
            return;
        }

        container.innerHTML = ''; // Clear previous content
        const savedData = await SavedAgrowisataIdb.getAllAgrowisata(); // Ambil data tersimpan dari IndexedDB

        currentPageData.forEach((agrowisata) => {
            const listItem = document.createElement('li');
            listItem.className = 'agrowisata-item';
            listItem.dataset.id = agrowisata._id;
            listItem.innerHTML = `
                <h2>${agrowisata.name}</h2>
                <p><img src="${agrowisata.urlimg}" alt="${agrowisata.name}" class="agrowisata-img"></p>
                <p><strong>Lokasi:</strong> ${agrowisata.location}</p>
                <p><strong>URL Maps:</strong> <a href="${agrowisata.urlmaps}" target="_blank" rel="noopener noreferrer">Lihat di Maps</a></p>
                <p><strong>Fasilitas:</strong> ${agrowisata.fasilitas}</p>
                <button class="save-btn">Simpan</button>
            `;

            const saveButton = listItem.querySelector('.save-btn');
            const isAlreadySaved = savedData.some(item => item._id === agrowisata._id);

            if (isAlreadySaved) {
                saveButton.textContent = 'Tersimpan';
                saveButton.disabled = true;
            } else {
                saveButton.addEventListener('click', () => {
                    this.saveAgrowisata(agrowisata, saveButton);
                });
            }

            container.appendChild(listItem);
        });
    },

    createPaginationControls(totalItems, container) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        let paginationHTML = '';

        // If totalItems is 0, reset the currentPage to 1
        if (totalItems === 0) {
            this.currentPage = 1;
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
        }
        container.innerHTML = paginationHTML;

        const pageButtons = container.querySelectorAll('.page-btn');
        pageButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                this.currentPage = Number(event.target.dataset.page);
                this.displayAgrowisata(this.filteredData, document.getElementById('agrowisata-list'));
            });
        });
    },

    async saveAgrowisata(agrowisata, button) {
        const userId = this.getUserIdFromToken(); // Mendapatkan userId dari token
        if (!userId) {
            this.showPopupAgrowisata('Anda belum login. Tidak dapat menyimpan data.');
            return;
        }
      
        try {
            // Simpan ke IndexedDB dengan menambahkan userId
            await SavedAgrowisataIdb.putAgrowisata(agrowisata, userId); 
            
            this.showPopupAgrowisata(`Data "${agrowisata.name}" berhasil disimpan!`);
            button.textContent = 'Tersimpan';
            button.disabled = true;
        } catch (error) {
            console.error("Error saving agrowisata:", error);
        }
    },

    async removeAgrowisata(agrowisata, button) {
        const userId = this.getUserIdFromToken(); // Mendapatkan userId dari token
        if (!userId) {
            this.showPopupAgrowisata('Anda belum login. Tidak dapat menghapus data.');
            return;
        }

        try {
            // Menghapus dari IndexedDB berdasarkan userId
            await SavedAgrowisataIdb.deleteAgrowisata(agrowisata._id, userId);

            this.showPopupAgrowisata(`Data "${agrowisata.name}" berhasil dihapus!`);
            button.textContent = 'Simpan';
            button.disabled = false;
        } catch (error) {
            console.error("Error removing agrowisata:", error);
        }
    },

    filterDataByLocation(data, location) {
        if (!location) return data;
        return data.filter(item => item.location === location);
    }
};

export default Agrowisata;
