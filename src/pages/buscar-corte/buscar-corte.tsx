import { IonButtons, 
    IonCard, 
    IonCardHeader, 
    IonCol, 
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonRippleEffect, 
    IonRow, 
    IonText, 
    IonTitle, 
    IonToolbar, 
    useIonViewDidEnter, 
    useIonViewWillEnter,
    IonSelect,
    IonSelectOption } from "@ionic/react";
import { useEffect, useState } from "react";
import { generarFechas } from '../../utilities'; 
import MenuLeft from '../../components/left-menu';
import './buscar-corte.css'
const BuscarCorte: React.FC = () => {
    const [activarMenu , setActivarMenu ] = useState(true);
    const [fechaActual, setFechaActual ] = useState(String);
    const [ anios, setAnios ] = useState<any[]>([]);
    const [ meses, setMeses ] = useState<any[]>([]);
    const [ anioSeleccionado, setAnioSeleccionado ] = useState(11);
    const [ mesSelecionado, setMesSeleccionado ] = useState(Number);
    const fecha = new Date();
    useIonViewWillEnter(()=>{setActivarMenu(false)});
    useIonViewDidEnter(()=>{setActivarMenu(true)});
    useEffect(()=>{
        setFechaActual(fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + (fecha.getDate()  + 1 ));
        preparaPantalla(String(fecha.getFullYear()));
    },[]);
    const preparaPantalla = async (anio:string) =>{
        let aniosMeses = await generarFechas(fecha.getFullYear());
        console.log(aniosMeses);
        setMeses(aniosMeses[0].Meses);
        setAnios(aniosMeses[1].Anios);
        setMesSeleccionado(fecha.getMonth());
    }
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
                        <IonRow className = "bordeFecha" >
                            <IonCol size = "6" className = "labelCalendario" >
                                <IonText > Seleccione el año: </IonText>
                            </IonCol>    
                            <IonCol size="6" className = "ion-activatable ripple-parent">
                                <div >
                                    <IonSelect value={ anioSeleccionado }>
                                        {
                                            anios != null ?
                                            anios.map((item,index)=>{
                                                return <IonSelectOption className="selectedItemBold"  value={ item.id } key = {index} >{ item.anio }</IonSelectOption>
                                            }) : <></>
                                        }
                                    </IonSelect>
                                    <IonRippleEffect></IonRippleEffect>
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonRow className = "bordeFecha" >
                            <IonCol size="6" class="labelCalendario">
                                <IonText> Seleccione mes: </IonText>
                            </IonCol>
                            <IonCol>
                                <div>
                                    <IonSelect value = { mesSelecionado } >
                                        {
                                            meses.map((mes,item)=>{
                                                return <IonSelectOption className="selectedItemBold" value={mes.id} key = {mes.id} >{ mes.mes }</IonSelectOption>
                                            })
                                        }
                                    </IonSelect>
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