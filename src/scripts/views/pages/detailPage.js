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

    try {
      const response = await fetch(`https://apidesawisata-353b9a2a7d66.herokuapp.com/desawisata/${id}`);
      const desa = await response.json();

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
    } catch (error) {
      console.error('Error fetching desa data:', error);
      const detailContainer = document.getElementById('detail-container');
      if (detailContainer) {
        detailContainer.innerHTML = '<p>Desa tidak ditemukan.</p>';
      }
    }
  },
};

export default Detail;
