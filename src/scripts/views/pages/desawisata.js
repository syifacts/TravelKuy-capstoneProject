import DesaWisataService from './desawisata-service';

const desawisata = {
  async render() {
    return `
      <section class="desa-wisata">
        <h2>Lokasi Desa Wisata</h2>
        <div id="desa-container" class="grid-container">Memuat data...</div>
        <div id="pagination-container"></div>
      </section>
    `;
  },

  async afterRender() {
    const data = await DesaWisataService.fetchData();
    const desaContainer = document.getElementById('desa-container');

    if (!desaContainer) {
      console.error('Elemen desa-container tidak ditemukan.');
      return;
    }

    desaContainer.innerHTML = '';
    data.forEach((desa) => {
      const desaElement = document.createElement('div');
      desaElement.classList.add('card');
      desaElement.innerHTML = `
        <img src="${desa.photo}" alt="${desa.name}" class="card-image">
        <div class="card-content">
          <h3>${desa.name}</h3>
          <p>${desa.location}</p>
          <p>${desa.description}</p>
          <a href="#/detail/${desa.id}" class="detail-link">Lihat Detail</a>
        </div>
      `;
      desaContainer.appendChild(desaElement);
    });
  },
};

export default desawisata;
