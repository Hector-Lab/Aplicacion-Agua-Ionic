import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonLoading, IonMenu, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { useEffect, useState } from 'react'
import LeftMenu from "../../components/left-menu";
import { obtenerIdReporte, verifyingSession } from '../../controller/storageController'
import { extraerReporte } from '../../controller/apiController';
import { useHistory } from 'react-router'
import { chevronBackCircleOutline } from 'ionicons/icons'
import './detalle-reporte.page.css'
const DetalleReporte: React.FC = () => {
    const history = useHistory();
    const [idReporte, setIdReporte] = useState(String);
    const [userName, setUserName] = useState(String);
    const [colonia, setColonia] = useState(String);
    const [calle, setCalle] = useState(String);
    const [numero, setNumero] = useState(String);
    const [fecha, setFecha] = useState(String)
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(String);
    const [typeMessage, setTypeMessage] = useState(String);
    const [connectionError, setConnectionError] = useState(false);
    const [expiredToken, setExpiredToken] = useState(false);
    const [descripcion, setDescripcion] = useState(String);
    const alertButtons = [
        {
            text: "Reintentar",
            handler: () => { setMessage(''); obtenerReporte() }
        },
        {
            text: "Aceptar",
            handler: () => { setMessage(''); setLoading(false) }
        }]
    const cargarDatos = async () => {
        setExpiredToken(!verifyingSession());
        console.log("El error es por que el token es null ", !expiredToken);
        let { id, userName } = obtenerIdReporte();
        setUserName(String(userName));
        setIdReporte(String(id));
    }
    useEffect(() => { obtenerReporte() }, [idReporte]);
    useEffect(() => { connectionError ? setTypeMessage("Error") : setTypeMessage("Mensaje") }, [connectionError]);
    useEffect(() => { logOut() }, [expiredToken]);
    const logOut = () => {
        if (expiredToken) {
            setMessage("ERROR");
            setMessage("Inicie sesión por favor\nRegresando...");
            setTimeout(() => {
                history.replace("./home")
            }
                , 2500);
        }
    }
    const obtenerReporte = async () => {
        setLoading(true);
        extraerReporte(idReporte)
            .then((result) => {
                let { Calle, Colonia, Descripcion, Fecha, Numero } = result[0];
                setCalle(Calle);
                setColonia(Colonia);
                setDescripcion(Descripcion);
                setFecha(Fecha);
                setNumero(Numero);
            })
            .catch((err) => {
                let errorMessage = String(err.message);
                setConnectionError((errorMessage.includes("API")));
                let expired = errorMessage.includes("Sesion no valida");
                setExpiredToken(expired);
                if (expired) {
                    setMessage(errorMessage);
                }
            })
            .finally(() => { setLoading(false) })

    }
    useEffect(() => { cargarDatos() }, [])
    const handleBtnRegresar = () =>{
        history.replace("/historial-reportes.page");
    }
    return (
        <IonPage>
            <IonContent>
                <LeftMenu />
                <IonToolbar color="danger" >
                    <IonTitle>Reportes</IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
                <IonCard>
                    <IonCardHeader>
                        <h6 className="center">{`Reporto: ${userName}`}</h6>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12">
                                    <h3 className="center">{`Colonia: ${colonia}`}</h3>
                                </IonCol>
                            </IonRow>
                            <br />
                            <IonRow >
                                <IonCol size="6" className="center">
                                    {`Calle: ${calle}`}
                                </IonCol>
                                <IonCol size="6" className="center">
                                    {`Numero: ${numero}`}
                                </IonCol>
                            </IonRow>
                            <br />
                            <IonRow>
                                <IonCol size="12" className="center">
                                    Descripción
                                </IonCol>
                            </IonRow>
                            <IonRow className="backgroundColor">
                                <IonCol size="12">
                                    <IonText>
                                        {descripcion}
                                    </IonText>
                                </IonCol>
                            </IonRow>
                            <br />
                            <div className="center">
                                <IonButton color="secondary" onClick = {handleBtnRegresar}>
                                    Regresar
                                <IonIcon icon={chevronBackCircleOutline} slot="start"></IonIcon>
                                </IonButton>
                            </div>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
                <IonAlert
                    isOpen={message.length > 0}
                    header={typeMessage}
                    message={message}
                    backdropDismiss={false}
                    buttons={connectionError ? alertButtons : [{ text: "Aceptar", handler: () => { setMessage('') } }]}
                />
                <IonLoading
                    isOpen={loading}
                    message="Espere por favor"
                />
            </IonContent>
        </IonPage>
    )
}

export default DetalleReporte;