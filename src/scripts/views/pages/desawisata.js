/* const desawisata = {
  async render() {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const apiUrl = 'https://katalogdata.kemenparekraf.go.id/api/3/action/datastore_search?resource_id=80461f76-2299-495b-bcba-e39205b9c0f1';

    const data = await this.fetchData(apiUrl);

    const container = document.getElementById('desawisata-list');
    if (container) {
      if (data.length > 0) {
        container.innerHTML = data.map(record => `
          <div class="desawisata-item">
            <h3>${record.Destinasi || 'Nama desa tidak tersedia'}</h3>
            <p><strong>Kabupaten/Kota:</strong> ${record['Kabupaten/Kota'] || 'Kabupaten tidak tersedia'}</p>
            <p><strong>Provinsi:</strong> ${record.Provinsi || 'Provinsi tidak tersedia'}</p>
            <p><strong>Tahun Sertifikasi:</strong> ${record['Tahun Sertifikasi'] || 'Tahun tidak tersedia'}</p>
          </div>
        `).join('');
      } else {
        container.innerHTML = '<p>Data desa wisata tidak ditemukan.</p>';
      }
    } else {
      console.error('Elemen dengan ID "desawisata-list" tidak ditemukan');
    }
  },

  async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      return result.result?.records || [];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  },

  async afterRender() {
    // Logika tambahan setelah render, misalnya menambahkan event listener
    const items = document.querySelectorAll('.desawisata-item h3');
    items.forEach(item => {
      item.addEventListener('click', () => {
        alert(`Anda mengklik: ${item.textContent}`);
      });
    });
  }
};

export default desawisata;
*/