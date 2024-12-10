const SavedDataPage = {
    async render() {
        return `
            <nav>
                <ul>
                    <li><a href="#/agrowisata" id="nav-home">Beranda</a></li>
                    <li><a href="#/saved-data-page" id="nav-saved">Data Tersimpan</a></li>
                </ul>
            </nav>
            <h1>Data Agrowisata Tersimpan</h1>
            <ul id="saved-agrowisata-list" class="saved-agrowisata-list"></ul>
        `;
    },

    async afterRender() {
        const savedAgrowisataList = document.getElementById('saved-agrowisata-list');
        const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];

        if (savedData.length === 0) {
            savedAgrowisataList.innerHTML = `<li>Belum ada data tersimpan.</li>`;
            return;
        }

        savedData.forEach((data) => {
            const listItem = document.createElement('li');
            listItem.className = 'saved-agrowisata-item';
            listItem.innerHTML = `
                <h2>${data.name}</h2>
                <p><img src="${data.urlimg}" alt="${data.name}" class="saved-agrowisata-img"></p>
                <p><strong>Lokasi:</strong> ${data.location}</p>
                <p><strong>URL Maps:</strong> <a href="${data.urlmaps}" target="_blank" rel="noopener noreferrer">Lihat di Maps</a></p>
                <p><strong>Fasilitas:</strong> ${data.fasilitas}</p>
                <button class="delete-btn">Hapus</button>
            `;
            savedAgrowisataList.appendChild(listItem);

            // Tambahkan event listener untuk tombol hapus
            const deleteButton = listItem.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => {
                this.deleteAgrowisata(data._id, savedAgrowisataList);
            });
        });
    },

    deleteAgrowisata(id, container) {
        let savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
        savedData = savedData.filter((item) => item._id !== id);

        localStorage.setItem('savedAgrowisata', JSON.stringify(savedData));

        // Refresh halaman setelah menghapus
        container.innerHTML = '';
        this.afterRender();

        // Popup alert setelah data dihapus
        alert("Data berhasil dihapus!");
    },
};

export default SavedDataPage;
