import { Redirect, Route } from 'react-router-dom';
import { useState } from 'react';
import { SQLiteHook, useSQLite } from 'react-sqlite-hook';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import TomaDatos from './pages/form-datos-toma/form-datos-toma.page'
import CapturaLectura from './pages/captura-de-lectura/captura-de-lectura.page'
import HistorialLecturas from './pages/historial-lecturas/historial-lecturas.page'
import EditarLectura from './pages/editar-lecturas-agua/editar-lecturas-agua.page'
import Reportes from './pages/reportes/reportes.page';
import ReportesContrato from './pages/buscar-contrato-reporte/buscar-contrato-reporte';
//import HistorialReportes from './pages/historial-reportes/historial-reportes.page';
//import DetallesHistorial from './pages/detalle-reporte/detalle-reporte.page';
import DatosContribuyente from './pages/datos-contribuyente/datos-del-contribuyente';
import PrincipalCortes from './pages/captura-cortes/buscar-contrato';
import RealizarCorte from './pages/realizar-corte/realizar-corte';
import BuscarCorte from './pages/buscar-corte/buscar-corte';
import MultarToma from './pages/multar-toma/multar-toma.page';
import RealizarMulta from './pages/Realizar-multa/realizar-multa.page';
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
interface JsonListenerInterface {
  jsonListeners: boolean,
  setJsonListeners: React.Dispatch<React.SetStateAction<boolean>>,
}
interface existingConnInterface {
  existConn: boolean,
  setExistConn: React.Dispatch<React.SetStateAction<boolean>>,
}
/** NOTE: Propiedades de la conexion a la base de datos */
export let sqlite:SQLiteHook;
export let existingConn: existingConnInterface;

const App: React.FC = () => {
  /* NOTE: Iniciamos los datos de la base de datos */ 
  const [existConn, setExistConn] = useState(false);
  existingConn = {existConn: existConn, setExistConn: setExistConn};
  sqlite = useSQLite();
  console.log(`$$$ in App sqlite.isAvailable  ${sqlite.isAvailable} $$$`);
  return(
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
        <Route exact path = "/buscar-corte" >
          <BuscarCorte />
        </Route>
        <Route exact path = "/reportes.page">
          <Reportes />
        </Route>
        <Route exact path = "/ContratosReportes" >
          <ReportesContrato />
        </Route>
        <Route exact path = "/Multas" >
          <MultarToma />
        </Route>
        <Route exact path = "/RealizarMulta" >
          <RealizarMulta />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  )
};

export default App;
