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
        </select>
        <div id="data-container">Loading data...</div>
        
        <!-- Tombol tambah data -->
        <button id="add-data-btn" aria-label="Tambah Data Baru">+</button>
    
        <!-- Modal untuk tambah data -->
        <div id="add-data-modal" class="modal hidden">
            <div class="modal-content">
                <h3>Tambahkan Data Baru</h3>
                <form id="add-data-form">
                    <input type="text" id="deskripsi" placeholder="Deskripsi" required>
                    <input type="text" id="lokasi" placeholder="Lokasi" required>
                    <input type="text" id="wilayah" placeholder="Wilayah" required>
                    <input type="text" id="kecamatan" placeholder="Kecamatan">
                    <input type="text" id="kelurahan" placeholder="Kelurahan">
                    <input type="text" id="fasilitas" placeholder="Fasilitas">
                    <input type="url" id="googlemaps" placeholder="Google Maps URL">
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
        
        const fetchData = async () => {
            if (this.cachedData.length === 0) {
                try {
                    const responses = await Promise.all(API_URLS.map(url => fetch(url)));
                    const results = await Promise.all(responses.map(response => response.json()));

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
                    dataContainer.innerHTML = 'Error loading data.';
                }
            }
        };

        this.mapDataFromAPI2 = (records) => {
            return records.map(record => ({
                deskripsi: record.nama_lokasi || 'Nama tidak tersedia',
                alamat: record.lokasi || 'Lokasi tidak tersedia',
                wilayah: record.wilayah || 'Wilayah tidak tersedia',
                kecamatan: '',
                kelurahan: '',
                fasilitas: '',
                isApi2: true
            }));
        };

        const displayData = (records) => {
            const selectedWilayah = filterWilayah.value;
            const filteredRecords = selectedWilayah
                ? records.filter(record => record.wilayah === selectedWilayah)
                : records;
            
            // Bersihkan container data
            dataContainer.innerHTML = '';

            // Tampilkan data
            filteredRecords.forEach(record => {
                const recordElement = createRecordElement(record);
                dataContainer.appendChild(recordElement);
            });
        };
        
        const createRecordElement = (record) => {
            const recordElement = document.createElement('div');
            recordElement.classList.add('record');
            recordElement.innerHTML = `
                <h3>${record.deskripsi}</h3>
                <p><strong>Lokasi:</strong> ${record.alamat}</p>
                <p><strong>Wilayah:</strong> ${record.wilayah}</p>
                <p><strong>Kecamatan:</strong> ${record.kecamatan || '-'}</p>
                <p><strong>Kelurahan:</strong> ${record.kelurahan || '-'}</p>
                <p><strong>Fasilitas:</strong> ${record.fasilitas || '-'}</p>
                ${record.googlemaps ? `<p><a href="${record.googlemaps}" target="_blank">Lihat di Google Maps</a></p>` : ''}
                <button class="save-btn">Simpan</button>
            `;

            const saveBtn = recordElement.querySelector('.save-btn');
            const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
            const isSaved = savedData.some(saved => saved.deskripsi === record.deskripsi);

            if (isSaved) {
                saveBtn.textContent = 'Tersimpan';
                saveBtn.disabled = true;
            }

            saveBtn.addEventListener('click', () => {
                saveData(record, saveBtn);
            });

            return recordElement;
        };

        const saveData = (record, button) => {
            const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
            if (savedData.some(saved => saved.deskripsi === record.deskripsi)) {
                alert('Data sudah disimpan!');
                return;
            }
            savedData.push(record);
            localStorage.setItem('savedAgrowisata', JSON.stringify(savedData));
            button.textContent = 'Tersimpan';
            button.disabled = true;
            alert('Data berhasil disimpan!');
        };

        const handleAddData = () => {
            const form = document.getElementById('add-data-form');
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const newRecord = {
                    deskripsi: document.getElementById('deskripsi').value || 'Deskripsi tidak tersedia',
                    alamat: document.getElementById('lokasi').value || 'Lokasi tidak tersedia',
                    wilayah: document.getElementById('wilayah').value || 'Wilayah tidak tersedia',
                    kecamatan: document.getElementById('kecamatan').value || '-',
                    kelurahan: document.getElementById('kelurahan').value || '-',
                    fasilitas: document.getElementById('fasilitas').value || '-',
                    googlemaps: document.getElementById('googlemaps').value || '#',
                    isNew: true,
                };

                this.newData.push(newRecord);
                displayData([...this.cachedData, ...this.newData]);

                form.reset();
                document.getElementById('add-data-modal').classList.add('hidden');
                alert('Data baru berhasil ditambahkan!');
            });
        };

        const addDataButton = document.getElementById('add-data-btn');
        const modal = document.getElementById('add-data-modal');
        const cancelButton = document.getElementById('cancel-btn');

        addDataButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });

        cancelButton.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        await fetchData();
        displayData([...this.cachedData, ...this.newData]);
        handleAddData();
    },
};

export default Agrowisata;
