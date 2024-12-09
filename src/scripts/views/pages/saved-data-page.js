class SavedDataPage {
    constructor() {
        this.API_URL = 'https://agrowisataapi-1aaac8500e71.herokuapp.com/agrowisata';
    }

    async render() {
        return `
            <h1>Data Tersimpan</h1>
            <ul id="saved-data-list"></ul>
        `;
    }

    async afterRender() {
        const savedDataList = document.getElementById('saved-data-list');
        await this.renderSavedData(savedDataList);
    }

    async renderSavedData(container) {
        const savedData = JSON.parse(localStorage.getItem('savedAgrowisata')) || [];
        container.innerHTML = ''; // Clear previous content

        if (savedData.length === 0) {
            container.innerHTML = `<li>No data saved.</li>`;
            return;
        }

        try {
            const allData = await this.fetchData();
            const filteredData = allData.filter(item => savedData.includes(item._id));

            if (filteredData.length === 0) {
                container.innerHTML = `<li>No data saved.</li>`;
                return;
            }

            filteredData.forEach(agrowisata => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h2>${agrowisata.name}</h2>
                    <p><strong>Lokasi:</strong> ${agrowisata.location}</p>
                    <p><strong>URL Maps:</strong> <a href="${agrowisata.urlmaps}" target="_blank" rel="noopener noreferrer">Lihat di Maps</a></p>
                    <p><strong>Fasilitas:</strong> ${agrowisata.fasilitas}</p>
                `;
                container.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching saved agrowisata data:', error);
            container.innerHTML = `<li>Error fetching data. Please try again later.</li>`;
        }
    }

    async fetchData() {
        const response = await fetch(this.API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
}

export default SavedDataPage;
