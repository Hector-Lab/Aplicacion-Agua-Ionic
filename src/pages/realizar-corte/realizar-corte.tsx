import { IonAlert, IonApp, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonLoading, IonMenuButton, IonPage, IonPicker, IonRippleEffect, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, useIonToast, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { checkmarkCircle, chevronBackCircleOutline, contractOutline, pencil, saveOutline, triangle } from "ionicons/icons";
import { useEffect,useState } from 'react';
import MenuLeft from '../../components/left-menu';
import { obtenerDatosCorte, RealizarCorteAPI } from '../../controller/apiController';
import { getIdUsuario } from '../../controller/storageController';
import { useTakePhoto, obtenerBase64, obtenerCoordenadas } from '../../utilities';
import { camera } from 'ionicons/icons';
import './realizar-corte.css';
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
    const modoPruebas = true; //INDEV: modo de pruebas 
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
    const handleAbrirCamara = async () =>{
        if(!bloquearCorte){
            console.log("Abriendo Camara...");
            setLoading(true);
            await takePhoto()
            .then((result)=>{
                agregarImagenEncode( String(result.webPath) );
                //NOTE: Verificamos que aun tenga fotos disponible
            }).catch((erro)=>{
                let errorType = erro.message + "";
                if (errorType.includes("denied")) {
                    setMensaje("La aplicación no tiene permisos para usar la cámara");
                }
            }).finally(()=>{
                setLoading(false);
            });
        }
    }
    const agregarImagenEncode = async ( direccion: string ) =>{
        await obtenerBase64(direccion)
        .then(( base64Encode )=>{
            setFotoActiva(direccion);
            setArregloFotosVista(arregloFotosVista => [...arregloFotosVista, direccion]);
            setIndexFoto(arregloFotosVista.length);
            setArregloFotos( arregloFotos => [...arregloFotos,String(base64Encode)] );
            setActivarGaleria(true);
        }).catch((error)=>{

        }).finally(()=>{
            setLoading(false);;
        })
        
    }
    const generarGaleria = () => {
        if (activarGaleria) {
            let data =
                <div>
                    {
                        arregloFotosVista.length > 0 ?
                            <IonItem>
                                <IonRow>
                                    {
                                        arregloFotosVista.map((item, index) => {
                                            return <IonCol key={index} className = {"ion-activatable ripple-parent " + ( indexFoto == index ? "selected" : "")} >
                                                        <IonImg src={item} onClick={() => { cambiarFotoActiva(item, index) }} className="imgFormat"></IonImg>
                                                        <IonRippleEffect></IonRippleEffect>
                                                    </IonCol>
                                        })
                                    }
                                </IonRow>
                            </IonItem> : <></>
                    }
                </div>;
            return data;
        }
    }
    const cambiarFotoActiva = (foto: string, index: number) => {
        setFotoActiva(foto);
        setIndexFoto(index);
    }
    const guardarInspeccion = async(  ) =>{
        try {
            setLoading(true);
            setTimeout(() => {
                if (loading) {
                    throw 0;
                }
            }, 20000);
            if(!(arregloFotos.length == 0)){
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
                        Evidencia:arregloFotos
                    };
                    await RealizarCorteAPI(datos)
                    .then(()=>{
                        setErrorCarga(false);
                        setTipoMensaje("Mensaje");
                        setMensaje("Corte realizado...");
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
            }else{
                setTipoMensaje("Mensaje");
                setMensaje("Debe capturar almenos 1 foto")
                setLoading(false);
            }
        }catch(error){
            console.log(error);
            setLoading(false);
            setTipoMensaje("Mensaje");
            setMensaje(`Tiempo de espera agotado.
            Asegúrese de activar la ubicación del dispositivo`)
        }
    }
    const validarCampos = async () =>{
        if(motivoInspeccion != ""){
            setErrorCampos(false);
            await guardarInspeccion();
        }else{
            setTipoMensaje("Mensaje");
            setMensaje("Favor de ingresar el motivo del corte");
            setErrorCampos(true);
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
    return (
        <IonPage>
            {
                activarMenu ? <MenuLeft /> : <></>
            }
            {/**  Header del menu */}
            
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle>Cortar toma</IonTitle>
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
                        
                        <IonItem>
                            <IonLabel >Adjuntar evidencia (maximo 3 fotos)</IonLabel>
                            <IonIcon  icon={camera} className="iconStyle" onClick={handleAbrirCamara}></IonIcon>
                        </IonItem>
                        <br/>
                        {
                            generarGaleria()
                        }
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
                                    <IonCol size="4">
                                            <IonIcon icon={chevronBackCircleOutline} slot="start"></IonIcon>
                                        <IonButton color="secondary" onClick = {regresar}>
                                            Regresar
                                        </IonButton>
                                    </IonCol>
                                    <IonCol size="4" ></IonCol>
                                    <IonCol size="4" >
                                        <IonButton disabled = {bloquearCorte} color="danger" onClick={validarCampos}>
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