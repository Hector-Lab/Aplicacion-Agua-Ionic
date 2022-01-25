import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Console } from 'node:console';
import { _private } from 'workbox-core';
import { APIservice } from '../api/api-laravel.service';
import {
    guardarDatosCliente,
    obtenerDatosCliente,
    guardarContratos,
    guardarDatosLectura,
    getContratos,
    obtenerDatosClienteEditar,
    getDatosLecturaStorage,
    setLogoStorage,
    setClienteNombreCorto,
    getContribuyente,
    setContribuyente,
    obtnerCliente,
    obtenerToken,
    extraerDatosEditarLectura,
    setCuentasPapas
} from '../controller/storageController';
const service = new APIservice();
const date = new Date();
//INDEV: Errores del sistema
const netwokError = new Error("Error al intentar comunicarse con la API. Verifique que su dispositivo se encuentre conectado a la red");
const sesionNotValidError = new Error("Sesion no valida");
const failedLoginError = new Error("Usuario y/o contraseña incorrectos");
const userNotValidError = new Error("No puedes iniciar sesión con este usuario");
const lecturaCodeError = new Error('Consulte con su administrador que el código de lecturas de agua se encuentre en el rango de 1-3');
const noRowSelect = new Error("No se encontraron registros");
const LecturaNull = new Error("No se ha calculado el consumo");
const LecturaMenor = new Error("La lectura actual no puede ser menor a la anterior");
const mesMayor = new Error("Aun no puedes realizar registros para el mes seleccionado");
const mesRegistrado = new Error("El mes seleccionado ya fue registrado");
const anioMayor = new Error("Aun no puedes realizar registros para este año");
const anioRegistrado = new Error("Ya no puedes realizar registros para este año");
const mesIgual = new Error("este mes ya fue registrado");
const API223 = new Error("Revisa que los campos esten rellenados de forma correcta");
const APIError = new Error("Error del servidor");
const atrasError = new Error("El mes seleccionada debe se mayor a la actual");
const adelanteError = new Error("El mes de la lectura debe ser menor al actual");
const PermissionsError = new Error("Para poder hacer uso de todas las funciones de la aplicaciòn por favor acepta los permisos solicitados por la misma");
export async function Login(user: string, password: string, remerber: boolean) {
    const acceso = {
        usuario: user,
        passwd: password
    }
    try {
        let result = await service.getAuth(acceso);
        //Verificanos si el inicio de session es valido
        let sessionValida = result.data.Status;
        if (sessionValida == true) {
            let data = {
                usuario: user,
                cliente: result.data.cliente,
                idUsuario: result.data.idUsuario,
                token: result.data.token,
                recordar: remerber,
                contrasenia: password,
                userName: result.data.datosUsuario.NombreCompleto
            }
            console.log(data.token);
            let verified = await verificarUsuarioLecturista(data);
            if (verified === true) {
                return verified;
            } else {
                throw verified;
            }
        } else {
            throw failedLoginError;
        }
    } catch (error) {
        throw conectionError(error);
    }

}
async function verificarUsuarioLecturista(userData: any) {
    try {
        let datos = {
            usuario: userData.idUsuario,
            cliente: userData.cliente
        }
        if (datos.cliente === "-1") {
            throw userNotValidError;
        }
        let result = await service.verificarUsuarioLecturista(datos, userData.token);
        let esLecturista = result.data.Status;
        if (esLecturista) {
            guardarDatosCliente(userData);
            return true;
        } else {
            throw userNotValidError;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function buscarSectores() {
    try {
        let basicData = obtenerDatosCliente();
        const datosConsulta = {
            nCliente: basicData.cliente,
            idUsuario: basicData.idUsuario,
        }
        let result = await service.buscarSectores(datosConsulta, basicData.token + "");
        return result.data.Sectores;
    } catch (error) {
        throw conectionError(error)
    }
}
export async function lecturasPorSector(sector: string) {
    try {
        let basicData = obtenerDatosCliente();
        let mes = date.getMonth() + 1;
        let anio = date.getFullYear();
        const datosConsulta = {
            nCliente: basicData.cliente,
            Sector: sector,
            mes: mes,
            a_no: anio
        }
        let result = await service.buscarLecturasPorSector(datosConsulta, basicData.token + "");
        let mensaje = result.data.mensaje;
        guardarContratos(JSON.stringify(mensaje));
        if (mensaje.legth === 0 || mensaje === "No se encontraron registros") {
            throw noRowSelect;
        } else {
            return mensaje;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function extraerDatosLectura(keyLectura: string) {
    try {
        //Extrallendo los datos de la lectura
        let basicData = obtenerDatosCliente();
        let datos = {
            nCliente: basicData.cliente,
            idLectura: keyLectura
        }
        let result = await service.extraesDatosLectura(datos, basicData.token + "");
        console.log(result);
        let tipoLectura = result.data.ValorLectura[0].Valor;
        if (tipoLectura != '1' && tipoLectura != '2' && tipoLectura != '3') {
            throw lecturaCodeError
        } else {
            return result.data;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function guardarCaptura(datosCaptura: any) {
    try {
        let result = await validarDatosLectura(datosCaptura);
        if (result === true) {
            //NOTE: se manda a llamar al metodo de guardado
            let result = await enviarDatosLectura(datosCaptura);
            return result;
        } else {
            throw result;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
/**
 * Funcion para verificar los datos de al guardar la captura del agua
 */
async function validarDatosLectura(data: any) {
    let anomalia = parseInt(data.anomalia);
    let tipoLectura = data.lectura;
    let arrayAnios = data.arrayAnios;
    let mesActual = date.getMonth() + 2;
    if (!Number.isInteger(anomalia)) {
        anomalia = NaN;
    }
    //Validamos que la lectura no este vacia
    if (data.lecturaActual == "" || data.lecturaActual == null) {
        throw LecturaNull;
    }
    //Validamos que el consumo no sea menor a 0 
    let consumo = parseInt(data.consumoFinal);
    if (!isNaN(anomalia)) {
        if (consumo < 0) {
            throw LecturaMenor;
        }
    } else {
        if (consumo <= 0) {
            throw LecturaMenor;
        }
    }
    //REVIEW: Esto creo que no es necesario
    if (tipoLectura == 3) {
        let anioSeleccionado = arrayAnios[data.indexAnio - 1].anio;
        //mayor 
        if (data.comparaMes < data.mesCaptura) {
            throw mesMayor;
        }
        if (data.comparaAnio < anioSeleccionado) {
            throw anioMayor
        }
        //menor
        if (data.comparaMes > data.mesCaptura) {
            throw mesRegistrado
        }
        if (data.comparaAnio > anioSeleccionado) {
            throw anioRegistrado
        }
        if (mesActual == 13) {
            mesActual = 1;
        }
        if (mesActual == data.mesLectura) {
            throw mesIgual
        }
    } else
        if (tipoLectura == 2) {
            let anhioSeleccionado = arrayAnios[data.indexAnio - 1].anio;

            if (data.comparaMes < data.mesCaptura) {
                throw mesMayor;
            }
            if (data.comparaMes > data.mesCaptura) {
                throw mesRegistrado
            }
            if (data.comparaAnio < anhioSeleccionado) {
                throw anioMayor
            }
            if (data.comparaAnio > anhioSeleccionado) {
                throw anioRegistrado
            }
            if (data.mesCaptura >= data.comparaAnio && data.anhioCaptura >= data.comparaAnio) {
                throw mesIgual
            }

        } else
            if (tipoLectura == 1) {
                let anhioSeleccionado = arrayAnios[data.indexAnio - 1].anio;
                let mesActual, anhioActual;
                if (data.mesCaptura > data.comparaMes) {
                    throw mesMayor
                }
                if (anhioSeleccionado > data.comparaAnio) {
                    throw anioMayor
                }
                if (data.mesCaptura < data.comparaMes) {
                    throw mesRegistrado
                }
                if (anhioSeleccionado < data.comparaAnio) {
                    throw anioRegistrado
                }
                mesActual = date.getMonth() + 2;
                anhioActual = date.getFullYear();
                if (mesActual == 13) {
                    mesActual = 1;
                    anhioActual = date.getFullYear() + 1;
                }
                if (mesActual == data.mesCaptura && anhioActual == data.comparaAnio) {
                    throw mesMayor
                }
            }
    return true;

}
async function enviarDatosLectura(data: any) {
    const datos = {
        idToma: data.idToma,
        cliente: data.nCliente,
        lecturaAnterior: data.lecturaAnterior,
        lecturaActual: data.lecturaActual,
        consumoFinal: data.consumoFinal,
        mesCaptura: data.mesCaptura,
        anhioCaptura: data.anhioCaptura,
        fechaCaptura: data.fechaCaptura,
        anomalia: data.anomalia,
        idUsuario: data.idUsuario,
        latitud: data.Latidude,
        longitud: data.Longitude,
        tipoCoordenada: 1,
        fotos: [],
        arregloFotos: data.arregloFotos,
        ruta: data.route
    }
    let result = await service.guardarDatosLectura(datos, data.token);
    console.log(result);
    let code = result.data.Mensaje;
    let message = "";
    switch (code) {
        case 200:
            message = "Ok";
            break;
        case 224:
            throw new Error("No se pudo realizar el registro");
            break;
        case 223:
            throw API223;
        case 400:
            throw new Error("El mes ya fue capturado");
            break;
        default:
            throw APIError;
            break;
    }
    return message;
}
export async function obtenerSiguienteIndice(idLectura: number) {
    let contratos = getContratos();
    let arrayContratos = new Array;
    let indice = -1;
    if (contratos != null) {
        arrayContratos = JSON.parse(contratos);
        arrayContratos.map((item, index) => {
            if (item.id == idLectura)
                indice = index + 1;
        })
    }
    let result = false;
    if (indice < arrayContratos.length) {
        let lecturaSiguiente = arrayContratos[indice];
        result = guardarDatosLectura(lecturaSiguiente.id, lecturaSiguiente.Contribuyente, lecturaSiguiente.ContratoVigente, lecturaSiguiente.Medidor)
    }
    return result;
}
//INDEV: dando soporte a los errores
export async function historialFechas(fechaInicio: string, fechaFin: string) {
    try {
        //Obteniedo los datos para la consulta
        let basicData = obtenerDatosCliente();
        let data = {
            idUsuario: basicData.idUsuario,
            nCliente: basicData.cliente,
            fechaInicioH: fechaInicio,
            fechaFinH: fechaFin
        }
        let result = await service.extraerHistorial(data, basicData.token + "");
        if (result.data.Status) {
            return result.data;
        } else {
            throw noRowSelect;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function getDatosLecturaEditar() {
    try {
        let { datosLectura, token } = obtenerDatosClienteEditar()
        if (token != null) {
            let result = await service.extraerDatoseditar(datosLectura, token);
            return result.data
        } else {
            throw null;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function validorDatosEditarLectura(lecturaDatos: any) {
    if (lecturaDatos.lecturaActual == "" || lecturaDatos.lecturaActual == null)
        throw LecturaNull;
    else if (lecturaDatos.consumo < 0)
        throw LecturaMenor;
    else if (lecturaDatos.validarAnhio < lecturaDatos.anhioLectura)
        throw anioMayor;
    else if (lecturaDatos.validarAnhio > lecturaDatos.anhioLectura)
        throw anioRegistrado;
    else if (lecturaDatos.mesLectura < lecturaDatos.validarMes)
        throw mesRegistrado
    else if (lecturaDatos.mesLectura > lecturaDatos.validarMes)
        throw mesMayor;
    else
        return null

}
export async function actualizarLectura(lecturaDatos: any) {
    try {
        let result = await validorDatosEditarLectura(lecturaDatos);
        let { datosLectura, token } = obtenerDatosClienteEditar();
        if (result == null) {
            let data = {
                idPadronLetura: datosLectura.idConsulta,
                idToma: lecturaDatos.idPadron,
                cliente: datosLectura.nCliente,
                anhioCaptura: lecturaDatos.anhioLectura,
                consumoFinal: lecturaDatos.consumo,
                fechaCaptura: lecturaDatos.fechaLectura,
                lecturaActual: lecturaDatos.lecturaActual,
                lecturaAnterior: lecturaDatos.lecturaAnterior,
                mesCaptura: lecturaDatos.mesLectura,
                anomalia: lecturaDatos.tipoAnomalia
            }
            let result = await service.actualizarDatosLectura(data, token + "")
            return result.data;
        } else {
            throw result;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function crearReporte(data: { colonia: String, calle: String, numero: String, descripcion: String, contrato: string, fallaAdministrativa: number }) {
    try {
        let valid = validarDatosReporte(data);
        if (valid) {
            //Llamada a la API
            let basicData = obtenerDatosCliente();
            let datosreporte = {
                cliente: basicData.cliente,
                usuario: basicData.idUsuario,
                colonia: data.colonia,
                calle: data.calle,
                numero: data.numero,
                descripcion: data.descripcion,
                contrato: data.contrato,
                fallaAdministrativa: data.fallaAdministrativa,
            }
            let result = await service.crearReporte(datosreporte, basicData.token + "")
            if (result.data.Status)
                return result.data.Mensaje
            else
                throw new Error(result.data.Mensaje);
        } else {
            throw new Error("Los campos que presentan * son obligatorios");
        }
    } catch (error) {
        throw conectionError(error);
    }
}
function validarDatosReporte(data: { colonia: String, calle: String, numero: String, descripcion: String, contrato: string }) {
    if (data.colonia == "" || data.calle == "" || data.descripcion == "") {
        return false
    } else {
        return true;
    }
}
export async function historialReportes(fechaInicio: string, fechaFin: string) {
    try {
        let basicData = obtenerDatosCliente();
        let data = {
            idUsuario: basicData.idUsuario,
            cliente: basicData.cliente,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        }
        let result = await service.extraerHistorialReportes(data, basicData.token + "");
        if (result.data.Mensaje.length <= 0) {
            throw noRowSelect;
        } else {
            return result.data.Mensaje;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function extraerReporte(id: String) {
    try {
        //Obteniendo datos basicos para la consulta;
        let basicData = obtenerDatosCliente();
        let data = {
            cliente: basicData.cliente,
            idUsuario: basicData.idUsuario,
            id: id
        }
        let result = await service.extraerReporte(data, String(basicData.token));
        if (result.data.Mensaje.length <= 0) {
            throw noRowSelect;
        } else {
            return result.data.Mensaje;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function obtenerContribuyente(busqueda: string,offset: number,sector: String) {
    try {
        let { token, cliente } = obtenerDatosCliente();
        let mes = date.getMonth() + 1;
        let anio = date.getFullYear();
        let datos = {
            nCliente: cliente,
            datoBusqueda: busqueda,
            mes: mes,
            a_no: anio,
            Offset: offset,
            sector:sector
        }
        let result = null;
        if(sector != "-1"){
            result = await service.obtenerDatosSectorPalabraClave(datos,String(token));
            console.log("Se utiliso el sector: " + sector);
        }else{
            result = await service.extraerContribuyente(datos, String(token));
        }
        //Mensaje "Campos vacios", "No se encontraron registros"
        let data = result.data.mensaje;
        let isArray = Array.isArray(data);
        if (isArray) {
            return data;
        } else {
            let message = String(data);
            throw new Error(message);
        }
    } catch (err) {
        throw conectionError(err);
    }
}
export async function obtenerTotalDatosSectores(sector: string) {
    try {
        let basicData = obtenerDatosCliente();
        let mes = date.getMonth() + 1;
        let anio = date.getFullYear();
        const datosConsulta = {
            cliente: basicData.cliente,
            sector: sector,
            mes: mes,
            anio: anio
        }
        let result = await service.extraerNumeroItems(datosConsulta, String(basicData.token));
        let exist = result.data.Mensaje.length;
        if (exist >= 1) {
            let items = result.data.Mensaje[0].cantidad;
            let pages = items / 20;
            let resid = pages % 1;
            if (resid > 0) {
                pages++;
            }
            return pages;
        } else {
            return 0;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function lecturasPorSectorPage(sector: string, offset: number,) {
    try {
        let basicData = obtenerDatosCliente();
        let mes = date.getMonth() + 1;
        let anio = date.getFullYear();
        const datosConsulta = {
            nCliente: basicData.cliente,
            Sector: sector,
            mes: mes,
            a_no: anio,
            Offset: offset
        }
        let result = await service.buscarLecturasPorSector(datosConsulta, basicData.token + "");
        let mensaje = result.data.mensaje;        
        setCuentasPapas(result.data.Papas);
        guardarContratos(JSON.stringify(mensaje));
        if (mensaje.legth === 0 || mensaje === "No se encontraron registros") {
            throw noRowSelect;
        } else {
            return mensaje;
        }
    } catch (error) {
        throw conectionError(error);
    }
}
export async function obtenerPromedioConsumo() {
    try {
        let { idLectura, token, nCliente } = getDatosLecturaStorage();
        let datos = {
            idLectura: idLectura,
            nCliente: nCliente,
        }
        let result = await service.extraerPromedioContribuyente(datos, String(token));
        let data = result.data.Mensaje;
        data = Math.round(data);
        return data;
    } catch (error) {
        throw conectionError(error);
    }
}
export async function obtenerLogo() {
    try {
        let { cliente, token } = obtenerDatosCliente();
        let data = {
            nCliente: cliente
        }
        let logo = await service.obtenerLogoCliente(data, String(token));
        setClienteNombreCorto(String(logo.data.Data));
        setLogoStorage(String(logo.data.Mensaje));
    } catch (error) {
        throw conectionError(error);
    }
}
export async function obtenerDatosContribuyente() {
    try {
        let { idLectura, token } = getDatosLecturaStorage();
        let { cliente } = obtenerDatosCliente();
        let datos = {
            nCliente: cliente,
            idBusqueda: idLectura
        }
        let data = await service.extraerContactoContribuyente(datos, String(token));
        let result = data.data.Mensaje[0];
        setContribuyente(result.Contribuyente);
        return result;
    } catch (error) {
        throw conectionError(error);
    }
}
export async function actualizarContribuyente(contacto: { telefono: String, email: String }) {
    try {
        let { nCliente, token } = getDatosLecturaStorage();
        let contribuyente = getContribuyente();
        let data = {
            cliente: nCliente,
            id: contribuyente,
            telefono: contacto.telefono,
            email: contacto.email
        }
        let result = await service.guardarContribuyente(data, String(token));
        return result.data.Mensaje;
    } catch (error) {
        throw conectionError(error);
    }
}
export async function obtenerTotalDatosBusqueda(clave: string, sector: string) {
    try {
        let { cliente, token } = obtenerDatosCliente()
        let mes = date.getMonth() + 1;
        let anio = date.getFullYear();
        let data = {
            cliente: cliente,
            mes: mes,
            anio: anio,
            busqueda: clave,
            sector: sector
        }
        let result = null;
        if(sector != "-1"){
            console.log(data);
            result = await service.obtenerNumeroItemsBusquedaSector(data, String(token));
        }else{
            result = await service.extraerNumeroItemsBusqueda(data, String(token));
        }
        /* return result.data.Mensaje.length; */
        let exist = result.data.Mensaje.length;
        if(exist >= 1){
            let items = result.data.Mensaje[0].Total;
            let pages = items / 20;
            let resid = pages % 1;
            if(resid > 0){
                pages++;
            }
            return pages
        }else{
            return 0;
        }
    } catch (error) {
        throw conectionError(error);
    }   
}
function conectionError(error: any) {
    let errorMessage = String(error.message);
    let errorCode = String(error.code);
    let typeError = error;
    if (errorMessage.includes("Network Error")) {
        typeError = netwokError;
    } else if (errorMessage.includes("400")) {
        typeError = sesionNotValidError;
    } else if (errorCode.includes("ECONNABORTED")) {
        typeError = netwokError;
    }
    return typeError;
}
export async function verifyPermissions() {
    let list = [
        AndroidPermissions.PERMISSION.CAMERA,
        AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
    ]
    let validPermissions = "Salida:";
    list.map((item, index) => {
        let data = AndroidPermissions.checkPermission(item);
        validPermissions += data + "";
    })
    return validPermissions;
}
export async function verifyCameraPermission() {
    let value = await AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.CAMERA);
    return value.hasPermission;
}
export async function verifyGPSPermission() {
    let value = await AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
    return value.hasPermission;
}
export async function obtenerContribuyenteInspeccion(busqueda: String){
    try{
        let { cliente, token } = obtenerDatosCliente();
        let data = {
            Cliente: cliente,
            Busqueda: busqueda
        }
        let result = await service.obtenerContribuyenteInspeccion(data,String(token));
        let listaDatos =  result.data.mensaje;
        if(listaDatos instanceof Array){
            return listaDatos;
        }else{
            throw noRowSelect;
        }
    }catch(error){
        throw conectionError(error);
    }   
}
/**
 * Funcion para pedir permisos Camara, gps, storage
 * Si se utilza en web marca un error (Cordova_web_notabiable) solo se utilza en dispisitivos fisicos y emuladoress
 */
export async function solicitarPermisos() {
    let result = await AndroidPermissions.requestPermissions([
        AndroidPermissions.PERMISSION.CAMERA,
        AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
    ]);
    return result;
}
export async function obtnerContribuyenteInspeccion(id:String){
    try{
        let datos = {
            Cliente: obtnerCliente(),
            Padron: id
        };
        let result = await service.obtenerDatosContribuyentePorPadron(datos,obtenerToken());
        console.log(result.data.mensaje.length);
        let datosContribuyente = result.data.mensaje;
        if(datosContribuyente.length > 0){
            return datosContribuyente[0];
        }else{
            throw noRowSelect;
        }
    }catch(error){
        throw conectionError(error);
    }
}
export async function  obtenerPromedioEditar(padron: number){
    try {
        let { token, nCliente } = getDatosLecturaStorage();
        let datosLectura = extraerDatosEditarLectura();
        let datos = {
            Cliente: nCliente,
            Padron: padron,
            Lectura: datosLectura.idLectura //Esta es la lectura que se va a editar
        }
        let result = await service.obtenerPromedioEditar(datos, String(token));
        let data = result.data.Mensaje;
        data = Math.round(data);
        return data;
    } catch (error) {
        throw conectionError(error);
    }
}

export async function buscarContrato(busqueda:string){
    try{
        console.log("Buscando por contrato");
        let { cliente,token } = obtenerDatosCliente();
        let mes = date.getMonth() + 1;
        let anio = date.getFullYear();
        let datos = {
            Cliente: cliente,
            Contrato: busqueda,
            mes: mes,
            a_no: anio
        };
        let result = await service.buscarPorContrato(datos,String(token));
        let data = result.data.Mensaje;
        console.log(result.data);
        setCuentasPapas(result.data.Papas);
        console.log(result.data.Papas);
        let isArray = Array.isArray(data);
        if (isArray) {
            return data;
        } else {
            let message = String(data);
            throw new Error(message);
        }
    }catch (error) {
        throw conectionError(error);
    }
}
export async function buscarPorMedidor(busqueda:string){
    try{
        console.log("Buscando por medidor");
        let { cliente,token } = obtenerDatosCliente();
        let mes = date.getMonth() + 1;
        let anio = date.getFullYear();
        let datos = {
            Cliente: cliente,
            Contrato: busqueda,
            mes: mes,
            a_no: anio
        };
        let result = await service.buscarPorMedidor(datos,String(token));
        let data = result.data.Mensaje;
        setCuentasPapas(result.data.Papas);
        console.log(result.data.Papas);
        let isArray = Array.isArray(data);
        if (isArray) {
            return data;
        } else {
            let message = String(data);
            throw new Error(message);
        }
    }catch(error){
        throw conectionError(error);
    }
}
function verificarDatosCoutaFija( consumoData: string ){
    //NOTE: Verificamos que el consumo sea valido
    let consumo = parseInt(consumoData);
    if(!isNaN(consumo)){
        if(consumo < 0 ){
            throw LecturaMenor;
        }else{
            return true;
        }
    }else{
        throw LecturaNull;
    }
}
export async function guardarCuotaFija(data:any){
    try{
        //NOTE: Verificamos los datos del consumo
        if( verificarDatosCoutaFija(data.Consumo)){
            //Enviamo los datoa a la API
            let basicData = obtenerDatosCliente();
            let token = basicData.token;
            //NOTE: damos formato a los datos en la interfaz
            let result = await service.capturarCoutaFija(data,String(token));
            if(result.data.Code == 200){
                return true;
            }else if(result.data.Code == 404){
                throw noRowSelect;
            }else if(result.data.Code == 423){
                throw mesRegistrado;
            }
        }
    }catch(error){
        throw conectionError(error);
    }

}