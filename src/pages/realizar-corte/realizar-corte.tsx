import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonLoading, IonMenuButton, IonPage, IonPicker, IonRippleEffect, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, useIonToast, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { checkmarkCircle, chevronBackCircleOutline, contractOutline, pencil, saveOutline, triangle } from "ionicons/icons";
import { useEffect,useState } from 'react';
import MenuLeft from '../../components/left-menu';
import { obtenerDatosCorte, EnviarCorte } from '../../controller/apiController';
import { useTakePhoto, obtenerBase64, obtenerCoordenadas,asignarCalidad,modificarTamanio } from '../../utilities';
import './realizar-corte.css';
import foto from '../../assets/icon/sinFoto.jpg';
import { useHistory } from 'react-router';

const RealizarCorte: React.FC = () => {
    const history = useHistory();
    const [ activarMenu, setActivarMenu ] = useState(true);
    const [ datosContrato, setDatosContrato ] = useState(Object);
    const [ datosUsuario, setDatosUsuario ] = useState(Object);
    const [ loading, setLoading ] = useState(true);
    const [ fechaActual, setFechaActual ] = useState("");
    const [ tipoInspeccion, setTipoInspecion ] = useState(2);
    /**NOTE: Manejadores de fotos */
    const [ arregloFotos, setArregloFotos ] = useState<string[]>([]);
    const [ arregloFotosVista, setArregloFotosVista ] = useState<string[]>([]);
    const [ fotoActiva, setFotoActiva ] = useState(String);
    const [ indexFoto, setIndexFoto ] = useState(Number);
    const [ activarGaleria, setActivarGaleria ] = useState(false);
    const { takePhoto } = useTakePhoto();
    //NOTE: contradores de la base de datos
    const [ motivoInspeccion, setMotivoInspeccion ] = useState(String);
    const [ ejercicio, setEjercicio ] = useState(2020);
    //NOTE: Validacion de toma si esta cortado
    const [ bloquearCorte, setBloquearCorte ] = useState(true);
    /**NOTE: Manejador de mensajes de error y advertencias */
    const [ tipoMensaje, setTipoMensaje ] = useState(String);   
    const [ mensaje, setMensaje ] = useState( String );
    const [ errorCarga, setErrorCarga ] = useState(false);
    const [ errorCampos, setErrorCampos ] = useState(false);
    const [pressentToast, dismissToast] = useIonToast();
    


     //INDEV: Bloque de fotos para tomas
     const [ fotoTomaEncode, setFotoTomaEncode ] =  useState(String);
     const [ fotoTomaPreview, setFotoTomaPreview ] = useState(String);
     //NOTE: Foto de la facha
     const [ fotoFachadaEncode, setFotoFachadaEncode ] = useState(String);
     const [ fotoFachadaPreview, setFotoFachadaPreview ] = useState(String);
     //NOTE: Foto perspectiva amplia
     const [ fotoCalleEncode, setFotoCalleEncode ] = useState(String);
     const [ fotoCallePreview, setFotoCallePreview ] = useState(String);
     //NOTE: Manejador de errores 
     const [ errorImagenes, setErrorImagenes ] = useState( String );
     

    const alertButtons = [
        {
            text: "Reintentar", handler: () => {
                setMensaje("");
                setTipoMensaje("Error");
                setLoading(true);
                extraerDatos();
                
            }
        },
        {
            text: "Cancelar"
        }]
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
        await obtenerDatosCorte()
        .then(( result )=>{
            if(result != undefined ){
                console.log(result[1]);
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
            switch (tipoFoto) {
                case 1:
                    setFotoTomaEncode(String(result));
                    setFotoTomaPreview(imgDir);
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
                        <IonGrid>
                                <IonRow>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Toma </IonLabel>
                                        <IonCard>
                                            <IonImg className="imagenViwer"  src="https://media.istockphoto.com/vectors/vector-camera-icon-with-photo-button-on-a-white-background-vector-id1270930870?k=20&m=1270930870&s=170667a&w=0&h=kG9xDNMeLFQJeDrg-ik-HkvaHcOy2HjZe8xaDMB-dk0=" >  </IonImg>
                                        </IonCard>
                                    </IonCol>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Facha </IonLabel>
                                        <IonCard>
                                            <IonImg className="imagenViwer"  src="https://media.istockphoto.com/vectors/vector-camera-icon-with-photo-button-on-a-white-background-vector-id1270930870?k=20&m=1270930870&s=170667a&w=0&h=kG9xDNMeLFQJeDrg-ik-HkvaHcOy2HjZe8xaDMB-dk0=" >  </IonImg>
                                        </IonCard>
                                    </IonCol>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Calle </IonLabel>
                                        <IonCard>
                                            <IonImg className="imagenViwer"  src="https://media.istockphoto.com/vectors/vector-camera-icon-with-photo-button-on-a-white-background-vector-id1270930870?k=20&m=1270930870&s=170667a&w=0&h=kG9xDNMeLFQJeDrg-ik-HkvaHcOy2HjZe8xaDMB-dk0=" >  </IonImg>
                                        </IonCard>
                                    </IonCol>
                                </IonRow>
                        </IonGrid>
    const guardarInspeccion = async( Fotos: { "Toma": string, "Fachada": string , "Calle": string }  ) =>{
        try {
            setLoading(true);
            setTimeout(() => {
                if (loading) {
                    throw 0;
                }
            }, 20000);
            await obtenerCoordenadas()
            .then( async ( coordenadas )=>{
                //NOTE: damos formato a los datos que se enviaran
                //INDEV: faltan las fotos {\"Estatus\":true,\"Code\":200,\"Mensaje\":\"Tomar cortada\",\"Corte\":6089}
                let datos = {
                    Motivo: motivoInspeccion,
                    Padron: datosContrato.Padron,
                    Persona: datosUsuario.Persona,
                    Usuario: datosUsuario.Usuario,
                    Estado: tipoInspeccion,
                    Longitud: String(coordenadas.longitude),
                    Latitud: String(coordenadas.latitude),
                    Ejercicio: ejercicio,
                    Evidencia:Fotos
                };
                console.log( datos );                
                await EnviarCorte(datos)
                .then(()=>{
                    setErrorCarga(false);
                    setTipoMensaje("Mensaje");
                    setMensaje("Corte realizado...");
                    setTimeout(()=>{
                        history.goBack();
                    }, 1000);
                })
                .catch((error)=>{
                    setErrorCarga(false);
                    setMensaje(error.message);
                    setTipoMensaje("ERROR");            
                })
                .finally(()=>{
                    setLoading(false);
                })
            });
        }catch(error){
            console.log(error);
            setLoading(false);
            setTipoMensaje("Mensaje");
            setMensaje(`Tiempo de espera agotado.
            Asegúrese de activar la ubicación del dispositivo`)
        }
    }
    const validarCampos = async () =>{
        //Validamos que las fotos no esten vacias
        let error = "";
        fotoTomaEncode == "" ? error += "T," : error+="";
        fotoFachadaEncode == "" ? error += "F," : error+="";
        fotoCalleEncode == "" ? error += "C,": error+=""
        if(error == ""){
            if(motivoInspeccion != ""){
                //NOTE: Creamosel objeto que se va a enviar
                let jsonImagenes = {
                    "Toma": fotoTomaEncode,
                    "Fachada": fotoFachadaEncode,
                    "Calle": fotoCalleEncode
                };
                setErrorCampos(false);
                await guardarInspeccion(jsonImagenes);
            }else{
                setTipoMensaje("Mensaje");
                setMensaje("Favor de ingresar el motivo del corte");
                setErrorCampos(true);
            }
        }else{
            //Lanzamos los errores de fotos
            setErrorImagenes(error);
        }
    }   
    const borrarFotoEvidencia = () => {
        let fotosTemporal = new Array;
        let fotosEncoded = new Array;
        arregloFotos.map((item, index) => {
            if (index != indexFoto) {
                fotosTemporal.push(item);
            }
        });
        arregloFotosVista.map((item, index) => {
            if (index != indexFoto) {
                fotosEncoded.push(item);
            }
        })
        setArregloFotosVista(fotosTemporal);
        setArregloFotos(fotosEncoded);
        setFotoActiva('');
        pressentToast({
            message: "Se elimino la foto de la lista",
            duration: 2000,
            position: 'top',
            buttons: [
                {
                    side: 'start',
                    icon: checkmarkCircle,
                }
            ]
        });
        console.log(fotosTemporal.length + " - " + fotosEncoded.length);
    }
    const regresar = () =>{
        history.replace('/buscar-contrato');
    }
    const limpiarPantalla = () =>{
        setActivarGaleria(false);
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
    return (
        <IonPage>
            {
                activarMenu ? <MenuLeft /> : <></>
            }
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle>Cortar Toma</IonTitle>
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
                            <IonLabel> Tipo de inspección </IonLabel>
                            <IonSelect disabled interface = "action-sheet" value = {tipoInspeccion} onIonChange = { ( e )=>{setTipoInspecion(e.detail.value)} } >
                                <IonSelectOption value = {3} > Baja Temporal </IonSelectOption>
                                <IonSelectOption value = {4} > Baja Permanente </IonSelectOption>
                                <IonSelectOption value = {2} > Cortado </IonSelectOption>
                                <IonSelectOption value = {5} > Inactivo </IonSelectOption>
                                <IonSelectOption value = {9} > Sin Toma </IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonTextarea disabled = {bloquearCorte} placeholder = "Motivo del corte" className = {errorCampos ? "inputBorderError":"inputBorder"} onIonChange = {e=>{setMotivoInspeccion(String(e.detail.value))}} > </IonTextarea>   
                        </IonItem>
                        <br/>
                        <IonGrid>
                                <IonRow>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Toma </IonLabel>
                                        <IonCard onClick = { FotoToma } className = { errorImagenes.includes("T,") ? "errorInput" : "clearInput" }  >
                                            <IonImg className="imagenViwer"  src = { fotoTomaPreview != "" ? fotoTomaPreview : foto } ></IonImg>
                                            <IonRippleEffect></IonRippleEffect>
                                        </IonCard>
                                    </IonCol>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Facha </IonLabel>
                                        <IonCard onClick = { FotoFachada } className = { errorImagenes.includes("F,") ? "errorInput" : "clearInput" } >
                                            <IonImg className="imagenViwer"  src ={ fotoFachadaPreview != "" ? fotoFachadaPreview : foto } >  </IonImg>
                                        </IonCard>
                                        <IonRippleEffect></IonRippleEffect>
                                    </IonCol>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Calle </IonLabel>
                                        <IonCard onClick = { FotoCalle } className = { errorImagenes.includes("C,") ? "errorInput" : "clearInput" } >
                                            <IonImg className="imagenViwer"  src ={ fotoCalleEncode != "" ? fotoCalleEncode : foto } >  </IonImg>
                                        </IonCard>
                                        <IonRippleEffect></IonRippleEffect>
                                    </IonCol>
                                </IonRow>
                        </IonGrid>
                        
                        <br />
                        {
                            fotoActiva != '' ?
                            <IonItem >
                                <IonCard className = "centrarCarousel" >
                                    <IonImg src={fotoActiva} />
                                    <IonCardContent >
                                        <IonButtons>
                                            <IonButton color="secondary" onClick={() => { setFotoActiva(''); }}>Cerrar</IonButton>
                                            <IonButton color="danger" onClick={() => { borrarFotoEvidencia(); }} >Eliminar</IonButton>
                                        </IonButtons>
                                    </IonCardContent>
                                </IonCard>
                            </IonItem> : <></>
                        }
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="6" className = "center" >
                                        <IonButton expand = "block" color="secondary" onClick = {regresar}>
                                        <IonIcon icon={chevronBackCircleOutline} slot="start"></IonIcon>
                                            Regresar
                                        </IonButton>
                                    </IonCol>
                                    <IonCol size="6" className = "center" >
                                        <IonButton expand = "block" disabled = {bloquearCorte} color="danger" onClick={validarCampos}>
                                            Guardar
                                            <IonIcon icon={saveOutline} slot="end"></IonIcon>
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                    </IonCardContent>
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

                    isOpen={mensaje.length > 0}
                    backdropDismiss={false}
                    buttons={ errorCarga ? alertButtons : [{ text: 'Aceptar', 
                        handler: () => { 
                            if(mensaje == "Corte realizado..."){
                                limpiarPantalla();
                                extraerDatos();
                            }
                        setMensaje("");
                     } 
                }]}
                />
            </IonContent>
        </IonPage>
    );
}

export default RealizarCorte;