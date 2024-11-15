const Home = {
  async render() {
      return `
      <h2>Selamat datang di aplikasi Agrowisata dan Desa Wisata</h2>
      <img src="/src/public/agrowisata.jpeg" alt="Desa Wisata" style="width: 100%; height: auto;">
      
      <h3>Apa itu Desa Wisata?</h3>
      <p>Desa wisata adalah desa yang dikembangkan untuk menarik wisatawan dengan menawarkan pengalaman budaya lokal, keindahan alam, serta kegiatan tradisional. Wisatawan dapat merasakan kehidupan masyarakat desa secara langsung dan ikut berpartisipasi dalam aktivitas yang ada di sana.</p>
      
      <h3>Apa itu Agrowisata?</h3>
      <p>Agrowisata adalah bentuk wisata yang mengedepankan kegiatan pertanian dan alam sebagai daya tarik utamanya. Pengunjung dapat mengunjungi perkebunan, ladang, atau peternakan, dan belajar mengenai proses pertanian serta menikmati hasilnya secara langsung.</p>
      `;
  },

  async afterRender() {
      // Anda bisa menambahkan interaksi atau efek tambahan di sini
  },
};

export default Home;
