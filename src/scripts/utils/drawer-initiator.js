const DrawerInitiator = {
  init({ button, drawer, content }) {
    if (!button) {
      console.error('Tombol hamburger tidak ditemukan');
      return;
    }

    // Pastikan tombol hanya memiliki satu event listener
    if (!button._hasEventListener) {
      button.addEventListener('click', (event) => {
        this._toggleDrawer(event, drawer);
      });
      button._hasEventListener = true;
    }

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
