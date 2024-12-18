# TravelKuy

> **TravelKuy** adalah aplikasi web untuk menampilkan katalog **Agrowisata** dan **Desa Wisata**. Pengguna dapat menjelajahi lokasi wisata berdasarkan kategori, melihat detail tiap lokasi, menyimpan lokasi favorit, serta memberikan ulasan dan rating.

## Fitur

- **Tampilan Daftar Agrowisata**: Menampilkan daftar agrowisata lengkap dengan URL peta yang dapat diklik untuk memudahkan navigasi. Pengguna dapat mencari dan memfilter daftar agrowisata berdasarkan wilayah, serta menyimpan yang sesuai dengan rencana liburan.
- **Tampilan Daftar Desa Wisata**: Menampilkan informasi lengkap tentang desa wisata, termasuk deskripsi, kegiatan yang dapat dilakukan, serta ulasan. Pengguna juga dapat memberikan ulasan dan melihat video terkait sebagai referensi liburan.
- **Data Tersimpan**: Pengguna dapat menambahkan lokasi agrowisata ke dalam daftar simpan dan menghapusnya.
- **Pencarian Lokasi Wisata**: Pengguna dapat mencari lokasi wisata berdasarkan nama dan lokasi.
- **Ulasan Pengguna**: Pengguna dapat memberikan ulasan dan rating pada lokasi desa wisata yang telah dikunjungi.
- **Penyimpanan Lokal**: Data lokasi wisata dan ulasan disimpan menggunakan IndexedDB pada penyimpanan lokal browser.
- **Edit Profile**: Pengguna dapat melakukan edit profile seperti edit nama, username dan password.

## Persyaratan Sistem

Berikut adalah perangkat lunak dan dependensi yang dibutuhkan untuk menjalankan proyek ini:

- **Node.js**: Versi 14 atau lebih tinggi
- **MongoDB**: Digunakan untuk menyimpan data pengguna (jika ada halaman login dan registrasi)
- **npm**: Paket manajer untuk instalasi dependensi

### Dependensi

#### Dependensi Frontend

- `@babel/core`: ^7.26.0 — Core Babel compiler untuk transpiling kode JavaScript.
- `@babel/preset-env`: ^7.26.0 — Preset Babel untuk mentranspile JavaScript sesuai dengan lingkungan target.
- `babel-loader`: ^9.2.1 — Loader untuk Webpack yang memungkinkan penggunaan Babel untuk mengonversi kode JavaScript.
- `copy-webpack-plugin`: ^12.0.2 — Plugin Webpack untuk menyalin file atau aset ke folder build.
- `css-loader`: ^7.1.2 — Loader Webpack untuk mengonversi file CSS menjadi module JavaScript.
- `file-loader`: ^6.2.0 — Loader Webpack untuk memproses file statis (misalnya gambar, font, dll.).
- `html-webpack-plugin`: ^5.6.3 — Plugin Webpack untuk menghasilkan file HTML dengan aset yang terhubung.
- `http-server`: ^14.1.1 — Server HTTP statis yang digunakan untuk menjalankan aplikasi dalam mode pengembangan.
- `mini-css-extract-plugin`: ^2.9.2 — Plugin Webpack untuk mengekstrak CSS dari JavaScript.
- `style-loader`: ^4.0.0 — Loader Webpack untuk menyisipkan CSS langsung ke dalam DOM.
- `webpack`: ^5.97.1 — Bundler JavaScript untuk aplikasi web.
- `webpack-cli`: ^5.1.4 — Interface command-line untuk Webpack.
- `webpack-dev-server`: ^5.1.0 — Server pengembangan Webpack yang memungkinkan pemantauan dan penyajian file.
- `webpack-merge`: ^6.0.1 — Alat untuk menggabungkan beberapa konfigurasi Webpack.
- `workbox-webpack-plugin`: ^7.3.0 — Plugin Webpack untuk menambahkan fungsionalitas service worker menggunakan Workbox.

#### Dependensi Backend

- `@hapi/hapi`: ^21.3.12 — Framework server HTTP untuk Node.js.
- `bcryptjs`: ^2.4.3 — Modul untuk hashing password.
- `cors`: ^2.8.5 — Middleware untuk mengaktifkan CORS (Cross-Origin Resource Sharing).
- `dotenv`: ^16.4.7 — Modul untuk memuat variabel lingkungan dari file `.env`.
- `hapi-cors`: ^1.0.3 — Middleware untuk menangani CORS di Hapi.js.
- `jsonwebtoken`: ^9.0.2 — Modul untuk membuat dan memverifikasi token JSON Web.
- `mongoose`: ^8.8.4 — ODM (Object Data Modeling) library untuk MongoDB dan Node.js.

## Instalasi

### FRONTEND
Langkah-langkah untuk mengatur proyek di lingkungan lokalmu:

1. **Clone repositori**
   Clone repositori ini ke direktori lokalmu:
   ```bash
   git clone https://github.com/syifacts/TravelKuy-capstoneProject


2. **Masuk ke folder proyek**
    Dengan command 
    cd TravelKuy-capstoneProject

3. **Install Dependensi**
    Jalankan perintah berikut untuk menginstal dependensi yang dibutuhkan
    npm install

4. **Membangun Proyek**
    Untuk membangun aplikasi untuk produksi, jalankan perintah:
    npm run build
    Perintah ini akan menghasilkan versi aplikasi yang teroptimasi yang dapat digunakan di lingkungan produksi.

5. **Menjalankan Proyek**
    Menjalankan Proyek dengan cara 
    npm run start-dev dapat dilihat dari package.json
    Proyek akan berjalan di `http://localhost:4000` (atau port lain yang sesuai)

**BACKEND**
Untuk backend, kami membagi proyek menjadi tiga repositori terpisah yang dapat diakses berikut:
- API Agrowisata: https://github.com/syifacts/agrowisata-api.git
- API Desa Wisata: https://github.com/syifacts/api-desawisata.git
- API User: https://github.com/syifacts/user-api.git

1. **Clone repositori ini ke direktori lokalmu:**

   ```bash
   git clone <sesuaikan dengan repositori yang ingin digunakan>

2. **Masuk ke folder proyek**
    Dengan command 
    cd (sesuaikan dengan yang digunakan)

3. **Install Dependensi**
    Jalankan perintah berikut untuk menginstal dependensi yang dibutuhkan
    npm install

4. **Menjalankan Proyek**
    Menjalankan Proyek dengan cara 
    npm run start
    Proyek akan berjalan di `http://localhost:8080` (atau port lain yang sesuai)


