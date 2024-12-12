import Home from "../views/pages/home";
import aboutus from "../views/pages/aboutus";
import desawisata from "../views/pages/desawisata";
import SavedDataPage from "../views/pages/saved-data-page";
import Detail from "../views/pages/detailPage";
import Agrowisata from "../views/pages/agrowisata";
import LoginPage from "../views/pages/loginPage";
import RegisterPage from "../views/pages/register"; // Impor halaman Register

const routes = {
    '/': Home,
    '/home': Home,
    '/agrowisata': Agrowisata, 
    '/aboutus': aboutus,
    '/desawisata': desawisata,
    '/detail/:id': Detail, // Menambahkan route untuk detail desa wisata
    '/saved-data-page': SavedDataPage,
    '/login': LoginPage, // Rute untuk Login
    '/register': RegisterPage, // Rute untuk Register
};

export default routes;
