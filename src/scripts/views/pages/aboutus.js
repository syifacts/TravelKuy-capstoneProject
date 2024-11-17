const aboutus = {
    async render() {
        return `
        <h2>About Us</h2>
        <div style="display: flex; justify-content: Left; align-items: Left;">
              <img src="assets/TravelKuy.jpeg" alt="Desa Wisata" style="max-width: 50%; height: auto; border-radius: 8px;">
          </div>
          <p>
            TravelKuy merupakan website refensi wisata yang akan membantu pengguna untuk mendapatkan informasi mengenai Agrowisata dan Desa Wisata di daerah sekitar. Dengan kegiatan pada agrowisata dan berkunjung ke desa wisata
            memberikan banyak manfaat diantaranya yaitu memperluas wawasan seperti
            pengetahuan, pengalaman rekreasi, melepas lelah dan hubungan usaha di bidang
            pertanian yang meliputi tanaman pangan, hortikultura, perkebunan, perikanan dan
            peternakan.
          </P><br>

          <br><h2>Tim Penyusun</h2>

      <section class="isi">
        <div class="tim">

          <article class="tim-item">
            <img class="tim-item_gambar" src="assets/profile.jpg" alt="Syifa Chandra Tiffani Sumardi">
            <div class="tim-item_isi">
              <h1 class="tim-item_nama"><a href="#">Syifa Chandra Tiffani Sumardi</a></h1>
              <p class="tim-item_asal">Asal Kota</p>
              <p class="tim-item_posisi">Back-End</p>
            </div>
          </article>

          <article class="tim-item">
            <img class="tim-item_gambar" src="assets/profile.jpg" alt="Yeudanta Mahardika Aditya Wicaksana">
            <div class="tim-item_isi">
              <h1 class="tim-item_nama"><a href="https://github.com/yuudantaa">Yeudanta Mahardika Aditya Wicaksana</a></h1>
              <p class="tim-item_asal">Asal Kota</p>
              <p class="tim-item_posisi">Front-End</p>
            </div>
          </article>

          <article class="tim-item">
            <img class="tim-item_gambar" src="assets/profile.jpg" alt="Parlaungan Siregar">
            <div class="tim-item_isi">
              <h1 class="tim-item_nama"><a href="#">Parlaungan Siregar</a></h1>
              <p class="tim-item_asal">Asal Kota</p>
              <p class="tim-item_posisi">Front-End</p>
            </div>
          </article>

          <article class="tim-item">
            <img class="tim-item_gambar" src="assets/profile.jpg" alt="Ikhsan Fadillah<">
            <div class="tim-item_isi">
              <h1 class="tim-item_nama"><a href="#">Ikhsan Fadillah</a></h1>
              <p class="tim-item_asal">Asal Kota</p>
              <p class="tim-item_posisi">Front-End</p>
            </div>
          </article>

          </section>
          </div>
        `;
    },

    async afterRender() {

    },
};

export default aboutus;