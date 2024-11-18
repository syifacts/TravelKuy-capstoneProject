const API_URL_1 = 'https://katalog.data.go.id/api/3/action/datastore_search?resource_id=266e3b85-1c43-4a84-b864-a54d41c218b1';
const API_URL_2 = 'https://katalog.data.go.id/api/3/action/datastore_search?resource_id=bfe834ff-1cb6-4c1c-ae75-4fbe6d62f1ae';

const Agrowisata = {
    async render() {
        return `
        <h2>Lokasi Agrowisata di Jakarta dan Lokasi Agrowisata Lainnya</h2>
        <label for="filter-wilayah">Filter Wilayah:</label>
        <select id="filter-wilayah">
            <option value="">Semua Wilayah</option>
            <option value="Jakarta Barat">Jakarta Barat</option>
            <option value="Jakarta Timur">Jakarta Timur</option>
            <option value="Jakarta Utara">Jakarta Utara</option>
            <option value="Jakarta Selatan">Jakarta Selatan</option>
            <option value="Kepulauan Seribu">Kepulauan Seribu</option>
        </select>
        <div id="data-container">Loading data...</div>
        `;
    },

    async afterRender() {
        const dataContainer = document.getElementById('data-container');
        const filterWilayah = document.getElementById('filter-wilayah');

        // Fetch data
        const fetchData = async () => {
            try {
                const [response1, response2] = await Promise.all([
                    fetch(API_URL_1),
                    fetch(API_URL_2),
                ]);

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

        // Pemetaan data API 2
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

        // Menampilkan data berdasarkan filter wilayah
        function displayData(records) {
            dataContainer.innerHTML = '';
            if (records.length === 0) {
                dataContainer.innerHTML = 'No data available';
                return;
            }

            const selectedWilayah = filterWilayah.value;

            // Filter records berdasarkan wilayah yang dipilih
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
                    </div>
                    `;
                }

                dataContainer.appendChild(recordElement);
            });
        }

        // Mengambil data ketika halaman pertama kali dimuat
        fetchData();

        // Menangani perubahan filter wilayah
        filterWilayah.addEventListener('change', () => {
            fetchData();
        });
    },
};

export default Agrowisata;
