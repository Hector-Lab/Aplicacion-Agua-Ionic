import React, { useEffect, useState } from "react";
import {
  IonPage,IonHeader,IonTitle,IonToolbar,IonContent,
  IonItem,IonButtons,IonMenuButton,IonCard,IonCardHeader,
  IonLabel,IonSelect,IonAlert,IonSelectOption,IonCardContent,
  IonItemDivider,IonList,IonLoading,IonButton,IonInput,
  IonIcon,IonGrid,IonRow,IonCol,useIonViewWillEnter,
  IonNote,useIonViewWillLeave,IonFab,IonFabButton,
  IonBadge,IonFabList
} from "@ionic/react";
import { Filesystem,Directory } from '@capacitor/filesystem';
import { useHistory } from 'react-router-dom';
import "./form-datos-toma.page.css";
import MenuLeft from '../../components/left-menu';
import { 
  EnviarDatoLocalesAPI,buscarSectores,lecturasPorSectorPage, 
  solicitarPermisos, verifyCameraPermission, verifyGPSPermission,
  obtenerContribuyente, obtenerTotalDatosSectores,
  buscarContrato,buscarPorMedidor, configuracionCuotaFija, 
  DescargarPadronAnomalias,DescargarConfiguraciones,
  DescargarContratosLecturaSector,
  ObtenerSectoresConfigurados
} from '../../controller/apiController';
import { 
  getUsuario, guardarDatosLectura, cerrarSesion, verifyingSession,
  setContribuyenteBuscado, setPuntero, getPuntero, getNumeroPaginas,
  setNumeroPaginas, getClienteNombreCorto, setSector, getPunteroBusqueda,
  getPaginasBusqueda, setPunteroBusqueda,getCuentasPapas,getDatosUsuario,
  ObtenerModoTrabajo 
} from '../../controller/storageController';
import { searchCircle, arrowForwardOutline, arrowBackOutline, cloudDownload, cloudUpload,warningOutline, returnUpBack } from 'ionicons/icons';
import { DEBBUG,TIPOTOMA } from '../../constantes/constantes';
import { isPlatform} from '@ionic/react';
import { 
  SQLITEInsertarDatosExtra,SQLITEObtenerPadronPagina,SQLITEObtenerTotalContratosPadron,SQLITEObtenerContratosFiltroContrato,
  SQLITEObtenerContratosFiltroMedidor,SQLITEObtenerListaSectores,SQLITETruncarTablas,SQLITEInsertarAnomalias,SQLITEInsertarConfiguracionUsuario,
  SQLITEGuardarPadronAgua,SQLITEGuardarLecturaAnteriorContrato, SQLITEInsertarSector,SQLITEObtenerEvidencias,SQLITEObtenerGeoreferencia,
  SQLITEObtenerListaLecturas, SQLITEObtenerContratoVigente,SQLITEBorrarLecturasLocales, SQLITEBorrarDatosPadron
} from '../../controller/DBControler';
import { ContratoAPI,LecturaAnteriorContrato,PadronAguaPotable, Anomalias, DatosLectura, Evidencia, StructuraEvidencia, Sector } from '../../Objetos/Interfaces';
import { obtenerBase64 } from '../../utilities';
import { Network } from '@capacitor/network';
const FormDatosTomaPage: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState('');
  const [sectores, setSectores] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [idSector, setIdSector] = useState("");
  const [loading, setLoading] = useState(false);
  const [lecturas, setLecuras] = useState<any[]>([]);
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
  const [ msjSubiendo, setMsjSubiendo ] = useState(String);
  // NOTE: Contraladores para descargar sectores y lecturas
  const [descargando, setDescargando] = useState(false);
  const [estadoDescarga, setEstadoDescarga] = useState("");
  const [ enLinea, setEnlinea ] = useState(false);
  const [ mostrarBotonDescarga, setMostrarBotonDescarga ] = useState(false);
  //NOTE: Mensaje de descarga 
  const [ verificarDescarga,setVerificarDescarga ] = useState(false);
  //NOTE: 
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
  ];

  const alertButtonsDescarga = [
    {
        text: "Aceptar", handler: () => {
            //NOTE: Mandamos a descargar la base de datos
            setVerificarDescarga(false);
            DescargarRecursos();
        }
    },
    {
        text: "Cancelar", handler: () =>{
          setVerificarDescarga(false);
        }
    }];
  const [activarMenu,setActivarMenu] = useState(true);
  const isSessionValid = async () => {
    if(!VerificarModoTrabajo()){
      console.log("Estamos en linea");
      prepararPantalla()
    }
    else{
      console.log("Estomos en local test");
      PrepararPantallaLocal();
    }
    let valid = verifyingSession();
    setTokenExpired(!valid);
    setBlock(!valid);
    let nombreCorto = getClienteNombreCorto();
    setNombreCliente(String(nombreCorto));
    Network.addListener('networkStatusChange',status => {
      setMostrarBotonDescarga(status.connectionType === "wifi");
    });
    await VerificarTipoConexion();
  }
  useEffect(() => { isSessionValid() }, []);
  useEffect(
    () => {
      if( tokenExpired ){
        logOut(tokenExpired)
      }
    }
    ,[tokenExpired])
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
        setTokenExpired(sessionValid)
        //setIdSector("");
        if (!sessionValid) {
          setMessage(err.message)
          setTypeError("sectores")
        }
      })
  }
  useIonViewWillEnter(()=>{ setActivarMenu(true);console.error("Activando menu") });
  useIonViewWillLeave(()=>{ setActivarMenu(false); console.error("Desactivando menu")});
  //Seccion de metodos en linea
  const buscarPorSector = async (idSector:string) => {
    setBusqueda(false)
    setLoading(true);
    await obtenerTotalDatosSectores(idSector).then((result) => {
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
        //
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
              setMessage("Temporalmente deshabilitado");   
            }
        })
        .catch((error)=>{
          //Mandamos un error al usuario
        })
      }
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
    !enLinea ? punteroBuscarPorSector(itemIndex, idSector) : obtenerPadronContratosLocal(parseInt(idSector));
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
    let itemIndex = (puntero * 20);
    !enLinea ? punteroBuscarPorSector(itemIndex, idSector) : obtenerPadronContratosLocal(parseInt(idSector));
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
    setLoading(true);
    if(enLinea){
        //setIdSector(sector);
        setSector(sector);
        calcularPaginadoLocal(parseInt(sector));
      
    }else{
      if(sector !== ""){
        //setIdSector(sector);
        setSector(sector);
        buscarPorSector(sector);
      }
    }
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
    punteroBuscarPorClave(itemIndex);
  }
  const punteroBuscarPorClave = async (offset: number) => {
      setBusqueda(true);
      //NOTE: Este metodo obtiene los contratos con el puntero desde la API obtenerDatosSectorPalabraClave
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
  const handleCancelFiltro = () =>{
    setFiltro(1);
  }
  const buscarFiltro = () =>{
    setLoading(true);
    setBusqueda(true);
    setLecuras([]);
    setShowPagination(false);
    switch(filtro){
      case 1:
        enLinea ? BuscarPorContratoLocal() : porContrato();
        break;
      case 2: 
        enLinea ? BuscarPorMedidorLocal() : porMedidor();
        break;
      default:
      break;
    }
  }
  const porContrato = async () =>{
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
  const handleSelectFiltro = (filter: number) => {
    setFiltro(filter); 
    if(filtro == 1){
      setPlaceHolder("Buscar por Medidor");
    }
    if(filtro == 2){
      setPlaceHolder("Buscar por Contrato");
    }
  }
  const DescargarRecursos = async () =>{
    setDescargando(true);
    setEstadoDescarga("Eliminando historial antiguo...");
    await SQLITETruncarTablas()
    .then( async ()=>{
      let Anomalias:[Anomalias] = await DescargarPadronAnomalias();
      let ConfiguracionesAgua: {Status:boolean,TipoLectura:number,BloquarCampos:number,Code:number} = await DescargarConfiguraciones(); //NOTE: para las lecturas
      let ConfiguracionUsuario = getDatosUsuario();
      let sectoresConfigurados = await ObtenerSectoresConfigurados();
      await InsertarSectores(sectoresConfigurados);

      await InsertarAnomalias(Anomalias);
      await SQLITEInsertarConfiguracionUsuario(parseInt(ConfiguracionUsuario.Cliente),ConfiguracionUsuario.NombreUsuario,ConfiguracionUsuario.Email,ConfiguracionUsuario.Contrasenia);
      await DescargarPadronSectorAgua(String(ConfiguracionesAgua.BloquarCampos));
      //NOTE: insertamos los datos extra Nombre, Valor, Descripcion       
      await SQLITEInsertarDatosExtra("TipoLectura",String(ConfiguracionesAgua.TipoLectura),"Configuracion para las lecturas de la app DATOS EXTRA SUINPAC"); //NOTE: Para tipo de lectura
      await SQLITEInsertarDatosExtra("BloquarCampos",String(ConfiguracionesAgua.BloquarCampos),"Para bloquear los campos de lectura de la app");
      setHideAlertbuttons(true);
      setMessage("Descarga Completa");
      //setTimeout( async ( )=>{ setDescargando(false); },10000);
    }).catch((error)=>{
      console.error(JSON.stringify(error));
      setMessage(`Error al descargar el padron\n${JSON.stringify(error)}`)
    }).finally(()=>{
      setDescargando(false);
    });
  }
  const InsertarSectores = async ( sectoresLocal:Array<Sector> ) =>{
    //NOTE: Es para ver si funciona la base de datos
    setEstadoDescarga("Insertando Sectores...");
    try {
      if(sectoresLocal != null && sectoresLocal.length > 0){
        for(let indexSectores:number = 0; indexSectores < sectoresLocal.length; indexSectores++ ){
          setEstadoDescarga(`${sectoresLocal[indexSectores].Sector}`)
          SQLITEInsertarSector(sectoresLocal[indexSectores].id,sectoresLocal[indexSectores].Sector);          
        }
      }  
    }catch( error ){
      setEstadoDescarga(`Erorr al realizar descarga de los sectores:\n${ error.message}`);
      setTimeout(()=>{
        setEstadoDescarga("Descargando Sectores...")
      },3000)
    }
  }
  const InsertarAnomalias = async (Anomalias:[{id:number,clave:string,descripci_on:string,AplicaFoto:number}]) =>{
    try{
      setEstadoDescarga("Insertando Anomalias...");
      for(let indexAnomalia:number = 0;indexAnomalia < Anomalias.length; indexAnomalia++ ){
        await SQLITEInsertarAnomalias(Anomalias[indexAnomalia].id,Anomalias[indexAnomalia].clave,Anomalias[indexAnomalia].descripci_on,Anomalias[indexAnomalia].AplicaFoto);
      }
    }catch(error){
      setEstadoDescarga(`Erorr al realizar descarga de las anomalias:\n${ error.message}`);
      setTimeout(()=>{
        setEstadoDescarga("Descargando Padron...")
      },3000)
    }
  }
  const DescargarPadronSectorAgua = async (BloquarCampos:string) => {
    //NOTE: cambiar el map por for
    for(let indexSector:number = 0; indexSector < sectores.length; indexSector++){
      let listaContratos:[ContratoAPI] = await DescargarContratosLecturaSector(String(sectores[indexSector].id));
      setEstadoDescarga(`Descargando contratos del sector: ${sectores[indexSector].Sector}`);
      for(let indexContratos:number = 0; indexContratos < listaContratos.length; indexContratos++ ){
        let padronAgua = ObtenerDatosPadron(listaContratos[indexContratos],sectores[indexSector].id);
        let lecturaActual = ObtenerDatosLecturaAnterior(listaContratos[indexContratos],BloquarCampos);
        //NOTE: Obtenemos el promedio actual del contrato
        if(padronAgua != null)
          await SQLITEGuardarPadronAgua(padronAgua);
        if(lecturaActual != null)
          await SQLITEGuardarLecturaAnteriorContrato(lecturaActual);
      }
    }

    /*sectores.map( async (Sector:{id:number,Sector:string},index)=>{ REVIEW: no respeta la espera 
      let listaContratos:[ContratoAPI] = await DescargarContratosLecturaSector(String(Sector.id));
      listaContratos.map( async (contrato,index) => {
        setEstadoDescarga(`Descargando contratos del sector: ${Sector.Sector}`);
        let padronAgua = ObtenerDatosPadron(contrato,Sector.id);
        let lecturaActual = ObtenerDatosLecturaAnterior(contrato,BloquarCampos);
        //NOTE: Obtenemos el promedio actual del contrato
        if(padronAgua != null)
          await SQLITEGuardarPadronAgua(padronAgua);
        if(lecturaActual != null)
          await SQLITEGuardarLecturaAnteriorContrato(lecturaActual);
      })
    });*/
    return 
  }
  const ObtenerDatosPadron = ( Contrato:ContratoAPI,Sector:number ):PadronAguaPotable|null => {
    if(Contrato != null ){
      let Padron: PadronAguaPotable = {
        ContratoVigente:Contrato.ContratoVigente,
        Contribuyente:Contrato.Contribuyente,
        Estatus:Contrato.Estatus,
        Medidor:Contrato.Medidor,
        MetodoCobro:Contrato.M_etodoCobro,
        Padron:Contrato.id, //NOTE: es el id de padron
        Toma:Contrato.Toma,
        id: -1,
        idSector:Sector,
      }
      return Padron;
    }
    return null;
  }
  const ObtenerDatosLecturaAnterior = ( Contrato:ContratoAPI,BloquarCampos:string ):LecturaAnteriorContrato|null =>{
    if( Contrato != null ){
      let LecturaAnterior:LecturaAnteriorContrato = {
        A_no:Contrato.A_no,
        BloquearCampos:BloquarCampos,
        Direccion: Contrato.Domicilio,
        LecturaActual:Contrato.LecturaActual,
        LecturaAnterior: Contrato.LecturaAnterior,
        Localidad:Contrato.Localidad,
        Mes:parseInt(Contrato.Mes),
        MetodoCobro:Contrato.M_etodoCobro,
        Municipio:Contrato.Municipio,
        TipoToma:Contrato.TipoToma,
        Toma:Contrato.Toma,
        id:-1,
        idPadron:Contrato.id,
        Promedio:Contrato.Promedio
      }
      return LecturaAnterior;
    }
    return null;
  }
  //INDEV: Seccion de metodos para usar base de datos local
  const PrepararPantallaLocal = async () =>{
    console.log("Usando modo local!!");
    let storageUser = getUsuario();
    setUser(storageUser + "");
    setSectores(await SQLITEObtenerListaSectores());
  }
  const BuscarPorContratoLocal = async () => {
    await SQLITEObtenerContratosFiltroContrato(zeroFill(textoBusqueda))
    .then(( listaContrato )=>{
      setLecuras(listaContrato)
    }).catch((error)=>{
      setMessage("Error al obtener registors de la base de datos: " + error.message)
      setTipoMessage("ERROR");
    }).finally(()=>{
      setLoading(false);
    })
  }
  const BuscarPorMedidorLocal = async () => {
    await SQLITEObtenerContratosFiltroMedidor(zeroFill(textoBusqueda))
    .then(( listaContrato )=>{
      setLecuras(listaContrato);
    }).catch(( error )=>{
      setMessage("Error al obtener registors de la base de datos: " + error.message)
      setTipoMessage("ERROR");
    }).finally(()=>{
      setLoading(false);
    })
  }
  const calcularPaginadoLocal = async (idSector:number) => {
    console.log("Buscando sector en local: "+idSector);
    await SQLITEObtenerTotalContratosPadron(idSector)
    .then((totalContratos:number)=>{
      console.log(JSON.stringify(totalContratos));
      if(totalContratos > 0){
        let paginas = totalContratos / 20;
        let residuo = paginas % 1;
        if( residuo > 0 ){
          paginas++;
        }
        //NOTE: lo enviamos al localstorage
        setShowPagination(true);
        setNumeroPaginas(parseInt(String(paginas)))
        setPaginas(parseInt(String(paginas)));
        setPuntero(0);
        obtenerPadronContratosLocal(idSector);
      }else{
        //NOTE: escondemos el paginado y elimnamos los contratos
        setShowPagination(false);
        setNumeroPaginas(0)
        setPaginas(0);
        setPuntero(0);
        setLecuras([]);
      }
    })
    .catch((error)=>{
      console.log("Error en el error: " + error.message);
    }).finally(()=>{
      setLoading(false);
    })
  }
  const obtenerPadronContratosLocal = async (idSector:number) => {
    await SQLITEObtenerPadronPagina(idSector,getPuntero())
    .then(( listaContratos:Array<PadronAguaPotable> ) => {
      setLecuras(listaContratos);
    })
    .catch((error)=>{
      setMessage(error.message);
    }).finally(()=>{
      setLoading(false);
    })
  }
  //metodo para verificar la conexion
  const VerificarTipoConexion = async () => {
    const status = await Network.getStatus();
    setMostrarBotonDescarga(status.connectionType === "wifi");
  }
  const VerificarModoTrabajo = () => {
    let modoTrabajo = ObtenerModoTrabajo();
    setEnlinea(modoTrabajo);
    if(enLinea != modoTrabajo){
      if(!modoTrabajo){
        console.log("Estamos en linea");
        prepararPantalla();
      }else{
        console.log("Estomos en local");
        PrepararPantallaLocal();
      }
      setLecuras([]);
    }
    return modoTrabajo;
  }
  function zeroFill( number:string,width:number = 9){
    while(number.length < width){
      number = "0"+number;
    }
    return number;
  }
  const enviarLecturarRegistradas = async () =>{
    //REVIEW: al que le toque esto es se puede mejorar
    setMsjSubiendo("Buscando Lecturas...");
    setLoading(true);
    try{
      //NOTE: Extraer la lectura
      await SQLITEObtenerListaLecturas()
      .then(( listaLecturas:Array<DatosLectura> )=>{
        //NOTE: recorremos los lecturas 
        listaLecturas.map(  async ( lectura:DatosLectura,index:number )=>{
          //NOTE: obtenemos el contrato vigente
          let labelContratoVigente =  await SQLITEObtenerContratoVigente(lectura.idbLectura);
          setMsjSubiendo(`Enviado lectura del contrato: ${labelContratoVigente}`);
          let evidencias = await SQLITEObtenerEvidencias(lectura.idbLectura);
          let coordenadas = await SQLITEObtenerGeoreferencia(lectura.idbLectura); 
          let listaEvidencia = await codificarEvidencia(evidencias);
          await EnviarDatoLocalesAPI(listaEvidencia,coordenadas,lectura)
          .then( async ( Padron )=>{
            //NOTE: Borramos los datos del telefono para evitar fallos en la realidad
            console.error("Lectura del contrato: ", Padron , " Enviada !!");
            await SQLITEBorrarDatosPadron(Padron)
            .then(( result )=>{
              eliminarEvidenciasLectura(evidencias);
            })
          })
          .catch((error)=>{
            setTipoMessage("Mensaje");
            setHideAlertbuttons(true);
            setMessage(error.message)
          });

        })
        setLoading(false);
      })
      .catch(( error )=>{
        setMessage(`Error al obtener los datos: ${error}`);
      })
    }catch( error ) {
      setTipoMessage("Mensaje");
      setHideAlertbuttons(true);
      setMessage(`Hubo un error al enviar las lecturas: ${error.message}`);
      
    }
  }
  const codificarEvidencia = async ( arregloEvidencia:Array<Evidencia> ):Promise<StructuraEvidencia> => {
    return new Promise( async (resolve,reject)=>{
      try{
        let fotos:StructuraEvidencia = {
          Calle:"",
          Fachada:"",
          Toma:""
        };
        for(let indexEvidencia = 0; indexEvidencia < arregloEvidencia.length; indexEvidencia++ ){
          try{
            let imagenCodificada = String(await obtenerBase64(arregloEvidencia[indexEvidencia].DireccionFisica));
            //console.error(imagenCodificada.substring(0,125),foto.Tipo);
            //NOTE: oganimos todos alv
            if(arregloEvidencia[indexEvidencia].Tipo == "Toma")
              fotos.Toma = imagenCodificada;
            if(arregloEvidencia[indexEvidencia].Tipo == "Facha")
              fotos.Fachada = imagenCodificada;
            if(arregloEvidencia[indexEvidencia].Tipo == "Calle")
              fotos.Calle = imagenCodificada;
          }catch( error ){              
            console.log(`Evidencia: ${arregloEvidencia[indexEvidencia].DireccionFisica} , Tipo: ${arregloEvidencia[indexEvidencia].Tipo}, Error: ${JSON.stringify(error)}`);
          }
        }
        //console.error(`Toma: ${arregloEvidenciaCodificado.Toma.length}, Fachada: ${arregloEvidenciaCodificado.Fachada.length}, Calle: ${arregloEvidenciaCodificado.Calle.length}`);
        resolve( fotos );
      }catch(error){
        console.error(JSON.stringify(error));
        reject(error);
      }
    })
  }
  const EliminarLecturasGuardadas = async () =>{
    setLoading(true);
    await SQLITEBorrarLecturasLocales()
    .then((respuesta:string)=>{ 
      setTipoMessage("Mensaje");
      setHideAlertbuttons(true);
      setMessage(respuesta) 
    })
    .catch((error)=>{ setMessage(error.message) })
    .finally(()=>{ setLoading(false) });
  }
  const eliminarEvidenciasLectura = async ( listaEvidencias:Evidencia[] ) => {
    //NOTE: verificamos que la imagen exista
    for(let indexEvidecia = 0; indexEvidecia < listaEvidencias.length; indexEvidecia ++ ){
      console.log("Borrando evidencia:",listaEvidencias[indexEvidecia].DireccionFisica);
      await Filesystem.deleteFile(
        {
          path:listaEvidencias[indexEvidecia].DireccionFisica,
          directory:Directory.Data
        });
    }
  }
  return (
    <IonPage onFocus = {VerificarModoTrabajo} >
      {
        activarMenu ? 
        <MenuLeft />: <></>
      }
      <IonHeader>
        <IonToolbar color="danger" >
          <IonTitle>{`${user} - ${nombreCliente}`}</IonTitle>
          <IonBadge className = "estadoConexion" slot="end" color = { enLinea ? "medium" : "success" } >{ enLinea ? "Local" : "En linea" }</IonBadge>
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
                      //console.log(JSON.stringify(item));
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
                  <IonCol>
                    <IonButton shape="round" color="danger" size="small" onClick={busqueda ? handlePreviousPageBusqueda : handlePreviousPage} disabled={getPuntero() == 0}>
                      <IonIcon icon={arrowBackOutline} size="small" ></IonIcon>
                    </IonButton></IonCol>
                  <IonCol className = "centrar-ios" >
                    <IonLabel >Pagina {busqueda ? getPunteroBusqueda() + 1 : getPuntero() + 1} de {(paginas == 0 ? 1 : paginas)}</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonButton shape="round" color="danger" onClick={busqueda ? handleNextPageBusqueda : handleNextPage}  disabled = {getPuntero()+1==(getNumeroPaginas())}>
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
                  //console.error("Estatus: ",item.Estatus,"Metodo de cobro:",parseInt( !enLinea ? item.M_etodoCobro : item.MetodoCobro ));
                  let arrayData = functionValidarLectura(parseInt(item.Estatus),parseInt( !enLinea ? item.M_etodoCobro : parseInt(item.MetodoCobro) ));
                  console.log("Datos en el contraro:", parseInt(item.MetodoCobro ),JSON.stringify(arrayData),"Contrato:",item.ContratoVigente);
                  let cuentaPapa = String(papas).includes(!enLinea ? item.id : String(item.Padron));
                  if(cuentaPapa){
                    arrayData[0] += "Desarrollo";  
                  }
                  return <div className = { ( cuentaPapa || arrayData[1]) ? 'cuotaFija':''} key={index} onClick={() => {  abrirCapturaDatos(!enLinea ? item.id : item.Padron, item.Contribuyente, item.ContratoVigente, item.Medidor,(enLinea) ?  item.MetodoCobro : item.M_etodoCobro,cuentaPapa) }}>
                    <IonItem detail={true} className = {isPlatform("ios") ? "padding-ios" : "" } >
                      <IonList>
                        <IonLabel>{item.Contribuyente}</IonLabel>
                        <p>Contrato: {item.ContratoVigente},
                           Medidor: {item.Medidor},  
                           Toma: { !enLinea ? item.Toma : TIPOTOMA[item.Toma-1] }
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
          buttons={ hideAlertButons ?  [{ text: "Aceptar", handler: () => { setMessage("") }}] : alertButtons }
        />
        <IonAlert
          cssClass = "my-custom-class"
          header = {"VERIFICAR"}
          message = { "Actualizar Contratos del dispositivo" }
          isOpen = { verificarDescarga }
          backdropDismiss = { false }
          buttons = { alertButtonsDescarga }
        />
        <IonLoading
          cssClass="my-custom-class"
          isOpen={loading}
          onDidDismiss={() => { setLoading(false); }}
          message = { msjSubiendo.length > 0 ? msjSubiendo : "Por favor espere"}
        />
        <IonLoading
          cssClass="my-custom-class"
          isOpen={descargando}
          onDidDismiss={() => { setLoading(false); }}
          message = { `Descargando: ${estadoDescarga}...`}
        />
        <IonAlert
          cssClass="my-custom-class"
          header={"ERROR"}
          message={'Para poder hacer uso de todas las funciones de la aplicaciòn por favor acepta los permisos solicitados por la misma'}
          isOpen={!permissions}
        />
        {
          mostrarBotonDescarga ? 
          <IonFab slot="fixed" vertical="top" horizontal="end" edge={true} className = "btnDescargar"  >
            <IonFabButton color = {"danger"} className = "btnDescargar" >
              <IonIcon icon={ cloudDownload }></IonIcon>
            </IonFabButton>
            <IonFabList>
              <IonFabButton color = {"primary"} >
                <IonIcon icon = { cloudDownload } onClick = {()=>{setVerificarDescarga(true)}} ></IonIcon>
              </IonFabButton>
              <IonFabButton color = {"success"} >
                <IonIcon icon = {cloudUpload} onClick = { enviarLecturarRegistradas } > </IonIcon>
              </IonFabButton>
              {
                DEBBUG ? 
                <IonFabButton color = {"success"} >
                  <IonIcon icon = {warningOutline} onClick = { EliminarLecturasGuardadas } > </IonIcon>
                </IonFabButton> : <></>
              }
            </IonFabList> 
          </IonFab>:
          <></>
        }
      </IonContent>
    </IonPage>
  );
};

export default FormDatosTomaPage;