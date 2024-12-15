const Desawisata = {
  API_URL: 'https://apidesawisata-353b9a2a7d66.herokuapp.com/desawisata',
  itemsPerPage: 12,
  currentPage: 1,
  data: [], // Properti untuk menyimpan data dari API

  async render() {
    return `
      <h1>Daftar Desa Wisata</h1>
      <input type="text" id="search-input" placeholder="Cari desa wisata..." />
      <ul id="desawisata-list" class="desawisata-list"></ul>
      <div id="pagination-controls"></div>
    `;
  },

  async afterRender() {
    const desawisataList = document.getElementById('desawisata-list');
    const paginationControls = document.getElementById('pagination-controls');
    const searchInput = document.getElementById('search-input');

    try {
      this.data = await this.fetchData(); // Simpan data di this.data
      console.log('Data dari API:', this.data);

      this.displayDesawisata(this.data, desawisataList);
      this.createPaginationControls(this.data.length, paginationControls);

      // Event listener untuk pencarian
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredData = this.data.filter(desawisata =>
          desawisata.name.toLowerCase().includes(query)
        );
        this.displayDesawisata(filteredData, desawisataList);
        this.createPaginationControls(filteredData.length, paginationControls);
      });
    } catch (error) {
      console.error('Error fetching desawisata data:', error);
      desawisataList.innerHTML = `<li>Error fetching data. Please try again later.</li>`;
    }
  },

  async fetchData() {
    const response = await fetch(this.API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  displayDesawisata(data, container) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const currentPageData = data.slice(startIndex, endIndex);

    if (currentPageData.length === 0) {
      container.innerHTML = `<li>No desawisata found.</li>`;
      return;
    }

    container.innerHTML = ''; // Clear previous content

    currentPageData.forEach((desawisata) => {
      const listItem = document.createElement('li');
      listItem.className = 'desawisata-item';
      listItem.dataset.id = desawisata._id;
      listItem.innerHTML = `
        <h2>${desawisata.name}</h2>
        <p><img src="${desawisata.photo}" alt="${desawisata.name}" class="desawisata-img"></p>
        <p><strong>Lokasi:</strong> ${desawisata.location}</p>
        <p><strong>Deskripsi:</strong> ${desawisata.description}</p>
        <button class="detail-btn">Detail</button>
      `;

      const detailButton = listItem.querySelector('.detail-btn');
      detailButton.addEventListener('click', () => {
        window.location.hash = `#/detail/${desawisata._id}`; // Arahkan ke halaman detail desa wisata
      });

      container.appendChild(listItem);
    });
  },

  createPaginationControls(totalItems, container) {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    let paginationHTML = '';

    if (totalItems === 0) {
      this.currentPage = 1;
    }

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
    }
    container.innerHTML = paginationHTML;

    const pageButtons = container.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        this.currentPage = Number(event.target.dataset.page);
        this.displayDesawisata(this.data, document.getElementById('desawisata-list')); // Gunakan this.data
      });
    });
  },
};

export default Desawisata;
