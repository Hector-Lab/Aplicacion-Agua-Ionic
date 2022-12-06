import React, { useEffect, useState } from "react";
import {
    IonAlert,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCol,
    IonContent,
    IonDatetime,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonMenuButton,
    IonPage,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    useIonToast,
    IonChip,
    useIonViewWillEnter,
    useIonViewDidEnter,
    IonRippleEffect
} from '@ionic/react'
import { saveOutline, pencil, chevronBackCircleOutline } from 'ionicons/icons';
import './captura-de-lectura.page.css';
import MenuLeft from '../../components/left-menu';
import { extraerDatosLectura, guardarCaptura, obtenerSiguienteIndice, obtenerPromedioConsumo, guardarCuotaFija } from '../../controller/apiController';
import { useTakePhoto, generarFechas, obtenerBase64, generarAniosPosterior, generarAnios, obtenerCoordenadas,asignarCalidad,modificarTamanio } from '../../utilities';
import { getDatosLecturaStorage, verifyingSession, setContribuyenteBuscado, setPuntero, setNumeroPaginas, deleteContratos } from '../../controller/storageController';
import { useHistory } from 'react-router';
import './captura-de-lectura.page.css';
import foto from '../../assets/icon/sinFoto.jpg';
const CapturaDeLectura: React.FC = () => {
    const history = useHistory();
    const [datosContribuyente, setDatosContribuyente] = useState(Object);
    const [lecturaAnterior, setLecturaAnterior] = useState(Number);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [anomalias, setAnomalias] = useState<any[]>([])
    const [consumo, setConsumo] = useState(Number);
    const [listaMeses, setlistaMeses] = useState<any[]>([]);
    const [mesDefautl, setMesDefault] = useState('');
    const [indexMes, setIndexMes] = useState(Number);
    const [anioActual, setAnioActual] = useState(Number);
    const [indexAnioActual, setIndexAnioActual] = useState(11);
    const [anioLectura, setAnioLectura] = useState(Number);
    const [listaAnios, setListaAnios] = useState<any[]>([]);
    const { takePhoto } = useTakePhoto();
    const [bloquearCampos, setBloquearcampos] = useState(false);
    const [btnInactivo, setBtnInactivo] = useState(false);
    const [comparaMes, setComparaMes] = useState(Number)
    const [comparaAnio, setComparaAnio] = useState(Number)
    const [seleccionAnomalia, setSeleccionAnomalia] = useState(Number);
    const [lecturaActual, setLecturaActual] = useState(Number);
    const [tipoLectura, setTipoLectura] = useState(Number);
    const [mesLectura, setMesLectura] = useState(Number);
    const [refreshControl, setRefreshControl] = useState(false);
    const [defaultLectura, setDefaultLectura] = useState(Number);
    const [defaultAnomalia, setDefaultAnomalia] = useState(Number);
    const [enbleButtons, setEnbleButtons] = useState(false);
    const [tipoMessage, setTipoMessage] = useState("MENSAJE");
    const [promedioLectura, setPromedioLectura] = useState(Number);
    const [toma, setToma] = useState(String);
    const [municipio, setMunicipio] = useState(String);
    const [localidad, setLocalidad] = useState(String);
    const [direccion, setDireccion] = useState(String);
    const [bloqueoAnomalias, setBloqueoAnomalias] = useState(false);
    const [consumoMinimo,setConsumoMinimo] = useState(20);
    const [activarMenu,setActivarMenu] = useState(true);
    const [ fija, setFija ] = useState(false);
    const sinFoto = "https://media.istockphoto.com/vectors/vector-camera-icon-with-photo-button-on-a-white-background-vector-id1270930870?k=20&m=1270930870&s=170667a&w=0&h=kG9xDNMeLFQJeDrg-ik-HkvaHcOy2HjZe8xaDMB-dk0=";

    //INDEV: Bloque de fotos para tomas
    const [ fotoMedidorEncode, setFotoMedidorEncode ] =  useState(String);
    const [ fotoMedidorPreview, setFotoMedidorPreview ] = useState(String);
    //NOTE: Foto de la facha
    const [ fotoFachadaEncode, setFotoFachadaEncode ] = useState(String);
    const [ fotoFachadaPreview, setFotoFachadaPreview ] = useState(String);
    //NOTE: Foto perspectiva amplia
    const [ fotoCalleEncode, setFotoCalleEncode ] = useState(String);
    const [ fotoCallePreview, setFotoCallePreview ] = useState(String);
    //NOTE: Error de las fotos
    const [ errorFotoUI, setErrorFotosU ] = useState("");


    const alertButtons = [
        {
            text: "Reintentar", handler: () => {
                setMessage("");
                setTipoMessage("Error");
                isSessionValid();
            }
        },
        {
            text: "Cancelar"
        }];
    const fecha = new Date();
    const isSessionValid = () => {
        let valid = verifyingSession();
        logOut(valid)
    }
    useEffect(() => { isSessionValid(); }, [refreshControl])
    useEffect(() => {
        //FIXME: obtenemos los datos actuales
        if (refreshControl) {
            setConsumo(0)
        }
    }, [defaultLectura])
    useEffect(() => { console.log(promedioLectura) }, [promedioLectura])
    const logOut = (valid: boolean) => {
        if (!valid) {
            setTipoMessage("Sesión no valida");
            setMessage("Inicie sesión por favor\nRegresando...");
            setTimeout(() => {
                setTipoMessage("ERROR");
                setMessage('');
                history.replace("/home");
            }, 2500)
        } else {
            setLoading(true);
            cargarContribuyente();
            setDefaultLectura(0);
        }
    }
    useIonViewWillEnter(()=>{setActivarMenu(false)});
    useIonViewDidEnter(()=>{setActivarMenu(true)});
    const cargarContribuyente = async () => {
        let result = getDatosLecturaStorage();
        if(result.contribuyente == "null"){
            result.contribuyente = "";
        }
        setDatosContribuyente(result);
        extraerLectura(result.idLectura);
        setRefreshControl(false);
    }
    const extraerLectura = async (idLectura: any) => {
        await obtenerPromedioConsumo().then( async (promedio)=>{
            promedio = parseFloat(promedio).toFixed(2);
            setPromedioLectura(parseInt(String(promedio)));
            await extraerDatosLectura(idLectura)
            .then((result) => {
                setFija(result.Mensaje[0].M_etodoCobro == "1");
                if(result.Mensaje != 300){
                    setToma(result.Mensaje[0].Toma)
                    setMunicipio(result.Mensaje[0].Municipio);
                    setLocalidad(result.Mensaje[0].Localidad);
                    setDireccion(result.Mensaje[0].Direccion);
                    //FIXED: hay un bug para los contraros sin lecturas y estatus de letura 1
                    let data = parseInt(result.Mensaje[0]['A_no']);
                    let mesLectura = parseInt(result.Mensaje[0].Mes);
                    //NOTE: si todo es NaN seleccionamos la fecha actual
                    isNaN(data) ? data = fecha.getFullYear() : data = data;
                    isNaN( mesLectura ) ? mesLectura = fecha.getMonth() : mesLectura = mesLectura;
                    setMesLectura(mesLectura);
                    setAnioLectura(data);
                    cargarFechas(data, result.ValorLectura[0].Valor, mesLectura);
                    setLecturaAnterior(result.Mensaje[0].LecturaActual != null ? parseInt(result.Mensaje[0].LecturaActual) : 0 );
                }else{
                    cargarFechas(fecha.getFullYear(), "1" , fecha.getMonth());
                }
                setBloquearcampos(result.BloquearCampos[0].Valor == 1);
                setAnomalias(result.Anomalias);
                setTipoLectura(result.ValorLectura[0].Valor)
                setConsumo(0);
            })
            .catch((err) => {
                console.log("aqui esta el error");
                let errorMessage = err.message + "";
                if (errorMessage.includes("API")) {
                    setEnbleButtons(true);
                }
                setMessage(err.message);
            })
            .finally(() => { setLoading(false) });
        }).catch((error)=>{

        }).finally(()=>{setLoading(false)})
        //Fin de extraer Consumo promedio del contribuyente
    }
    const cargarFechas = async (anioDefault: number, tipoLectura: string, mes: number) => {
        const mesActual = (parseInt(fecha.getMonth().toString()));
        await generarFechas(anioDefault).then((result) => {
            setMesDefault(result[0].Meses[mesActual].mes);
            setIndexMes(result[0].Meses[mesActual].id);
            setlistaMeses(result[0].Meses);
            setListaAnios(result[1].Anios);
            // Se debe separar por casos
            switch (tipoLectura) {
                case '1':
                    lecturaCasoUno(anioDefault, mes, result[0].Meses);
                    break;
                case '2':
                    lecturaCasoDos(anioDefault, result[0].Meses[mesActual].id, result[0].Meses, result[1].Anios);
                    break;
                case '3':
                    lecturaCasoTres(result[0].Meses);
                    break;
            }
        })
    }
    const calcularConsumo = (consumido: number) => {
        let result = consumido - lecturaAnterior;
        setLecturaActual(consumido);
        setDefaultLectura(consumido)
        isNaN(result) ? setConsumo(0) : setConsumo(result)
    }
    const lecturaCasoUno = (anioResult: number, mes: number, meses: any[]) => {
        let anhioLista = anioResult;
        let esteMes = mes + 1;
        setComparaAnio(anhioLista); //NOTE: se envia este compara anio al metodo de verificacion
        let listaAnios = generarAniosPosterior(anioResult);
        setListaAnios(listaAnios);
        if (esteMes == 13) {
            anhioLista = anioResult + 1;
            esteMes = meses[0].id;
            setMesDefault(meses[0].mes);
            setComparaAnio(anioResult + 1);
        }
        setComparaMes(esteMes); //NOTE: se envia este compara anio al metodo de verificacion
        setIndexMes(esteMes);

        listaAnios.map((item, index) => {
            if (item.anio == anhioLista) {
                setIndexAnioActual(item.id);
                setAnioActual(item.anio)
            }
        })
        if (lecturaAnterior == null) {
            setLecturaAnterior(0);
        }
    }
    const lecturaCasoDos = (anioResult: number, mesResult: number, meses: any[], anios: any[]) => {
        // se tomara la fecha actual para generar la lectura
        let anhioLista = fecha.getFullYear();
        let esteMes = fecha.getMonth();
        meses.map((item, index) => {
            if (item.id == esteMes) {
                setIndexMes(item.id);
                setMesDefault(item.mes);
            }
        })
        setComparaMes(fecha.getMonth());    //NOTE: se envia este compara anio al metodo de verificacion
        setComparaAnio(fecha.getFullYear());    //NOTE: se envia este compara anio al metodo de verificacion
        //Generar lista de los años
        let listaAnios = generarAnios(anhioLista);
        setListaAnios(listaAnios);
        listaAnios.map((item, index) => {
            if (anhioLista == item.anio) {
                setIndexAnioActual(item.id);
                setAnioActual(item.anio);
            }
        })
        if (lecturaAnterior == null) {
            setLecturaAnterior(0);
        }
    }
    const lecturaCasoTres = (meses: any[]) => {
        // se Obtienen las fechas actuales
        let mesComparacion = fecha.getMonth() + 1
        setComparaMes(mesComparacion);  //NOTE: se envia este compara anio al metodo de verificacion
        let anioComparar = fecha.getFullYear()
        let esteMes = fecha.getMonth() + 1

        if (esteMes == 13) {
            anioComparar = fecha.getFullYear() + 1
            esteMes = meses[0].id;
            setMesDefault(meses[0].mes);
            setComparaAnio(anioComparar);
            setComparaMes(meses[0].id);
        }

        setAnioActual(anioComparar);
        setComparaAnio(anioComparar);     //NOTE: se envia este compara anio al metodo de verificacion
        setIndexMes(esteMes);
        let listaAnios = generarAnios(anioComparar);
        setListaAnios(listaAnios);
        listaAnios.map((item, index) => {
            if (item.anio == anioComparar) {
                setIndexAnioActual(item.id);
            }
        })
        if (lecturaAnterior == null) {
            setLecturaAnterior(0);
        }
    }
    const siguienteLectura = async () => {
        await obtenerSiguienteIndice(datosContribuyente.idLectura)
            .then((result) => {
                if (result) {
                    /*setTipoMessage("Mensaje");
                    setMessage("Lectura guardada\nPasando a siguiente lectura...");
                    setTimeout(() => {
                        setLoading(false);
                        //Limpiando Componentes
                        setActivarGaleria(false)
                        setDefaultLectura(0)
                        setFotoActiva('');
                        setFotosCodificadas([]);
                        setFotosEvidencia([]);
                        setIndexFoto(0);
                        setSeleccionAnomalia(-1)
                        setDefaultAnomalia(-1)
                        setRefreshControl(true);
                        handleCancelAnomalia();
                    }, 1000);*/
                    setTipoMessage("Mensaje");
                    setMessage("Final de los datos en la pagina\nRegresado...");
                    setPuntero(0);
                    setNumeroPaginas(0);
                    deleteContratos();
                    setTimeout(() => {
                        history.replace("/form-datos-toma.page");
                    }, 2500);
                } else {
                    setTipoMessage("Mensaje");
                    setMessage("Final de los datos en la pagina\nRegresado...");
                    setPuntero(0);
                    setNumeroPaginas(0);
                    deleteContratos();
                    setTimeout(() => {
                        history.replace("/form-datos-toma.page");
                    }, 2500);
                }

            }).catch(err => {
                setMessage(err.message);
            }).finally(() => {
                setLoading(false);
            })
    }
    const mensajeConsumoCero = async () => {
        //let value = contribuyenteBuscado();
        /*if (!value) {
            if (consumo <= 0) {
                setEnbleButtons(false);
                setTipoMessage("Mensaje");
                setMessage("El Consumo se calculo como el promedio de 12 meses");
                setTimeout(() => {
                    setMessage("");
                    siguienteLectura();
                }, 2000);
            } else {
                siguienteLectura();
            }
        } else {

        }*/
        setLoading(false);
        setTipoMessage("Mensaje");
        setMessage("Lectura guardada\nRegresado...");
        setTimeout(() => {
            setContribuyenteBuscado(false);
            history.replace("/form-datos-toma.page");
        }, 2500);
    }
    //Manejadores de la interfaz
    const handleBtnGuardar = async ( fotos:any  ) => {
        try {
            setLoading(true);
            setTimeout(() => {
                if (loading) {
                    throw 0;
                }
            }, 20000);
            let mes = fecha.getMonth() + 1;
                let anio = fecha.getFullYear();
                let coords = await obtenerCoordenadas();
                let validarConsumo = procesoConsumo(); // Falta la validacion del consumo
                //NOTE: Verificamos la cuotafija
                if( !fija ){
                    let datosCapturados = {
                        route: anio + "" + mes + "/",
                        lecturaAnterior:  lecturaAnterior,
                        lecturaActual: bloqueoAnomalias ? lecturaAnterior : lecturaActual,
                        consumoFinal: validarConsumo,
                        mesCaptura: indexMes,
                        anhioCaptura: anioActual,
                        fechaCaptura: fecha,
                        anomalia: seleccionAnomalia == 0 ? "" : seleccionAnomalia,
                        tipoCoordenada: 1,
                        arregloFotos: fotos,
                        comparaMes: comparaMes,
                        comparaAnio: comparaAnio,
                        lectura: 1,
                        arrayAnios: listaAnios,
                        indexAnio: indexAnioActual,
                        mesLectura: mesLectura,
                        nCliente: datosContribuyente.nCliente,
                        token: datosContribuyente.token,
                        idUsuario: datosContribuyente.idUsuario,
                        idToma: datosContribuyente.idLectura,
                        Latidude:  String(coords.latitude) ,
                        Longitude: String(coords.longitude),
                    }
                    await guardarCaptura(datosCapturados)
                        .then((result) => { mensajeConsumoCero(); })
                        .catch((err) => { setLoading(false); setMessage(err.message) });
                }else{
                    guardarDatosCuotaFija(validarConsumo,coords,fotos);
                }
        } catch (err) {
            console.log(err);
            setLoading(false);
            setMessage(`Tiempo de espera agotado.
            Asegúrese de activar la ubicación del dispositivo`)
        }
    }
    //NOTE: metodo para enviar los datos de la cuotafija
    const guardarDatosCuotaFija = async ( consumo:Number, coords: any, fotos:any ) => {
        //NOTE: creamos el formato de los datos
        let datos = {
            LecturaActual: lecturaActual,
            LecturaAnterior: lecturaAnterior,
            Cliente: datosContribuyente.nCliente,
            Consumo: consumo,
            Anio: anioActual,
            padron: datosContribuyente.idLectura,
            mes: indexMes,
            anomalia: seleccionAnomalia == 0 ? "" : seleccionAnomalia,
            idUsuario: datosContribuyente.idUsuario,
            Fotos: fotos,
            tipoCoordenada: 1,
            Latidude:  String(coords.latitude),
            Longitude: String(coords.longitude),
        };
        await guardarCuotaFija(datos)
        .then(()=>{
            mensajeConsumoCero();
        }) 
        .catch(( error )=>{
            setLoading(false); setMessage(error.message);
        }).finally(()=>{
            setLoading(false);
        })
    }
    const handleSelectAnio = (value: number) => {
        listaAnios.map((item, index) => {
            if (item.id == value) {
                setAnioActual(item.anio)
                setIndexAnioActual(item.id)
            }
        })
    }
    const handleSelectMes = (value: number) => {
        listaMeses.map((item, index) => {
            if (item.id == value) {
                setIndexMes(item.id);
                setMesDefault(item.mes);
            }
        })
    }
    const handleSelectAnomalia = (seleccionAnomalia: number) => {
        setSeleccionAnomalia(seleccionAnomalia);
        setDefaultAnomalia(seleccionAnomalia);
        setConsumo(promedioLectura);
        setBloqueoAnomalias(seleccionAnomalia != 0);
        console.log(defaultLectura);
        anomalias.map((item, index) => {
            if (item.id == seleccionAnomalia) {
                    console.log(item.ActualizarAdelante + " - " + item.ActualizarAtras + " Se activa: " + (parseInt(item.ActualizarAdelante) == 0 || parseInt(item.ActualizarAtras) == 0));
                    if(parseInt(item.ActualizarAdelante) == 1 || parseInt(item.ActualizarAtras) == 1 ){
                        setBloqueoAnomalias(false);
                        setLecturaActual( defaultLectura );
                    }else{
                        setBloqueoAnomalias(true);
                        setLecturaActual( defaultLectura );
                    }
                    setConsumoMinimo( parseInt(item.Minima) );
                    if(defaultLectura != 0){
                        console.log("Procesando Consumo");
                        setConsumo(procesoConsumo());
                    }
                    if(seleccionAnomalia == 24){
                        setConsumo(promedioLectura);
                    }
            }
        });
    }
    const handleCancelAnomalia = () => { 
        setDefaultAnomalia(0);
        setBloqueoAnomalias(false);
    }
    //NOTE: 1 = Medidor, 2 = Fachada, 3 = Calle( )  
    const handleAbrirCamera = async ( tipoFoto: number  ) => {
        setLoading(true);
        //NOTE: asugnamos la calidad de la camara
        asignarCalidad( tipoFoto == 1 ? 50 : 20 );
        modificarTamanio(  tipoFoto != 1 );
        await takePhoto() 
            .then(async (result) => {
                setLoading(true);
                agregarImagenEncode(result.webPath + "", tipoFoto);
            })
            .catch((err) => {
                let errorType = err.message + "";
                if (errorType.includes("denied")) {
                    setMessage("La aplicación no tiene permisos para usar la cámara")
                }
            }).finally(() => { setLoading(false) })
    }
    //llamada al metodo de convercion
    const agregarImagenEncode = async (imgDir: string, tipoFoto:number) => {
        await obtenerBase64(imgDir).then((result) => {
            switch (tipoFoto) {
                case 1:
                    setFotoMedidorEncode(String(result));
                    setFotoMedidorPreview(imgDir);
                    break;
                case 2:
                    setFotoFachadaEncode(String(result));
                    setFotoFachadaPreview(imgDir);
                    break;
                case 3: 
                    setFotoCalleEncode(String(result));
                    setFotoCallePreview(imgDir);
                    break;
            }

        }).finally(() => { setLoading(false) })
    }
    const formatindex = (index: string) => {
        let result = "";
        let numIndex = Number(index);
        if (isNaN(numIndex)) {
            result = '00';
        } else {
            numIndex <= 9 ? result = String("0" + numIndex) : result = String(numIndex);
        }
        return result;
    }
    const btnDetallesContribuyente = () => {
        history.push("/datos-contribuyente.page");
    }
    const btnRegresar = () =>{
        history.replace("/form-datos-toma.page");
    }
    const procesoConsumo = () => {
        let consumoProcesado = 0;
        if(seleccionAnomalia != 0){
            if(bloqueoAnomalias){ // este es el proceso de las anomalias sin capturas
                if ( promedioLectura < consumoMinimo ){
                    consumoProcesado = consumoMinimo;
                }else{
                    consumoProcesado = promedioLectura;
                }
            }else{ //este el el proceso de las anomalias con captura
                if(consumo < promedioLectura){
                    consumoProcesado = promedioLectura;
                }
                if(promedioLectura < consumoMinimo){
                    consumoProcesado = consumoMinimo;
                }
                if(consumoMinimo < consumo){
                    consumoProcesado =  consumo;
                }
            }
        }else{ // este es el proceso de captura normal
            consumoProcesado = consumo;
        }
        if(seleccionAnomalia == 47){
            consumoProcesado = consumoMinimo;
        }
        if(seleccionAnomalia == 99){
            if(lecturaActual < consumoMinimo){
                consumoProcesado = consumoMinimo;
            }else{
                consumoProcesado = lecturaActual;
            }
        }
        if(seleccionAnomalia == 24){
            consumoProcesado = promedioLectura;
        }
        if(seleccionAnomalia == 40){ //Nuevo forma de anomalia
            if(lecturaActual < consumoMinimo){
                consumoProcesado = consumoMinimo;
            }else{
                consumoProcesado = lecturaActual;
            }
        }
        setConsumo(consumoProcesado);
        return consumoProcesado;
    }
    //INDEV: Bloque para lanzar la camara dependiendo del tipo de foto
    const FotoToma = () =>{
        //NOTE: lanzamos la camara con el tipo 1
        handleAbrirCamera(1);
    } 
    const FotoFachada = () =>{
        handleAbrirCamera(2);
    }
    const FotoCalle = () =>{
        handleAbrirCamera(3);
    }
    const validarFotosTomadas = () => {
        let errorFotos = "";
        if( fotoMedidorEncode.length == 0 ){
            errorFotos += "FM,";
        }
        if( fotoFachadaEncode.length == 0 ){
            errorFotos += "FF,";
        }
        if( fotoCalleEncode.length == 0 ){
            errorFotos += "FC,";
        }
        if(errorFotos.length != 0){
            setMessage("¡Favor de capturar las evidencias!");
            setTipoMessage("Mensaje");
            console.log(errorFotos);
            setErrorFotosU(errorFotos);
        }else{
            //NOTE: se forma el json para el envio de las imagenes
            setErrorFotosU("");
            let jsonImagenes = {
                "Toma": fotoMedidorEncode,
                "Fachada": fotoFachadaEncode,
                "Calle": fotoCalleEncode
            }
            handleBtnGuardar(jsonImagenes);
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
                    <IonTitle>Captura de lectura</IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton ></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader className="headerData">
                        <div className="datosContribuyete">
                            <h3>{datosContribuyente.contribuyente}</h3>
                            <p>Contrato: {datosContribuyente.contratoVigente}, &nbsp;&nbsp; Medidor: {datosContribuyente.medidor == "null" ? "S/N" : datosContribuyente.medidor }, &nbsp;&nbsp; Toma: {toma}</p>
                            <p>Municipio: {municipio}, &nbsp;&nbsp; Localidad: {localidad}</p>
                            <p>{`Dirección: ${direccion}`}</p>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="10">
                                    </IonCol>
                                    <IonCol size="1">
                                        <IonChip color="danger" onClick={btnDetallesContribuyente}>
                                            <IonIcon icon={pencil} className="btnEditar" />
                                        </IonChip>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </div>
                    </IonCardHeader>
                    <IonCardContent>
                        <br />
                        <IonItem>
                            <IonLabel>Lectura anterior:</IonLabel>
                            <IonInput disabled className="disabledInput">{`${lecturaAnterior}`}</IonInput>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>Lectura actual:</IonLabel>
                            <IonInput disabled = {bloqueoAnomalias} type="number" placeholder="0" value={defaultLectura} onIonChange={e => { calcularConsumo(parseFloat(e.detail.value + "")) }}></IonInput>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>Consumo:</IonLabel>
                            <IonInput disabled className="disabledInput" value={consumo}></IonInput>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>Fecha de lectura:</IonLabel>
                            <IonDatetime disabled displayFormat="DD/MM/YYYY" min="2000" max="2026" value={`${fecha}`}></IonDatetime>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>Anomalía</IonLabel>
                            <IonSelect interface="action-sheet" onIonCancel = {handleCancelAnomalia} value={defaultAnomalia} onIonChange={e => { handleSelectAnomalia(e.detail.value) }}>
                                {
                                    anomalias.map((item, index) => {
                                        return <IonSelectOption key={index} value={item.id}>
                                            {`${item.clave <= 10 ? formatindex(item.clave) : item.clave} - ${item.descripci_on}`}
                                        </IonSelectOption>
                                    })
                                }
                            </IonSelect>
                        </IonItem>
                        <br />
                        <IonGrid>
                                <IonRow>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Toma </IonLabel>
                                        <IonCard onClick = { FotoToma } className = { errorFotoUI.includes("FM,") ? "cardError" : "" } >
                                            <IonImg className="imagenViwer"  src = { fotoMedidorPreview != "" ? fotoMedidorPreview : foto }></IonImg>
                                            <IonRippleEffect></IonRippleEffect>
                                        </IonCard>
                                    </IonCol>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Facha </IonLabel>
                                        <IonCard onClick = { FotoFachada } className = { errorFotoUI.includes("FF,") ? "cardError" : "" } >
                                            <IonImg className="imagenViwer"  src ={ fotoFachadaPreview != "" ? fotoFachadaPreview : foto } >  </IonImg>
                                        </IonCard>
                                        <IonRippleEffect></IonRippleEffect>
                                    </IonCol>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Calle </IonLabel>
                                        <IonCard onClick = { FotoCalle } className = { errorFotoUI.includes("FC,") ? "cardError" : "" } >
                                            <IonImg className="imagenViwer"  src ={ fotoCalleEncode != "" ? fotoCalleEncode : foto } >  </IonImg>
                                        </IonCard>
                                        <IonRippleEffect></IonRippleEffect>
                                    </IonCol>
                                </IonRow>
                        </IonGrid>
                        <IonItem>
                            <IonLabel>Mes: </IonLabel>
                            <IonSelect interface="action-sheet" value={indexMes} selectedText={`${mesDefautl}`} disabled={bloquearCampos} onIonChange={e => handleSelectMes(e.detail.value)}>
                                {
                                    listaMeses.map((item, index) => {
                                        return <IonSelectOption key={index} value={item.id} >{item.mes}</IonSelectOption>
                                    })
                                }
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Año: </IonLabel>
                            <IonSelect interface="action-sheet" value={indexAnioActual} selectedText={`${anioActual}`} disabled={bloquearCampos} onIonChange={e => handleSelectAnio(e.detail.value)}>
                                {
                                    listaAnios.map((item, index) => {
                                        return <IonSelectOption key={index} value={item.id}>{item.anio}</IonSelectOption>
                                    })
                                }
                            </IonSelect>
                        </IonItem>
                        <br />
                        <div className="centrar">
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="6">
                                        <IonButton expand = "block" color="secondary" onClick = {btnRegresar}>
                                            <IonIcon icon={chevronBackCircleOutline} slot="start"></IonIcon>
                                            Regresar
                                        </IonButton>
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonButton expand = "block" color="danger" onClick={validarFotosTomadas} disabled={btnInactivo}>
                                            Guardar
                                            <IonIcon icon={saveOutline} slot="end"></IonIcon>
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>

                        </div>
                    </IonCardContent>
                </IonCard>
                <IonAlert
                    cssClass="my-custom-class"
                    header={tipoMessage}
                    message={message}
                    isOpen={message.length > 0}
                    backdropDismiss={false}
                    buttons={enbleButtons ? alertButtons : [{ text: 'Aceptar', handler: () => { setMessage("") } }]}
                />
                <IonLoading
                    cssClass="my-custom-class"
                    isOpen={loading}
                    onDidDismiss={() => { setLoading(false); }}
                    message="Por favor espere"
                />
            </IonContent>
        </IonPage>
    );
}

export default CapturaDeLectura;