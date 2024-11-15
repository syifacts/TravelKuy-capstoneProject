const API_URL = 'https://katalog.data.go.id/api/3/action/datastore_search?resource_id=266e3b85-1c43-4a84-b864-a54d41c218b1&limit=10';

const Agrowisata = {
    async render() {
        return `
        <h2>Lokasi Agrowisata di daerah Jakarta</h2>
        <div id="data-container">Loading data...</div>
        `;
    },

    async afterRender() {
        // Ambil elemen `data-container`
        const dataContainer = document.getElementById('data-container');

        // Fungsi untuk mengambil data dari API
        async function fetchData() {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                if (data.success) {
                    displayData(data.result.records);
                } else {
                    dataContainer.innerHTML = 'Error loading data';
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                dataContainer.innerHTML = 'Error loading data';
            }
        }

        // Fungsi untuk menampilkan data
        function displayData(records) {
            dataContainer.innerHTML = '';
            if (records.length === 0) {
                dataContainer.innerHTML = 'No data available';
                return;
            }

            records.forEach(record => {
                const recordElement = document.createElement('div');
                recordElement.classList.add('record');
                recordElement.innerHTML = `
                     <h2>${record.deskripsi || 'Nama tidak tersedia'}</h2>
                    <p><strong>Lokasi:</strong> ${record.alamat || 'Lokasi tidak tersedia'}</p>
                    <p><strong>Keterangan:</strong> ${record.fasilitas || 'Keterangan tidak tersedia'}</p>
                `;
                dataContainer.appendChild(recordElement);
            });
        }

        // Panggil `fetchData` untuk menampilkan data setelah halaman dirender
        fetchData();
    },
};

export default Agrowisata;
