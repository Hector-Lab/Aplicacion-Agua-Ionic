import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonDatetime, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonMenuButton, IonNote, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { buscarMedidorSinFiltro, ContratosListaContratoReporte } from '../../controller/apiController';
import { searchCircle } from 'ionicons/icons';
import { verifyingSession, cerrarSesion, setContratoMulta } from '../../controller/storageController'
import { useHistory } from 'react-router-dom';
import MenuLeft from '../../components/left-menu';
import { zeroFill } from '../../utilities';

const MultarToma: React.FC = () => {
    //NOTE: navegador 
    const history = useHistory();
    const [ activarMenu, setActivarMenu ] = useState( false );
    const [ listaContratos, setListaContratos ] = useState<any[]>([]);
    const [ mensaje, setMensaje ] = useState(String);
    //NOTE: manejadores de alertas y mensajes
    const [ tipoMensaje, setTipoMensaje ] = useState( String );
    const [ cargando, setCargando ] = useState(false);
    //NOTE: manejadores de la pantalla principal
    const [ tipoFiltro, setTipoFiltro ] = useState( 1 );
    const [ placeHolderFiltro, setPlaceHolderFiltro ] = useState("Buscar por Contrato");
    const [ palabraClave, setPalabraClave ] = useState(String);
    //NOTE: controladores de session
    const [ tokenExpirado , setTokenExpirado ] = useState( false );
    const listaEstatus = ["Activo","Cortado","Baja Temporal","Baja Permanente","Inactivo","Nueva","","","Sin Toma","Multada"];
    useIonViewWillEnter(()=>{setActivarMenu( true )});
    useIonViewDidLeave(()=>{setActivarMenu( false )});
    useEffect(()=>{ verificarSession() },[]);
    useEffect(()=>{
        if(tokenExpirado){
            logOut( tokenExpirado )
        }
    },[tokenExpirado])
    //NOTE: verificamos los datos de la session

    //NOTE: manejadores de pantalla
    const cambiarFiltro = ( filtro:number ) =>{
        setTipoFiltro(filtro);
        filtro == 2 ? setPlaceHolderFiltro("Buscar por Medidor") : setPlaceHolderFiltro("Buscar por Contrato");
    }
    const buscarPadron = async () =>{
        //NOTE: damos formato al contrato
        setCargando(true);
        if( tipoFiltro == 1 ){ //NOTE: 1 Contrato, 2 = Medidor
            await ContratosListaContratoReporte(zeroFill( palabraClave ))
            .then(( result )=>{
                if(result.length == 0){
                    setMensaje("Sin resultados");
                }
                setListaContratos(result);
            })
            .catch((error)=>{ console.log(error) })
            .finally(()=>{ setCargando(false) });
        }else{
            await buscarMedidorSinFiltro(zeroFill(palabraClave))
            .then((result)=>{
                if(result.length == 0){
                    setTipoMensaje("Mensaje");
                    setMensaje("Sin resultados");
                }
                setListaContratos(result);
            })
            .catch((error)=>{
                let mensaje = String(error.message);
                setTipoMensaje("Mensaje");
                setMensaje(mensaje);
            }).finally(()=>{ setCargando(false) });
        }
    }
    const abrirContrato = (padron: string ) => {        
        console.log(padron);
        setContratoMulta(padron);
        history.push("/RealizarMulta");
    }
    //NOTE: metodos para verificar la session
    const verificarSession = async () =>{
        //INDEV: obtenemos el token y lo verificamos
        setTokenExpirado(!verifyingSession());
    }
    const logOut = async(valido:Boolean) =>{
        if (valido) {
            setTipoMensaje("Sesión no valida");
            setMensaje("Inicie sesión por favor\nRegresando...");
            setTimeout(async () => {
              setTipoMensaje('Error');
              setMensaje('');
              await cerrarSesion()
                .then((result) => {
                  history.replace("/home")
                })
            }, 2500);
          }
    }
    return (
        <IonPage>
        {
          activarMenu ? 
          <MenuLeft />: <></>
        }
        <IonHeader>
          <IonToolbar color="danger" >
            <IonTitle>{` Multar contrato `}</IonTitle>
            <IonButtons slot="start" className="btnMenu">
              <IonMenuButton ></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard class="ion-text-center" className="box">
            <IonCardHeader>
              <div>
                <h3> Buscar contrato </h3>
                <IonLabel>Puedes realizar busquedas por:</IonLabel>
                <p>Contrato o Medidor</p>
                <br />
              </div>
              <IonGrid>
              <IonRow>
                  <IonCol>
                  <IonItem>
                    <IonLabel>Filtrar Por:</IonLabel>
                  <IonSelect onIonCancel = {()=>{ setTipoFiltro(1) }} value = { tipoFiltro } placeholder = "Seleccione el filtro" interface = "action-sheet" onIonChange = {e => { cambiarFiltro(parseInt(String(e.detail.value)))}}>
                      <IonSelectOption value={1} >Contrato</IonSelectOption>
                      <IonSelectOption value={2} >Medidor</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonInput type="number" placeholder = { placeHolderFiltro } onIonChange={ e => { setPalabraClave(String(e.detail.value))} } ></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="12" > 
                        <IonButton color="danger" expand="block" onClick={ buscarPadron } ><IonIcon icon={ searchCircle } color="light" size="large" ></IonIcon></IonButton>
                    </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardHeader>
            <IonCardContent>
                {/*NOTE: contenedor lista*/ }
                <div style = {{flex:1,justifyContent:"center", borderWidth: 1, marginTop: 5 }} >
                    <IonList className = "borderList" >
                        {
                            listaContratos.map((item,index)=>{
                                return <IonItem key = {index} onClick = { ()=>{ abrirContrato( item.id )}} >
                                    <IonLabel>
                                        <h2> {item.Contribuyente} </h2>
                                        <p> Contrato: { item.ContratoVigente }, Toma: { item.Toma } </p>
                                        <p> Medidor: { item.Medidor }</p>
                                        <IonNote color="primary">Estado: {listaEstatus[item.Estatus - 1] }</IonNote>
                                    </IonLabel>
                                    
                                    </IonItem>
                            })
                        }
                    </IonList>
                </div>
            </IonCardContent>
          </IonCard>
          <IonAlert
            cssClass="my-custom-class"
            header={tipoMensaje}
            message={mensaje}
            isOpen={mensaje.length > 0}
            backdropDismiss={false}
            buttons={ [{ text: "Aceptar", handler: () => { setMensaje("") } }] }
          />
          <IonLoading
            cssClass="my-custom-class"
            isOpen={cargando}
            onDidDismiss={() => { setCargando( false ); }}
            message="Por favor espere"
          />
        </IonContent>
      </IonPage>
    
    )
}
export default MultarToma;