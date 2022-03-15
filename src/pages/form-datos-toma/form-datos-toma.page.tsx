import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonItem,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonLabel,
  IonSelect,
  IonAlert,
  IonSelectOption,
  IonCardContent,
  IonItemDivider,
  IonList,
  IonLoading,
  IonButton,
  IonInput,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  useIonViewWillEnter,
  IonNote,
  
} from "@ionic/react";
import { useHistory } from 'react-router-dom'
import "./form-datos-toma.page.css";
import MenuLeft from '../../components/left-menu';
import { buscarSectores, lecturasPorSectorPage, solicitarPermisos, verifyCameraPermission, verifyGPSPermission, obtenerContribuyente, obtenerTotalDatosSectores, obtenerTotalDatosBusqueda,buscarContrato,buscarPorMedidor, configuracionCuotaFija} from '../../controller/apiController';
import { getUsuario, guardarDatosLectura, cerrarSesion, verifyingSession, setContribuyenteBuscado, setPuntero, getPuntero, getNumeroPaginas, setNumeroPaginas, getClienteNombreCorto, setSector, getSector, getPunteroBusqueda, getPaginasBusqueda, setPunteroBusqueda, setPaginasBusqueda,getCuentasPapas } from '../../controller/storageController';
import { searchCircle, arrowForwardOutline, arrowBackOutline, cogSharp, server } from 'ionicons/icons'
import { Console } from "node:console";
const FormDatosTomaPage: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState('');
  const [sectores, setSectores] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [idSector, setIdSector] = useState("");
  const [loading, setLoading] = useState(false);
  const [lecturas, setLecuras] = useState<any[]>([])
  const [typeErro, setTypeError] = useState('');
  const [permissions, setPermissons] = useState(true);
  const [hideAlertButons, setHideAlertbuttons] = useState(false);
  const [block, setBlock] = useState(false);
  const [tipoMessage, setTipoMessage] = useState("Mensaje");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState(String);
  const [serched, setSerched] = useState(false);
  const [paginas, setPaginas] = useState(Number);
  const [showPagination, setShowPagination] = useState(false);
  const [nombreCliente, setNombreCliente] = useState(String);
  const [busqueda, setBusqueda] = useState(false);
  const [filtro,setFiltro] = useState(1);
  const [placeHolder,setPlaceHolder] = useState("Buscar por contrato");
  const alertButtons = [
    {
      text: "Reintentar", handler: () => {
        setMessage("");
        typeErro == "sectores" ? cargarSectores() : buscarPorSector(idSector);
      }
    },
    {
      text: "Cancelar", handle: () => {
        setMessage("");
      }
    }
  ]
  const [activarMenu,setActivarMenu] = useState(true);
  const isSessionValid = async () => {
    let valid = verifyingSession();
    setTokenExpired(!valid);
    setBlock(!valid);
    let nombreCorto = await getClienteNombreCorto();
    setNombreCliente(String(nombreCorto));
  }

  useEffect(() => { isSessionValid() }, []);
  useEffect(() => { tokenExpired ? logOut(tokenExpired) : prepararPantalla() }, [tokenExpired])

  const logOut = (valid: boolean) => {
    if (valid) {
      setTipoMessage("Sesión no valida");
      setMessage("Inicie sesión por favor\nRegresando...");
      setHideAlertbuttons(true);
      setTimeout(async () => {
        setTipoMessage('Error');
        setMessage('');
        await cerrarSesion()
          .then((result) => {
            history.replace("/home")
          })
      }, 2500);
    }
  }
  const prepararPantalla = async () => {
    await solicitarPermisos()
      .then(async (err) => {
        let camera = await verifyCameraPermission();
        let gps = await verifyGPSPermission();
        if (camera && gps) {
          let storageUser = getUsuario();
          setUser(storageUser + "");
          cargarSectores();
        } else {
          setHideAlertbuttons(true);
          setMessage("Debe otorgar permisos para usar la aplicación");
          setBlock(true)
          setTimeout(() => {
            history.replace("/home")
          }, 2500)
        }
      }).catch(() => {
        //Quitar antes de la vercion final (solo sirve en web)
        let storageUser = getUsuario();
        setUser(storageUser + "");
        cargarSectores()
      })
    /**
   * Activar el metodo solo para la version web de prueba
   */

    //setMessage("EL IOIOA")
  }
  const cargarSectores = async () => {
    await buscarSectores()
      .then(result => setSectores(result))
      .catch(err => {
        let errorMessage = String(err.message);
        let sessionValid = errorMessage.includes("Sesion no valida");
        setTokenExpired(sessionValid);
        setIdSector("");
        if (!sessionValid) {
          setMessage(err.message)
          setTypeError("sectores")
        }
      })
  }
  useIonViewWillEnter(()=>{setActivarMenu(true)});
  const buscarPorSector = async (idSector:string) => {
    setBusqueda(false)
    setLoading(true);
    await obtenerTotalDatosSectores(idSector).then((result) => {
      console.log(result);
      setNumeroPaginas(parseInt(result + ""))
      setPaginas(parseInt(result + ""));
      setPuntero(0)
    })
    await lecturasPorSectorPage(idSector, 0)
      .then((result) => {
        setShowPagination(true);
        setLecuras(result);
        setSerched(false)
        setPuntero(0);
      })
      .catch((err) => {
        setLecuras([]);
        let errorMessage = String(err.message);
        let expired = errorMessage.includes("Sesion no valida");
        setTokenExpired(expired);
        if (!expired) {
          setHideAlertbuttons(true)
          setTypeError("Mensaje");
          setMessage(err.message)
        }
      })
      .finally(() => { setLoading(false) })
  }
  const abrirCapturaDatos = async (idLectura: string, contribuyente: string, contratoVigente: string, medidor: string,metodo:number,esPapa:boolean) => {
    if(!esPapa){
      if( metodo != 1 ){
        setContribuyenteBuscado(serched);
        let result = guardarDatosLectura(idLectura, contribuyente, contratoVigente, medidor);
        if (result === true) {
          //Redireccion a toma de lectura
          history.push('/captura-de-lectura.page');
          setHideAlertbuttons(true);
        }
      }else{
        //INDEV: obtenemo la configuracion de los clie 
        await configuracionCuotaFija()
        .then((result)=>{
            //NOTE: si el valor del result es 1 se inserta
            if(result == "1"){
              let result = guardarDatosLectura(idLectura, contribuyente, contratoVigente, medidor);
              if(result === true){
                history.push('/captura-de-lectura.page');
                setHideAlertbuttons(true);
              }
            }else{              
              setHideAlertbuttons(true);
              setTipoMessage("Mensaje");
              setMessage("Temporamemte desabilitado");   
            }
        })
        .catch((error)=>{
          //Mandamos un error al usuario
        })
      }
     }
  }
  const buscarPalabraClave = async () => {

    if(idSector == ""){
      setBusqueda(true);
      setLecuras([]);
      setShowPagination(true);
      setLoading(true);
      await obtenerTotalDatosBusqueda(textoBusqueda,"-1").then((result) => {
        let paginas = parseInt(String(result));
        setPunteroBusqueda(0);
        setPaginasBusqueda(paginas);
        setPaginas(paginas);
      });
      await obtenerContribuyente(textoBusqueda,0,"-1").then((result) => {
        console.log(result);
        setSerched(true);
        setLecuras(result);
      }).catch((err) => {
        setLecuras([]);
        let errorMessage = String(err.message);
        let sessionValid = errorMessage.includes("Sesion no valida");
        if (!sessionValid) {
          setHideAlertbuttons(true);
          setTipoMessage("ERROR");
          setMessage(errorMessage);
        } else {
          setTokenExpired(true);
        }
      }).finally(() => { setLoading(false) });
    }else{
      console.log("Busqueda por sector");
      handleBuscarSectorParablaClave();
    }
  }
  const handleInputSerh = (texto: string) => {
    setTextoBusqueda(texto);
  }
  const handleNextPage = () => {
    setLoading(true);
    let puntero = getPuntero();
    setPuntero(puntero + 1);
    puntero++;
    let pages = getNumeroPaginas();
    let itemIndex = 0;
    if (puntero >= pages) {
      setPuntero(0);
      puntero = 0;
      itemIndex = puntero * 20;
    } else {
      itemIndex = puntero * 20;
    }
    console.log(itemIndex, idSector);
    punteroBuscarPorSector(itemIndex, idSector);
  }
  const handlePreviousPage = () => {
    let puntero = getPuntero();
    if (puntero - 1 < 0) {
      puntero = getNumeroPaginas() - 1;
      setPuntero(puntero);
    } else {
      setPuntero(puntero - 1);
      puntero--;
    }
    let pages = getNumeroPaginas();
    let itemIndex = (puntero * 20);
    punteroBuscarPorSector(itemIndex, idSector);
  }
  const punteroBuscarPorSector = async (offset: number, sector: string) => {
    setBusqueda(false);
    setLoading(true);
    await lecturasPorSectorPage(sector, offset)
      .then((result) => {
        setLecuras(result);
        setSerched(false)
      })
      .catch((err) => {
        console.log(err)
        setLecuras([]);
        let errorMessage = String(err.message);
        let expired = errorMessage.includes("Sesion no valida");
        setTokenExpired(expired);
        if (!expired) {
          setHideAlertbuttons(true)
          setTypeError("Mensaje");
          setMessage(err.message)
        }
      })
      .finally(() => { setLoading(false) })
  }
  const handleSector = (sector: string) => {
    setIdSector(sector);
    setSector(sector);
    buscarPorSector(sector);

  }
  const handleNextPageBusqueda = () => {
    setLoading(true); 
    let puntero = getPunteroBusqueda();
    setPunteroBusqueda(puntero + 1);
    puntero++;
    let pages = getPaginasBusqueda()
    let itemIndex = 0;
    if (puntero >= pages) {
      setPunteroBusqueda(0);
      puntero = 0;
      itemIndex = puntero * 20;
    } else {
      itemIndex = puntero * 20;
    }
    console.log(itemIndex, textoBusqueda);
    punteroBuscarPorClave(itemIndex);
  }
  const handlePreviousPageBusqueda = () => {
    setLoading(true);
    let puntero = getPunteroBusqueda();
    if (puntero - 1 < 0) {
      puntero = getPaginasBusqueda() - 1;
      setPunteroBusqueda(puntero);
    } else {
      setPunteroBusqueda(puntero - 1);
      puntero--;
    }
    let itemIndex = (puntero * 20);
    console.log(itemIndex, textoBusqueda);
    punteroBuscarPorClave(itemIndex);
  }
  const punteroBuscarPorClave = async (offset: number) => {
      setBusqueda(true);
      await obtenerContribuyente(textoBusqueda,offset,"-1").then((result) => {
        setSerched(true);
        setLecuras(result);
      }).catch((err) => {
        let errorMessage = String(err.message);
        let sessionValid = errorMessage.includes("Sesion no valida");
        if (!sessionValid) {
          setHideAlertbuttons(true);
          setTipoMessage("Mensaje");
          setMessage(errorMessage);
        } else {
          setTokenExpired(true);
        }
      }).finally(() => { setLoading(false) });
  }
  const handleCancelSector = () =>{
    setIdSector("");
  }
  const handleBuscarSectorParablaClave = async () =>{
    setBusqueda(true);
    setLecuras([]);
    setShowPagination(true);
    setLoading(true);
    await obtenerTotalDatosBusqueda(textoBusqueda,idSector).then((result) => {
      let paginas = parseInt(String(result));
      setPunteroBusqueda(0);
      setPaginasBusqueda(paginas);
      setPaginas(paginas);
    });
    await obtenerContribuyente(textoBusqueda,0,idSector).then((result) => {
      console.log(result);
      setSerched(true);
      setLecuras(result);
    }).catch((err) => {
      setLecuras([]);
      let errorMessage = String(err.message);
      let sessionValid = errorMessage.includes("Sesion no valida");
      if (!sessionValid) {
        setHideAlertbuttons(true);
        setShowPagination(false);
        setTipoMessage("Mensaje");
        setMessage(errorMessage);
      } else {
        setTokenExpired(true);
      }
    }).finally(() => { setLoading(false) });
  }  
  const handleCancelFiltro = () =>{
    setFiltro(1);
  }
  const buscarFiltro = () =>{
    if(filtro == 1){
      porContrato();
    }
    if(filtro == 2){
      porMedidor();
    }
    if(filtro == 3){
    }
  }
  const porContrato = async () =>{
    setBusqueda(true);
    setLecuras([]);
    setShowPagination(false);
    setLoading(true);
    console.log(zeroFill(textoBusqueda));
    await buscarContrato(zeroFill(textoBusqueda))
    .then(result =>{
      setLecuras(result);
    }).catch(err=>{
      setLecuras([]);
      let errorMessage = String(err.message);
      let expired = errorMessage.includes("Sesion no valida");
      setTokenExpired(expired);
      if (!expired) {
        setHideAlertbuttons(true)
        setTypeError("Mensaje");
        setMessage(err.message)
      }
    }).finally(
     ()=>{setLoading(false);} 
    )
  }
  const porMedidor = async () =>{ 
    setBusqueda(true);
    setLecuras([]);
    setShowPagination(false);
    setLoading(true);
    console.log(zeroFill(textoBusqueda,10));
    await buscarPorMedidor(zeroFill(textoBusqueda,10))
    .then(result =>{
      setLecuras(result);
    }).catch(err=>{
      setLecuras([]);
      let errorMessage = String(err.message);
      let expired = errorMessage.includes("Sesion no valida");
      setTokenExpired(expired);
      if (!expired) {
        setHideAlertbuttons(true)
        setTypeError("Mensaje");
        setMessage(err.message)
      }
    }).finally(
     ()=>{setLoading(false);} 
    )
  }
  const functionValidarLectura = (estatus: number, cobro:number) =>{
    let leyendaCobro = "";
    let result = ["",false];
    if(cobro == 1){
      leyendaCobro = "Cuota Fija ";
    }
  switch(estatus){
    case 1:
      result = [ leyendaCobro + "",cobro == 1];
    break;
    case 2:
     result = [leyendaCobro + "",cobro == 1];
    break;
    case 3:
      result = [ leyendaCobro + "Baja Temporal",true];
    break;
    case 4:
      result = [ leyendaCobro +  "Baja Permanente",true];
    break;
    case 5:
      result = [ leyendaCobro + "Inactivo",true];
    break;
    case 6:
      result = [ leyendaCobro +  "Nueva",true];
    break;    
    case 9:
      result = [ leyendaCobro +  "Sin Toma",true];
    break;
    case 10:
      result = [ leyendaCobro +  "Multada",true]
    break;
  }
  return result;
  }
  function zeroFill( number:string,width:number = 9)
{
  while(number.length < width){
    number = "0"+number;
  }
  return number;
  }
  const handleSelectFiltro = (filter: number) => {
  setFiltro(filter); 
  if(filtro == 1){
    setPlaceHolder("Buscar por Medidor");
  }
  if(filtro == 2){
    setPlaceHolder("Buscar por Contrato");
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
          <IonTitle>{`${user} - ${nombreCliente}`}</IonTitle>
          <IonButtons slot="start" className="btnMenu">
            <IonMenuButton ></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard class="ion-text-center" className="box">
          <IonCardHeader>
            <div>
              <h3>Lectura de agua potable</h3>
              <IonLabel>Puedes realizar busquedas por:</IonLabel>
              <p>Contrato y Medidor</p>
              <br />
            </div>
            <IonGrid>
            <IonRow>
                <IonCol>
                <IonItem>
                  <IonLabel>Filtrar Por:</IonLabel>
                <IonSelect onIonCancel = {handleCancelFiltro} value = {filtro} placeholder = "Seleccione el filtro" interface = "action-sheet" onIonChange = {e => {handleSelectFiltro(parseInt(e.detail.value+""))}}>
                    <IonSelectOption value={1} >Contrato</IonSelectOption>
                    <IonSelectOption value={2} >Medidor</IonSelectOption>
                  </IonSelect>
                </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="9">
                  <IonItem>
                    <IonInput type="number" placeholder = {placeHolder} onIonChange={e => { handleInputSerh(String(e.detail.value)) }}></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol size="2" class="btnSerch">
                  <IonButton color="danger" size="large" shape="round" onClick={buscarFiltro}><IonIcon icon={searchCircle} color="light" size="large"></IonIcon></IonButton>
                </IonCol>
              </IonRow>
              <IonItem>
                <IonLabel className="center" color="">o seleccione un sector</IonLabel>
              </IonItem>
            </IonGrid>
            <IonItem>
              <IonLabel>Sectores</IonLabel>
              <IonSelect
                placeholder="Seleccionar uno"
                onIonChange={e => { handleSector(e.detail.value) }}
                interface="action-sheet"
                disabled={block}
                cancelText="Cancelar"
                value={idSector}
              >
                {
                  sectores != null  ?
                    sectores.map(function (item, index) {
                      return <IonSelectOption key={index} value={item.id}>{item.Sector}</IonSelectOption>
                    }) :
                    <IonSelectOption disabled>
                      Sin Sectores
                    </IonSelectOption>
                }
              </IonSelect>
            </IonItem>
          </IonCardHeader>
          <IonCardContent >
            <IonItemDivider >
              {showPagination ? <IonGrid>
                <IonRow>
                  <IonCol size="2">
                    <IonButton shape="round" color="danger" size="small" onClick={busqueda ? handlePreviousPageBusqueda : handlePreviousPage} /* disabled={getPuntero() == 0} */>
                      <IonIcon icon={arrowBackOutline} size="small" ></IonIcon>
                    </IonButton></IonCol>
                  <IonCol size="8"><IonLabel>Resultados: Pagina {busqueda ? getPunteroBusqueda() + 1 : getPuntero() + 1} de {paginas}</IonLabel></IonCol>
                  <IonCol size="2">
                    <IonButton shape="round" color="danger" onClick={busqueda ? handleNextPageBusqueda : handleNextPage} /* disabled = {getPuntero()+1==getNumeroPaginas()} */>
                      <IonIcon icon={arrowForwardOutline} size="small" ></IonIcon>
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid> : <IonLabel className="center" class="ion-text-center" >Mostrando Resultados</IonLabel>
              }
            </IonItemDivider>
            <IonList >
              {
                lecturas.map(function (item, index) {
                  let papas = getCuentasPapas();
                  let arrayData = functionValidarLectura(parseInt(item.Estatus),parseInt(item.M_etodoCobro));
                  let cuentaPapa = String(papas).includes(item.id);
                  if(cuentaPapa){
                    arrayData[0] += "Desarrollo";  
                  }
                  return <div className = { ( cuentaPapa || arrayData[1]) ? 'cuotaFija':''} key={index} onClick={() => {  abrirCapturaDatos(item.id, item.Contribuyente, item.ContratoVigente, item.Medidor,item.M_etodoCobro,cuentaPapa) }}>
                    <IonItem detail={true} >
                      <IonList>
                        <IonLabel>{item.Contribuyente}</IonLabel>
                        <p>Contrato: {item.ContratoVigente},
                           Medidor: {item.Medidor}, 
                           Toma: {item.Toma}
                           &nbsp;&nbsp;&nbsp;&nbsp;
                           {
                             (cuentaPapa || arrayData[1]) ? <IonNote style ={{fontsize: 20}} color="danger">{arrayData[0]}</IonNote> :""
                           }
                        </p>
                      </IonList>
                    </IonItem>
                  </div>
                })
              }
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonAlert
          cssClass="my-custom-class"
          header={tipoMessage}
          message={message}
          isOpen={message.length > 0}
          backdropDismiss={false}
          buttons={hideAlertButons ? [{ text: "Aceptar", handler: () => { setMessage("") } }] : alertButtons}
        />
        <IonLoading
          cssClass="my-custom-class"
          isOpen={loading}
          onDidDismiss={() => { setLoading(false); }}
          message="Por favor espere"
        />
        <IonAlert
          cssClass="my-custom-class"
          header={"ERROR"}
          message={'Para poder hacer uso de todas las funciones de la aplicaciòn por favor acepta los permisos solicitados por la misma'}
          isOpen={!permissions}
        />
      </IonContent>
    </IonPage>
  );
};

export default FormDatosTomaPage;