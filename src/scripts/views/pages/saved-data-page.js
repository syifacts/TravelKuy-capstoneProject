const SavedDataPage = {
    async render() {
        return `
        <nav>
            <ul>
                <li><a href="#/agrowisata">Beranda</a></li>
                <li><a href="#/saved-data-page">Data Tersimpan</a></li>
            </ul>
        </nav>
        <h2>Data Tersimpan</h2>
        <div id="saved-data-container">Memuat data tersimpan...</div>
        `;
    },

    async afterRender() {
        const dataContainer = document.getElementById('saved-data-container');
        
        // Fungsi untuk menampilkan data yang tersimpan
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
                <h3>${record.deskripsi}</h3>
                <p><strong>Lokasi:</strong> ${record.alamat}</p> <!-- Ganti lokasi dengan alamat -->
                <p><strong>Wilayah:</strong> ${record.wilayah}</p>
                <p><strong>Kecamatan:</strong> ${record.kecamatan}</p>
                <p><strong>Kelurahan:</strong> ${record.kelurahan}</p>
                <p><strong>Fasilitas:</strong> ${record.fasilitas}</p>
                ${record.googlemaps && record.googlemaps !== '#' ? `<p><a href="${record.googlemaps}" target="_blank">Lihat di Google Maps</a></p>` : ''}
                <button class="delete-btn">Hapus</button>
                `;
                
                // Event listener untuk menghapus data
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
            showSavedData(); 
        }

        showSavedData();
    }
};

export default SavedDataPage;
