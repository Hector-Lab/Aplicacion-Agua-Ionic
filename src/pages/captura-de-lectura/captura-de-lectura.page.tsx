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
    useIonViewDidEnter
} from '@ionic/react'
import { camera, checkmarkCircle, saveOutline, pencil, chevronBackCircleOutline } from 'ionicons/icons';
import './captura-de-lectura.page.css';
import MenuLeft from '../../components/left-menu';
import { extraerDatosLectura, guardarCaptura, obtenerSiguienteIndice, obtenerPromedioConsumo, guardarCuotaFija} from '../../controller/apiController';
import { useTakePhoto, generarFechas, obtenerBase64, generarAniosPosterior, generarAnios, obtenerCoordenadas } from '../../utilities';
import { getDatosLecturaStorage, verifyingSession, contribuyenteBuscado, setContribuyenteBuscado, setPuntero, setNumeroPaginas, deleteContratos } from '../../controller/storageController';
import { useHistory } from 'react-router';
const CapturaDeLectura: React.FC = () => {
    const history = useHistory();
    const [datosContribuyente, setDatosContribuyente] = useState(Object);
    const [lecturaAnterior, setLecturaAnterior] = useState(Number);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [anomalias, setAnomalias] = useState<any[]>([])
    const [consumo, setConsumo] = useState(Number);
    const [activarGaleria, setActivarGaleria] = useState(false);
    const [fotoActiva, setFotoActiva] = useState('');
    const [fotosEvidencia, setFotosEvidencia] = useState<any[]>([]);
    const [indexFoto, setIndexFoto] = useState(-1);
    const [pressentToast, dismissToast] = useIonToast();
    const [fotosCodificadas, setFotosCodificadas] = useState<any[]>([]);
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
    const [tipoMessage, setTipoMessage] = useState("ERROR");
    const [promedioLectura, setPromedioLectura] = useState(Number);
    const [toma, setToma] = useState(String);
    const [municipio, setMunicipio] = useState(String);
    const [localidad, setLocalidad] = useState(String);
    const [direccion, setDireccion] = useState(String);
    const [bloqueoAnomalias, setBloqueoAnomalias] = useState(false);
    const [consumoMinimo,setConsumoMinimo] = useState(20);
    const [activarMenu,setActivarMenu] = useState(true);
    const [ fija, setFija ] = useState(false);
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
        }]
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
            setPromedioLectura(promedio);
            console.log(idLectura);
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
                    setLecturaAnterior(result.Mensaje[0].LecturaActual != null ? result.Mensaje[0].LecturaActual : 0 );
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
    const cambiarFotoActiva = (foto: string, index: number) => {
        setFotoActiva(foto);
        setIndexFoto(index);
    }
    const borrarFotoEvidencia = () => {
        let fotosTemporal = new Array;
        let fotosEncoded = new Array;
        fotosEvidencia.map((item, index) => {
            if (index != indexFoto) {
                fotosTemporal.push(item);
            }
        });
        fotosCodificadas.map((item, index) => {
            if (index != indexFoto) {
                fotosEncoded.push(item);
            }
        })
        setFotosEvidencia(fotosTemporal);
        setFotosCodificadas(fotosEncoded);
        setFotoActiva('');
        pressentToast({
            message: "Se elimino la foto de la lista'",
            duration: 2000,
            position: 'top',
            buttons: [
                {
                    side: 'start',
                    icon: checkmarkCircle,
                }
            ]
        })
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
    const handleBtnGuardar = async () => {
        try {
            setLoading(true);
            setTimeout(() => {
                if (loading) {
                    throw 0;
                }
            }, 20000);
            if (!(fotosEvidencia.length == 0 && activarGaleria)) {
                let mes = fecha.getMonth() + 1;
                let anio = fecha.getFullYear();
                let coords = await obtenerCoordenadas();
                let validarConsumo = procesoConsumo(); // Falta la validacion del consumo
                console.log(lecturaActual);
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
                        arregloFotos: fotosCodificadas,
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
                    console.log(datosCapturados);
                    await guardarCaptura(datosCapturados)
                        .then((result) => { mensajeConsumoCero(); })
                        .catch((err) => { setLoading(false); setMessage(err.message) });
                }else{
                    guardarDatosCuotaFija(validarConsumo,coords);
                }
            } else {
                setMessage("Debe capturar almenos 1 foto")
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            setMessage(`Tiempo de espera agotado.
            Asegúrese de activar la ubicación del dispositivo`)
        }
    }
    //NOTE: metodo para enviar los datos de la cuotafija
    const guardarDatosCuotaFija = async ( consumo:Number, coords: any ) => {
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
            Fotos: fotosCodificadas,
            tipoCoordenada: 1,
            Latidude:  String(coords.latitude),
            Longitude: String(coords.longitude),
        };
        console.log(datos);
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
                    setActivarGaleria(true);
                    console.log(item.ActualizarAdelante + " - " + item.ActualizarAtras + " Se activa: " + (parseInt(item.ActualizarAdelante) == 0 || parseInt(item.ActualizarAtras) == 0));
                    if(parseInt(item.ActualizarAdelante) == 1 || parseInt(item.ActualizarAtras) == 1 ){
                        setBloqueoAnomalias(false);
                        setLecturaActual( defaultLectura );
                    }else{
                        setBloqueoAnomalias(true);
                        setLecturaActual( defaultLectura );
                    }
                    setConsumoMinimo(item.Minima);
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
        setActivarGaleria(false);
        setDefaultAnomalia(0);
        setBloqueoAnomalias(false);
    }
    const handleAbrirCamera = async () => {
        setLoading(true);
        await takePhoto()
            .then(async (result) => {
                if (fotosEvidencia.length <= 2) {
                    setLoading(true);
                    agregarImagenEncode(result.webPath + "");
                }
                else {
                    setLoading(false)
                    setMessage("Solo se permiten 3 fotos como máximo")
                }
            })
            .catch((err) => {
                let errorType = err.message + "";
                if (errorType.includes("denied")) {
                    setMessage("La aplicación no tiene permisos para usar la cámara")
                }
            }).finally(() => { setLoading(false) })
    }
    //llamada al metodo de convercion
    const agregarImagenEncode = async (imgDir: string) => {
        await obtenerBase64(imgDir).then((result) => {
            setFotoActiva(imgDir);
            setFotosEvidencia(fotosEvidencia => [...fotosEvidencia, imgDir]);
            setIndexFoto(fotosEvidencia.length);
            setFotosCodificadas(fotosCodificadas => [...fotosCodificadas, result])
        }).finally(() => { setLoading(false) })
    }
    //METODOS PARA GENERAR ETIQUETAS DE LA INTERFAZ
    const generarGaleria = () => {
        if (activarGaleria) {
            let data =
                <div>
                    <IonItem>
                        <IonLabel >Adjuntar evidencia (maximo 3 fotos)</IonLabel>
                        <IonIcon icon={camera} className="iconStyle" onClick={handleAbrirCamera}></IonIcon>
                    </IonItem>
                    {
                        fotosEvidencia.length > 0 ?
                            <IonItem>
                                <IonRow>
                                    {
                                        fotosEvidencia.map((item, index) => {
                                            return <IonCol key={index}><IonImg src={item} onClick={() => { cambiarFotoActiva(item, index) }} className="imgFormat"></IonImg></IonCol>
                                        })
                                    }
                                </IonRow>
                            </IonItem> : <></>
                    }
                </div>;
            return data;
        }
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
                if (promedioLectura < consumoMinimo){
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
                        {
                            generarGaleria()
                        }
                        {
                            fotoActiva != '' ?
                                <IonItem>
                                    <IonCard className="centrar">
                                        <IonImg src={fotoActiva} />
                                        <IonCardContent >
                                            <IonButtons>
                                                <IonButton color="secondary" onClick={() => { setFotoActiva('') }}>Cerrar</IonButton>
                                                <IonButton color="danger" onClick={() => { borrarFotoEvidencia() }} >Eliminar</IonButton>
                                            </IonButtons>
                                        </IonCardContent>
                                    </IonCard>
                                </IonItem> : <></>
                        }
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
                                        <IonButton color="secondary" onClick = {btnRegresar}>
                                            <IonIcon icon={chevronBackCircleOutline} slot="start"></IonIcon>
                                            Regresar
                                        </IonButton>
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonButton color="danger" onClick={handleBtnGuardar} disabled={btnInactivo}>
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