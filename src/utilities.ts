import { useCamera, } from '@capacitor-community/camera-react';
import { Camera,CameraSource,CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@ionic-native/geolocation';
let calidad = 50;
//NOTE: para fotos de fachada y calle
let alto = 500; // 1280
let ancho = 400; // 800 
//NOTE: para la foto de la toma
/* 
 * resultType: 'Uri',
   source: 'PHOTOS',
   quality: calidad,
   height: alto,
   width: ancho
 */

export function useTakePhoto( ) {
  const { getPhoto } = useCamera();
  const takePhoto = async () => {
    const cameraPhoto = await getPhoto({ 
      resultType:CameraResultType.Uri,
      source:CameraSource.Camera,
      allowEditing:false,
      quality:calidad,
      height:alto,
      width:ancho
    });
    return cameraPhoto;
  }
  return {
    takePhoto
  }
}
export function asignarCalidad(cl:number) {
  calidad < 5 ? calidad = 5 : ( cl > 100 ) ? calidad = 100 : calidad = cl; 
}
export function modificarTamanio ( reducir:boolean ){
  reducir ? alto = 500 : alto = 1280;
  reducir ? ancho = 400 : ancho = 800; 
}

export async function generarFechas(anio: number) {
  let result = new Array();
  let listaMeses = new Array();
  listaMeses = [
    {
      id: 1,
      mes: "Enero"
    }, {
      id: 2,
      mes: "Febrero"
    },
    {
      id: 3,
      mes: "Marzo"
    },
    {
      id: 4,
      mes: "Abril"
    }, {
      id: 5,
      mes: "Mayo"
    }, {
      id: 6,
      mes: "Junio"
    }, {
      id: 7,
      mes: "Julio"
    }, {
      id: 8,
      mes: "Agosto"
    }, {
      id: 9,
      mes: "Septiembre"
    }, {
      id: 10,
      mes: "Octubre"
    }, {
      id: 11,
      mes: "Noviembre"
    }, {
      id: 12,
      mes: "Diciembre"
    }]
  let listaAnios = generarAnios(anio);
  result.push({ 'Meses': listaMeses });
  result.push({ 'Anios': listaAnios });
  return result;
}
export function generarAniosPosterior(anio: number) {
  let listaAnios = new Array();
  let anioActual = new Date().getFullYear() + 1;
  let idAnio = 1;
  for (let anios = anio; anios <= anioActual; anios++) {
    listaAnios.push({ 'id': idAnio, anio: anios });
    idAnio++;
  }
  return listaAnios;
}
export function obtenerBase64(path: string) {
  let imgEncode = leerArchivo(path);
  return imgEncode;
}
async function leerArchivo(path: string) {
  let file = await fetch(path);
  let blobFile = await file.blob();
  let imgEncode = await convertBase64(blobFile);
  return imgEncode;
}
async function convertBase64(blobFile: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => {
      let baseSplit  = reader.result;/* ?.toString().split(',')[1] */
      resolve(baseSplit);
    }
    reader.readAsDataURL(blobFile);
  })
}
export function generarAnios(defaultAnio: number) {
  let listaAnios = new Array();
  let menorAnio = (defaultAnio - 10);
  let anioMaximo = (defaultAnio + 3);
  let idAnio = 1;
  for (menorAnio; menorAnio <= anioMaximo; menorAnio++) {
    listaAnios.push({ 'id': idAnio, anio: menorAnio });
    idAnio++;
  }
  return listaAnios;

}
export async function obtenerCoordenadas() {
  try {
    let coords = await Geolocation.getCurrentPosition();
  return coords.coords;
  } catch (err) {
    throw err;
  }
}
export function zeroFill( number:string,width:number = 9){
  while(number.length < width){
    number = "0"+number;
  }
  return number;
}