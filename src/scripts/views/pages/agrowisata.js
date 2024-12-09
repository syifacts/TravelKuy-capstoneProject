class AgrowisataPage {
    constructor() {
        this.API_URL = 'https://agrowisataapi-1aaac8500e71.herokuapp.com/agrowisata';
    }

    async render() {
        return `
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
            <h2>Data Tersimpan</h2>
            <ul id="saved-data-list"></ul>
        `;
    }

    async afterRender() {
        const agrowisataList = document.getElementById('agrowisata-list');
        const filterLocation = document.getElementById('filter-location');
        const savedDataList = document.getElementById('saved-data-list');

        try {
            const data = await this.fetchData();
            console.log('Data dari API:', data);  // Log data API untuk debugging

            this.displayAgrowisata(data, agrowisataList);
            this.renderSavedData(savedDataList);

            filterLocation.addEventListener('change', async (event) => {
                const location = event.target.value;
                console.log('Filter lokasi yang dipilih:', location);  // Log lokasi yang dipilih untuk debugging
                
                const filteredData = this.filterDataByLocation(data, location);

                console.log('Data setelah filter:', filteredData);  // Log data yang sudah difilter
                this.displayAgrowisata(filteredData, agrowisataList);
            });
        } catch (error) {
            console.error('Error fetching agrowisata data:', error);
            agrowisataList.innerHTML = `<li>Error fetching data. Please try again later.</li>`;
        }
    }

    async fetchData() {
        const response = await fetch(this.API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    displayAgrowisata(data, container) {
        if (data.length === 0) {
            container.innerHTML = `<li>No agrowisata found.</li>`;
            return;
        }

        container.innerHTML = ''; // Clear previous content

        data.forEach((agrowisata) => {
            const listItem = document.createElement('li');
            listItem.className = 'agrowisata-item';
            listItem.innerHTML = `
                <h2>${agrowisata.name}</h2>
                <p><strong>Lokasi:</strong> ${agrowisata.location}</p>
                <p><strong>URL Maps:</strong> <a href="${agrowisata.urlmaps}" target="_blank" rel="noopener noreferrer">Lihat di Maps</a></p>
                <p><strong>Fasilitas:</strong> ${agrowisata.fasilitas}</p>
                <button class="save-btn" data-id="${agrowisata._id}">Simpan</button>
            `;
            container.appendChild(listItem);
        });

        const saveButtons = container.querySelectorAll('.save-btn');
        saveButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const agrowisataId = event.target.dataset.id;
                this.saveAgrowisata(agrowisataId);
            });
        });
    }

    saveAgrowisata(agrowisataId) {
        let savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
        if (!savedData.includes(agrowisataId)) {
            savedData.push(agrowisataId);
            localStorage.setItem('savedAgrowisata', JSON.stringify(savedData));
            this.renderSavedData(); // Render ulang data yang tersimpan
        }
    }

    renderSavedData(container) {
        const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
        container.innerHTML = ''; // Clear previous content
        if (savedData.length === 0) {
            container.innerHTML = `<li>No data saved.</li>`;
            return;
        }

        savedData.forEach((id) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Agrowisata ID: ${id}`; // Tampilkan hanya ID agrowisata
            container.appendChild(listItem);
        });
    }

    filterDataByLocation(records, selectedLocation) {
        if (!selectedLocation) return records;

        const normalizedLocation = selectedLocation.trim().toLowerCase();

        if (normalizedLocation === "wilayah lainnya") {
            return records.filter(record => {
                const excludedLocations = ["jakarta timur", "jakarta barat", "jakarta utara", "jakarta selatan", "jakarta pusat"];
                return !excludedLocations.some(location => record.location.toLowerCase().includes(location));
            });
        }

        return records.filter(record => record.location.toLowerCase().includes(normalizedLocation));
    }
}

export default AgrowisataPage