import Agrowisata from "../views/pages/agrowisata";
import Home from "../views/pages/home";
import aboutus from "../views/pages/aboutus";
import desawisata from "../views/pages/desawisata";
import SavedDataPage from "../views/pages/saved-data-page";
import Detail from "../views/pages/detailPage";
import AgrowisataPage from "../views/pages/agrowisata";

const routes = {
    '/': Home,
    '/home': Home,
    '/agrowisata': AgrowisataPage, 
    '/aboutus': aboutus,
    '/desawisata': desawisata,
    '/detail/:id': Detail, // Menambahkan route untuk detail desa wisata
    '/saved-data-page': SavedDataPage,
};

export default routes;
