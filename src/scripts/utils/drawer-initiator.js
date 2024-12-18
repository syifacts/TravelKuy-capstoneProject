const DrawerInitiator = {
  init({ button, drawer, content }) {
    // Hapus event listener lama jika ada
    button.replaceWith(button.cloneNode(true));
    button = document.querySelector('#hamburgerButton'); // Ambil elemen baru

    // Pastikan tombol hamburger tetap bisa berfungsi
    button.addEventListener('click', (event) => {
      this._toggleDrawer(event, drawer);
    });

    content.addEventListener('click', (event) => {
      this._closeDrawer(event, drawer);
    });
  },

  _toggleDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.toggle('open');
  },

  _closeDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.remove('open');
  },
};

export default DrawerInitiator;
