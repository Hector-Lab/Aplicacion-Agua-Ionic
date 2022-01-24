import { 
    IonButtons,
    IonButton, 
    IonCard, 
    IonCardHeader, 
    IonContent, 
    IonHeader, 
    IonMenuButton, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonTextarea, 
    IonItemDivider,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonLoading,
    IonAlert,
    IonItem,
    IonLabel,
    IonImg,
    useIonToast,
    IonCardContent} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import "./inspeccion-agregar.page.css";
import { getInspeccionPadronAgua, obtenerDatosCliente, verifyingSession} from '../../controller/storageController';
import { useHistory } from 'react-router-dom';
import { obtnerContribuyenteInspeccion } from '../../controller/apiController';
import { camera,checkmarkCircle } from 'ionicons/icons';
import LeftMenu from '../../components/left-menu';
import { useTakePhoto, obtenerBase64} from '../../utilities';
const AgregarInspeccion: React.FC = () =>{
    const history = useHistory();
    const [pressentToast, dismissToast] = useIonToast();
    const [contribuyente,setContribuyente] = useState(Object);
    const [padron,setPadron] = useState(String);
    const [mensaje,setMensaje] = useState(String);
    const [motivo,setMotivo] = useState(String);
    const [loading,setLoading] = useState(false);
    const [fotoActiva, setFotoActiva] = useState('');
    const [fotosEvidencia, setFotosEvidencia] = useState<any[]>([]);
    const [indexFoto, setIndexFoto] = useState(-1);
    const [fotosCodificadas, setFotosCodificadas] = useState<any[]>([]);
    const [tipoMessage, setTipoMessage] = useState("ERROR");
    const [enbleButtons, setEnbleButtons] = useState(false);
    const [message,setMessage] = useState('');
    const [activarGaleria,setActivarGaleria] = useState(false);

    const alertButtons = [
        {
            text: "Reintentar", handler: () => {
                setMessage("");
                setTipoMessage("Error");
                isSessionValid();
            }
        },
        {
            text: "Cancelar"
        }]
    const { takePhoto } = useTakePhoto();
    useEffect(()=>{buscarDatosContibuyente()},[]);
    const isSessionValid = () =>{
        let valid = verifyingSession();
        logOut(valid)
    }
    const buscarDatosContibuyente = async () => {
        let datos = obtenerDatosCliente();
        console.log(datos.cliente + " - " + getInspeccionPadronAgua());
        if(getInspeccionPadronAgua() != null){
            await obtnerContribuyenteInspeccion(String(getInspeccionPadronAgua()))
            .then((result)=>{console.log(result); setContribuyente(result)})
            .catch((error)=>{setMensaje(error.mensaje)})
        }
    }
    const handleAbrirCamera = async () => {
        setLoading(true);
        await takePhoto()
            .then(async (result) => {
                if (fotosEvidencia.length <= 2) {
                    setLoading(true);
                    agregarImagenEncode(result.webPath + "");
                }
                else {
                    setLoading(false)
                    setMessage("Solo se permiten 3 fotos como máximo")
                }
            })
            .catch((err) => {
                let errorType = err.message + "";
                if (errorType.includes("denied")) {
                    setMessage("La aplicación no tiene permisos para usar la cámara")
                }
            }).finally(() => { setLoading(false) })
    }
    //llamada al metodo de convercion
    const agregarImagenEncode = async (imgDir: string) => {
        await obtenerBase64(imgDir).then((result) => {
            setFotoActiva(imgDir);
            setFotosEvidencia(fotosEvidencia => [...fotosEvidencia, imgDir]);
            setIndexFoto(fotosEvidencia.length);
            setFotosCodificadas(fotosCodificadas => [...fotosCodificadas, result]);
            setActivarGaleria(true);
        }).finally(() => { setLoading(false) })
    }
    const logOut = (valid: boolean) => {
        if (!valid) {
            setTipoMessage("Sesión no valida");
            setMessage("Inicie sesión por favor\nRegresando...");
            setTimeout(() => {
                setTipoMessage("ERROR");
                setMessage('');
                history.replace("/home");
            }, 2500)
        } else {
            setLoading(true);
        }
    }
    const cambiarFotoActiva = (foto: string, index: number) => {
        setFotoActiva(foto);
        setIndexFoto(index);
    }
    const generarGaleria = () => {
        if (activarGaleria) {
            let data =
                <div>
                    <IonItem>
                        <IonLabel >Adjuntar evidencia (maximo 3 fotos)</IonLabel>
                        <IonIcon icon={camera} className="iconStyle" onClick={handleAbrirCamera}></IonIcon>
                    </IonItem>
                    {
                        fotosEvidencia.length > 0 ?
                            <IonItem>
                                <IonRow>
                                    {
                                        fotosEvidencia.map((item, index) => {
                                            return <IonCol key={index}><IonImg src={item} onClick={() => { cambiarFotoActiva(item, index) }} className="imgFormat"></IonImg></IonCol>
                                        })
                                    }
                                </IonRow>
                            </IonItem> : <></>
                    }
                </div>;
            return data;
        }
    }
    const borrarFotoEvidencia = () => {
        let fotosTemporal = new Array;
        let fotosEncoded = new Array;
        fotosEvidencia.map((item, index) => {
            if (index != indexFoto) {
                fotosTemporal.push(item);
            }
        });
        fotosCodificadas.map((item, index) => {
            if (index != indexFoto) {
                fotosEncoded.push(item);
            }
        })
        setFotosEvidencia(fotosTemporal);
        setFotosCodificadas(fotosEncoded);
        setFotoActiva('');
        pressentToast({
            message: "Se elimino la foto de la lista'",
            duration: 2000,
            position: 'top',
            buttons: [
                {
                    side: 'start',
                    icon: checkmarkCircle,
                }
            ]
        })
    }
    /*const handleValidarDatos = () =>{
        let handleDatosValidos = dato
    }*/
    return(
        <IonPage>
            <LeftMenu/>
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle>Agregar Inspeccción</IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                <IonCardHeader className="headerData">
                        <div className="datosContribuyete">
                            <h3>{contribuyente.Nombre}</h3>
                            <p>Contrato: {contribuyente.ContratoVigente}, &nbsp;&nbsp; Medidor: {contribuyente.Medidor}, &nbsp;&nbsp; Toma: {contribuyente.Toma}</p>
                            <p>Municipio: {contribuyente.Municipio}, &nbsp;&nbsp; Localidad: {contribuyente.Localidad}</p>
                            <p>{`Dirección: ${contribuyente.Colonia} ${contribuyente.Calle} ${contribuyente.NoExterior} ${contribuyente.NoInterior} ${ contribuyente.CPostal }`}</p>
                        </div>
                </IonCardHeader>
                <IonItemDivider/>
                    <p className = "centrar">Ingrese el motivo</p>
                    <IonTextarea className = "borderTextArea" rows = {4} value = {motivo} placeholder = {"Ingrese el motivo de la inspección"}></IonTextarea>
                    <IonItemDivider/>
                    <IonGrid>
                    <IonRow >
                        <IonCol size = "10">
                            Adjuntar evidencia (maximo 3 fotos)
                        </IonCol>
                        <IonCol size = "2">
                            <IonIcon icon={camera} className="iconStyle" onClick={handleAbrirCamera}></IonIcon>
                        </IonCol>
                        <IonCol size = "12">
                        {
                             generarGaleria()
                        }
                        {
                            fotoActiva != '' ?
                                <IonItem>
                                    <IonCard className="centrar">
                                        <IonImg src={fotoActiva} />
                                        <IonCardContent >
                                            <IonButtons>
                                                <IonButton color="secondary" onClick={() => { setFotoActiva('') }}>Cerrar</IonButton>
                                                <IonButton color="danger" onClick={() => { borrarFotoEvidencia() }} >Eliminar</IonButton>
                                            </IonButtons>
                                        </IonCardContent>
                                    </IonCard>
                                </IonItem> : <></>
                        }
                        </IonCol>
                    </IonRow>
                </IonGrid>
                </IonCard>
                <IonAlert
                    cssClass="my-custom-class"
                    header={tipoMessage}
                    message={message}

                    isOpen={message.length > 0}
                    backdropDismiss={false}
                    buttons={enbleButtons ? alertButtons : [{ text: 'Aceptar', handler: () => { setMessage("") } }]}
                />
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

export default AgregarInspeccion;