import DesaWisataService from './desawisata-service';

const Detail = {
  async render() {
    return `
      <section class="detail-desa">
        <div id="detail-container">Memuat detail...</div>
      </section>
    `;
  },

  async afterRender() {
    const urlParams = window.location.hash.split('/');
    const id = urlParams[urlParams.length - 1];
    const desa = await DesaWisataService.getDesaById(id);

    const detailContainer = document.getElementById('detail-container');
    if (!detailContainer) {
      console.error('Elemen detail-container tidak ditemukan.');
      return;
    }

    if (!desa) {
      detailContainer.innerHTML = '<p>Desa tidak ditemukan.</p>';
      return;
    }

    detailContainer.innerHTML = `
      <div class="detail-container">
        <img src="${desa.photo}" alt="${desa.name}" class="detail-image">
        <h2>${desa.name}</h2>
        <p><strong>Lokasi:</strong> ${desa.location}</p>
        <p><strong>Deskripsi:</strong> ${desa.description}</p>
        <p><strong>Detail:</strong> ${desa.longdesc}</p>
        <div class="video-container">
          <h3>Video</h3>
          <iframe width="560" height="315" src="${desa.urlvid}" frameborder="0" allowfullscreen></iframe>
        </div>
        <a href="#/desawisata" class="back-button">Kembali</a>
      </div>
    `;
  },
};

export default Detail;
