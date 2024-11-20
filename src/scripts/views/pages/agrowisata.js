const API_URL_1 = 'https://katalog.data.go.id/api/3/action/datastore_search?resource_id=266e3b85-1c43-4a84-b864-a54d41c218b1';
const API_URL_2 = 'https://katalog.data.go.id/api/3/action/datastore_search?resource_id=bfe834ff-1cb6-4c1c-ae75-4fbe6d62f1ae';

const Agrowisata = {
    async render() {
        return `
        <nav>
            <ul>
                <li><a href="#/agrowisata">Beranda</a></li>
                <li><a href="#/saved-data-page">Data Tersimpan</a></li>
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

        // Fungsi untuk mengfetch data dari API
        const fetchData = async () => {
            try {
                const [response1, response2] = await Promise.all([fetch(API_URL_1), fetch(API_URL_2)]);

                const data1 = await response1.json();
                const data2 = await response2.json();

                if (data1.success && data2.success) {
                    const mappedData2 = mapDataFromAPI2(data2.result.records);
                    const combinedData = [...data1.result.records, ...mappedData2];
                    displayData(combinedData);
                } else {
                    dataContainer.innerHTML = 'Error loading data';
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                dataContainer.innerHTML = 'Error loading data';
            }
        };

        function mapDataFromAPI2(records) {
            return records.map(record => ({
                deskripsi: record.nama_lokasi || 'Nama tidak tersedia',
                alamat: record.lokasi || 'Lokasi tidak tersedia',
                wilayah: record.wilayah || 'Wilayah tidak tersedia',
                kecamatan: '',
                kelurahan: '',
                fasilitas: '',
                isApi2: true
            }));
        }

        function displayData(records) {
            dataContainer.innerHTML = '';
            if (records.length === 0) {
                dataContainer.innerHTML = 'No data available';
                return;
            }

            const selectedWilayah = filterWilayah.value;

            const filteredRecords = selectedWilayah
                ? records.filter(record => record.wilayah === selectedWilayah)
                : records;

            if (filteredRecords.length === 0) {
                dataContainer.innerHTML = 'No data available for the selected wilayah';
                return;
            }

            filteredRecords.forEach(record => {
                const recordElement = document.createElement('div');
                recordElement.classList.add('record');

                if (record.isApi2) {
                    recordElement.innerHTML = `
                    <div class="record">
                        <h3>${record.deskripsi || 'Nama tidak tersedia'}</h3>
                        <p><strong>Lokasi:</strong> ${record.alamat || 'Lokasi tidak tersedia'}</p>
                        <p><strong>Wilayah:</strong> ${record.wilayah || 'Wilayah tidak tersedia'}</p>
                        <button class="save-btn">Simpan</button>
                    </div>
                    `;
                } else {
                    recordElement.innerHTML = `
                    <div class="record">
                        <h3>${record.deskripsi || 'Nama tidak tersedia'}</h3>
                        <p><strong>Lokasi:</strong> ${record.alamat || 'Lokasi tidak tersedia'}</p>
                        <p><strong>Wilayah:</strong> ${record.wilayah || 'Wilayah tidak tersedia'}</p>
                        <p><strong>Kecamatan:</strong> ${record.kecamatan || 'Kecamatan tidak tersedia'}</p>
                        <p><strong>Kelurahan:</strong> ${record.kelurahan || 'Kelurahan tidak tersedia'}</p>
                        <p><strong>Fasilitas:</strong> ${record.fasilitas || 'Fasilitas tidak tersedia'}</p>
                        <button class="save-btn">Simpan</button>
                    </div>
                    `;
                }

                const saveButton = recordElement.querySelector('.save-btn');
                saveButton.addEventListener('click', () => {
                    saveData(record);
                });

                dataContainer.appendChild(recordElement);
            });
        }

        function saveData(record) {
            let savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
            const isAlreadySaved = savedData.some(savedRecord => savedRecord.deskripsi === record.deskripsi && savedRecord.alamat === record.alamat);
            
            if (isAlreadySaved) {
                alert('Data ini sudah disimpan sebelumnya!');
                return;
            }
            
            savedData.push(record);
            localStorage.setItem('savedAgrowisata', JSON.stringify(savedData));
            alert('Data berhasil disimpan!');
        }

        function showSavedData() {
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
                <div class="record">
                    <h3>${record.deskripsi || 'Nama tidak tersedia'}</h3>
                    <p><strong>Lokasi:</strong> ${record.alamat || 'Lokasi tidak tersedia'}</p>
                    <p><strong>Wilayah:</strong> ${record.wilayah || 'Wilayah tidak tersedia'}</p>
                    <button class="delete-btn">Hapus</button>
                </div>
                `;
                const deleteButton = recordElement.querySelector('.delete-btn');
                deleteButton.addEventListener('click', () => {
                    deleteData(index);
                });

                dataContainer.appendChild(recordElement);
            });
        }

        function deleteData(index) {
            let savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
            savedData.splice(index, 1); // Menghapus data berdasarkan index
            localStorage.setItem('savedAgrowisata', JSON.stringify(savedData));
            alert('Data berhasil dihapus!');
            window.location.hash = '#/saved-data-page'; // Tetap di halaman data tersimpan setelah penghapusan
        }

        // Fungsi untuk menampilkan halaman sesuai hash
        function handleRouting() {
            const hash = window.location.hash;

            if (hash === '#/saved-data-page') {
                showSavedData();
            } else {
                fetchData(); // Menampilkan data dari API
            }
        }

        // Menambahkan event listener untuk menangani perubahan hash
        window.addEventListener('hashchange', handleRouting);

        // Event listener untuk filter wilayah
        filterWilayah.addEventListener('change', () => {
            fetchData();
        });

        // Navigasi untuk beranda dan data tersimpan
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetHash = event.target.getAttribute('href');
                window.location.hash = targetHash;
            });
        });

        // Inisialisasi halaman berdasarkan hash
        handleRouting();
    },
}

export default Agrowisata;
