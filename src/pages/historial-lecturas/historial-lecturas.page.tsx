import { 
    IonAlert,
    IonButton, 
    IonButtons, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCol, 
    IonContent, 
    IonDatetime, 
    IonGrid, 
    IonHeader, 
    IonIcon, 
    IonItem, 
    IonItemDivider, 
    IonLabel, 
    IonList, 
    IonLoading, 
    IonMenuButton, 
    IonNote, 
    IonPage, 
    IonRippleEffect, 
    IonRow, 
    IonSelect, 
    IonSelectOption, 
    IonText, 
    IonTitle, 
    IonToolbar, 
    useIonViewDidEnter, 
    useIonViewWillEnter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import MenuLeft from '../../components/left-menu';
import { contractOutline, eyeOutline, searchCircle } from 'ionicons/icons';
import { historialFechas, historialLecturas} from '../../controller/apiController';
import { guardarDatosEditarLectura, verifyingSession, cerrarSesion, setFechasHistorialLectura, getFechasHistorialLectura } from '../../controller/storageController';
import { useHistory } from 'react-router-dom'
import { generarFechas } from "../../utilities";
const HistorialLecturas: React.FC = () => {
    const fecha = new Date();
    //NOTE: lista de los meses y anios 
    const [ anios, setAnios ] = useState<any[]>();
    const [ meses, setMeses ] = useState<any[]>();
    //NOTE: Manejadores de la interfaz
    const [ anioSeleccionado, setAnioSeleccionado ] = useState(11);
    const [ mesSeleccionado, setMesSeleccionado ] = useState(Number);
    const [ fechaInicio, setFechaInicio ] = useState();
    const [activarMenu , setActivarMenu ] = useState(true);
    //NOTE: manejadores de listas
    const [ listaReportes, setListaReportes ] = useState<any[]>();
    //NOTE: manejadores de mensajes de errores
    const [ mensaje, setMensaje ] = useState( String );
    const [ loading, setLoading ] = useState( false );
    const [ tipoMensaje, setTipoMensaje ] = useState( String ) 

    useIonViewWillEnter(()=>{setActivarMenu(false)});
    useIonViewDidEnter(()=>{setActivarMenu(true)});
    useEffect(()=>{
        prepararPantalla();
    },[]);
    const prepararPantalla = async () =>{
        let aniosMeses = await generarFechas(fecha.getFullYear());
        setMeses(aniosMeses[0].Meses);
        setAnios(aniosMeses[1].Anios);
        setMesSeleccionado(fecha.getMonth() + 1);
    }
    const extraerHistorial = async () =>{
        setLoading(true);
        let fechaAnio = anios != null ? anios[anioSeleccionado-1].anio : fecha.getFullYear();
        let fechas = {
            anio: fechaAnio,
            mes: mesSeleccionado
        }
        await historialLecturas(fechas)
        .then(( result )=>{
            setListaReportes(result);
        })
        .catch((error)=>{
            setMensaje(error.message);
            setTipoMensaje("ERROR");
        }).finally(()=>{
            setLoading( false );
        });
    }
    return (
        <IonPage>
            {
                activarMenu ? 
                <MenuLeft /> : <></>
            }
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle> Lecturas </IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton ></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader >
                        <IonRow className = "bordeFecha" >
                            <IonCol className = "labelCalendario" >
                                <IonText > Seleccione el año: </IonText>
                            </IonCol>    
                            <IonCol className = "ion-activatable ripple-parent">
                                <div >
                                    <IonSelect onIonCancel = { ()=>{setAnioSeleccionado(11)} }  interface = "action-sheet" value={ anioSeleccionado } onIonChange = {e=>{setAnioSeleccionado(e.detail.value)}} >
                                        {
                                            anios?.map((item,index)=>{
                                                return <IonSelectOption value={ item.id } key = {index} >{ item.anio }</IonSelectOption>
                                            })
                                        }
                                    </IonSelect>
                                    <IonRippleEffect></IonRippleEffect>
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonRow className = "bordeFecha" >
                            <IonCol class="labelCalendario">
                                <IonText> Seleccione mes: </IonText>
                            </IonCol>
                            <IonCol>
                                <div>
                                    <IonSelect onIonCancel = { () => { setMesSeleccionado(fecha.getMonth() + 1) }} interface = "action-sheet" value = { mesSeleccionado } onIonChange = {e => {setMesSeleccionado(e.detail.value)}} >
                                        {
                                            meses?.map((mes,item)=>{
                                                return <IonSelectOption value={mes.id} key = {mes.id} >{ mes.mes }</IonSelectOption>
                                            })
                                        }
                                    </IonSelect>
                                </div>
                            </IonCol> 
                        </IonRow>
                        <IonRow>
                            <IonCol className = "center margintop" >
                                <IonButton color="danger" expand = "block" onClick = { extraerHistorial } >
                                    <IonText> Mostrar Historial </IonText> <IonRippleEffect></IonRippleEffect>
                                    <IonIcon icon={searchCircle} size="large" slot = "end" ></IonIcon>
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonCardHeader>
                    <IonCardContent>
                        {/*NOTE: contenedor lista*/ }
                        <div style = {{flex:1,justifyContent:"center", borderWidth: 1, marginTop: 5 }} >
                            <IonList className = "borderList" >
                                {
                                    listaReportes?.map((item,index)=>{
                                        return <IonItem key = {index} >
                                            <IonLabel>
                                                <h2> {item.Nombre} </h2>
                                                <p> Contrato: { item.ContratoVigente }, Fecha: { item.Fecha } </p>
                                                <p> Contribuyente: { item.Contribuyente == "" ? "No disponible" : item.Contribuyente }, Tipo: {item.Toma} </p>
                                                <IonNote slot = "end" color = {item.Estatus == 2 ? "danger" : "primary"} > {listaReportes[item.Estatus-1]} </IonNote>
                                            </IonLabel>
                                            </IonItem>
                                    })
                                }
                            </IonList>
                        </div>
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
                onDidDismiss = {()=>{setMensaje("")}}
                buttons ={[{
                    text:"Aceptar",
                    handler:()=>{setMensaje("")}
                }]}
                />
            </IonContent>
        </IonPage>
    )
}
export default HistorialLecturas;