import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonLoading, IonMenuButton, IonPage, IonRow, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react'
import { useEffect, useState } from 'react'
import LeftMenu from '../../components/left-menu';
import { crearReporte } from '../../controller/apiController';
import { verifyingSession, cerrarSesion } from '../../controller/storageController';
import { useHistory } from 'react-router';
import './reportes.page.css';
import { isatty } from 'node:tty';
const Reportes: React.FC = () => {
    const history = useHistory();
    const [colonia, setColonia] = useState(String);
    const [calle, setCalle] = useState(String);
    const [numero, setNumero] = useState(String);
    const [descripcion, setDescripcion] = useState(String);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(String);
    const [tipoMensaje, setTipoMensaje] = useState(String);
    const [block, setBlock] = useState(false);
    const [tokenExpired, setTokenExpired] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [contrato,setContrato] = useState(String);
    const [fallaAdministrativa, setFallaAdministrativa] = useState(false)
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
    return (
        <IonPage>
            <LeftMenu />
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle>Fallos en infraestructura</IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <br />
                <IonCard>
                    <IonCardHeader>
                        <div className="centrado">
                            <h5>
                                Los campos que presentan<IonText color="danger">*</IonText>son obligatorios
                            </h5>
                        </div>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel>Selecciones aqui si es una falla administrativa</IonLabel>
                            <IonCheckbox color = "danger" onIonChange = {e=>{handleCheckAdminstraivo(e.detail.checked)}}></IonCheckbox>
                        </IonItem>
                        <IonItem >
                            <IonLabel position="floating" className="input">Colonia <IonText color="danger">*</IonText></IonLabel>
                            <IonInput disabled={block} onIonChange={e => { handleColonia(e.detail.value + "") }} value={colonia} ></IonInput>
                        </IonItem>
                        <IonItem >
                            <IonLabel position="floating" className="input">Calle<IonText color="danger">*</IonText></IonLabel>
                            <IonInput disabled={block} onIonChange={e => { handleCalle(e.detail.value + "") }} value={calle}  ></IonInput>
                        </IonItem>
                        <IonItem >
                            <IonLabel position="floating" className="input">Número</IonLabel>
                            <IonInput disabled={block} type="number" onIonChange={e => { handleNumero(e.detail.value + "") }} value={numero}  ></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position = "floating" className = "input">Contrato</IonLabel>
                            <IonInput disabled={block} type="number" onIonChange = {e => {handleContrato(String(e.detail.value))}}></IonInput>
                        </IonItem>
                        <IonItem >
                            <IonLabel position="floating" className="input">{ `Descripcion de la falla${fallaAdministrativa ? " administrativa": ""}`}<IonText color="danger">*</IonText></IonLabel>
                            <IonTextarea disabled={block} onIonChange={e => { handledescripcion(e.detail.value + "") }} value={descripcion} ></IonTextarea>
                        </IonItem >
                        <br /><br />
                        <div className="centrar">
                            <IonButton disabled={block} color="primary" onClick={handleBtnCrearReporte}>Crear reporte</IonButton>
                        </div>
                        
                    </IonCardContent>
                </IonCard>
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