const Home = {
  async render() {
      return `
          <div class="hero">
            <div class="hero_inner">
            <div class="transparent-box">
            <h1 class="hero-title">Welcome to TravelKuy</h1>
            <p class="hero-desc">Explore Agricultural vacation with us</p>
            <button class="hero-button"> <a href="#/agrowisata">Lets go</a></button>
            </div>           
            </div>
        </div>

        <section class="isi">
        <div class="travelkuy">

          <article class="travelkuy-item">
            <img class="travelkuy-item_gambar" src="assets/DesaWisata.jpeg" alt="Gambar Desa Wisata">
            <div class="travelkuy-item_isi">
              <h1 class="travelkuy-item_judul">Apa itu Desa Wisata?</h1>
              <p class="travelkuy-item_penjelasan">Desa wisata adalah desa yang dikembangkan untuk menarik wisatawan dengan menawarkan pengalaman budaya lokal, keindahan alam, serta kegiatan tradisional.
              </p>
            </div>
          </article>

         <article class="travelkuy-item">
            <img class="travelkuy-item_gambar" src="assets/IniAgroWisata.jpg" alt="Gambar Agrowisata">
            <div class="travelkuy-item_isi">
              <h1 class="travelkuy-item_judul">Apa itu AgroWisata</h1>
              <p class="travelkuy-item_penjelasan">Agrowisata adalah bentuk wisata yang mengedepankan kegiatan pertanian dan alam sebagai daya tarik utamanya.
              </p>
            </div>
          </article>

          </div>
          </section>
      `;
  },
  async afterRender() {},
};

export default Home;
