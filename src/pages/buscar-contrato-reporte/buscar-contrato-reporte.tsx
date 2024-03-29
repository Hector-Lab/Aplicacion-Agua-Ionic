import React, { useEffect, useState } from "react";
import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonMenuButton, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonLabel,
    IonGrid,
    IonRow, 
    IonCol,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonCardContent,
    IonItemDivider,
    IonIcon,
    IonList,
    IonAlert,
    IonLoading,
    useIonViewWillEnter,
    IonNote,
    useIonViewDidLeave,
} from "@ionic/react";
import MenuLeft from "../../components/left-menu";
import { obtenerDatosCliente, verifyingSession, getClienteNombreCorto, cerrarSesion, getUsuario, setContratoReporte } from "../../controller/storageController";
import { solicitarPermisos, verifyCameraPermission, verifyGPSPermission, ContratosListaContratoReporte, buscarMedidorSinFiltro } from "../../controller/apiController";
import { zeroFill } from '../../utilities';
import { searchCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const ListaContratoReportes : React.FC = () => {
    const [ activarMenu, setActivarMenu ] = useState( false );
    const [ tokenExpirado , setTokenExpirado ] = useState( false );
    const [ nombreCliente, setClienteNombre ] = useState( String );
    const [ tipoMensaje, setTipoMensaje ] = useState( String );
    const [ mensaje, setMensaje ] = useState(String);
    const [ usuario, setUsuario ] = useState("");
    const [ tipoFiltro, setTipoFiltro ] = useState(1);
    const [ placeHolderFiltro, setPlaceHolderFiltro ] = useState("Buscar por contrato");
    const [ palabraClave, setPalabraClave ] = useState(String);
    const [ botonReintentar, setBotonReintentar ] = useState( false );
    const [ tipoError , setTipoError ] = useState( String );
    const [ cargando, setCargando ] = useState(false);
    const [ listaContratos, setListaContratos ] = useState<any[]>([]);
    const listaEstatus = ["Activo","Cortado","Baja Temporal","Baja Permanente","Inactivo","Nueva","","","Sin Toma","Multada"];
    const history = useHistory();

    const [] = useState( true );
    //NOTE: recursos de la pantalla
    const alertButtons = [
        {
          text: "Reintentar", handler: () => {
            setMensaje("");
            buscarContrato(palabraClave);
          }
        },
        {
          text: "Cancelar", handle: () => {
            setMensaje("");
          }
        }
      ]
    //NOTE: Session de los hooks
    useIonViewWillEnter(()=>{setActivarMenu( true )});
    useIonViewDidLeave(()=>{setActivarMenu( false )});
    useEffect(()=>{ verificarSession(); },[]);
    useEffect(()=>{ tokenExpirado ? logOut( tokenExpirado ) : prepararPantalla()  },[tokenExpirado])
    //NOTE: seccion de los metodos
    const verificarSession = async () =>{
        //INDEV: obtenemos el token y lo verificamos
        setTokenExpirado(!verifyingSession());
        setClienteNombre( String(await getClienteNombreCorto()));
    }
    const logOut = async(valido:Boolean) =>{
        if (valido) {
            setTipoMensaje("Sesión no valida");
            setMensaje("Inicie sesión por favor\nRegresando...");
            setTimeout(async () => {
              setTipoMensaje('Error');
              setMensaje('');
              await cerrarSesion()
                .then((result) => {
                  history.replace("/home")
                })
            }, 2500);
          }
    }
    const prepararPantalla = async () => {
        await solicitarPermisos()
        .then( async (  )=>{
            let camera = await verifyCameraPermission();
            let gps = await verifyGPSPermission();
            if(camera && gps ){
                setUsuario(String(getUsuario()));
            }else{
                setMensaje("Debe otorgar permisos para usar la aplicación");
                setTimeout(() => {
                    history.replace("/home")
                }, 2500)
            }
        });
    }
    const handleSelectFiltro = (filtro: number) => {
        setTipoFiltro(filtro);
        filtro == 1 ? setPlaceHolderFiltro("Buscar por Medidor") : setPlaceHolderFiltro("Buscar por Contrato");
    }
    //INDEV: metodo para crear un reporte
    const irReportar = ( item:any ) =>{
        //INDEV: aqui ingresamos el id del contrato 
        setContratoReporte(item.id);
        setCargando( true );
        setTimeout(()=>{
            setCargando( false );
            history.push("/reportes.page");
        },500)
    }
    //INDEV: metodo para la busqueda de contratos sin filtros
    const buscarContrato = async (pablabraClave: string) =>{
        //NOTE: damos formato al contrato
        console.log(zeroFill( pablabraClave ));
        await ContratosListaContratoReporte(zeroFill( pablabraClave ))
        .then(( result )=>{
          if(result.length == 0){
            setTipoError("Mensaje");
            setMensaje("Sin resultados");
            setBotonReintentar(false);
          }
            setListaContratos(result);
        })
        .catch((error)=>{
            console.log(error);
        })
        .finally(()=>{
          setCargando(false);
        })
    } 
    const buscarMedidor = async ( palabraClave: string ) => {
      await buscarMedidorSinFiltro(zeroFill( palabraClave ))
      .then(( result ) => {
        if(result.length == 0){
          setTipoError("Mensaje");
          setMensaje("Sin resultados");
          setBotonReintentar(false);
        }
        setListaContratos( result );
      })
      .catch(( error )=>{
        console.log(error.message);
      }).finally(()=>{
        setCargando( false );
      })
    }
    const realizarBusqueda = async() =>  {
      if( palabraClave.trim().length == 0 ){
        setTipoMensaje("Mensaje");
        setMensaje("Ingrese un contrato o medidor");
        setBotonReintentar( true );
      }else{
        setCargando(true);
        tipoFiltro == 1 ? buscarContrato( palabraClave ) : buscarMedidor( palabraClave );
      }
      
    }
    return (
        <IonPage>
        {
          activarMenu ? 
          <MenuLeft />: <></>
        }
        <IonHeader>
          <IonToolbar color="danger" >
            <IonTitle>{` Reportar `}</IonTitle>
            <IonButtons slot="start" className="btnMenu">
              <IonMenuButton ></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard class="ion-text-center" className="box">
            <IonCardHeader>
              <div>
                <h3> Buscar contrato </h3>
                <IonLabel>Puedes realizar busquedas por:</IonLabel>
                <p>Contrato o Medidor</p>
                <br />
              </div>
              <IonGrid>
              <IonRow>
                  <IonCol>
                  <IonItem>
                    <IonLabel>Filtrar Por:</IonLabel>
                  <IonSelect onIonCancel = {()=>{ setTipoFiltro(1) }} value = { tipoFiltro } placeholder = "Seleccione el filtro" interface = "action-sheet" onIonChange = {e => {handleSelectFiltro(parseInt(e.detail.value+""))}}>
                      <IonSelectOption value={1} >Contrato</IonSelectOption>
                      <IonSelectOption value={2} >Medidor</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonInput type="number" placeholder = {placeHolderFiltro} onIonChange={e => {setPalabraClave(String(e.detail.value)) }}></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="12" > 
                        <IonButton color="danger" expand="block" onClick={ realizarBusqueda } > Buscar Toma <IonIcon icon={searchCircle} color="light" size="large" slot = "end" ></IonIcon></IonButton>
                    </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardHeader>
            <IonCardContent>
                {/*NOTE: contenedor lista*/ }
                <div style = {{flex:1,justifyContent:"center", borderWidth: 1, marginTop: 5 }} >
                    <IonList className = "borderList" >
                        {
                            listaContratos.map((item,index)=>{
                                return <IonItem key = {index} onClick = { ()=>{ irReportar(item); } } >
                                    <IonLabel>
                                        <h2> {item.Contribuyente} </h2>
                                        <p> Contrato: { item.ContratoVigente }, Toma: { item.Toma } </p>
                                        <p> Medidor: { item.Medidor }</p>
                                        <IonNote color="primary">Estado: {listaEstatus[item.Estatus - 1] }</IonNote>
                                    </IonLabel>
                                    
                                    </IonItem>
                            })
                        }
                    </IonList>
                </div>
            </IonCardContent>
          </IonCard>
          <IonAlert
            cssClass="my-custom-class"
            header={tipoMensaje}
            message={mensaje}
            isOpen={mensaje.length > 0}
            backdropDismiss={false}
            buttons={botonReintentar ? [{ text: "Aceptar", handler: () => { setMensaje("") } }] : alertButtons}
          />
          <IonLoading
            cssClass="my-custom-class"
            isOpen={cargando}
            onDidDismiss={() => { setCargando( false ); }}
            message="Por favor espere"
          />
        </IonContent>
      </IonPage>
    );
}

export default ListaContratoReportes;