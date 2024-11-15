const Home = {
  async render() {
      return `
          <h2 style="text-align: center;">Selamat datang di aplikasi Agrowisata dan Desa Wisata</h2>
          <div style="display: flex; justify-content: center; align-items: center;">
              <img src="assets/agrowisata.jpeg" alt="Desa Wisata" style="max-width: 100%; height: auto; border-radius: 8px;">
          </div>
          
          <h3>Apa itu Desa Wisata?</h3>
          <p>Desa wisata adalah desa yang dikembangkan untuk menarik wisatawan dengan menawarkan pengalaman budaya lokal, keindahan alam, serta kegiatan tradisional.</p>
          
          <h3>Apa itu Agrowisata?</h3>
          <p>Agrowisata adalah bentuk wisata yang mengedepankan kegiatan pertanian dan alam sebagai daya tarik utamanya.</p>
      `;
  },
  async afterRender() {},
};

export default Home;
