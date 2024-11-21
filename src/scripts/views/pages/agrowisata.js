const API_URLS = [
    'https://katalog.data.go.id/api/3/action/datastore_search?resource_id=266e3b85-1c43-4a84-b864-a54d41c218b1',
    'https://katalog.data.go.id/api/3/action/datastore_search?resource_id=bfe834ff-1cb6-4c1c-ae75-4fbe6d62f1ae'
];

const Agrowisata = {
    cachedData: [],

    async render() {
        return `
        <nav>
            <ul>
                <li><a href="#/agrowisata" id="nav-home">Beranda</a></li>
                <li><a href="#/saved-data-page" id="nav-saved">Data Tersimpan</a></li>
            </ul>
        </nav>
        <h2>Lokasi Agrowisata di Jakarta dan Lokasi Agrowisata Lainnya</h2>
        <label for="filter-wilayah">Filter Wilayah:</label>
        <select id="filter-wilayah">
            <option value="">Semua Wilayah</option>
            <option value="Jakarta Barat">Jakarta Barat</option>
            <option value="Jakarta Timur">Jakarta Timur</option>
            <option value="Jakarta Utara">Jakarta Utara</option>
            <option value="Jakarta Selatan">Jakarta Selatan</option>
        </select>
        <div id="data-container">Loading data...</div>
        `;
    },

    async afterRender() {
        const dataContainer = document.getElementById('data-container');
        const filterWilayah = document.getElementById('filter-wilayah');
        const navLinks = document.querySelectorAll('nav a');

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

            dataContainer.innerHTML = '';
            if (filteredRecords.length === 0) {
                dataContainer.innerHTML = 'No data available for the selected wilayah.';
                return;
            }

            const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];

            filteredRecords.forEach(record => {
                const isSaved = savedData.some(saved => saved.deskripsi === record.deskripsi);

                const recordElement = document.createElement('div');
                recordElement.classList.add('record');
                recordElement.innerHTML = `
                <h3>${record.deskripsi}</h3>
                <p><strong>Lokasi:</strong> ${record.alamat}</p>
                <p><strong>Wilayah:</strong> ${record.wilayah}</p>
                ${record.isApi2 ? '' : `<p><strong>Kecamatan:</strong> ${record.kecamatan || '-'}</p>
                <p><strong>Kelurahan:</strong> ${record.kelurahan || '-'}</p>
                <p><strong>Fasilitas:</strong> ${record.fasilitas || '-'}</p>`}
                <button class="save-btn">${isSaved ? 'Tersimpan' : 'Simpan'}</button>
                `;
                const saveButton = recordElement.querySelector('.save-btn');
                saveButton.disabled = isSaved;
                saveButton.addEventListener('click', () => saveData(record, saveButton));
                dataContainer.appendChild(recordElement);
            });
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

        const showSavedData = () => {
            const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
            dataContainer.innerHTML = '';
            if (savedData.length === 0) {
                dataContainer.innerHTML = 'Tidak ada data yang tersimpan.';
                return;
            }
            savedData.forEach((record, index) => {
                const recordElement = document.createElement('div');
                recordElement.classList.add('record');
                recordElement.innerHTML = `
                <h3>${record.deskripsi}</h3>
                <p><strong>Lokasi:</strong> ${record.alamat}</p>
                <p><strong>Wilayah:</strong> ${record.wilayah}</p>
                <button class="delete-btn">Hapus</button>
                `;
                const deleteButton = recordElement.querySelector('.delete-btn');
                deleteButton.addEventListener('click', () => deleteData(index));
                dataContainer.appendChild(recordElement);
            });
        };

        const deleteData = (index) => {
            const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
            savedData.splice(index, 1);
            localStorage.setItem('savedAgrowisata', JSON.stringify(savedData));
            alert('Data berhasil dihapus!');
            showSavedData();
        };

        const handleRouting = async () => {
            const hash = window.location.hash;
            if (hash === this.currentHash) return; 

            this.currentHash = hash; 
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector(`nav a[href="${hash}"]`)?.classList.add('active');

            if (hash === '#/saved-data-page') {
                showSavedData();
            } else {
                await fetchData();
                displayData(this.cachedData);
            }
        };

        filterWilayah.addEventListener('change', () => displayData(this.cachedData));
        window.addEventListener('hashchange', handleRouting);

        await handleRouting();
    },
};

export default Agrowisata;
