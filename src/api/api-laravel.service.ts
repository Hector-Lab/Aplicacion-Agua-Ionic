import axios from 'axios'
import { returnUpBackOutline } from 'ionicons/icons';
export class APIservice {
    //llamada a la api en la
    getAuth(data: object) {
        return axios.post(`https://api.servicioenlinea.mx/api-movil/login-presidentePrueba`, data)
    }
    verificarUsuarioLecturista(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/verificarUsuarioLecturistaPrueba`, data, { headers });
    }
    buscarSectores(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post('https://api.servicioenlinea.mx/api-movil/buscarSectores', data, { headers })
    }
    buscarLecturasPorSector(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/datosLecturaPorSector`, data, { headers });
    }
    extraesDatosLectura(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post('https://api.servicioenlinea.mx/api-movil/extrarDatosLecturaPrueba', data, { headers })
    }
    guardarDatosLectura(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/guardarDatosLecturaPrueba`, data, { headers })
    }
    extraerHistorial(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/extraerHistorialPrueba`, data, { headers });
    }
    extraerDatoseditar(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/extraerDatosEditarPrueba`, data, { headers });
    }
    actualizarDatosLectura(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/actualizarRegistroPrueba`, data, { headers });
    }
    crearReporte(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/crearReportePrueba`, data, { headers });
    }
    extraerHistorialReportes(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/listaReportes`, data, { headers });
    }
    extraerReporte(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/extraerReporte`, data, { headers });
    }
    extraerContribuyente(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/datosLecturaAguaPrueba`, data, { headers });
    }
    extraerNumeroItems(data: object, token: String) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/paginas`, data, { headers });
    }
    extraerPromedioContribuyente(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/obtenerConsumoPromedio`, data, { headers });
    }
    obtenerLogoCliente(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/extraerLogo`, data, { headers });
    }
    extraerContactoContribuyente(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/extraerContribuyente`, data, { headers });
    }
    guardarContribuyente(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/guardarContribuyente`,data,{headers});
    }
    extraerNumeroItemsBusqueda(data: object,token:string){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/paginasBusqueda`,data,{headers});
    }
    obtenerContribuyenteInspeccion(data:object, token:string){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/inspeccionContribuyente`,data,{headers});
    }
    obtenerDatosContribuyentePorPadron(data: object,token:String){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/obtenerPadronContribyenteDatos`,data,{headers})
    }
    obtenerDatosSectorPalabraClave(data: object,token: String){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post("https://api.servicioenlinea.mx/api-movil/buscarSectorPalabraClave",data,{headers});
    }
    obtenerNumeroItemsBusquedaSector(data:object,token: String){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post("https://api.servicioenlinea.mx/api-movil/paginasBusqueaSector",data,{headers});
    }
    obtenerPromedioEditar(data:object,token:String){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post("https://api.servicioenlinea.mx/api-movil/ObtenerPromedioEditar",data,{headers});
    }
    buscarPorContrato(data:object,token:string){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/buscarPorContrato`,data,{headers})
    }
    buscarPorMedidor(data:object,token:string){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/buscarPorMedidor`,data,{headers})
    }
    capturarCoutaFija(data:object,token:string){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/consumo`,data,{headers})
    }
    obtenerDatosContratoCorte( data: object, token: string){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/DatosTomaCorte`,data,{headers});
    }
    realizarCorteTomaSuinpac( data: object ,token: string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/RealizarCorte`,data,{headers});
    }
}

