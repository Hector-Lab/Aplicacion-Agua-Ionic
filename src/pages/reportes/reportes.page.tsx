import { useIonToast,IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonMenuButton, IonPage, IonRippleEffect, IonRow, IonText, IonTextarea, IonTitle, IonToolbar, IonIcon, useIonViewWillEnter } from '@ionic/react'
import { useEffect, useState } from 'react'
import LeftMenu from '../../components/left-menu';
import {  guardarReporteV2 } from '../../controller/apiController';
import { verifyingSession, cerrarSesion, getContratoReporte } from '../../controller/storageController';
import { useTakePhoto, obtenerBase64, obtenerCoordenadas } from '../../utilities';
import { useHistory } from 'react-router';
import './reportes.page.css';
import { arrowBackOutline,checkmarkCircle, chevronBackCircleOutline, saveOutline } from 'ionicons/icons';
import MenuLeft from '../../components/left-menu';
import foto from '../../assets/icon/sinFoto.jpg';

const Reportes: React.FC = () => {
    const history = useHistory();
    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState(String);
    const [ tipoMensaje, setTipoMensaje ] = useState(String);
    const [ block, setBlock ] = useState(false);
    const [ tokenExpired, setTokenExpired ] = useState(false);
    const [ connectionError, setConnectionError ] = useState(false);
    const [ contrato,setContrato ] = useState(String);
    const [ fallaAdministrativa, setFallaAdministrativa ] = useState(false);
    const [ arregloFotos, setArregloFotos ] = useState<string[]>([]);
    const [ fotoActiva, setFotoActiva ] = useState('');
    const [ indexFoto, setIndexFoto ] = useState(Number);
    const [ fotosCodificadas, setFotosCodificadas ] = useState<any[]>([]);
    const [pressentToast, dismissToast ] = useIonToast();
    const [ activarGalaria, setActivarGaleria ] = useState(false);
    const [ ErrorUI, setErrorUI ] = useState("");
    //NOTE: manejadores de los inputs
    const [colonia, setColonia] = useState(String);
    const [calle, setCalle] = useState(String);
    const [numero, setNumero] = useState(String);
    const [ descripcion, setDescripcion ] = useState( String );
    const [activarMenu,setActivarMenu] = useState(false);

     //INDEV: Bloque de fotos para tomas
     const [ fotoMedidorEncode, setFotoMedidorEncode ] =  useState(String);
     const [ fotoMedidorPreview, setFotoMedidorPreview ] = useState(String);
     //NOTE: Foto de la facha
     const [ fotoFachadaEncode, setFotoFachadaEncode ] = useState(String);
     const [ fotoFachadaPreview, setFotoFachadaPreview ] = useState(String);
     //NOTE: Foto perspectiva amplia
     const [ fotoCalleEncode, setFotoCalleEncode ] = useState(String);
     const [ fotoCallePreview, setFotoCallePreview ] = useState(String);

    const { takePhoto } = useTakePhoto();
    //Verificando la session
    const buttonsErrorConnection = [
        { text: "Reintentar", handler: () => { setMessage(""); enviarReporte(); } },
        { text: "Aceptar", handler: () => { setMessage(""); console.log("Cancelando") } }
    ]
    const isSessionValid = async () => {
        let valid = verifyingSession();
        setTokenExpired(!valid);
        setBlock(!valid);
    }
    useIonViewWillEnter(()=>{setActivarMenu(true)});
    useEffect(() => { isSessionValid() }, []);
    useEffect(() => { logOut() }, [tokenExpired]);
    useEffect(()=>{
        setActivarGaleria( arregloFotos.length > 0 );
    },[arregloFotos])
    //Manejadores de la interfaz
    const logOut = async () => {
        if (tokenExpired) {
            setTipoMensaje("Sesión no valida");
            setMessage("Inicie sesión por favor\nRegresando...");
            setTimeout(() => {
                cerrarSesion()
                    .then((result) => {
                        setMessage('');
                        history.replace('/home');
                    })
            }, 2500)
        }
    }
    const handleAbrirCamera = async (tipoFoto: number) => {
        setLoading(true);
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
    const borrarFotoEvidencia = () => {
        let fotosTemporal = new Array;
        let fotosEncoded = new Array;
        arregloFotos.map((item, index) => {
            if (index != indexFoto) {
                fotosTemporal.push(item);
            }
        });
        fotosCodificadas.map((item, index) => {
            if (index != indexFoto) {
                fotosEncoded.push(item);
            }
        })
        setFotosCodificadas(fotosEncoded);
        setArregloFotos(fotosTemporal);
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
    const validarDatos = () =>{
        setMessage("");
        setErrorUI("");
        let error = "";
        if( calle.trim().length == 0 ){
            error += "Cl,";
        }
        if( colonia.trim().length == 0 ){
            error += "C,";
        }
        if( numero.trim().length == 0 ){
            error += "N,";
        }
        if ( descripcion.trim().length == 0 ){
            error += "D,";
        }
        //NOTE: aqui ingresamos lar reglas para las imagenes
        if(fotoMedidorEncode.length == 0)
            error += "FM,"
        if(fotoFachadaEncode.length == 0)
            error += "FF,"
        if(fotoCallePreview.length == 0)
            error += "FC,";
        //NOTE: validamos que los datos no esten en 0
        error.length == 0 ? enviarReporte() : lanzarMensaje("Mensaje","Favor de ingresar los campos requeridos", error);
    }
    const enviarReporte = async () =>{
        //NOTE: Recolectamos los datos
        setLoading(true);
        //NOTE: creamos el json de los datos
        let jsonImagenes = {
            "Toma": fotoMedidorEncode,
            "Fachada": fotoFachadaEncode,
            "Calle": fotoCalleEncode
        }
        let Padron = getContratoReporte()
        await obtenerCoordenadas().then( async ( coordenadas )=>{
            let datos = {
                'Calle':calle,
                'Colonia':colonia,
                'Numero':numero,
                'Descripcion':descripcion,
                'Latitud':String(coordenadas.latitude),
                'Longitud':String(coordenadas.longitude),
                'FallaAdministrativa':0,
                'Estatus':1,
                'Fotos':jsonImagenes,
                'Padron':String(Padron),
            };
            await guardarReporteV2(datos)
            .then(( result )=>{
                limpiarPantalla();
            })
            .catch(( error )=>{
                console.log(error);
                setTipoMensaje("Mensaje");
                //setMessage(error.mensaje);
            }).finally(()=>{
                setLoading(false);
            });
        }).catch((error)=>{
            setLoading(false);
            lanzarMensaje("ERROR","¡Favor de activar el servicio de ubicacion!", "")
        })
    }
    const lanzarMensaje = ( tipoMensaje: string, mensaje: string, error = "") =>{
        setTipoMensaje( tipoMensaje );
        setMessage( mensaje );
        setErrorUI( error );
    }
    const btnRegresar = () => {
        history.goBack();
    }
    const limpiarPantalla = () =>{
        
        setColonia("");
        setCalle("");
        setNumero("");
        setDescripcion("");
        setContrato("");
        setFotoActiva("");
        setFotosCodificadas([]);
        setArregloFotos([]);
        setTipoMensaje("Mensaje");
        setMessage("Reporte guardado\nRegresando");
        setTimeout(()=>{
            history.goBack();
        }, 1000);

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
        <IonPage >
            <LeftMenu />
            {
                activarMenu ? 
                <MenuLeft />: <></>
            }
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle>Reportar</IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent >
                {/*INDEV: Pantalla de para el reporte */  }
                <div style={{paddingLeft:10, paddingRight:10}} >
                    <br></br>
                    <IonGrid className = {'centerInput ' + ( ErrorUI.includes("C,") ? "errorInput" : "" )} >
                        <IonRow>
                            <IonInput placeholder = "Colonia"  value={colonia} onIonChange = { text => { setColonia(String(text.detail.value))} } ></IonInput>
                        </IonRow>
                    </IonGrid>
                    <br></br>
                    <IonGrid className = {'centerInput ' + ( ErrorUI.includes("Cl,") ? "errorInput" : "" ) } >
                        <IonRow>
                            <IonInput placeholder = "Calle" value={calle} onIonChange = { text => { setCalle( String(text.detail.value) )}} >  </IonInput>
                        </IonRow>
                    </IonGrid>
                    <br></br>
                    <IonGrid className = {'centerInput ' + ( ErrorUI.includes("N,") ? "errorInput" : "" ) } >
                        <IonRow>
                            <IonInput placeholder = "Numero" value = { numero } onIonChange = { text => {setNumero( String(text.detail.value))}} >  </IonInput>
                        </IonRow>
                    </IonGrid>
                    <br/><br/>
                    <IonGrid>
                                <IonRow>
                                    <IonCol size="4" className="center"  >
                                        <IonLabel> Toma </IonLabel>
                                        <IonCard onClick = { FotoToma } className = { ErrorUI.includes("FM,") ? "errorInput" : "clearInput" } >
                                            <IonImg className="imagenViwer"  src = { fotoMedidorPreview != "" ? fotoMedidorPreview : foto } ></IonImg>
                                            <IonRippleEffect></IonRippleEffect>
                                        </IonCard>
                                    </IonCol>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Facha </IonLabel>
                                        <IonCard onClick = { FotoFachada } className = { ErrorUI.includes("FF,") ? "errorInput" : "clearInput" }  >
                                            <IonImg className="imagenViwer"  src ={ fotoFachadaPreview != "" ? fotoFachadaPreview : foto } >  </IonImg>
                                        </IonCard>
                                        <IonRippleEffect></IonRippleEffect>
                                    </IonCol>
                                    <IonCol size="4" className="center" >
                                        <IonLabel> Calle </IonLabel>
                                        <IonCard onClick = { FotoCalle } className = { ErrorUI.includes("FC,") ? "errorInput" : "clearInput" } >
                                            <IonImg className="imagenViwer"  src ={ fotoCalleEncode != "" ? fotoCalleEncode : foto } >  </IonImg>
                                        </IonCard>
                                        <IonRippleEffect></IonRippleEffect>
                                    </IonCol>
                                </IonRow>
                        </IonGrid>
                    <IonGrid className = {'centerInput ' + ( ErrorUI.includes("D,") ? "errorInput" : "" ) } >
                        <IonRow>
                            <IonCol size='12' className='centrado descrip' >
                                <IonLabel > Descripción </IonLabel>
                            </IonCol>
                            <IonCol size='12' >
                                <IonTextarea value = { descripcion } onIonChange = { text => { setDescripcion(String(text.detail.value))}}></IonTextarea>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <br></br>
                    
                    <IonGrid>
                        <IonRow>
                            <IonCol size='6' >
                                <IonButton color='secondary' expand='block' onClick={ btnRegresar }>
                                    <IonIcon icon={chevronBackCircleOutline} slot= "start" ></IonIcon>
                                     Regresar 
                                     </IonButton>
                            </IonCol>
                            <IonCol size='6' >
                                <IonButton color='danger' expand='block' onClick={ validarDatos }>
                                    <IonIcon icon={saveOutline} slot="end"></IonIcon>
                                    Guardar</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
                <IonAlert
                    cssClass="my-custom-class"
                    header={ tipoMensaje }
                    message={ message }
                    isOpen={ message.length > 0 }
                    backdropDismiss={ false }
                    buttons={connectionError ? buttonsErrorConnection : [{ text: "Aceptar", handler: () => { setMessage(""); console.log("Cancelando") } }]}
                />
                <IonLoading
                    cssClass="my-custom-class"
                    isOpen={loading}
                    onDidDismiss={() => { setLoading(false); }}
                    message="Por favor espere"
                />
            </IonContent>
        </IonPage>
    )
}

export default Reportes;