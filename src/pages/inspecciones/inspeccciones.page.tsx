import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCheckbox, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonSearchbar, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar} from '@ionic/react';
import LeftMenu from '../../components/left-menu';
import React, { useState, useEffect } from 'react';
import { obtenerContribuyenteInspeccion } from '../../controller/apiController'
import { search } from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import { getInspeccionPadronAgua, setInspeccionPadronAgua } from '../../controller/storageController';
import "./inspecciones.page.css";
const AgregarInspeccion: React.FC = () => {
    const history = useHistory();
    const [contratoVigente,SetContratoVigente] = useState(String);
    const [contribuyentes,setListaContribuyentes] = useState<any[]>([]);
    const handleSerchBar = () => {
        SetContratoVigente(contratoVigente);
        if(contratoVigente != ""){
            obtenerContribuyenteInspeccion(contratoVigente)
            .then((result)=>{
                setListaContribuyentes(result);
            })
            .catch((err)=>{
                setListaContribuyentes([]);
            })
        }
    }
    const handleSelectList = (selectContribuyente:any) =>{
        setInspeccionPadronAgua(selectContribuyente.id);
        history.replace("/inspeccion-agregar.page");
    }
    useEffect(()=>{handleSerchBar()},[contratoVigente])
    return (
        <IonPage>
            <LeftMenu/>
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle>Agregar Inspeccción</IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton ></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
          <IonContent fullscreen>
              <IonCard>
                  <IonHeader class="ion-text-center" className="box">
                  <div>
                    <h3>Seleccione un contribuyente</h3>
                    <IonLabel>Puedes realizar busquedas por:</IonLabel>
                    <p>Contrato, Medidor, Nombre comercial o nombre del propietario</p>
                    <br />
                  </div>
                  </IonHeader>
                  <IonCardContent>
                  <IonSearchbar placeholder = "Contrato Vigente" value = {contratoVigente} onIonChange = {e => {SetContratoVigente(e.detail.value!)}}></IonSearchbar>
                  <IonList>
                      <IonItemDivider/>
                  {
                      contribuyentes.length > 0 ? (
                            contribuyentes.map((item,index)=>{
                            return <IonItem detail={true} key = {index} onClick = {()=>{handleSelectList(item)}}>
                                <IonList >
                                  <IonLabel>{item.Contribuyente}</IonLabel>
                                  <p>Contrato: {item.ContratoVigente}, Medidor: {item.Medidor}, Toma: {item.Toma}</p>
                                </IonList>
                            </IonItem>
                            })
                      ):("")
                  }
                  </IonList>
                  </IonCardContent>
              </IonCard>
          </IonContent>
        </IonPage>
      );
}


export default AgregarInspeccion;