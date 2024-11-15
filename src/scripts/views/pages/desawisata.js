const desawisata = {
    async render() {
      // Mengambil data dari API
      const apiUrl = 'https://cors-anywhere.herokuapp.com/https://katalogdata.kemenparekraf.go.id/api/3/action/datastore_search?resource_id=80461f76-2299-495b-bcba-e39205b9c0f1';
      const data = await this.fetchData(apiUrl);
  
      // Membuat HTML dinamis berdasarkan data yang diambil
      const desaWisataHTML = data.map(record => `
        <div class="desawisata-item">
          <h3>${record.Destinasi || 'Nama desa tidak tersedia'}</h3>
          <p><strong>Kabupaten/Kota:</strong> ${record['Kabupaten/Kota'] || 'Kabupaten tidak tersedia'}</p>
          <p><strong>Provinsi:</strong> ${record.Provinsi || 'Provinsi tidak tersedia'}</p>
          <p><strong>Tahun Sertifikasi:</strong> ${record['Tahun Sertifikasi'] || 'Tahun tidak tersedia'}</p>
        </div>
      `).join('');
  
      // Menyisipkan HTML ke dalam elemen #desawisata-list
      const container = document.getElementById('desawisata-list');
      if (container) {
        container.innerHTML = desaWisataHTML;
      } else {
        console.error('Elemen dengan ID "desawisata-list" tidak ditemukan');
      }
    },
  
    async afterRender() {
      // Implementasi setelah render, misalnya jika perlu interaksi lebih lanjut
    },
  
    // Fungsi untuk mengambil data dari API
    async fetchData(url) {
      try {
        const response = await fetch(url);
        const result = await response.json();
        return result.success ? result.result.records : [];
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    }
  };
  
  export default desawisata;
  