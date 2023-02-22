import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonLoading,
  IonNote,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  useIonViewDidEnter,
  useIonViewWillEnter,
  IonRefresherContent,
  IonRefresher
} from "@ionic/react"
import { useEffect, useState } from "react"
import MenuLeft from '../../components/left-menu';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton } from '@ionic/react';
import { solicitarPermisos, verifyGPSPermission, verifyCameraPermission, ObtenerListaCortes, BuscarContratoCorte, BuscarMedidorCorte } from '../../controller/apiController';
import { searchCircle, arrowForwardOutline, arrowBackOutline } from "ionicons/icons";
import { getCuentasPapas, getUsuario, setContratoCorte, getNumeroPaginasTareas } from "../../controller/storageController";
import { useHistory } from 'react-router-dom';

//FIXME: Agregar la validacion de vencimiento de session

const PrincipalCortes: React.FC = () => {
  const history = useHistory();
  const [activarMenu, setActivarMenu] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState(1);
  const [user, setUser] = useState("Prueba");
  const [nombreCliente, setNombreCliente] = useState("Demo OPD");
  const [contrato, setContrato] = useState("");
  const [loading, setLoading] = useState(false);
  const [listaContratos, setListaContratos] = useState<any[]>([]);
  const [tipoMensaje, setTipoMensaje] = useState("Mensaje");
  const [mensaje, setMensaje] = useState("");
  const [sesionValida, setSessionValida] = useState(true);
  const [listaTareas, setListaTareas] = useState<any[]>([]);

  //NOTE: para el control del paginado
  const [index, setIndex] = useState(0);
  const [ totalPaginas, setTotalPaginas ] = useState(1);
  
  useEffect(() => { prepararPantalla(); }, []);
  useIonViewWillEnter(() => { setActivarMenu(false) });
  useIonViewDidEnter(() => { setActivarMenu(true) });
  //INDEV: buscamos los contratos dentro de las tareas del usuarios 
  const BuscarLectura = () => {
    setLoading(true);
    if (contrato != "") {
      tipoFiltro == 1 ? PorContrato(contrato) : porMedidor(contrato);
    } else {
      //NOTE: mostramos los todos los contratos asignados
      mostrarListaContratos();
    }
  }
  const PorContrato = async (contrato: string) => {
    console.log(contrato);
    await BuscarContratoCorte(zeroFill(contrato))
      .then((result) => {
        if (result.length == 0) {
          setMensaje("Contrato no encontrado, favor de revisar sus contrato asignados")
          setListaContratos([]);
        }else{
          setListaContratos(result);
        }
        
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setLoading(false);
      })
  }
  const porMedidor = async (medidor: string) => {
    setLoading(true);
    await BuscarMedidorCorte(medidor)
      .then((result) => {
          if( result.length == 0 ){
            setMensaje("Contrato no encontrado, favor de revisar sus contrato asignados")
            setListaContratos([]);
          }else{
            setListaContratos(result);
          }
      }).catch((error) => {
        setMensaje(error.message);
      }).finally(() => {
        setLoading(false);
      })
  }
  function zeroFill(number: string, width: number = 9) {
    while (number.length < width) {
      number = "0" + number;
    }
    return number;
  }
  const functionValidarLectura = (estatus: number, cobro: number) => {
    let leyendaCobro = "";
    let result = ["", false];
    if (cobro == 1) {
      leyendaCobro = "Cuota Fija ";
    }
    switch (estatus) {
      case 1:
        result = [leyendaCobro + "", cobro == 1];
        break;
      case 2:
        result = [leyendaCobro + "", cobro == 1];
        break;
      case 3:
        result = [leyendaCobro + "Baja Temporal", true];
        break;
      case 4:
        result = [leyendaCobro + "Baja Permanente", true];
        break;
      case 5:
        result = [leyendaCobro + "Inactivo", true];
        break;
      case 6:
        result = [leyendaCobro + "Nueva", true];
        break;
      case 9:
        result = [leyendaCobro + "Sin Toma", true];
        break;
      case 10:
        result = [leyendaCobro + "Multada", true]
        break;
    }
    return result;
  }
  const prepararPantalla = async () => {
    await solicitarPermisos()
      .then(async (err) => {
        console.log("Solicitando persmisos");
        let camera = await verifyCameraPermission();
        let gps = await verifyGPSPermission();
        if (camera && gps) {
          let storageUser = getUsuario();
          setUser(storageUser + "");
        } else {
        }
      }).catch(() => {
        //Quitar antes de la vercion final (solo sirve en web)
        let storageUser = getUsuario();
        setUser(storageUser + "");
      })
    mostrarListaContratos();
  }
  const mostrarDatosContrato = async (item: any, esPapa: boolean) => {
    //NOTE: Verificamos si es una cuenta papa
    if (!esPapa) {
      //INDEV: guardamos los datos en el storage para mostrar en la pantalla
      setContratoCorte(item.id);
      history.push("/realizar-corte");
    }
  }
  const mostrarListaContratos = async () => {
    await ObtenerListaCortes()
      .then( async (result) => {
        if(result.length > 0){
          //NOTE: obtenemos los datos para el paginado
          setIndex(1);
          setTotalPaginas(await getNumeroPaginasTareas());
          let listaSeccion = [];
          for( let i = (0); i < ((index+1)*4); i++ ){
            listaSeccion.push(result[i]);
          }
          setListaContratos(listaSeccion);
          setListaTareas(result);
        }
        //setListaContratos(result);
      })
      .catch((error) => {
        setMensaje(error.message);
      }).finally(() => {
        setLoading(false);
      })
  }
  const paginaAnterior = (  ) =>{
    if( (index - 2) >= 0 ){
      let listaSeccion = [];
      console.log( "Border: " + ((index - 2) * 4 ) + " -> Superior: " +((( index - 1 ) * 4)));
      for( let i = ((index - 2) * 4 ); i <= ((index - 1) * 4)-1; i++ ){
        listaSeccion.push(listaTareas[i]);
      }
      setListaContratos(listaSeccion);
      setIndex((index - 1));
    }
  }
  const paginaSigueinte = async () =>{
    if(( index + 1) < getNumeroPaginasTareas()){
      let listaSeccion = [];
      for( let i = (( index * 4 ) -1) ; i < (( index + 1 )*4) -1; i++ ){
        listaSeccion.push(listaTareas[i]);
      }
      setListaContratos(listaSeccion);
      setIndex((index + 1));
    }
  }
  return (
    <IonPage>
      {
        activarMenu ?
          <MenuLeft /> : <></>
      }
      {/* Cabezera */}
      <IonHeader>
        <IonToolbar color="danger" >
          <IonTitle>{`Cortes`}</IonTitle>
          <IonButtons slot="start" className="btnMenu">
            <IonMenuButton ></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {/* Contenido de la app */}
      <IonContent>
        <IonCard class="ion-text-center" className="box" >
          <IonCardHeader >
            <div>
              <h3>Realizar corte</h3>
              <IonLabel >Puedes realizar busquedas por:</IonLabel>
              <p>Contrato o Medidor</p>
              <br />
            </div>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel>Filtrar Por:</IonLabel>
                    <IonSelect value={tipoFiltro} onIonCancel={() => { setTipoFiltro(1); }} placeholder="Seleccione el filtro" interface="action-sheet" onIonChange={e => { setTipoFiltro(e.detail.value) }} >
                      <IonSelectOption value={1} >Contrato</IonSelectOption>
                      <IonSelectOption value={2} >Medidor</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonInput type="number" placeholder={`Ingrese el ${tipoFiltro == 1 ? "contrato" : "medidor"}`} onIonChange={e => { setContrato(String(e.detail.value)) }}></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <br />
              <IonButton color="danger" expand="block" onClick={BuscarLectura}>
              <IonIcon icon={searchCircle} slot="end" size = "large"></IonIcon>
                 Buscar Toma </IonButton>
              <IonItem></IonItem>
              {
                (listaContratos != null && listaContratos.length > 0) ?
                <IonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton shape="round" color="danger" size="small" onClick={ paginaAnterior} /* disabled={getPuntero() == 0} */>
                        <IonIcon icon={arrowBackOutline} size="small" ></IonIcon>
                      </IonButton></IonCol>
                      <IonCol ><IonLabel className = "center">Pagina:{index == 0 ? 1 : index}</IonLabel></IonCol>
                    <IonCol >
                      <IonButton shape="round" color="danger" onClick={ paginaSigueinte } /* disabled = {getPuntero()+1==getNumeroPaginas()} */>
                        <IonIcon icon={arrowForwardOutline} size="small" ></IonIcon>
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>:<></>
              }
            </IonGrid>
          </IonCardHeader>
          <IonList>
            {
              listaContratos.map((item, index) => {
                if( item != undefined ){
                  let papas = getCuentasPapas();
                  //console.log( "Estado de la toma: " + item);
                  let arrayData = functionValidarLectura(parseInt(item.Estatus), parseInt(item.M_etodoCobro));
                  let cuentaPapa = String(papas).includes(item.id);
                  if (cuentaPapa) {
                    arrayData[0] += "Desarrollo";
                  }
                  return <div className={(cuentaPapa || arrayData[1]) ? 'cuotaFija' : ''} key={index} onClick={() => { mostrarDatosContrato(item, cuentaPapa); }}>
                    <IonItem detail={true} >
                      <IonList>
                        <IonLabel>{item.Contribuyente}</IonLabel>
                        <p>Contrato: {item.ContratoVigente},
                                           Medidor: {item.Medidor},
                                           Toma: {item.Toma}
                                           &nbsp;&nbsp;&nbsp;&nbsp;
                                           {
                            (cuentaPapa || arrayData[1]) ? <IonNote style={{ fontsize: 20 }} color="danger">{arrayData[0]}</IonNote> : ""
                          }
                        </p>
                      </IonList>
                    </IonItem>
                  </div>
                }
              })
            }
          </IonList>
        </IonCard>
        <IonLoading
          cssClass="my-custom-class"
          isOpen={loading}
          onDidDismiss={() => { setLoading(false); }}
          message="Por favor espere"
        />
        <IonAlert
          cssClass="my-custom-class"
          header={tipoMensaje}
          message={mensaje}
          onDidDismiss={() => { if (!sesionValida) { history.replace("./home"); } }}
          isOpen={mensaje.length > 0}
          backdropDismiss={false}
          buttons={[{ text: 'Aceptar', handler: () => { setMensaje("") } }]}
        />
      </IonContent>
    </IonPage>
  )
}
export default PrincipalCortes;