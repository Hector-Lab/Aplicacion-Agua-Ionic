
import './left-menu.css';
import { create, logOut, reader, water, newspaper, construct } from 'ionicons/icons'
import { IonMenu, IonContent, IonImg, IonItemDivider, IonMenuToggle, IonRouterOutlet, IonItem, IonLabel, IonIcon, IonSpinner } from '@ionic/react'
import { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { cerrarSesion, getLogoStorage} from '../controller/storageController'
interface ContainerProps { }

const MenuLeft: React.FC<ContainerProps> = () => {
    const history = useHistory();
    let [selectedIndex, setSelectedIndex] = useState(-1);
    const [logo,setLogo] = useState("");
    const appPages = [
        {
            title: 'Toma de agua',
            selects: ['form-datos-toma.page','datos-contribuyente.page'],
            icon: water,
            path: '/form-datos-toma.page'
        }, {
            title: 'Historial de lecturas',
            selects: ['historial-lecturas.page','editar-lecturas-agua.page'],
            icon: reader,
            path: '/historial-lecturas.page'
        }, {

            title: 'Fallos en infraestructura',
            selects: ['reportes.page'],
            path: '/reportes.page',
            icon: construct
        },
        {
            title: 'Historial reportes',
            selects: ['historial-reportes.page', 'detalles-reportes.page'],
            path: '/historial-reportes.page',
            icon: newspaper
        },
        /*{
            title: 'Inspecciones',
            selects: ['inspeccciones.page'],
            path: '/inspeccciones.page',
            icon: newspaper
        },*/
        {
            title: 'Salir',
            selects: ['inicio-de-sesion.page'],
            icon: logOut
        },
    ];
    useEffect(() => {
        itemSelected();
        cargarLogo();
    });
    
    const itemSelected = () => {
        let dir = window.location.pathname.toString().split("/")[1];
        let selected = false;
        if (dir != undefined) {
            appPages.map((item, pageIndex) => {
                item.selects.map((item, index) => {
                    if (item == dir) {
                        console.log(item);
                        setSelectedIndex(pageIndex);
                        selected = true;
                    }
                })
            })
            if (!selected) {
                setSelectedIndex(0);
            }
        }
    }
    const btnSelected = (dir: any) => {
        if (dir.title == 'Salir') {
            cerrarSesion()
                .then((result) => {
                    history.replace("/home")
                })
        } else {
            history.replace(dir.path);
        }
    }
    const cargarLogo = async ()=>{
        await getLogoStorage().then((result)=>{
            setLogo(String(result));
        })
    }
    return (
        <div>
            <IonMenu side="start" menuId="first" contentId="main-content" >
            <IonContent >
                    <div className = "center">
                        {   logo != "" ? 
                            <IonImg  src= {"data:image/png;base64,"+logo}/* "../assets/Imagenes/Logo recortado.png" */></IonImg> : 
                            <IonSpinner className = "spinerItem" color = "danger" name = "lines"></IonSpinner>}
                    </div>
                    <IonItemDivider className="menuLeft" />
                    <IonMenuToggle  >
                        {
                            appPages.map((item, index) => {
                                return <IonItem key={index} button={true} className={index == selectedIndex ? "selected" : ""} onClick={() => { btnSelected(item) }}>
                                    <IonLabel>{item.title}</IonLabel>
                                    <IonIcon slot="start" ios={item.icon + "-outline"} md={item.icon + "-sharp"} color="blue"></IonIcon>
                                </IonItem>
                            })
                        }
                    </IonMenuToggle>
                    <IonItemDivider />
                </IonContent>
            </IonMenu>
            <IonRouterOutlet id = "main-content"></IonRouterOutlet>
        </div>
    )
}

export default MenuLeft;