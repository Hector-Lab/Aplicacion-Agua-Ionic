import { IonButton, IonCard, IonCardHeader, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonNote, IonPage, IonRow, IonSelect, IonSelectOption } from "@ionic/react"
import { useEffect, useState } from "react"
import MenuLeft from '../../components/left-menu';
import { IonHeader,IonToolbar,IonTitle,IonButtons,IonMenuButton } from '@ionic/react';
import { buscarContrato, solicitarPermisos, verifyGPSPermission,verifyCameraPermission } from '../../controller/apiController';
import { searchCircle } from "ionicons/icons";
import { getCuentasPapas, getUsuario, setContratoCorte } from "../../controller/storageController";
import { useHistory } from 'react-router-dom';

const PrincipalCortes: React.FC = () => {
    const history = useHistory();
    const [ activarMenu,setActivarMenu ] = useState(true);
    const [ tipoFiltro , setTipoFiltro ] = useState(1);
    const [user, setUser ] = useState("Prueba");
    const [ nombreCliente,setNombreCliente ] = useState("Demo OPD");
    const [ contrato, setContrato ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ listaContratos, setListaContratos ] = useState<any[]>([]);

    useEffect(()=>{
      prepararPantalla();
    });

    const BuscarLectura = (  ) =>{
        setLoading(true);
        if(contrato != ""){
            tipoFiltro == 1 ? PorContrato( contrato ) : porMedidor( contrato );
        }else{
            setLoading(false);
            
        }
    }
    const PorContrato = async ( contrato: string ) =>{
        await buscarContrato(zeroFill(contrato))
        .then(( result )=>{
        setListaContratos(result);
        }).catch((error)=>{
            console.log(error);
        })
        setLoading(false);
    }
    const porMedidor = ( contrato: string ) =>{
        console.log( zeroFill(contrato) );
        setLoading(false);
    }
    function zeroFill( number:string,width:number = 9)
    {
        while(number.length < width){
            number = "0"+number;
        }
        return number;
    }
    const functionValidarLectura = (estatus: number, cobro:number) =>{
        let leyendaCobro = "";
        let result = ["",false];
        if(cobro == 1){
          leyendaCobro = "Cuota Fija ";
        }
      switch(estatus){
        case 1:
          result = [ leyendaCobro + "",cobro == 1];
        break;
        case 2:
         result = [leyendaCobro + "",cobro == 1];
        break;
        case 3:
          result = [ leyendaCobro + "Baja Temporal",true];
        break;
        case 4:
          result = [ leyendaCobro +  "Baja Permanente",true];
        break;
        case 5:
          result = [ leyendaCobro + "Inactivo",true];
        break;
        case 6:
          result = [ leyendaCobro +  "Nueva",true];
        break;    
        case 9:
          result = [ leyendaCobro +  "Sin Toma",true];
        break;
        case 10:
          result = [ leyendaCobro +  "Multada",true]
        break;
      }
      return result;
    }
    const prepararPantalla = async () => {
        await solicitarPermisos()
          .then(async (err) => {
            console.log("Solicitando persmisos");
            let camera = await verifyCameraPermission();
            let gps = await verifyGPSPermission();
            if (camera && gps) {
              let storageUser = getUsuario();
              setUser(storageUser + "");
            } else {
            }
          }).catch(() => {
            //Quitar antes de la vercion final (solo sirve en web)
            let storageUser = getUsuario();
            setUser(storageUser + "");
          })
        /**
        * Activar el metodo solo para la version web de prueba
        */        
    }
    const mostrarDatosContrato = async (item:any ,esPapa:boolean) =>{
      //NOTE: Verificamos si es una cuenta papa
      if(!esPapa){
        //INDEV: guardamos los datos en el storage para mostrar en la pantalla
        setContratoCorte(item.id);
        console.log(item.id);
        history.push("/realizar-corte");
      }
    }

    return (
        <IonPage>
            {
                activarMenu ? 
                    <MenuLeft /> :<></>
            }
            {/* Cabezera */}            
            <IonHeader>
                <IonToolbar color="danger" >
                <IonTitle>{`${user} - ${nombreCliente}`}</IonTitle>
                <IonButtons slot="start" className="btnMenu">
                    <IonMenuButton ></IonMenuButton>
                </IonButtons>
                </IonToolbar>
            </IonHeader>
            {/* Contenido de la app */}
            <IonContent>
                <IonCard class="ion-text-center" className="box" >
                    <IonCardHeader >
                        <div>
                        <h3>Realizar Corte</h3>
                        <IonLabel >Puedes realizar busquedas por:</IonLabel>
                        <p>Contrato y Medidor</p>
                        <br/>
                        </div>
                        <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonLabel>Filtrar Por:</IonLabel>
                                    <IonSelect value = {tipoFiltro}  onIonCancel = { ()=>{ setTipoFiltro(1); } } placeholder = "Seleccione el filtro" interface = "action-sheet" onIonChange = {e => { setTipoFiltro(e.detail.value) }} >
                                        <IonSelectOption value={1} >Contrato</IonSelectOption>
                                        <IonSelectOption value={2} >Medidor</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="12">
                              <IonItem>
                                  <IonInput type="number" placeholder = { `Ingrese el ${tipoFiltro == 1 ?  "contrato" : "medidor"}` } onIonChange={e => { setContrato(String(e.detail.value)) }}></IonInput>
                              </IonItem>
                            </IonCol>
                        </IonRow>
                        <br />
                        <IonButton color="danger" expand = "block" onClick={ BuscarLectura }>
                            <IonIcon icon={searchCircle} color="light" size="large"></IonIcon>
                            
                            </IonButton>
                        <IonItem>
                            <IonLabel className="center" color="">Contrato</IonLabel>
                        </IonItem>
                        </IonGrid>
                    </IonCardHeader>
                    <IonList>
                        {
                            listaContratos.map((item,index)=>{
                                let papas = getCuentasPapas();
                                let arrayData = functionValidarLectura(parseInt(item.Estatus),parseInt(item.M_etodoCobro));
                                let cuentaPapa = String(papas).includes(item.id);
                                if(cuentaPapa){
                                  arrayData[0] += "Desarrollo";  
                                }
                                return <div className = { ( cuentaPapa || arrayData[1]) ? 'cuotaFija':''} key={index} onClick={() => { mostrarDatosContrato( item, cuentaPapa ); }}>
                                  <IonItem detail={true} >
                                    <IonList>
                                      <IonLabel>{item.Contribuyente}</IonLabel>
                                      <p>Contrato: {item.ContratoVigente},
                                         Medidor: {item.Medidor}, 
                                         Toma: {item.Toma}
                                         &nbsp;&nbsp;&nbsp;&nbsp;
                                         {
                                           (cuentaPapa || arrayData[1]) ? <IonNote style ={{fontsize: 20}} color="danger">{arrayData[0]}</IonNote> :""
                                         }
                                      </p>
                                    </IonList>
                                  </IonItem>
                                </div>
                            })
                        }
                    </IonList>
                </IonCard>
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
export default PrincipalCortes;