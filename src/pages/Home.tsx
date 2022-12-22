import { IonAlert, IonButton, IonCard, IonCheckbox, IonContent, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import './Home.css';
import { Login, obtenerLogo, solicitarPermisos, } from '../controller/apiController';
import { restoreUser,clearState } from '../controller/storageController';
import { CrearTablas, VerificarTablas } from '../controller/DBControler';
const Home: React.FC = () => {
  const history = useHistory();
  const [User, setUserName] = useState('');
  const [passwors, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [remember, setRemember] = useState(false);
  useEffect(() => {
    //SplashScreen.hide();
    CreatTablasDB();
    handleRequestPermissions();
    recordarCredenciales();
  }, [])
  useIonViewWillEnter(clearState)
  const recordarCredenciales = async () => {
    let user = restoreUser();
    if (user.pass != null && user.user != null) {
      setUserName(user.user);
      setPassword(user.pass);
      setRemember(user.remember);
    }
  }
  const handleBtnLoginPress = () => {
    setLoading(true)
    validateUserData();
  }
  const validateUserData = async () => {    
    if (User != "" && passwors != "" && User != null && passwors != null) {
      try {
        setTimeout(() => {
          if (loading) {
            throw new Error("Tiempo de espera agotado.");
          }
        }, 8000)
        await Login(User, passwors, remember)
          .then(async (result) => {
            await obtenerLogo();
            history.replace('./form-datos-toma.page');
          })
          .catch((err) => {
            setMessage(err.message);
          })
          .finally(() => { setLoading(false) })
      } catch (err) {
        setMessage(err.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setMessage("Campos vacios")
    }
  }
  const handleRequestPermissions = async () => {
    await solicitarPermisos().then((result) => {
      console.log(result)
    })
  }
  const CreatTablasDB = async () =>{
    await CrearTablas();
    await VerificarTablas();
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" >
          <IonTitle>Inicio de sessión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard class="ion-text-center" className="box">
          <IonImg src={"../assets/Imagenes/Logo_suinpac.jpeg"}></IonImg>
          <IonItem className="input">
            <IonInput type="text" placeholder="Usuario" onIonChange={e => setUserName(e.detail.value!)} value={User}>
            </IonInput>
          </IonItem>
          <IonItem className="input">
            <IonInput type="password" placeholder="Contraseña" onIonChange={e => setPassword(e.detail.value!)} value={passwors}>
            </IonInput>
          </IonItem>
          <IonItem class="ion-text-center">
            <IonCheckbox slot="start" color="primary" checked={remember} onIonChange={e => setRemember(e.detail.checked)}></IonCheckbox>
            <IonLabel>Recordar Usuario y Contraseña</IonLabel>
          </IonItem>
          <IonButton color="danger" onClick={handleBtnLoginPress} className="input button">INICIAR SESSIÓN</IonButton>
        </IonCard>
        <IonLoading
          cssClass="my-custom-class"
          isOpen={loading}
          onDidDismiss={() => setLoading(false)}
          message="Por favor espere"
        />
        <IonAlert
          cssClass="my-custom-class"
          header={"ERROR"}
          message={message}
          isOpen={message.length > 0}
          onDidDismiss={() => { setMessage('') }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;