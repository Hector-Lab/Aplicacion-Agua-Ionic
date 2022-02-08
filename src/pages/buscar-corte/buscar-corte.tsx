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
    IonSelectOption, 
    IonItemDivider,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonNote,
    IonCardContent,
    IonLoading,
    IonAlert} from "@ionic/react";
import { useEffect, useState } from "react";
import { generarFechas } from '../../utilities'; 
import MenuLeft from '../../components/left-menu';
import { ListaCortes } from '../../controller/apiController';
import { useHistory } from  'react-router-dom'; 
import './buscar-corte.css'
const BuscarCorte: React.FC = () => {
    const history = useHistory();
    const [activarMenu , setActivarMenu ] = useState(true);
    const [fechaActual, setFechaActual ] = useState(String);
    const [ anios, setAnios ] = useState<any[]>([]);
    const [ meses, setMeses ] = useState<any[]>([]);
    const [ anioSeleccionado, setAnioSeleccionado ] = useState(11);
    const [ mesSelecionado, setMesSeleccionado ] = useState(Number);
    const [ arregloCortes , setArregloCortes ] = useState<any[]>([]);
    const [ loading, setLoading ] = useState(false);
    const [mensaje, setMensaje ] = useState("");
    const [ tipoMensaje, setTipoMensaje ] = useState( "Mensaje" );
    const fecha = new Date();
    const listaEstados = ["Activo","Cortado","Baja Temporal","Baja Permanente","Inactivo","Nueva","","","Sin toma","Multada"];
    useIonViewWillEnter(()=>{setActivarMenu(false)});
    useIonViewDidEnter(()=>{setActivarMenu(true)});
    useEffect(()=>{
        setFechaActual(fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + (fecha.getDate()  + 1 ));
        preparaPantalla(String(fecha.getFullYear()));
        
    },[]);
    const preparaPantalla = async (anio:string) =>{
        let aniosMeses = await generarFechas(fecha.getFullYear());
        setMeses(aniosMeses[0].Meses);
        setAnios(aniosMeses[1].Anios);
        setMesSeleccionado(fecha.getMonth() + 1);
        //setAnioSeleccionado(fecha.getFullYear()); es mediante el id del arreglo
    }
    const obtenerCortes = async () =>{
        setLoading(true);
        await ListaCortes(mesSelecionado <= 9 ? ("0" + mesSelecionado ) : String(mesSelecionado),anios[anioSeleccionado-1].anio)
        .then((result)=>{
            setArregloCortes(result);
        })
        .catch((error)=>{
            error.message == "No se encontraron registros" ? setTipoMensaje("MENSAJE") : setTipoMensaje("ERROR");
            setMensaje(error.message);
            setArregloCortes([]);
        }).finally(()=>{
            setLoading(false);
        })
    }
    const regresarPantalla = ()=>{
        history.goBack();
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
                        <IonRow className = "bordeFecha" >
                            <IonCol size = "6" className = "labelCalendario" >
                                <IonText > Seleccione el año: </IonText>
                            </IonCol>    
                            <IonCol size="6" className = "ion-activatable ripple-parent">
                                <div >
                                    <IonSelect onIonCancel = { ()=>{setAnioSeleccionado(11)} }  interface = "action-sheet" value={ anioSeleccionado } onIonChange = {e=>{setAnioSeleccionado(e.detail.value)}} >
                                        {
                                            anios != null ?
                                            anios.map((item,index)=>{
                                                return <IonSelectOption value={ item.id } key = {index} >{ item.anio }</IonSelectOption>
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
                                    <IonSelect onIonCancel = { () => { setMesSeleccionado(fecha.getMonth() + 1) }} interface = "action-sheet" value = { mesSelecionado } onIonChange = {e => {setMesSeleccionado(e.detail.value)}} >
                                        {
                                            meses.map((mes,item)=>{
                                                return <IonSelectOption value={mes.id} key = {mes.id} >{ mes.mes }</IonSelectOption>
                                            })
                                        }
                                    </IonSelect>
                                </div>
                            </IonCol> 
                        </IonRow>
                        <IonRow>
                            <IonCol className = "center margintop" >
                                <IonButton color="danger" expand = "block" onClick = { obtenerCortes } > <IonText> Buscar Cortes </IonText> <IonRippleEffect></IonRippleEffect> </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonCardHeader>
                    <IonCardContent>
                        {/*NOTE: contenedor lista*/ }
                        <div style = {{flex:1,justifyContent:"center", borderWidth: 1, marginTop: 5 }} >
                            <IonList className = "borderList" >
                                {
                                    arregloCortes.map((item,index)=>{
                                        return <IonItem key = {index} >
                                            <IonLabel>
                                                <h2> {item.Nombre} </h2>
                                                <p> Contrato: { item.ContratoVigente }, Fecha: { item.FechaCorte } </p>
                                                <p> Motivo: { item.Motivo } </p>
                                                <IonNote slot = "end" color = {item.Estatus == 2 ? "danger" : "primary"} > {listaEstados[item.Estatus-1]} </IonNote>
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
    );
}

export default BuscarCorte;