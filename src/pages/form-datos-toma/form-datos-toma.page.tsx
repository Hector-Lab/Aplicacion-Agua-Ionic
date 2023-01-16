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
  useIonViewWillLeave,
  IonFab,
  IonFabButton,
  IonBadge,
  IonFabList
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import "./form-datos-toma.page.css";
import MenuLeft from '../../components/left-menu';
import { buscarSectores, lecturasPorSectorPage, solicitarPermisos, verifyCameraPermission, verifyGPSPermission, obtenerContribuyente, obtenerTotalDatosSectores, obtenerTotalDatosBusqueda,buscarContrato,buscarPorMedidor, configuracionCuotaFija, DescargarPadronAnomalias,DescargarConfiguraciones,DescargarContratosLecturaSector, obtenerPromedioContrato} from '../../controller/apiController';
import { getUsuario, guardarDatosLectura, cerrarSesion, verifyingSession, setContribuyenteBuscado, setPuntero, getPuntero, getNumeroPaginas, setNumeroPaginas, getClienteNombreCorto, setSector, getPunteroBusqueda, getPaginasBusqueda, setPunteroBusqueda,getCuentasPapas,getDatosUsuario, ObtenerModoTrabajo } from '../../controller/storageController';
import { searchCircle, arrowForwardOutline, arrowBackOutline, cloudDownload, cloudUpload, returnUpBackOutline } from 'ionicons/icons';
import { isPlatform} from '@ionic/react';
import { 
  SQLITEInsertarDatosExtra,SQLITEObtenerPadronPagina,SQLITEObtenerTotalContratosPadron,SQLITEObtenerContratosFiltroContrato,
  SQLITEObtenerContratosFiltroMedidor,SQLITEObtenerListaSectores,SQLITETruncarTablas,SQLITEInsertarAnomalias,SQLITEInsertarConfiguracionUsuario,
  SQLITEGuardarPadronAgua,SQLITEGuardarLecturaAnteriorContrato, SQLITEInsertarSector, SQLITEObtenerLecturaActual,SQLITEObtenerEvidencias,SQLITEObtenerGeoreferencia, SQLITEObtenerListaLecturas, SQLITEObtenerContratoVigente} from '../../controller/DBControler';
