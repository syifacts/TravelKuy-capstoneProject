const aboutus = {
    async render() {
        return `
        <h2>About Us</h2>
        <div class="aboutus-description">
            <img src="icons/icon.png" alt="TravelKuy Logo" class="aboutus-logo">
            <p><strong>TravelKuy</strong> adalah platform yang menghubungkan wisatawan dengan destinasi agrowisata dan desa wisata, memberikan informasi lengkap mengenai tempat wisata, dan memudahkan pengunjung untuk menemukan lokasi wisata yang sesuai dengan preferensi mereka. Kami menyediakan berbagai fitur untuk membantu wisatawan merencanakan perjalanan mereka dengan lebih mudah dan menyenankan.</p>
        </div>
        <div class="team-container">
            <div class="team-member">
                <img src="assets/parla.jpg" alt="Parlaungan Siregar">
                <h3>Parlaungan Siregar</h3>
                <p>Universitas Malikussaleh</p>
                <p>
                    <a href="https://github.com/Parlaungan08" target="_blank"><img src="assets/github.png" alt="Github"></a>
                    <a href="https://www.linkedin.com/in/parlaungan-siregar-1493322b9/" target="_blank"><img src="assets/linkedid.png" alt="Linkedin"></a>
                    <a href="https://www.instagram.com/parlaungan344/" target="_blank"><img src="assets/1384063.png" alt="Instagram"></a>
                </p>
            </div>
            <div class="team-member">
                <img src="assets/fadil.jpg" alt="Ikhsan Fadillah">
                <h3>Ikhsan Fadillah</h3>
                <p>Politeknik Negeri Jakarta</p>
                <p>
                    <a href="https://github.com/ikhsan111" target="_blank"><img src="assets/github.png" alt="Github"></a>
                    <a href="https://www.linkedin.com/in/parlaungan-siregar-1493322b9/" target="_blank"><img src="assets/linkedid.png" alt="Linkedin"></a>
                    <a href="https://www.instagram.com/iksanfdllh/" target="_blank"><img src="assets/1384063.png" alt="Instagram"></a>
                </p>
            </div>
            <div class="team-member">
                <img src="assets/sifa.jpg" alt="Syifa Chandra Tiffani">
                <h3>Syifa Chandra Tiffani</h3>
                <p>Politeknik Negeri Jakarta</p>
                <p>
                    <a href="https://github.com/syifacts" target="_blank"><img src="assets/github.png" alt="Github"></a>
                    <a href="https://www.linkedin.com/in/syifa-chandra-tiffani-sumardi/" target="_blank"><img src="assets/linkedid.png" alt="Linkedin"></a>
                    <a href="https://www.instagram.com/syifacts_?igsh=bGVibjRxbnU3OWtl" target="_blank"><img src="assets/1384063.png" alt="Instagram"></a>
                </p>
            </div>
            <div class="team-member">
                <img src="assets/yeudanta.jpg" alt="Yeudanta Mahardika">
                <h3>Yeudanta Mahardika</h3>
                <p>Universitas Duta Wacana</p>
                <p>
                    <a href="https://github.com/yuudantaa" target="_blank"><img src="assets/github.png" alt="Github"></a>
                    <a href="https://id.linkedin.com/in/yeudanta-mahardika-aditya-wicaksana-87222733b" target="_blank"><img src="assets/linkedid.png" alt="Linkedin"></a>
                    <a href="https://www.instagram.com/yu_dantaa_/" target="_blank"><img src="assets/1384063.png" alt="Instagram"></a>
                </p>
            </div>
        </div>`;
    },

    async afterRender() {

    },
};

export default aboutus;
