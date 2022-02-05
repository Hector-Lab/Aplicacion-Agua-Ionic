import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import TomaDatos from './pages/form-datos-toma/form-datos-toma.page'
import CapturaLectura from './pages/captura-de-lectura/captura-de-lectura.page'
import HistorialLecturas from './pages/historial-lecturas/historial-lecturas.page'
import EditarLectura from './pages/editar-lecturas-agua/editar-lecturas-agua.page'
import Reportes from './pages/reportes/reportes.page';
import HistorialReportes from './pages/historial-reportes/historial-reportes.page';
import DetallesHistorial from './pages/detalle-reporte/detalle-reporte.page';
import DatosContribuyente from './pages/datos-contribuyente/datos-del-contribuyente';
import PrincipalCortes from './pages/captura-cortes/buscar-contrato';
import RealizarCorte from './pages/realizar-corte/realizar-corte';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path = "/form-datos-toma.page">
          <TomaDatos />
        </Route>
        <Route exact path = "/captura-de-lectura.page">
          <CapturaLectura/>
        </Route>
        <Route exact path = "/historial-lecturas.page">
          <HistorialLecturas/>
        </Route>
        <Route exact path = "/editar-lecturas-agua.page">
          <EditarLectura/>
        </Route>
        <Route exact path = "/datos-contribuyente.page">
          <DatosContribuyente/>
        </Route>
        <Route exact path = "/buscar-contrato">
          <PrincipalCortes/>
        </Route>
        <Route exact path = "/realizar-corte">
          <RealizarCorte />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
