import Agrowisata from "../views/pages/agrowisata";
import Home from "../views/pages/home";
import aboutus from "../views/pages/aboutus";
import desawisata from "../views/pages/desawisata";

const routes = {
    '/': Home,
    '/home': Home,
    '/agrowisata': Agrowisata, 
    '/aboutus': aboutus,
    '/desawisata': desawisata,
};

export default routes;