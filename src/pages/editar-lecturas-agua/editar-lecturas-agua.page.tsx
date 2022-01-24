import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonButtons,
    IonHeader,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonAlert,
    IonToast,
    IonLoading,
    IonGrid,
    IonRow,
    IonCol
} from '@ionic/react';
import LeftMenu from '../../components/left-menu';
import { getDatosLecturaEditar, actualizarLectura, obtenerPromedioEditar} from '../../controller/apiController';
import { saveOutline, checkmarkCircleOutline, chevronBackCircleOutline, star, } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useTakePhoto, generarFechas, obtenerBase64, generarAniosPosterior, generarAnios, obtenerCoordenadas } from '../../utilities';
import { cerrarSesion, extraerDatosEditarLectura, verifyingSession } from '../../controller/storageController';
const EditarLecturaAgua: React.FC = () => {
    const history = useHistory();
    const [datosContribuyente, setDatosContribuyente] = useState(Object)
    const [loading, setLoading] = useState(false);
    const [anomalias, setAnomalias] = useState<any[]>([]);
    const [bloquearCampos, setBloquearDatos] = useState(true);
    const [tipoLectura, setTipoLectura] = useState(Number);
    const [anhioLectura, setAnhioLectura] = useState(Number);
    const [mesLectura, setMesLectura] = useState(Number)
    const [validarAnhio, setValidarAnhio] = useState(Number);
    const [validarMes, setValidarMes] = useState(Number);
    const [message, setMessage] = useState(String);
    const [listaAnhios, setListaAnhios] = useState<any[]>([]);
    const [listaMeses, setListaMeses] = useState<any[]>([]);
    const [consumo, setConsumo] = useState(Number);
    const [lecturaActual, setLecturaActual] = useState(Number);
    const [lecturaAnterior, setLecturaAnterior] = useState(Number);
    const [tipoAnomalia, setTipoAnomalia] = useState(Number);
    const [fechaLectura, setFechaLectura] = useState(Date);
    const [tipoMensaje, setTipoMensaje] = useState(String);
    const [showToast, setShowToast] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [block, setBlock] = useState(false);
    const [tokenExpired, setTokenExpered] = useState(false);
    const [traceError, setTraceError] = useState(String);
    //INDEV: Actualizar el registro de la lectura
    const [bloqueoAnomalias, setBloqueoAnomalias] = useState(false);
    const [seleccionAnomalia,setSeleccionAnomalia] = useState(0);
    const [promedioLectura,setPromedioLectura] = useState(Number);
    const [consumoMinimo,setConsumoMinimo] = useState(20);
    const [lecturaRegistrada,setLecturaRegistrada] = useState(Number);
    let consumoDatos = 0;
    const fecha = new Date();
    const alertRetriButtons = [
        { text: "Reintentar", handler: () => { setMessage(""); traceError == "onLoad" ? cargarDatos() : guardarLectura(); } },
        { text: "Aceptar", handler: () => { setTraceError(""); setMessage(""); } }
    ]
    const alertAcceptButtons = [{ text: "Aceptar", handler: () => { } }];
    const isSessionValid = () => {
        let valid = verifyingSession(); //Verificamos si existe algun token guardado
        setTokenExpered(!valid);        //Validacion para ver si el token expiro (Si valid == false se lanza el error de la sesion)
        setBlock(!valid);               //Si existe el token
    }
    
    const cargarDatos = async () => {
        setLoading(true);
        let result = extraerDatosEditarLectura();
        setDatosContribuyente(result);
        //Obtenemos el promedio de las lecturas
        await getDatosLecturaEditar()
            .then((result) => {
                if (result.Status) {
                    //Me falta contrato vigente
                    console.log(result.Mensaje);
                    setDatosContribuyente(result.Mensaje[0]);
                    generarFechasAnhios(parseInt(result.Mensaje[0].A_no));
                    filtrarLectura(result)

                } else {
                    setTipoMensaje("Mensaje");
                    setMessage("No se encontraron resultados.");
                }
            })
            .catch((err) => {
                let errorMessage = String(err.message);
                setConnectionError(errorMessage.includes("API"));
                let sessionValid = errorMessage.includes("Sesion no valida");
                console.log("El toke es valido ?", sessionValid)
                setTokenExpered(sessionValid);
                if (!sessionValid) {
                    setTraceError("onLoad");
                    setMessage(err.message)
                    setTipoMensaje("ERROR");
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => { isSessionValid(); }, [anhioLectura]);
    useEffect(() => { logOut(tokenExpired); }, [tokenExpired])
    const logOut = (valid: boolean) => {
        if (valid) {
            setTipoMensaje("Sesión no valida");
            setMessage("Inicie sesión por favor\nRegresando...");
            setTimeout(async () => {
                setMessage('');
                setTipoMensaje('MENSAJE')
                await cerrarSesion().then((result) => {
                    history.replace("/home");
                })
            }, 2500)
        } else {
            cargarDatos();
        }
    }
    const filtrarLectura = async (result: any) => {
        console.log(result.tipoLectura[0].Valor);
        result.bloqueoCampos[0].Valor == 0 ? setBloquearDatos(false) : setBloquearDatos(true);
        setTipoLectura(result.tipoLectura[0].Valor);
        setAnomalias(result.Anomalias);
        let lectura = result.tipoLectura[0].Valor;
        if (lectura == 1 || lectura == 2 || lectura == 3) {
            setAnhioLectura(result.Mensaje[0]['A_no']);
            setMesLectura(result.Mensaje[0]['Mes'])
            setValidarAnhio(result.Mensaje[0]['A_no']);
            setValidarMes(result.Mensaje[0]['Mes']);
            //Obtenemos el promedio
            await obtenerPromedioEditar(result.Mensaje[0]['Padr_onAgua']).then((result)=>{
                setPromedioLectura(result);
            }).catch((e)=>{
                setPromedioLectura(0);
            });
        } else {
            //Mensaje de error
            setTipoMensaje('ERROR')
            setMessage('Consulte con su administrador que el código de lecturas de agua se encuentre en el rango de 1-3');
            setTimeout(() => {
                history.goBack();
            }, 2000)
        }
        let datosLectura = result.Mensaje[0];
        setConsumo(datosLectura.Consumo);
        consumoDatos = datosLectura.Consumo;
        setLecturaActual(datosLectura.LecturaActual);
        setLecturaRegistrada(datosLectura.LecturaActual);
        setLecturaAnterior(datosLectura.LecturaAnterior);
        datosLectura.Observaci_on == null ? setTipoAnomalia(0) : setTipoAnomalia(datosLectura.Observaci_on);
        setFechaLectura(datosLectura.FechaLectura);
    }
    const generarFechasAnhios = async (anio: number) => {
        let data = await generarFechas(anio);
        setListaAnhios(data[1].Anios);
        setListaMeses(data[0].Meses);
    }
    const handleCalcularconsumo = (consumido: number) => {
        //Calculando el consumo
        let result = consumido - lecturaAnterior;
        setLecturaActual(consumido);
        isNaN(result) ? setConsumo(0) : setConsumo(result)
        
    }
    const guardarLectura = async () => {
        setLoading(true);
        //localStorage.setItem("@Storage::userToken","eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLnNlcnZpY2lvZW5saW5lYS5teFwvYXBpLW1vdmlsXC9sb2dpbi1wcmVzaWRlbnRlUHJ1ZWJhIiwiaWF0IjoxNjIxMzY1OTk0LCJleHAiOjE2MjE0MDE5OTQsIm5iZiI6MTYyMTM2NTk5NCwianRpIjoiV0w3VE9EeUZpQkhWZzZqRSIsInN1YiI6MzgwMCwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSJ9.5aG5sSnugBRIPvmj0QcbhHuqxPfBRkwrxN74bGz1uho");
        console.log(anhioLectura, mesLectura,datosContribuyente.Padr_onAgua);
        let consumoCalculado = procesoConsumo();
        if(consumoCalculado == 0){
            setTipoMensaje("MENSAJE");
            setMessage("No se ha calculado el consumo");
            setLoading(false);
        }else if(consumoCalculado < 0){
            setTipoMensaje("MENSAJE");
            setMessage("La lectura actual no puede ser menor a la anterior");
            setLoading(false);
        }else{
            //Enviamos los datos a editar
            let data = {
                anhioLectura: anhioLectura,
                consumo: consumoCalculado,
                fechaLectura: fechaLectura,
                lecturaActual: lecturaActual,
                lecturaAnterior: lecturaAnterior,
                mesLectura: mesLectura,
                tipoAnomalia: tipoAnomalia,
                validarAnhio: validarAnhio,
                validarMes: validarMes,
                idPadron: datosContribuyente.Padr_onAgua,
            }
            console.log(data);
            setLoading(false);
                 /*await actualizarLectura(data)
            .then((result) => {
                setShowToast(true);
                console.log(result)
            })
            .catch((err) => {
                let errorMessage = String(err.message);
                setConnectionError(errorMessage.includes("API"));
                let sessionValid = errorMessage.includes("Sesion no valida");
                setTokenExpered(sessionValid);
                if (!sessionValid) {
                    setTraceError("onUpdate");
                    setTipoMensaje("ERROR");
                    setMessage(err.message)
                }
            })
            .finally(() => {
                setLoading(false);
            })*/
        }
   
    }
    const regresarPantalla = async () => {
        if (showToast) {
            setShowToast(false);
            history.replace('/historial-lecturas.page');
        }
    }
    //Manejadores de 
    const handleSelectMes = (mes: string) => {
        setMesLectura(parseInt(mes));
    }
    const handleSelectAnio = (anio: string) => {
        setAnhioLectura(parseInt(anio));
    }
    const handlebtnRegresar = () => {
        history.replace("/historial-lecturas.page");
        console.log("Regresando");
    }
    const handleSelectAnomalia = (selectAnomalia: number) =>{
        setSeleccionAnomalia(selectAnomalia);
        setTipoAnomalia(selectAnomalia);
        anomalias.map((item,index)=>{
            if(item.id == selectAnomalia){
                if(parseInt(item.ActualizarAdelante) == 1 || parseInt(item.ActualizarAtras) == 1){
                    setBloqueoAnomalias(false);
                }else{
                    setBloqueoAnomalias(true);
                    setLecturaActual(lecturaAnterior);
                }
                setConsumoMinimo(item.Minima);
                console.log(item.Minima + "Consumo calculado");
                if(lecturaActual != 0){
                    setConsumo(procesoConsumo());
                }
                if(selectAnomalia == 24){
                    setConsumo(promedioLectura);
                }
            }
        });
    }
    const handleCancelAnomalia = () =>{
        setTipoAnomalia(0);
        setSeleccionAnomalia(0);
        setBloqueoAnomalias(false);
        handleCalcularconsumo(lecturaActual);
        setLecturaActual(lecturaRegistrada);
    }
    const procesoConsumo = () => {
        let consumoProcesado = 0;
        console.log(seleccionAnomalia);
        if( seleccionAnomalia != 0){
            if(bloqueoAnomalias){ // este es el proceso de las anomalias sin capturas
                if (promedioLectura < consumoMinimo){
                    consumoProcesado = consumoMinimo;
                }else{
                    consumoProcesado = promedioLectura;
                }
            }else{ //este el el proceso de las anomalias con captura
                if(consumo < promedioLectura){
                    consumoProcesado = promedioLectura;
                }
                if(promedioLectura < consumoMinimo){
                    consumoProcesado = consumoMinimo;
                }
                if(consumoMinimo < consumo){
                    consumoProcesado =  consumo;
                }
            }
        }else{ // este es el proceso de captura normal
            if(consumo < consumoMinimo && consumo > 0){
                consumoProcesado = consumoMinimo;
            }else{
                consumoProcesado = consumo;
            }
        }
        if(tipoAnomalia == 47){
            consumoProcesado = consumoMinimo;
        }
        if(tipoAnomalia == 99){
            if(lecturaActual < consumoMinimo){
                consumoProcesado = consumoMinimo;
            }else{
                consumoProcesado = lecturaActual;
            }
        }
        if(tipoAnomalia == 24){
            consumoProcesado = promedioLectura;
        }
        
        setConsumo(consumoProcesado);
        return consumoProcesado;
    }
    return (
        <IonPage>
            <LeftMenu />
            <IonHeader>
                <IonToolbar color="danger" >
                    <IonTitle>Editar lectura</IonTitle>
                    <IonButtons slot="start" className="btnMenu">
                        <IonMenuButton ></IonMenuButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <div className="datosContribuyete">
                            <h3>{datosContribuyente.Nombre}</h3>
                            <p>Contrato: {datosContribuyente.ContratoVigente}, &nbsp;&nbsp; Medidor: {datosContribuyente.Medidor}, &nbsp;&nbsp; Toma: {datosContribuyente.Toma}</p>
                            <p>Municipio: {datosContribuyente.Municipio}, &nbsp;&nbsp; Localidad: {datosContribuyente.Localidad}</p>
                            <p>Colonia: {datosContribuyente.Colonia} &nbsp;&nbsp; Calle: {datosContribuyente.Calle} &nbsp;&nbsp; Exterior: {datosContribuyente.Exterior} &nbsp;&nbsp; Interior: {datosContribuyente.Interior}</p>
                        </div>
                    </IonCardHeader>
                    <IonCardContent>
                        <br />
                        <IonItem>
                            <IonLabel> Lectura anterior:</IonLabel>
                            <IonInput disabled value={lecturaAnterior}></IonInput>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>Lectura actual:</IonLabel>
                            <IonInput disabled  value={lecturaActual} onIonChange={e => { handleCalcularconsumo(parseFloat(e.detail.value + "")) }}></IonInput>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>Consumo :</IonLabel>
                            <IonInput disabled value={consumo}></IonInput>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>Fecha de lectura: </IonLabel>
                            <IonDatetime disabled displayFormat="DD/MM/YYYY" value={fechaLectura}></IonDatetime>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>Anomalía:</IonLabel>
                            <IonSelect 
                                disabled
                                placeholder="Seleccione uno" 
                                interface="action-sheet" 
                                cancelText="Cancelar" 
                                value={tipoAnomalia}
                                onIonCancel = {handleCancelAnomalia}
                                onIonChange = { e => { handleSelectAnomalia(e.detail.value) } } >
                                <IonSelectOption value={null}></IonSelectOption>
                                {
                                    //Lista de anomalias
                                    anomalias.map((item, index) => {
                                        return <IonSelectOption key={index} value={item.id}>
                                            {`${item.clave}-${item.descripci_on}`}
                                        </IonSelectOption>
                                    })
                                }
                            </IonSelect>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel> Mes: </IonLabel>
                            <IonSelect disabled={bloquearCampos} interface="action-sheet" placeholder="Seleccione uno" cancelText="Cancelar" value={mesLectura} onIonChange={e => { handleSelectMes(e.detail.value) }}>
                                {
                                    listaMeses.map((item, index) => {
                                        return <IonSelectOption key={index} value={item.id}>
                                            {item.mes}
                                        </IonSelectOption>
                                    })
                                }
                            </IonSelect>
                        </IonItem>
                        <br />
                        <IonItem>
                            <IonLabel>Año: </IonLabel>
                            <IonSelect disabled={bloquearCampos} interface="action-sheet" placeholder="Seleccione uno" cancelText="Cancelar" value={anhioLectura} onIonChange={e => { handleSelectAnio(e.detail.value) }}>
                                {
                                    listaAnhios.map((item, index) => {
                                        return <IonSelectOption key={index} value={item.anio}>
                                            {item.anio}
                                        </IonSelectOption>
                                    })
                                }
                            </IonSelect>
                        </IonItem>
                        <br />
                        <div className="centrar">
                            <IonGrid>
                                <IonRow>
                                    <IonCol>
                                        <IonButton color="secondary" onClick={handlebtnRegresar} >Regresar<IonIcon icon={chevronBackCircleOutline} slot="start"></IonIcon> </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>


                        </div>
                    </IonCardContent>
                </IonCard>
                <IonAlert
                    cssClass="my-custom-class"
                    header={tipoMensaje}
                    message={message}
                    isOpen={message.length > 0}
                    backdropDismiss={false}
                    buttons={connectionError ? alertRetriButtons : [{ text: "Aceptar", handler: () => { setMessage("") } }]}
                />
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={regresarPantalla}
                    message="Los datos se actualizaron correctamente"
                    duration={2000}
                    position="top"
                    buttons={[{ side: "end", icon: checkmarkCircleOutline, handler: regresarPantalla }]}
                ></IonToast>
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

export default EditarLecturaAgua;