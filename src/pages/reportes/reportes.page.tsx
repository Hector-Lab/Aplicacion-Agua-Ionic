import { useIonToast,IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonMenuButton, IonPage, IonRippleEffect, IonRow, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react'
import { useEffect, useState } from 'react'
import LeftMenu from '../../components/left-menu';
import { crearReporte } from '../../controller/apiController';
import { verifyingSession, cerrarSesion } from '../../controller/storageController';
import { useTakePhoto, obtenerBase64} from '../../utilities';
import { useHistory } from 'react-router';
import './reportes.page.css';
import { checkmarkCircle } from 'ionicons/icons';

const Reportes: React.FC = () => {
    const history = useHistory();
    const [descripcion, setDescripcion] = useState(String);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(String);
    const [tipoMensaje, setTipoMensaje] = useState(String);
    const [block, setBlock] = useState(false);
    const [tokenExpired, setTokenExpired] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [contrato,setContrato] = useState(String);
    const [fallaAdministrativa, setFallaAdministrativa] = useState(false);
    const [ arregloFotos, setArregloFotos ] = useState<string[]>([]);
    const [ fotoActiva, setFotoActiva ] = useState('');
    const [ indexFoto, setIndexFoto ] = useState(Number);
    const [ fotosCodificadas, setFotosCodificadas ] = useState<any[]>([]);
    const [pressentToast, dismissToast] = useIonToast();
    const [ activarGalaria, setActivarGaleria ] = useState(false);
    const [ ErrorUI, setErrorUI ] = useState("");
    //NOTE: manejadores de los inputs
    const [colonia, setColonia] = useState(String);
    const [calle, setCalle] = useState(String);
    const [numero, setNumero] = useState(String);

    const { takePhoto } = useTakePhoto();
    //Verificando la session
    const buttonsErrorConnection = [
        { text: "Reintentar", handler: () => { setMessage(""); handleBtnCrearReporte(); } },
        { text: "Aceptar", handler: () => { setMessage(""); console.log("Cancelando") } }
    ]
    const isSessionValid = async () => {
        let valid = verifyingSession();
        setTokenExpired(!valid);
        setBlock(!valid);
    }
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
    const handleColonia = (data: string) => {
        setColonia(data)
    }
    const handleCalle = (data: string) => {
        setCalle(data)
    }
    const handleNumero = (data: string) => {
        setNumero(data);
    }
    const handledescripcion = (data: string) => {
        setDescripcion(data);
    }
    const handleBtnCrearReporte = async () => {
        setLoading(true);
        let data = {
            colonia: colonia,
            calle: calle,
            numero: numero,
            descripcion: descripcion,
            contrato: contrato,
            fallaAdministrativa: fallaAdministrativa ? 1 : 0,
        }
        await crearReporte(data)
            .then((result) => {
                setConnectionError(false);
                limpiarPantalla();
                setTipoMensaje("Mensaje");
                setMessage(result);
            }).catch((err) => {
                setTipoMensaje("ERROR");
                let messageError = String(err.message);
                setConnectionError(messageError.includes("API"));
                let sessionExpired = messageError.includes("Sesion no valida");
                setTokenExpired(sessionExpired);
                if (!sessionExpired) {
                    setMessage(messageError);
                } else {
                    console.log("El token ya expiro")
                }
            }).finally(() => {
                setLoading(false);
            })
    }
    const limpiarPantalla = () => {
        setColonia("");
        setCalle("");
        setNumero("");
        setDescripcion("");
        setContrato("");
    }
    const handleContrato = (data: string) =>{
        setContrato(data);
    }
    const handleCheckAdminstraivo = (value: boolean) =>{
        setFallaAdministrativa(value)
    }
    const generarGaleria = () => {
        if ( activarGalaria ) {
            let data =
                <div>
                    <br></br>
                    {
                        arregloFotos.length > 0 ?
                            <IonItem>
                                <IonRow>
                                    {
                                        arregloFotos.map((item, index) => {
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
    const handleAbrirCamera = async () => {
        setLoading(true);
        await takePhoto()
            .then(async (result) => {
                
                if (arregloFotos.length <= 2) {
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
    const agregarImagenEncode = async (imgDir: string) => {
        await obtenerBase64(imgDir).then((result) => {
            setFotoActiva(imgDir);
            setArregloFotos(fotosEvidencia => [...fotosEvidencia, imgDir]);
            setIndexFoto(arregloFotos.length);
            setFotosCodificadas(fotosCodificadas => [...fotosCodificadas, result])
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
        let error = "";
    }
    const ubicacion = () =>{
        
    }

    return (
        <IonPage >
            <LeftMenu />
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
                    <IonGrid className = 'centerInput' >
                        <IonRow>
                            <IonCol size='3' className = 'centerItems' >
                                <IonLabel className='inputLabel' > Colonia: </IonLabel>
                            </IonCol>
                            <IonCol size='9' >
                                <IonInput>  </IonInput>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <br></br>
                    <IonGrid className = 'centerInput' >
                        <IonRow>
                            <IonCol size='3' className = 'centerItems' >
                                <IonLabel className='inputLabel' > Calle: </IonLabel>
                            </IonCol>
                            <IonCol size='9' >
                                <IonInput>  </IonInput>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <br></br>
                    <IonGrid className = 'centerInput' >
                        <IonRow>
                            <IonCol size='3' className = 'centerItems' >
                                <IonLabel className='inputLabel' > Calle: </IonLabel>
                            </IonCol>
                            <IonCol size='9' >
                                <IonInput>  </IonInput>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <br/><br/>
                    <IonGrid className = 'centerInput' >
                        <IonRow>
                            <IonCol size='12' className='centrado descrip' >
                                <IonLabel > Descripción </IonLabel>
                            </IonCol>
                            <IonCol size='12' >
                                <IonTextarea ></IonTextarea>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <br></br>
                    { generarGaleria() }
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
                    <IonGrid >
                        <IonRow>
                            <IonCol size='6' className='centrado' >
                                <IonButton color='primary' onClick={ handleAbrirCamera } > Evidencia </IonButton>
                                <IonRippleEffect></IonRippleEffect>
                            </IonCol>
                            <IonCol size='6' class='centrado' >
                                <IonButton color='primary' onClick = { ()=>{} } > Ubicaciòn </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonGrid>
                        <IonRow>
                            <IonCol size='12' >
                                <IonButton color='danger' expand='block' onClick={()=>{}}> Guardar Reporte </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
                <IonAlert
                    cssClass="my-custom-class"
                    header={tipoMensaje}
                    message={message}
                    isOpen={message.length > 0}
                    backdropDismiss={false}
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