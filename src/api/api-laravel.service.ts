import axios from 'axios'
import { returnUpBackOutline } from 'ionicons/icons';
export class APIservice {
    //llamada a la api en la
    getAuth(data: object) {
        return axios.post(`https://api.servicioenlinea.mx/api-movil/login-presidentePrueba`, data)
    }
    //FIXED:
    verificarUsuarioLecturista(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/VerificarUsuario`, data, { headers });
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
    //FIXME: esta es una vercion vieja para enviar los datos de la captura 
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
    listarCortesUsuario( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/listaCortes`,data,{headers});
    }
    //FIXED: Rutas con nuevo controlador
    buscarContratoReporte( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/ReporteBuscarContrato`,data,{headers});
    }
    //FIXED:
    realizarReporteContrato( data: object, token:string ) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/crearReporteV2`,data,{headers});
    }
    //FIXED:
    realizarReporteMedidor( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/ReporteBuscarMedidor`, data , {headers});
    }
    //FIXED:
    obtenerConfiguracion( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        };
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/ConfiguracionCoutaFija`,data,{headers});
    }
    //FIXED:
    obtenerConfiguracionFotografia( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        };
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/ConfiguracionEvidencia`,data,{headers});
    }
    //FIXED: metodos para guardar las fotos de forma ordenada
    guardarDatosLecturaV2(data: object, token: string) {
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/GuardarLecturaV3`, data, { headers })
    }
    //FIXED:
    guardarCoutaFijaV2( data: object, token: string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/GuardarCoutaFija`,data,{headers})
    }
    //FIXED:
    guardarReporte( data:object, token: string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/GuardarReporteAgua`,data,{headers});
    }
    //FIXED:
    RealizarCorteV2( data: object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/RealizarCorte`,data,{ headers });
    }
    //FIXED:
    ObtenerHistorialLecturas( data:object, token: string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/HistorialLecturas`,data,{headers});
    }
    //FIXED:
    ObtenerConfiguracionCortes( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/verificarUsuarioCortes`,data,{headers});
    }
    //FIXED:
    ObtenerListaTareas( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/TareasCortes`,data,{headers});
    }
    //FIXED:
    BuscarContratoCorte( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/BuscarCortePorContrato`,data,{headers});
    }
    //FIXED:
    BuscarMedidorCorte( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/BuscarCortePorMedidor`,data,{headers});
    }
    //FIXED:
    MultarContratoAPI( data:object, token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/AppAgua/MultarToma`,data,{headers});
    }
    ObtenerContratosLecturaSector( data:object,token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/test/ContratosSector`,data,{headers});
    }
    ObtenerPadronAnomalias( data:object,token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/test/PadronAguaAnomalias`,data,{headers});
    }
    ObtenerConfiguracionAgua( data:object,token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/test/ObtenerConfiguracionesAgua`,data,{headers});
    }
    ObtenerContractosSector( data:object,token:string ){
        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer' + token
        }
        return axios.post(`https://api.servicioenlinea.mx/api-movil/test/ContratosSector`,data,{headers});
    }
}

