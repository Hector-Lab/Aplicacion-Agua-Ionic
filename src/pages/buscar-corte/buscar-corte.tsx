import { IonButton, IonButtons, IonCard, IonCardHeader, IonCol, IonContent, IonDatetime, IonHeader, IonLabel, IonMenuButton, IonModal, IonPage, IonRippleEffect, IonRow, IonText, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { timeEnd } from "node:console";
import { useEffect, useState } from "react";
import MenuLeft from '../../components/left-menu';
import './buscar-corte.css'
const BuscarCorte: React.FC = () => {
    const [activarMenu , setActivarMenu ] = useState(true);
    const [fechaActual, setFechaActual ] = useState(String);
    const fecha = new Date();
    useIonViewWillEnter(()=>{setActivarMenu(false)});
    useIonViewDidEnter(()=>{setActivarMenu(true)});
    useEffect(()=>{
        setFechaActual(fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + (fecha.getDate()  + 1 ));
    },[])
    return(
        <IonPage>
            {
                activarMenu ? 
                <MenuLeft /> : <></>
            }
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
                    <IonCardHeader >
                        <IonTitle className = "center" > Historial de cortes </IonTitle>
                        <br />
                        <br />
                        <IonRow className = "bordeFecha"  >
                            <IonCol size = "6" className = "labelCalendario" >
                                <IonText > Seleccione una fecha: </IonText>
                            </IonCol>    
                            <IonCol size="6" className = "ion-activatable ripple-parent">
                                <div >
                                    <IonDatetime value = {fechaActual} displayFormat="DD-MM-YYYY" pickerFormat="DD-MM-YYYY" cancelText="Cancelar" doneText="Aceptar" onIonChange={e => { setFechaActual(String(e.detail.value)) }} ></IonDatetime>
                                    <IonRippleEffect></IonRippleEffect>
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonCardHeader>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}

export default BuscarCorte;