import { ContratoAPI,LecturaAnteriorContrato,PadronAguaPotable, Anomalias, DatosLectura, Evidencia, StructuraEvidencia } from '../../Objetos/Interfaces';
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
    VerificarModoTrabajo();
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
      if(!enLinea)
        tokenExpired ? logOut(tokenExpired) : prepararPantalla()
      else
        PrepararPantallaLocal();
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
        setTokenExpired(sessionValid);
        setIdSector("");
        if (!sessionValid) {
          setMessage(err.message)
          setTypeError("sectores")
        }
      })
  }
  useIonViewWillEnter(()=>{
    setActivarMenu(true)
  });
  useIonViewWillLeave(()=>{setActivarMenu(false)});
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
    setLoading(true);
    if(enLinea){
      setIdSector(sector);
      setSector(sector);
      calcularPaginadoLocal(parseInt(sector));
    }else{
      if(sector !== ""){
        setIdSector(sector);
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
    await EliminarBaseAnterior()
    .then( async ()=>{
      let Anomalias:[Anomalias] = await DescargarPadronAnomalias();
      let ConfiguracionesAgua: {Status:boolean,TipoLectura:number,BloquarCampos:number,Code:number} = await DescargarConfiguraciones(); //NOTE: para las lecturas
      let ConfiguracionUsuario = getDatosUsuario();
      await InsertarSectores();
      await InsertarAnomalias(Anomalias);
      await SQLITEInsertarConfiguracionUsuario(parseInt(ConfiguracionUsuario.Cliente),ConfiguracionUsuario.NombreUsuario,ConfiguracionUsuario.Email,ConfiguracionUsuario.Contrasenia);
      await DescargarPadronSectorAgua(String(ConfiguracionesAgua.BloquarCampos));
      //NOTE: insertamos los datos extra Nombre, Valor, Descripcion       
      await SQLITEInsertarDatosExtra("TipoLectura",String(ConfiguracionesAgua.TipoLectura),"Configuracion para las lecturas de la app DATOS EXTRA SUINPAC"); //NOTE: Para tipo de lectura
      await SQLITEInsertarDatosExtra("BloquarCampos",String(ConfiguracionesAgua.BloquarCampos),"Para bloquear los campos de lectura de la app");
      setTimeout( async ( )=>{ setDescargando(false); },10000);
    }).catch(()=>{
      setDescargando(false);
      setMessage("Error al elimnar la base de datos antigua\n favor de eliminar los datos de la aplicacion desde configuraciones del dispositivo")
    });
  }
  const EliminarBaseAnterior = async ( ) =>{
    //NOTE: Eliminamos tablas
    await SQLITETruncarTablas();
  }
  const InsertarSectores = async () =>{
    //NOTE: Es para ver si funciona la base de datos
    setEstadoDescarga("Insertando Sectores...");
    try {
      if(sectores != null && sectores.length > 0){
        sectores.map((sectores,index)=>{
          setEstadoDescarga(`${sectores.Sector}`)
          SQLITEInsertarSector(sectores.id,sectores.Sector);
        });
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
      Anomalias.map( async (Anomalia,index)=>{
        await SQLITEInsertarAnomalias(Anomalia.id,Anomalia.clave,Anomalia.descripci_on,Anomalia.AplicaFoto);
      });
    }catch(error){
      setEstadoDescarga(`Erorr al realizar descarga de las anomalias:\n${ error.message}`);
      setTimeout(()=>{
        setEstadoDescarga("Descargando Padron...")
      },3000)
    }
  }
  const DescargarPadronSectorAgua = async (BloquarCampos:string) => {
    sectores.map( async (Sector:{id:number,Sector:string},index)=>{
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
    });
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
  //Termina seccion de metodos en linea
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
    await SQLITEObtenerTotalContratosPadron(idSector)
    .then((totalContratos:number)=>{  
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
      }
    })
    .catch((error)=>{
      setLoading(false);
      console.log("Error en el error: " + error.message);
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
  const VerificarModoTrabajo = async () => {
    //let promedioDoceMesesContrato = await obtenerPromedioContrato(146794);
    setEnlinea(ObtenerModoTrabajo());
  }
  function zeroFill( number:string,width:number = 9){
    while(number.length < width){
      number = "0"+number;
    }
    return number;
  }
  const enviarLecturarRegistradas = async () =>{
    setMsjSubiendo("Buscando Lecturas...");
    setLoading(true);
    try{
      //NOTE: Extraer la lectura
      await SQLITEObtenerListaLecturas()
      .then(( listaLecturas:Array<DatosLectura> )=>{
        //NOTE: recorremos los lecturas 
        listaLecturas.map(  async ( lectura:DatosLectura,index:number )=>{
          //NOTE: obtenemos el contrato vigente
          await SQLITEObtenerContratoVigente(lectura.idbLectura);
          setMsjSubiendo(`Enviado lectura del contrato:${ await SQLITEObtenerContratoVigente(lectura.idbLectura)} `);
          let evidencias = await SQLITEObtenerEvidencias(lectura.idbLectura);
          let coordenadas = await SQLITEObtenerGeoreferencia(lectura.idbLectura); 
          await codificarEvidencia(evidencias)
          .then((listaEvidencia)=>{ 
            //console.error(JSON.stringify(listaEvidencia));
            console.error(`Calle: ${listaEvidencia.Calle} Fachada: ${listaEvidencia.Fachada} Toma: ${listaEvidencia.Toma}`);
          })

        })
        setLoading(false);
      })
      .catch(( error )=>{
        setMessage(`Error al obtener los datos: ${error}`);
      })
    }catch( error ) {

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
  const dormirSegundos = async () =>{
    setTimeout(()=>{
      return Promise.resolve("Terminado Proceso...");
    },2000);
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
                  let arrayData = functionValidarLectura(parseInt(item.Estatus),parseInt( !enLinea ? item.M_etodoCobro : item.MetodoCobro ));
                  let cuentaPapa = String(papas).includes(!enLinea ? item.id : item.Padron);
                  if(cuentaPapa){
                    arrayData[0] += "Desarrollo";  
                  }
                  return <div className = { ( cuentaPapa || arrayData[1]) ? 'cuotaFija':''} key={index} onClick={() => {  abrirCapturaDatos(!enLinea ? item.id : item.Padron, item.Contribuyente, item.ContratoVigente, item.Medidor,(enLinea) ?  item.MetodoCobro : item.M_etodoCobro,cuentaPapa) }}>
                    <IonItem detail={true} className = {isPlatform("ios") ? "padding-ios" : "" } >
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
              <IonIcon icon={cloudDownload}></IonIcon>
            </IonFabButton>
            <IonFabList>
              <IonFabButton color = {"primary"} >
                <IonIcon icon = { cloudDownload} onClick = {()=>{setVerificarDescarga(true)}} ></IonIcon>
              </IonFabButton>
              <IonFabButton color = {"success"} >
                <IonIcon icon = {cloudUpload} onClick = { enviarLecturarRegistradas } > </IonIcon>
              </IonFabButton>
            </IonFabList>
          </IonFab>:
          <></>
        }
      </IonContent>
    </IonPage>
  );
};

export default FormDatosTomaPage;