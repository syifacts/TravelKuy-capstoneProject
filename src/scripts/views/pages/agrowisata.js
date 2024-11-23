const API_URLS = [
    'https://katalog.data.go.id/api/3/action/datastore_search?resource_id=266e3b85-1c43-4a84-b864-a54d41c218b1',
    'https://katalog.data.go.id/api/3/action/datastore_search?resource_id=bfe834ff-1cb6-4c1c-ae75-4fbe6d62f1ae'
];

const Agrowisata = {
    cachedData: [],
    newData: [],

    async render() {
        return `
            <nav>
                <ul>
                    <li><a href="#/agrowisata" id="nav-home">Beranda</a></li>
                    <li><a href="#/saved-data-page" id="nav-saved">Data Tersimpan</a></li>
                </ul>
            </nav>
            <h2>Lokasi Agrowisata di Jakarta</h2>
            <label for="filter-wilayah">Filter Wilayah:</label>
            <select id="filter-wilayah">
                <option value="">Semua Wilayah</option>
                <option value="Jakarta Barat">Jakarta Barat</option>
                <option value="Jakarta Timur">Jakarta Timur</option>
                <option value="Jakarta Utara">Jakarta Utara</option>
                <option value="Jakarta Selatan">Jakarta Selatan</option>
                <option value="Wilayah Lainnya">Wilayah Lainnya</option>
            </select>
            <div id="data-container">Loading data...</div>
            
            <button id="add-data-btn" aria-label="Tambah Data Baru">+</button>
        
            <div id="add-data-modal" class="modal hidden">
                <div class="modal-content">
                    <h3>Tambahkan Data Baru</h3>
                    <form id="add-data-form">
                        <input type="text" id="input-deskripsi" placeholder="Deskripsi" required>
                        <input type="text" id="input-lokasi" placeholder="Lokasi" required>
                        <input type="text" id="input-wilayah" placeholder="Wilayah" required>
                        <input type="text" id="input-kecamatan" placeholder="Kecamatan">
                        <input type="text" id="input-kelurahan" placeholder="Kelurahan">
                        <input type="text" id="input-fasilitas" placeholder="Fasilitas">
                        <input type="url" id="input-googlemaps" placeholder="Google Maps URL">
                        <button type="submit">Tambahkan</button>
                        <button type="button" id="cancel-btn">Batal</button>
                    </form>
                </div>
            </div>
        `;
    },

    async afterRender() {
        const dataContainer = document.getElementById('data-container');
        const filterWilayah = document.getElementById('filter-wilayah');
        const addDataButton = document.getElementById('add-data-btn');
        const modal = document.getElementById('add-data-modal');
        const cancelButton = document.getElementById('cancel-btn');

        // Filter data saat filter berubah
        filterWilayah.addEventListener('change', () => {
            this.displayData([...this.cachedData, ...this.newData]);
        });

        // Load data baru dari localStorage
        this.loadLocalData();

        // Ambil data dari API
        await this.fetchData();

        // Tampilkan data
        this.displayData([...this.cachedData, ...this.newData]);

        // Event handler untuk tombol tambah data
        addDataButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });

        cancelButton.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        this.handleAddData();
    },

    async fetchData() {
        if (this.cachedData.length > 0) return;

        try {
            const responses = await Promise.all(API_URLS.map(url => fetch(url)));
            const results = await Promise.all(responses.map(res => res.json()));

            this.cachedData = results.flatMap((result, index) => {
                if (result.success) {
                    return index === 1
                        ? this.mapDataFromAPI2(result.result.records)
                        : result.result.records;
                }
                return [];
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            const dataContainer = document.getElementById('data-container');
            dataContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
        }
    },

    mapDataFromAPI2(records) {
        return records.map(record => ({
            deskripsi: record.nama_lokasi || 'Nama tidak tersedia',
            alamat: record.lokasi || 'Lokasi tidak tersedia',
            wilayah: record.wilayah || 'Wilayah tidak tersedia',
            kecamatan: '',
            kelurahan: '',
            fasilitas: '',
            googlemaps: '',
            isApi2: true
        }));
    },

    loadSavedData() {
        try {
            const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
            return savedData;
        } catch (error) {
            console.error('Error loading saved data:', error);
            return [];
        }
    },

    displayData(records) {
        const dataContainer = document.getElementById('data-container');
        const selectedWilayah = document.getElementById('filter-wilayah').value;
        const savedData = this.loadSavedData();
        const allRecords = [...records, ...savedData];

        const filteredRecords = records.filter(record =>
            !selectedWilayah || record.wilayah === selectedWilayah);

        dataContainer.innerHTML = '';

        filteredRecords.forEach(record => {
            const recordElement = this.createRecordElement(record);
            dataContainer.appendChild(recordElement);
        });
    },

    createRecordElement(record) {
        const recordElement = document.createElement('div');
        recordElement.classList.add('record');
        recordElement.innerHTML = `
            <h3>${record.deskripsi}</h3>
            <p><strong>Lokasi:</strong> ${record.alamat}</p>
            <p><strong>Wilayah:</strong> ${record.wilayah}</p>
            <p><strong>Kecamatan:</strong> ${record.kecamatan || '-'}</p>
            <p><strong>Kelurahan:</strong> ${record.kelurahan || '-'}</p>
            <p><strong>Fasilitas:</strong> ${record.fasilitas || '-'}</p>
            ${record.googlemaps && record.googlemaps.trim() !== '' ? `<p><a href="${record.googlemaps}" target="_blank">Lihat di Google Maps</a></p>` : ''}
            <button class="save-btn">Simpan</button>
        `;

        const saveBtn = recordElement.querySelector('.save-btn');
        const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
        const isSaved = savedData.some(saved => saved.deskripsi === record.deskripsi);
    
        // Update tombol jika data sudah tersimpan
        if (isSaved) {
            saveBtn.textContent = 'Tersimpan';
            saveBtn.disabled = true;
        }
    

        saveBtn.addEventListener('click', () => this.saveData(record, saveBtn));

        return recordElement;
    },

    saveData(record, button) {
        const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
    
        // Validasi dan normalisasi data
        const completeRecord = {
            deskripsi: record.deskripsi || 'Tidak tersedia',
            alamat: record.alamat || record.lokasi || 'Lokasi tidak tersedia', // Pastikan ada fallback
            wilayah: record.wilayah || 'Wilayah tidak tersedia',
            kecamatan: record.kecamatan || '-',
            kelurahan: record.kelurahan || '-',
            fasilitas: record.fasilitas || '-',
            googlemaps: record.googlemaps || '#',
        };
    
        if (savedData.some(saved => saved.deskripsi === record.deskripsi)) {
            alert('Data sudah disimpan!');
            return;
        }
    
        savedData.push(completeRecord);
        localStorage.setItem('savedAgrowisata', JSON.stringify(savedData));
        button.textContent = 'Tersimpan';
        button.disabled = true;
    },
    
    

    handleAddData() {
        const form = document.getElementById('add-data-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const newRecord = {
                deskripsi: document.getElementById('input-deskripsi').value || 'Deskripsi tidak tersedia',
                alamat: document.getElementById('input-lokasi').value || 'Lokasi tidak tersedia',
                wilayah: document.getElementById('input-wilayah').value || 'Wilayah tidak tersedia',
                kecamatan: document.getElementById('input-kecamatan').value || '-',
                kelurahan: document.getElementById('input-kelurahan').value || '-',
                fasilitas: document.getElementById('input-fasilitas').value || '-',
                googlemaps: document.getElementById('input-googlemaps').value || '#',
                isNew: true,
            };

            this.newData.push(newRecord);
            localStorage.setItem('newAgrowisataData', JSON.stringify(this.newData));
            this.displayData([...this.cachedData, ...this.newData]);

            form.reset();
            document.getElementById('add-data-modal').classList.add('hidden');
            alert('Data baru berhasil ditambahkan!');
        });
    },

    loadLocalData() {
        try {
            const storedData = JSON.parse(localStorage.getItem('newAgrowisataData'));
            if (Array.isArray(storedData)) {
                this.newData = storedData;
            }
        } catch (error) {
            console.error('Error loading local data:', error);
            this.newData = [];
        }
    }
};

export default Agrowisata;
