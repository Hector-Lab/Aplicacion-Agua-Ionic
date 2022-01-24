import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import LeftMenu from '../../components/left-menu';
import React, { useState, useEffect } from 'react';
import { historialReportes } from '../../controller/apiController';
import { eyeOutline } from 'ionicons/icons';
import { guardarIdReporte, verifyingSession, cerrarSesion, getFechasHistorialReportes, setFechasHistorialReportes } from '../../controller/storageController'
import { useHistory } from 'react-router-dom';
const HistorilaReportes: React.FC = () => {
    const history = useHistory();
    const [fechaDesde, setFechaDesde] = useState(String);
    const [fechaHasta, setFechaHasta] = useState(String);
    const [placeFechaDesde, setPlaceFechaDesde] = useState(String);
    const [placeFechaHasta, setPlaceFechaHasta] = useState(String);
    const [message, setMessage] = useState(String);
    const [typeMessage, setTypeMessage] = useState(String);
    const [loading, setLoading] = useState(false);
    const [reportes, setReportes] = useState<any[]>([]);
    const [connectionError, setConnectionError] = useState(false);
    const [tokenExpired, setTokenExpired] = useState(false);
    const [block, setBlock] = useState(true);
    const alertsButtons = [
        {
            text: "Reintentar",
            handler: () => { setMessage(''); handleBtnGenerar(fechaDesde,fechaHasta); }
        },
        {
            text: "Cancelar",
            handler: () => { setLoading(false); setMessage(''); }
        }
    ]
    const fecha = new Date();

    const sessionIsValid = () => {
        let valid = verifyingSession();
        setTokenExpired(!valid);
        setBlock(!valid);
    }
    useEffect(() => {
        let defaultFecha = (fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + (fecha.getDate()));
        setFechaDesde(defaultFecha);
        setFechaHasta(defaultFecha);
        setPlaceFechaDesde(defaultFecha);
        setPlaceFechaHasta(defaultFecha);
        sessionIsValid();
    }, [])
    useEffect(() => { logOut(tokenExpired) }, [tokenExpired])
    const verificarFechas = () =>{
        let data = getFechasHistorialReportes();
        console.log(data);
        if(data != null){
            setFechaDesde(String(data.desde));
            setFechaHasta(String(data.hasta));
            handleBtnGenerar(String(data.desde),String(data.hasta));
        }
    }
    useIonViewWillEnter(verificarFechas)
    const logOut = (valid: boolean) => {
        if (valid) {
            setTypeMessage("Sesión no valida");
            setMessage("Inicie sesión por favor\nRegresando...");
            cerrarSesion();
            setTimeout(() => {
                history.replace("./home")
            }, 2500);
        } else {
            console.log("La session es valida");
        }
    }
    //Manejadores de la interfaz
    const handleBtnGenerar = (desde: string, hasta:string) => {
        let valid = validateFecha(desde,hasta);
        if (valid) {
            setLoading(true);
            historialReportes(desde, hasta)
                .then((result) => { setReportes(result) })
                .catch((error) => {
                    console.log(error);
                    setReportes([]);
                    let resultMessage = String(error.message);
                    setConnectionError(resultMessage.includes("API"));
                    setTokenExpired(resultMessage.includes("Sesion no valida"));
                    let errores = resultMessage.includes("Sesion no valida") && resultMessage.includes("API");
                    errores ? setTypeMessage("ERROR") : setTypeMessage("MENSAJE");
                    setMessage(resultMessage);
                })
                .finally(() => { setLoading(false) })
        }else{
            setTypeMessage("MENSAJE");
            setMessage("Selección de fechas no validas"); 
        }
    }
    const handleFechaDesde = (fecha: string) => {
        setFechaDesde(fecha)
    }
    const handleFechaHasta = (fecha: string) => {
        setFechaHasta(fecha)
    }
    const handleAlertBtnAceptar = () => { setMessage(''); setConnectionError(false) }
    const handelDetalleReporte = (id: number) => {
        //Giardar las fechas de los reportes
        setFechasHistorialReportes(fechaDesde,fechaHasta);
        guardarIdReporte(id);
        history.replace('/detalles-reportes.page');
    }
    const validateFecha = (desde: string,hasta:string) => {
        let fechaInicio = new Date(desde);
        let fechaFin = new Date(hasta);
        console.log(fechaInicio,fechaFin, fechaInicio <= fechaFin);
        return fechaInicio <= fechaFin;
    }
    return (
        <IonPage>
            <IonContent>
                <LeftMenu />
                <IonHeader>
                    <IonToolbar color="danger" >
                        <IonTitle>Historial Reportes</IonTitle>
                        <IonButtons slot="start" className="btnMenu">
                            <IonMenuButton ></IonMenuButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonCard>
                    <IonCardHeader className="center">
                        <div>
                            <h5>Seleccione la fecha</h5>
                        </div>
                    </IonCardHeader>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <div className="center">
                                        <label>Desde: </label>
                                        <IonDatetime disabled={block}
                                            onIonChange={e => { handleFechaDesde(e.detail.value + "") }}
                                            placeholder={placeFechaDesde}
                                            displayFormat="DD-MM-YYYY"
                                            pickerFormat="DD-MM-YYYY"
                                            cancelText="Cancelar"
                                            doneText="Aceptar"
                                            value={fechaDesde}>{fechaDesde}</IonDatetime>
                                    </div>
                                </IonCol>
                                <IonCol>
                                    <div className="center">
                                        <label>Hasta: </label>
                                        <IonDatetime disabled={block}
                                            onIonChange={e => { handleFechaHasta(e.detail.value + "") }}
                                            placeholder={placeFechaHasta}
                                            displayFormat="DD-MM-YYYY"
                                            pickerFormat="DD-MM-YYYY"
                                            cancelText="Cancelar"
                                            doneText="Aceptar"
                                            value={fechaHasta} >{fechaHasta}</IonDatetime>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <br />
                    <div className="center">
                        <IonButton disabled={block} color="danger" onClick={()=>{handleBtnGenerar(fechaDesde,fechaHasta)}}>Generar</IonButton>
                    </div>
                </IonCard>
                <IonCard>
                    <IonCardContent>
                        <IonList>
                            {
                                reportes.map((item, index) => {
                                    return <IonItem key={index} onClick={() => { handelDetalleReporte(item.id) }}>
                                        <IonList>
                                            <h6>{item.Fecha}</h6>
                                            <label>{item.Colonia}</label><br />
                                            <label>{`Calle: ${item.Calle}`}</label>
                                            <br />
                                            <label>{`Colonia: ${item.Colonia}`}</label>
                                        </IonList>
                                        <label slot="end" ><IonIcon icon={eyeOutline} color="primary"></IonIcon></label>
                                    </IonItem>
                                })
                            }
                        </IonList>
                    </IonCardContent>
                </IonCard>
                <IonAlert
                    isOpen={message.length > 0}
                    backdropDismiss={false}
                    header={typeMessage}
                    message={message}
                    buttons={connectionError ? alertsButtons : [{ text: "Aceptar", handler: handleAlertBtnAceptar }]} />
                <IonLoading
                    isOpen={loading}
                    message="Espere por favor"
                />
            </IonContent>
        </IonPage>
    )
}
export default HistorilaReportes;