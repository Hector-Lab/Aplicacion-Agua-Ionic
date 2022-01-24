import { IonIcon, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonAlert, IonLoading, IonGrid, IonCol, IonRow, IonFooter, IonFab, IonFabButton } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './datos-del-contribuyente.css'
import MenuLeft from '../../components/left-menu';
import { obtenerDatosContribuyente, actualizarContribuyente } from '../../controller/apiController';
import { backspaceOutline, chevronBackCircleOutline, saveOutline, saveSharp, logoFacebook, compassOutline } from 'ionicons/icons';
import { cerrarSesion } from '../../controller/storageController';
const DatosContribuyente: React.FC = () => {
    const history = useHistory();
    const [datosContribuyente, setDatosContribuyente] = useState(Object);
    const [telefono, setTelefono] = useState(String);
    const [email, setEmail] = useState(String);
    const [message, setMessage] = useState(String);
    const [typeMessage, setTypeMessage] = useState(String);
    const [loading, setLoading] = useState(false);
    const [hideButtons, setHideButtons] = useState(true);
    const [tokenExpired, setTokenExpired] = useState(false);
    const [ typeError, setTypeError ] = useState(String);
    useEffect(() => { obtenerContribuyente() }, []);
    useEffect(() => { logOut() }, [tokenExpired]);
    const alertButtons = [
        { text: "Reintentar", handler: () => { setMessage(""); typeError == "onLoad" ? obtenerContribuyente() : handleBtnGuardarContacto();} },
        { text: "Aceptar", handler: () => { setMessage(""); } }
    ]
    const logOut = () => {
        if (tokenExpired) {
            setTypeMessage("Session no valida");
            setMessage("Inicie sesión por favor\nRegresando...");
            setHideButtons(true);
            setTimeout(async () => {
                await cerrarSesion().then((result) => {
                    setTypeMessage("Error");
                    setMessage('');
                    history.replace('/home');
                })
            }, 2500)
        }
    }
    const obtenerContribuyente = async () => {
        setLoading(true);
        await obtenerDatosContribuyente()
            .then((result) => {
                setTelefono(result.Celular == null ? "" : result.Celular);
                setEmail(result.Email == null ? "" : result.Email);
                setDatosContribuyente(result);
            })
            .catch((error) => { 
                setHideButtons(false);
                let errorMessage = String(error.message);
                let validSession = errorMessage.includes("Sesion no valida");
                if(!validSession){
                    setTypeMessage("ERROR");
                    setTypeError("onLoad");
                    setMessage(errorMessage);
                }
             })
            .finally(() => { setLoading(false) });
    }
    const handleTelefono = (value: string) => {
        setTelefono(value);
    }
    const handleEmail = (value: string) => {
        setEmail(value);
    }
    const handleBtnGuardarContacto = async () => {
        setLoading(true);
        let datos = {
            telefono: telefono,
            email: email
        }
        await actualizarContribuyente(datos)
            .then((result) => {
                setHideButtons(true);
                setTypeMessage("MENSAJE");
                setMessage(result);
            })
            .catch(err => {
                setTypeError("onUpdate");
                let errorMessage = String(err.message);
                let sesionValid = errorMessage.includes("Sesion no valida");
                let connectionError = errorMessage.includes("API");
                setHideButtons(connectionError);
                if (!sesionValid) {
                    setHideButtons(false);
                    setTypeMessage("Error");
                    setMessage(err.message);
                } else {
                    setTokenExpired(true);
                }
            })
            .finally(() => { setLoading(false) })
    }
    const handleBtnRegresar = () =>{
        console.log("REGRESANDO!!");
        history.replace("/captura-de-lectura.page")
    }
    return (
        <IonPage>
            <IonContent fullscreen = {true}>
                <MenuLeft />
                <IonHeader>
                    <IonToolbar color="danger" >
                        <IonTitle>Detalles contribuyente</IonTitle>
                        <IonButtons slot="start" className="btnMenu">
                            <IonMenuButton ></IonMenuButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonCard >
                    <IonCardHeader className="headerData">
                        <div className="datosContribuyete">
                            <h3>{datosContribuyente.Nombre}</h3>
                            <p>Contrato: {datosContribuyente.ContratoVigente}, &nbsp;&nbsp; Medidor: {datosContribuyente.Medidor}, &nbsp;&nbsp; Toma: {datosContribuyente.Toma}</p>
                            <p>Municipio: {datosContribuyente.Municipio}, &nbsp;&nbsp; Localidad: {datosContribuyente.Localidad}</p>
                            <p>Colonia: {datosContribuyente.Colonia} &nbsp;&nbsp; Calle: {datosContribuyente.Calle} &nbsp;&nbsp; Exterior: {datosContribuyente.Exterior} &nbsp;&nbsp; Interior: {datosContribuyente.Interior}</p>
                        </div>
                    </IonCardHeader>
                    <IonCardContent className="centrar">
                        <IonItem>
                            <IonLabel className="center" color="">Datos de contacto</IonLabel>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel className="input" position="floating">Telefono</IonLabel>
                            <IonInput type="tel" placeholder="Telefono del contribuyente" value={telefono} onIonChange={e => { handleTelefono(String(e.detail.value)) }} />
                        </IonItem>
                        <IonItem>
                            <IonLabel className="input" position="floating" >Correo Electronico</IonLabel>
                            <IonInput type="email" placeholder="Correo Electronico" value={email} onIonChange={e => { handleEmail(String(e.detail.value)) }} />
                        </IonItem>
                        <br />
                        <IonGrid>
                            <IonRow>
                                <IonCol size="4">
                                    <IonButton color="secondary" onClick = {handleBtnRegresar}>
                                        Regresar
                                        <IonIcon icon={chevronBackCircleOutline} slot="start"></IonIcon>
                                    </IonButton>
                                </IonCol>
                                <IonCol size="4" ></IonCol>
                                <IonCol size="4">
                                    <IonButton color="danger" onClick={handleBtnGuardarContacto}>
                                        Guardar
                                        <IonIcon icon={saveSharp} slot="end"></IonIcon>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
                <IonAlert
                    isOpen={message.length > 0}
                    header={typeMessage}
                    message={message}
                    backdropDismiss={false}
                    buttons={hideButtons ? ["Aceptar"] : alertButtons}
                />
                <IonLoading
                    cssClass="my-custom-class"
                    isOpen={loading}
                    message={"Por favor espere"}
                    backdropDismiss={false}
                />
            </IonContent>
        </IonPage>
    )
}

export default DatosContribuyente;