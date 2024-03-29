import { IonModal,IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonLoading, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar, useIonToast, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { chevronBackCircleOutline, saveOutline, cameraOutline,arrowBackCircle, arrowForwardCircle, arrowBackCircleOutline } from "ionicons/icons";
import { useEffect,useRef,useState } from 'react';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { MediaCapture, MediaFile } from '@awesome-cordova-plugins/media-capture';
import MenuLeft from '../../components/left-menu';
import { obtenerDatosCorte, MultarToma } from '../../controller/apiController';
import { useTakePhoto, obtenerBase64, obtenerCoordenadas,asignarCalidad,modificarTamanio } from '../../utilities';
import { VideoPlayer } from '@awesome-cordova-plugins/video-player';
import './realizar-multa.page.css';
import foto from '../../assets/icon/sinFoto.jpg';
import { useHistory } from 'react-router';
import { cerrarSesion } from "../../controller/storageController";
import { Console } from "node:console";

const RealizarMulta: React.FC = () => {
    //NOTE: referencias
    const referenciaModal = useRef<HTMLIonModalElement>(null);
    const history = useHistory();
    const [ activarMenu, setActivarMenu ] = useState(true);
    const [ datosContrato, setDatosContrato ] = useState(Object);
    const [ datosUsuario, setDatosUsuario ] = useState(Object);
    const [ loading, setLoading ] = useState(true);
    const [ fechaActual, setFechaActual ] = useState("");
    const [ tipoInspeccion, setTipoInspecion ] = useState(1);
    /**NOTE: Manejadores de fotos */
    const [ mostrarSlide, setMostrarSlide ] = useState(Boolean);
    const [ arregloFotos, setArregloFotos ] = useState<string[]>([]);
    const [ arregloFotosVista, setArregloFotosVista ] = useState<string[]>([]);
    const [ fotoActiva, setFotoActiva ] = useState(String);
    const [ indexFoto, setIndexFoto ] = useState(Number);
    const { takePhoto } = useTakePhoto();
    //NOTE: contradores de la base de datos
    const [ motivoInspeccion, setMotivoInspeccion ] = useState(String);
    const [ ejercicio, setEjercicio ] = useState(2020);
    //NOTE: Validacion de toma si esta cortado
    const [ bloquearCorte, setBloquearCorte ] = useState(true); //REVIEW: Preguntar si se puede tener mas de una multa sin pagar 
    /**NOTE: Manejador de mensajes de error y advertencias */
    const [ tipoMensaje, setTipoMensaje ] = useState(String);   
    const [ mensaje, setMensaje ] = useState( String );
    const [ errorCarga, setErrorCarga ] = useState(false);
    const [ errorCampos, setErrorCampos ] = useState(false);
    const sinFoto = "https://media.istockphoto.com/vectors/vector-camera-icon-with-photo-button-on-a-white-background-vector-id1270930870?k=20&m=1270930870&s=170667a&w=0&h=kG9xDNMeLFQJeDrg-ik-HkvaHcOy2HjZe8xaDMB-dk0=";
    const [ monto, setMonto ] = useState(4481);

    const modoPruebas = false; //INDEV: modo de pruebas 
    const fecha = new Date();
    useEffect(()=>{
        extraerDatos();
    },[]);
    useIonViewWillEnter(()=>{setActivarMenu(false)});
    useIonViewDidEnter(()=>{setActivarMenu(true)});
    const listaEstados = ["Activo","Cortado","Baja Temporal","Baja Permanente","Inactivo","Nueva","","","Sin toma","Multada"];
    const extraerDatos = async () =>{
        //NOTE: extraer datos del contrato
        let dia = fecha.getDate();
        let mes = fecha.getMonth();
        let anio = fecha.getFullYear();
        setEjercicio( modoPruebas ? 2020 : anio);
        setFechaActual( formatoFecha(dia,mes,anio) );
        await obtenerDatosCorte(true) //NOTE: False para cortes y true para multas
        .then(( result )=>{
            if(result != undefined ){
                console.log(result);
                setDatosContrato(result[0]);
                setDatosUsuario(result[1]);
                //NOTE: verificamos si
                setBloquearCorte(result[0].Estatus != 1);
            }
        })
        .catch(( error )=>{
            setErrorCarga(true);
            setMensaje(error.message);
            setTipoMensaje("ERROR");

        }).finally(()=>{
            setLoading(false);
        });
    }
    const formatoFecha = ( dia: number, mes: number, anio:number  ) =>{
        let formatoFecha = "";
        dia < 10 ? formatoFecha += ("0"+dia+"/") : formatoFecha += dia +"/";
        mes < 10 ? formatoFecha += ("0"+mes+"/") :  formatoFecha += mes + "/";
        formatoFecha += anio;
        return formatoFecha;
    }
    const handleAbrirCamera = async (tipoFoto: number) =>{
        setLoading(true);
        asignarCalidad(50);
        modificarTamanio(false);
        await takePhoto()
            .then(async (result) => {
                setLoading(true);
                agregarImagenEncode(result.webPath + "", tipoFoto);
            })
            .catch((err) => {
                let errorType = err.message + "";
                if (errorType.includes("denied")) {
                    setMensaje("La aplicación no tiene permisos para usar la cámara")
                }                
            }).finally(() => { setLoading(false) })
    }
    const agregarImagenEncode = async ( imgDir: string, tipoFoto: number ) =>{
        await obtenerBase64(imgDir).then((result) => {
            console.log(String(result).slice(50));
            //FIXME: se cambia por encode universal            
            setIndexFoto(arregloFotos.length);
            setFotoActiva(imgDir);
            setArregloFotos([...arregloFotos,String(result)]);
            setArregloFotosVista([...arregloFotosVista,imgDir]);
        }).finally(() => { setLoading(false) })
        
    }
    const guardarMulta = async( ) =>{
        //NOTE: Mandamo a Generar y cotizar la multa
        try{
            setLoading(true);
            setTimeout(()=>{
                if(loading){
                    throw 0;
                }
            },20000);
            //NOTE: Obtenemos la ubicacion del dispositivo
            await obtenerCoordenadas().then( async ( coordenadas ) => {
                //NOTE: damos formato a las coordenadas a enviar
                let coords = {
                    latitude: coordenadas.latitude,
                    longitude: coordenadas.longitude
                }
                await MultarToma(parseInt(datosContrato.Padron),monto,motivoInspeccion,coords, arregloFotos/*Fotos*/)
                .then(()=>{
                    setTipoMensaje("Mensaje");
                    setMensaje("Multa guardada");
                })
                .catch(( error )=>{
                    setTipoMensaje("Mensaje");
                    setMensaje(error.message);
                }).finally(()=>{
                    setLoading(false);
                });
            }).catch((error)=>{
                console.log(error);
                setLoading(false);
                setTipoMensaje("Mensaje");
                setMensaje(`Tiempo de espera agotado.
                Asegúrese de activar la ubicación del dispositivo`);
            });
        }catch( error ){
            console.log(error);
            setLoading(false);
            setTipoMensaje("Mensaje");
            setMensaje(`Tiempo de espera agotado.
            Asegúrese de activar la ubicación del dispositivo`);
        }
    }
    const validarCampos = async () =>{
        //Validamos que las fotos no esten vacias
        let error = "";
        (monto < 1 || monto >= 5000) ? error +="M," : error+="";
        console.log("Errores encontrados: " + error );
        if( error == "" ){
            if(monto >= 5000 ){
                setTipoMensaje("Mensaje");
                setMensaje("El monto excede el máximo permitido");
                setErrorCampos(true);
                return;
            }
            if(motivoInspeccion != ""){
                //NOTE: Creamosel objeto que se va a enviar
                setErrorCampos(false);
                await guardarMulta(/* FIXME: las imagenes*/);
            }else{
                setTipoMensaje("Mensaje");
                setMensaje("Favor de ingresar el motivo del corte");
                setErrorCampos(true);
            }
        }else{
            //Lanzamos los errores de fotos
        }
    }
    const regresar = () =>{
        history.replace('/Multas');
    }
    const limpiarPantalla = () =>{
        setFotoActiva("");
        setArregloFotos([]);
        setArregloFotosVista([]);
        setIndexFoto(0);
        setBloquearCorte(true);
        setMensaje("");
        setTipoMensaje("");
        setErrorCampos(false);
        setErrorCarga(false);
    } 
    //INDEV: Bloque para lanzar la camara dependiendo del tipo de foto
    const CapturarEvidencia = async () =>{
        //NOTE: Lanzamos la camara para capturar la imagen
        handleAbrirCamera(1);
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
    const siguienteFoto = () =>{
        if((indexFoto + 1) < arregloFotos.length  ){
            //INDEV: pasamos a la siguiente 
            setFotoActiva( arregloFotosVista[indexFoto + 1] );
            setIndexFoto(indexFoto + 1);
        }
    }
    const fotoAnterior = () => {
        if( (indexFoto - 1) >= 0 ){
            setFotoActiva( arregloFotosVista[indexFoto - 1] );
            setIndexFoto(indexFoto - 1);
        }
    }
    const borrarEvidencia = () =>{
        setLoading(true);
        if(arregloFotos.length > 1){
            let arregloAuxiliar = arregloFotosVista.filter(item => item !== arregloFotosVista[indexFoto]);
            let arregloAuxiliarCodificado  = arregloFotos.filter(item => item !== arregloFotos[indexFoto]);
            setIndexFoto(indexFoto-1);
            setArregloFotos( arregloAuxiliarCodificado);
            setArregloFotosVista( arregloAuxiliar);
            setFotoActiva(arregloFotosVista[indexFoto-1]);
        }else{
            setIndexFoto(0);
            setFotoActiva("");
            setArregloFotos([]);
            setArregloFotosVista([]);
        }
        setLoading(false);
    }
    return (
        <IonPage>
            {
                activarMenu ? <MenuLeft /> : <></>
            }
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle>Multar Toma</IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton ></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <div className="datosContribuyete">
                            <h3>{ datosContrato.Nombre } </h3>
                            <p> RFC: { datosContrato.Rfc } , Cuenta: {datosContrato.Cuenta}</p>
                            <p>Contrato: { datosContrato.ContratoVigente }, &nbsp;&nbsp; Medidor: {datosContrato.Medidor}, &nbsp;&nbsp; Toma: {datosContrato.Toma}</p>
                            <p>Municipio: {datosContrato.Municipio}, &nbsp;&nbsp; Localidad: { datosContrato.Localidad}</p>
                            <p>Direccion: {datosContrato.Direccion}</p>
                        </div>
                    </IonCardHeader>
                    <IonCardContent>
                        <br />
                        <IonItem >
                            <IonLabel>{ `Inspector: ${datosUsuario.PersonaNombre} - ${ datosUsuario.Puesto } ` }</IonLabel>
                        </IonItem>
                        <br/>
                        <IonItem >
                            <IonLabel color = {bloquearCorte ? "danger" : "primary"} className = "bloquearCorte" > { ` Estado:  ${listaEstados[ parseInt(datosContrato.Estatus)-1 ]} ${modoPruebas ? " Modo Pruebas " :"" }` } </IonLabel>
                        </IonItem>
                        <br/>
                        <IonItem>
                            <IonLabel> {`Fecha: ${fechaActual} `} </IonLabel>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>{`Monto: $ 4,481.00`}</IonLabel>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel> Tipo de inspección </IonLabel>
                            <IonSelect disabled interface = "action-sheet" value = {tipoInspeccion} onIonChange = { ( e )=>{ }} >
                                <IonSelectOption value = {1} > Multa </IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonTextarea disabled = {false} placeholder = "Motivo de la Multa" className = {errorCampos ? "inputBorderError":"inputBorder"} onIonChange = {e=>{setMotivoInspeccion(String(e.detail.value))}} > </IonTextarea>   
                        </IonItem>
                        {
                        /*<IonItem>
                            <IonInput type="number" disabled = {true} value={monto} placeholder = "$ 4,481.00" className = { String(errorImagenes).includes("M,") ? "inputBorderError" : "inputBorder" } onIonChange = { e =>{setMonto(parseInt(String(e.detail.value)))} } ></IonInput>
                        </IonItem>*/
                        }
                        <br/>
                        <IonGrid>
                            {/**INDEV: Se cambio por un boton */}
                    <IonButton expand="block" color="danger" onClick={() => { setMostrarSlide(true) }} > Evidencias <IonIcon slot="end" icon={cameraOutline} ></IonIcon> </IonButton>
                    </IonGrid>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6" className = "center" >
                                    <IonButton expand = "block" color="secondary" onClick = {regresar}>
                                    <IonIcon icon={chevronBackCircleOutline} slot="start"></IonIcon>
                                        Regresar
                                    </IonButton>
                                </IonCol>
                                <IonCol size="6" className = "center" >
                                    <IonButton expand = "block" disabled = { false/** NOTE: default permite guardar varias multas */ } color="danger" onClick={validarCampos}>
                                        Guardar
                                        <IonIcon icon={saveOutline} slot="end"></IonIcon>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                </IonCardContent>
                </IonCard>
                {/**INDEV: Parte del modal de evidencias */}
                <IonModal ref={referenciaModal} isOpen={mostrarSlide} >
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle className="center" > Evidencias </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent >
                        <IonGrid fixed = { true } >
                            <IonRow className = "centrarImagen cabecera" >
                                <IonCol className= "centrarIconos" > Lista de imagenes </IonCol>
                            </IonRow>
                            <IonRow className="media" >
                                <IonCol size="2" className= "centrarIconosTest" >
                                    <IonIcon onClick={ fotoAnterior } size="large" icon={arrowBackCircle} ></IonIcon></IonCol>
                                <IonCol size="8" className="centrarIconos" >
                                    <IonImg className="imgTotal" src = { fotoActiva == "" ? foto : fotoActiva } ></IonImg>
                                </IonCol>
                                <IonCol size="2" className= " centrarIconos" >
                                    <IonIcon onClick={  siguienteFoto } size="large" icon={arrowForwardCircle} ></IonIcon>
                                </IonCol>
                            </IonRow>
                            <IonRow className = "centrarImagen cabecera">
                                <IonCol className= "centrarIconos centrarDatos" >
                                    <IonButton onClick = {borrarEvidencia} expand="block" color="danger" >Borrar</IonButton>
                                </IonCol>
                                <IonCol className= "centrarIconos centrarDatos" >
                                    <IonButton expand="block" color="success" onClick={CapturarEvidencia} >Capturar</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonContent>
                    <IonButton expand="block" className = "bottom" onClick={ ()=>{setMostrarSlide(false)} } > <IonIcon icon={arrowBackCircleOutline} size = "large" slot="start"></IonIcon> Regresar</IonButton>
                </IonModal>
                <IonLoading 
                    cssClass="my-custom-class"
                    isOpen={ loading }
                    onDidDismiss={() => { setLoading(false); }}
                    message="Por favor espere"
                />
                <IonAlert
                    cssClass="my-custom-class"
                    header={tipoMensaje}
                    message={mensaje}

                    isOpen={mensaje.length > 0}
                    backdropDismiss={false}
                    buttons={[{ text: 'Aceptar', 
                        handler: () => { 
                            if(mensaje == "Multa guardada"){
                                limpiarPantalla();
                                extraerDatos();
                            }else if( mensaje == "La sesion del usuario a caducado" ){ //NOTE: regresamos a la pantalla de inicio
                                //FIXED: cerramos la sesion y regresamos a el login
                                logOut(true);
                            }
                        setMensaje("");
                    }}]}
                />
            </IonContent>
        </IonPage>
    );
}

export default RealizarMulta;