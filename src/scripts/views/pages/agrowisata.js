import SavedAgrowisataIdb from "../../data/saved-agrowisata";  // Import modul untuk IndexedDB
import { jwtDecode } from 'jwt-decode';

const Agrowisata = {
    API_URL: 'https://agrowisataapi-1aaac8500e71.herokuapp.com/agrowisata',
    itemsPerPage: 12,
    currentPage: 1,
    filteredData: [],
    searchQuery: '',

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
            <div class="filter-container">
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
                <input type="text" id="search-input" placeholder="Cari berdasarkan nama..." />
            </div>

            <ul id="agrowisata-list" class="agrowisata-list"></ul>
            <div id="pagination-controls"></div>
        `;
    },

    async afterRender() {
        const agrowisataList = document.getElementById('agrowisata-list');
        const filterLocation = document.getElementById('filter-location');
        const searchInput = document.getElementById('search-input');
        const paginationControls = document.getElementById('pagination-controls');

        try {
            const data = await this.fetchData();
            console.log('Data dari API:', data);

            this.filteredData = data;
            this.displayAgrowisata(this.filteredData, agrowisataList);

            filterLocation.addEventListener('change', (event) => {
                const location = event.target.value;
                this.filteredData = this.filterDataByLocation(data, location);
                this.currentPage = 1;

                this.displayAgrowisata(this.filteredData, agrowisataList);
                this.createPaginationControls(this.filteredData.length, paginationControls);
            });

            searchInput.addEventListener('input', (event) => {
                this.searchQuery = event.target.value.toLowerCase();
                this.filteredData = this.searchData(data, this.searchQuery);
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
        const savedData = await SavedAgrowisataIdb.getAllAgrowisata();

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
        const userId = this.getUserIdFromToken();
        if (!userId) {
            this.showPopupAgrowisata('Anda belum login. Tidak dapat menyimpan data.');
            return;
        }
      
        try {
            await SavedAgrowisataIdb.putAgrowisata(agrowisata, userId);
            this.showPopupAgrowisata(`Data "${agrowisata.name}" berhasil disimpan!`);
            button.textContent = 'Tersimpan';
            button.disabled = true;
        } catch (error) {
            console.error("Error saving agrowisata:", error);
        }
    },

    filterDataByLocation(records, selectedLocation) {
        if (!selectedLocation) return records;
    
        // Jika "Wilayah Lainnya" dipilih, tampilkan lokasi yang tidak termasuk dalam daftar standar Jakarta
        if (selectedLocation === "Wilayah Lainnya") {
            return records.filter(record => {
                // Daftar lokasi yang harus dikecualikan (Jakarta)
                const excludedLocations = ["Jakarta Timur", "Jakarta Barat", "Jakarta Utara", "Jakarta Selatan", "Jakarta Pusat"];
                // Menampilkan agrowisata yang lokasinya tidak ada dalam daftar excludedLocations
                return !excludedLocations.some(location => record.location.toLowerCase().includes(location.toLowerCase()));
            });
        }
        
        // Jika lokasi yang dipilih adalah salah satu Jakarta, tampilkan lokasi yang sesuai
        if (["Jakarta Timur", "Jakarta Barat", "Jakarta Utara", "Jakarta Selatan", "Jakarta Pusat"].includes(selectedLocation)) {
            return records.filter(record => record.location.toLowerCase().includes(selectedLocation.toLowerCase()));
        }
        
        // Jika lokasi selain Jakarta dipilih, tampilkan data sesuai dengan lokasi yang dipilih
        return records.filter(record => record.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    },

    searchData(data, query) {
        if (!query) return data;
        return data.filter(item => item.name.toLowerCase().includes(query));
    }
};

export default Agrowisata;
