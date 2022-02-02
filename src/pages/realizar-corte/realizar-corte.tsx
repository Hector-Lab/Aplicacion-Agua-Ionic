import { IonApp, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonLoading, IonMenuButton, IonPage, IonRow, IonText, IonTextarea, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { contractOutline, pencil, triangle } from "ionicons/icons";
import { useEffect,useState } from 'react';
import MenuLeft from '../../components/left-menu';
import { obtenerDatosCorte } from '../../controller/apiController';
import { getIdUsuario } from '../../controller/storageController';
import { useTakePhoto } from '../../utilities';
import { camera } from 'ionicons/icons';

const RealizarCorte: React.FC = () => {
    const [ activarMenu, setActivarMenu ] = useState(true);
    const [ datosContrato, setDatosContrato ] = useState(Object);
    const [ datosUsuario, setDatosUsuario ] = useState(Object);
    const [ usuarioPerasona, setUsuarioPersona ] = useState(Number);
    const [ loading, setLoading ] = useState(true);
    const [ fechaActual, setFechaActual ] = useState("");
    const [ arregloFotos, setArregloFotos ] = useState([]);
    const [] = useState()
    const { takePhoto } = useTakePhoto();
    const fecha = new Date();
    useEffect(()=>{
        extraerDatos();
    },[]);
    useIonViewWillEnter(()=>{setActivarMenu(false)});
    useIonViewDidEnter(()=>{setActivarMenu(true)});
    const listaEstados = ["Activo","Cortado","Baja Temporal","Baja Permanente","Inactivo","Nueva","","","Sin toma","Multada"];
    const extraerDatos = async () =>{
        //NOTE: extraer datos del contrato
        let dia = fecha.getDate();
        let mes = fecha.getMonth();
        let anio = fecha.getFullYear();
        setFechaActual( formatoFecha(dia,mes,anio) );
        await obtenerDatosCorte()
        .then(( result )=>{
            if(result != undefined ){
                setDatosContrato(result[0]);
                setDatosUsuario(result[1]);
                setUsuarioPersona(result[1].id);
            }
        })
        .catch(( error )=>{
            console.log(error);
        }).finally(()=>{
            setLoading(false);
        });
    }
    const formatoFecha = ( dia: number, mes: number, anio:number  ) =>{
        let formatoFecha = "";
        dia < 10 ? formatoFecha += ("0"+dia+"/") : formatoFecha += dia +"/";
        mes < 10 ? formatoFecha += ("0"+mes+"/") :  formatoFecha += mes + "/";
        formatoFecha += anio;
        return formatoFecha;
    }
    const handleAbrirCamara = async () =>{
        console.log("Abriendo Camara...");
        setLoading(true);
        await takePhoto()
        .then((result)=>{
            //NOTE: Verificamos que aun tenga fotos disponible
        }).catch((erro)=>{

        }).finally(()=>{
            setLoading(false);
        });
    }
    return (
        <IonPage>
            {
                activarMenu ? <MenuLeft /> : <></>
            }
            {/**  Header del menu */}
            
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle>Captura de lectura</IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton ></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <div className="datosContribuyete">
                            <h3>{ datosContrato.Nombre } </h3>
                            <p> RFC: { datosContrato.Rfc } , Cuenta: {datosContrato.Cuenta}</p>
                            <p>Contrato: { datosContrato.ContratoVigente }, &nbsp;&nbsp; Medidor: {datosContrato.Medidor}, &nbsp;&nbsp; Toma: {datosContrato.Toma}</p>
                            <p>Municipio: {datosContrato.Municipio}, &nbsp;&nbsp; Localidad: { datosContrato.Localidad}</p>
                            <p>Direccion: {datosContrato.Direccion}</p>
                        </div>
                    </IonCardHeader>
                    <IonCardContent>
                        <br />
                        <IonItem >
                            <IonLabel>{ `Inspector: ${datosUsuario.PersonaNombre} - ${ datosUsuario.Puesto } ` }</IonLabel>
                        </IonItem>
                        <br/>
                        <IonItem>
                            <IonLabel> { ` Estado:  ${listaEstados[ parseInt(datosContrato.Estatus)-1 ]}` } </IonLabel>
                        </IonItem>
                        <br/>
                        <IonItem>
                            <IonLabel> {`Fecha: ${fechaActual} `} </IonLabel>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel >Adjuntar evidencia (maximo 3 fotos)</IonLabel>
                            <IonIcon icon={camera} className="iconStyle" onClick={ handleAbrirCamara }></IonIcon>
                        </IonItem>
                    </IonCardContent>
                </IonCard>
                <IonLoading 
                    cssClass="my-custom-class"
                    isOpen={loading}
                    onDidDismiss={() => { setLoading(false); }}
                    message="Por favor espere"
                />
            </IonContent>
        </IonPage>
    );
}

export default RealizarCorte;