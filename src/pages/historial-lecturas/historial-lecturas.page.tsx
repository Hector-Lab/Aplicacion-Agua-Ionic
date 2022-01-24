import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import React, { useEffect, useState } from "react";
import MenuLeft from '../../components/left-menu';
import { contractOutline, eyeOutline } from 'ionicons/icons';
import { historialFechas } from '../../controller/apiController';
import { guardarDatosEditarLectura, verifyingSession, cerrarSesion, setFechasHistorialLectura, getFechasHistorialLectura } from '../../controller/storageController';
import { useHistory } from 'react-router-dom'
const HistorialLecturas: React.FC = () => {
    const fecha = new Date();
    const history = useHistory();
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFinal, setFechaFinal] = useState('');
    const [loading, setLoading] = useState(false);
    const [historial, setHistorial] = useState<any[]>([])
    const [message, setMessage] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState("MENSAJE");
    const [block, setBlock] = useState(false);
    const [conectionError, setConectionErro] = useState(false);
    const [expiredToken, setExpiredToken] = useState(Boolean);
    const alertsButtons = [
        {
            text: "Reintentar",
            handler: () => { setMessage(""); setConectionErro(false); extraerHistorial(fechaInicio,fechaFinal); }
        },
        {
            text: "Cancelar",
            handler: () => { setConectionErro(false) }
        }
    ]
    const isSessionValid = () => {
        let valid = verifyingSession();
        setExpiredToken(!valid);
        setBlock(!valid);
    }
    useEffect(() => {
        setFechaInicio(fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + (fecha.getDate()));
        setFechaFinal(fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + (fecha.getDate()));
        console.log(fechaInicio, "\n\n", fechaFinal)
        isSessionValid();
    }, [])
    useEffect(() => { logOut() }, [expiredToken]);
    const verificarFechas = () =>{
        let data = getFechasHistorialLectura();
        if(data != null){
            setFechaInicio(String(data.desde));
            setFechaFinal(String(data.hasta));
            extraerHistorial(String(data.desde),String(data.hasta));

        }
    }
    useIonViewWillEnter(verificarFechas)

    const logOut = () => {
        if (expiredToken) {
            setTipoMensaje("Sesión no valida");
            setMessage("Inicie sesión por favor\nRegresando...");
            setTimeout(() => {
                cerrarSesion().then((result) => {
                    setTipoMensaje('MENSAJE');
                    setMessage('');
                    history.replace('/home');
                })
            }, 2500)
        }
    }
    const extraerHistorial = async (desde: string,hasta:string) => {
        let selectionValid = validateFechas(desde,hasta);
        if (selectionValid) {
            setLoading(true)
            await historialFechas(desde, hasta)
                .then((result) => {
                    if (result.Status) {
                        console.log(result.Mensaje)
                        setHistorial(result.Mensaje);
                    } else {
                        setHistorial([]);
                        setTipoMensaje("MENSAJE");
                        setMessage("No se encontraron resultados.");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    let errorMessage = String(err.message);
                    setExpiredToken(errorMessage.includes("Sesion no valida"));
                    setConectionErro(errorMessage.includes("API"));
                    if (!expiredToken) {
                        setTipoMensaje("ERROR");
                        setMessage(errorMessage);
                    }
                })
                .finally(() => { setLoading(false) })
        }else{
            setTipoMensaje("Mensaje")
            setMessage("Selección de fechas no validas");
        }
    }
    //manejadores de la interfaz
    const handleSelectFechaInicio = (date: String) => {
        setFechaInicio(date.split("T")[0]);
        console.log(fechaInicio);
    }
    const handleSelectFechaFin = (date: any) => {
        setFechaFinal(date.split("T")[0]);
        console.log(fechaFinal)
    }
    const validateFechas = (desde: string,hasta: string) => {
        let fechaDesde = new Date(desde);
        let fechaHasta = new Date(hasta);
        if (fechaDesde <= fechaHasta) {
            return true;
        } else {
            return false;
        }
    }
    const editarContribuyente = (datos: any) => {
        //Guardar fechas historial
        setFechasHistorialLectura(fechaInicio,fechaFinal);
        guardarDatosEditarLectura(datos.idLectura, datos.ContratoVigente, datos.Contribuyente, datos.Medidor);
        // Mostrar editarLecturaAgua
        history.replace('/editar-lecturas-agua.page');
    }
    return (
        <IonPage>
            <IonContent>
                <MenuLeft />
                <IonHeader>
                    <IonToolbar color="danger" >
                        <IonTitle>Historial de lecturas</IonTitle>
                        <IonButtons slot="start" className="btnMenu">
                            <IonMenuButton ></IonMenuButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonCard>
                    <IonCardHeader>
                        <div className="center">
                            <h5>Seleccione la fecha</h5>
                        </div>
                    </IonCardHeader>
                    <IonItem>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <div className="center">
                                        <label>Desde: </label>
                                        <IonDatetime disabled={block} value={fechaInicio} displayFormat="DD-MM-YYYY" pickerFormat="DD-MM-YYYY" cancelText="Cancelar" doneText="Aceptar" onIonChange={e => { handleSelectFechaInicio(e.detail.value + "") }} >{fechaInicio}</IonDatetime>
                                    </div>
                                </IonCol>
                                <IonCol size="6">
                                    <div className="center">
                                        <label>Hasta: </label>
                                        <IonDatetime disabled={block} value={fechaFinal} displayFormat="DD-MM-YYYY" cancelText="Cancelar" doneText="Aceptar" onIonChange={e => { handleSelectFechaFin(e.detail.value + "") }} >{fechaFinal}</IonDatetime>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <br />
                    <div className="center">
                        <IonButton disabled={block} color="danger" onClick={()=>{extraerHistorial(fechaInicio,fechaFinal)}}>Generar</IonButton>
                    </div>
                </IonCard>
                <IonCard>
                    <IonCardContent>
                        <IonList>
                            {
                                historial.map((item, index) => {
                                    return <IonItem key={index} onClick={() => { editarContribuyente(item) }}>
                                        <IonList>
                                            <h6>{item.Fecha}</h6>
                                            <label>{item.Contribuyente}</label><br />
                                            <label>{`Contrato: ${item.ContratoVigente} , Medidor: ${item.Medidor}, Toma: ${item.Toma}`}</label>
                                        </IonList>
                                        <label slot="end" ><IonIcon icon={eyeOutline} color="primary"></IonIcon></label>
                                    </IonItem>
                                })
                            }
                        </IonList>
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
                    message={message}
                    isOpen={message.length > 0}
                    backdropDismiss={false}
                    onDidDismiss={() => { setConectionErro(false) }}
                    buttons={conectionError ? alertsButtons : [{ text: "Aceptar", handler: () => { setMessage(""); } }]}
                />
            </IonContent>
        </IonPage>
    )
}
export default HistorialLecturas;