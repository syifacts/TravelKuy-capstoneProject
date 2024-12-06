const desawisata = {
  cachedData: [],
  newData: [],
  currentPage: 1,
  dataPerPage: 10,

  async render() {
    return `
      <h2>Lokasi Desa Wisata</h2>
      <div id="desa-container" class="grid-container">Memuat data...</div>
      <div id="pagination-container"></div>
    `;
  },

  async afterRender() {
    await this.fetchData();

    const desaContainer = document.getElementById('desa-container');
    const paginationContainer = document.getElementById('pagination-container');

    if (!desaContainer || !paginationContainer) {
      console.error('Elemen tidak ditemukan di DOM.');
      return;
    }

    this.displayData([...this.cachedData, ...this.newData]);
    this.setupPagination();
  },

  async fetchData() {
    if (this.cachedData.length > 0) return;

    try {
      const response = await fetch('desa-wisata.json');
      if (!response.ok) throw new Error('Gagal memuat data');
      const data = await response.json();
      this.cachedData = Object.values(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      const desaContainer = document.getElementById('desa-container');
      if (desaContainer) {
        desaContainer.innerHTML = '<p>Gagal memuat data. Silakan coba lagi nanti.</p>';
      }
    }
  },

  displayData(records) {
    const desaContainer = document.getElementById('desa-container');
    if (!desaContainer) {
      console.error('Elemen desa-container tidak ditemukan.');
      return;
    }

    const paginatedData = this.paginateData(records, this.currentPage);

    desaContainer.innerHTML = '';
    paginatedData.forEach((desa) => {
      const desaElement = document.createElement('div');
      desaElement.classList.add('card');
      desaElement.innerHTML = `
        <img src="${desa.photo}" alt="${desa.name}" class="card-image">
        <div class="card-content">
          <h3>${desa.name}</h3>
          <p>${desa.location}</p>
          <p>${desa.description}</p>
        </div>
      `;
      desaContainer.appendChild(desaElement);
    });
  },

  paginateData(records, currentPage) {
    const startIndex = (currentPage - 1) * this.dataPerPage;
    return records.slice(startIndex, startIndex + this.dataPerPage);
  },

  setupPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
      console.error('Elemen pagination-container tidak ditemukan.');
      return;
    }

    const totalPages = Math.ceil([...this.cachedData, ...this.newData].length / this.dataPerPage);

    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add(i === this.currentPage ? 'active' : '');
      button.addEventListener('click', () => {
        this.currentPage = i;
        this.displayData([...this.cachedData, ...this.newData]);
      });
      paginationContainer.appendChild(button);
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  desawisata.render().then((html) => {
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = html;
      desawisata.afterRender();
    } else {
      console.error('Elemen dengan id "app" tidak ditemukan.');
    }
  });
});

export default desawisata;
