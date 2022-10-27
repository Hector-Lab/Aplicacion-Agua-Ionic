import { lockClosed, returnUpBackOutline } from "ionicons/icons";

//controlador del LocalStorage
export function restoreUser() {
    let remenberMe = localStorage.getItem("@Storage:recordarUsuario");
    if (remenberMe != null) {
        let value = remenberMe == "true";
        if (value) {
            let user = {
                pass: localStorage.getItem("@Storage:contraseniaX"),
                user: localStorage.getItem("@Storage:usuario"),
                remember: value
            }
            return user;
        } else {
            localStorage.removeItem('@Storage:contraseniaX');
            localStorage.removeItem('"@Storage:usuario"');
            let user = {
                pass: '',
                user: '',
                remember: value
            }
            return user;
        }
    } else {
        let user = {
            pass: '',
            user: '',
            remember: false
        }
        return user;
    }
}
export function guardarDatosCliente(basicData: { usuario: string, idUsuario: Number, cliente: Number, token: string, recordar: boolean, contrasenia: string, userName: string }) {
    basicData.recordar ? localStorage.setItem("@Storage:contraseniaX", basicData.contrasenia) : localStorage.removeItem("@Storage:contraseniaX");
    localStorage.setItem("@Storage:usuario", basicData.usuario);
    localStorage.setItem("@Storage:idUsuario", String(basicData.idUsuario));
    localStorage.setItem("@Storage:cliente", String(basicData.cliente));
    localStorage.setItem("@Storage::userToken", basicData.token);
    localStorage.setItem("@Storage:recordarUsuario", String(basicData.recordar));
    localStorage.setItem("@Storage:userName", basicData.userName);
    console.log(basicData.userName)
}
export function getUsuario() {
    return localStorage.getItem("@Storage:usuario");
}
export function obtenerDatosCliente() {
    let result = {
        cliente: localStorage.getItem("@Storage:cliente"),
        idUsuario: localStorage.getItem("@Storage:idUsuario"),
        token: localStorage.getItem("@Storage::userToken")
    }
    return result;
}
export function guardarContratos(contratos: string) {
    localStorage.setItem("@Storage:contratos", contratos);
}
export function guardarDatosLectura(idLectura: string, contribuyente: string, contratoVigente: string, medidor: string) {
    localStorage.setItem('@Storage:idLectura', idLectura);
    localStorage.setItem('@Storage:nContribuyente', contribuyente);
    localStorage.setItem('@Storage:contratoVigente', contratoVigente);
    localStorage.setItem('@Storage:medidor', medidor);
    return true;
}
export function getDatosLecturaStorage() {
    let lectura = {
        idLectura: localStorage.getItem('@Storage:idLectura'),
        contribuyente: localStorage.getItem('@Storage:nContribuyente'),
        contratoVigente: localStorage.getItem('@Storage:contratoVigente'),
        medidor: localStorage.getItem('@Storage:medidor'),
        //NOTE: TESTING: datos para el guardado de la lectura
        nCliente: localStorage.getItem("@Storage:cliente"),
        token: localStorage.getItem("@Storage::userToken"),
        idUsuario: localStorage.getItem("@Storage:idUsuario")
    }
    return lectura;
}
export function getContratos() {
    let datos = localStorage.getItem("@Storage:contratos");
    return datos;
}
export function guardarDatosEditarLectura(idLectua: string, contrato: string, contribuyente: string, medidor: string) {
    localStorage.setItem('@Storage:editarIdLectura', idLectua);
    localStorage.setItem('@Storage:editarContratoVigente', contrato);
    localStorage.setItem('@Storage:editarNContribuyente', contribuyente);
    localStorage.setItem('@Storage:editarMedidor', medidor);
    return true;
}
export function extraerDatosEditarLectura() {
    let result = {
        idLectura: localStorage.getItem('@Storage:editarIdLectura'),
        contrato: localStorage.getItem('@Storage:editarContratoVigente'),
        contribuyente: localStorage.getItem('@Storage:editarNContribuyente'),
        medidor: localStorage.getItem('@Storage:editarMedidor')
    }
    return result;
}
export function obtenerDatosClienteEditar() {
    let lecturaData = {
        idConsulta: localStorage.getItem('@Storage:editarIdLectura'),
        nCliente: localStorage.getItem('@Storage:cliente'),
    }
    return { datosLectura: lecturaData, token: localStorage.getItem('@Storage::userToken') };
}
export async function cerrarSesion() {
    //Olvidando credenciales
    let remenber = localStorage.getItem("@Storage:recordarUsuario");
    if (remenber == "false") {
        localStorage.removeItem("@Storage:usuario");
        localStorage.removeItem("@Storage:idUsuario");
        localStorage.removeItem("@Storage:cliente");
        localStorage.removeItem("@Storage::userToken");
        localStorage.removeItem("@Storage:contraseniaX");
    } else {
        localStorage.removeItem("@Storage:idUsuario");
        localStorage.removeItem("@Storage:cliente");
        localStorage.removeItem("@Storage::userToken");
    }
    return true
}
export function verifyingSession() {
    /* localStorage.setItem("@Storage::userToken","eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLnNlcnZpY2lvZW5saW5lYS5teFwvYXBpLW1vdmlsXC9sb2dpbi1wcmVzaWRlbnRlUHJ1ZWJhIiwiaWF0IjoxNjIxMzY1OTk0LCJleHAiOjE2MjE0MDE5OTQsIm5iZiI6MTYyMTM2NTk5NCwianRpIjoiV0w3VE9EeUZpQkhWZzZqRSIsInN1YiI6MzgwMCwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSJ9.5aG5sSnugBRIPvmj0QcbhHuqxPfBRkwrxN74bGz1uho");
     */let token = localStorage.getItem("@Storage::userToken");
    return token != null;
}
export function obtenerIdReporte() {
    let reporte = {
        userName: localStorage.getItem("@Storage:userName"),
        id: localStorage.getItem("@Storage:idReporte")
    }
    return reporte;

}
export function obtenerToken() {
    return String(localStorage.getItem("@Storage::userToken"));
}
export function guardarIdReporte(id: number) {
    localStorage.setItem("@Storage:idReporte", String(id));
}
export function contribuyenteBuscado() {
    let data = localStorage.getItem("@Storage:serched");
    if (data == null) {
        return false;
    } else {
        return data === "true";
    }
}
export function setContribuyenteBuscado(value: Boolean) {
    localStorage.setItem("@Storage:serched", String(value));
}
export function setPuntero(value: number){
    localStorage.setItem("@Storage:cursor",String(value))
}
export function getPuntero(){
    let cursor =  localStorage.getItem("@Storage:cursor");
    let puntero = Number(cursor);
    if(isNaN(puntero)){
        return 0;
    }else{
        return puntero
    }
}
export function setNumeroPaginas(value: number){
    localStorage.setItem("@Storage:pages",String(value));
}
export function getNumeroPaginas(){
    let noPages = localStorage.getItem("@Storage:pages");
    let pages = Number(noPages);
    if(isNaN(pages)){
        return 0
    }else{
        return pages;
    }
}
export function deleteContratos(){
    localStorage.removeItem("@Storage:contratos");
}
export async function getLogoStorage(){
    return localStorage.getItem("@Storage:logoCliente");
}
export async function setLogoStorage(logoEncode: string){
    localStorage.setItem("@Storage:logoCliente",logoEncode);
}
export  function setClienteNombreCorto(clienteNombreCorto: string){
    localStorage.setItem("@Storage:clienteNombreCorto",clienteNombreCorto)
}
export  function getClienteNombreCorto() {
    return localStorage.getItem("@Storage:clienteNombreCorto");
}
export  function setContribuyente(contribuyente: string) {
    localStorage.setItem("@Storage:idContribuyente",contribuyente);
}
export  function getContribuyente() {
    return localStorage.getItem("@Storage:idContribuyente");
}
export function setSector(sector: string) {
    localStorage.setItem("@Storage:idSector",sector);
}
export function getSector() {
    return localStorage.getItem("@Storage:idSector");
}
export function clearState(){
    localStorage.removeItem("@Storage:idSector");
    localStorage.removeItem("@Storage:cursor");
    localStorage.removeItem("@Storage:pages");
    localStorage.removeItem("@Storage:lecturaDesde");
    localStorage.removeItem("@Storage:lecturaHasta");
    localStorage.removeItem("@Storage:reporteDesde");
    localStorage.removeItem("@Storage:reporteHasta");
}
export function setFechasHistorialLectura (desde: string, hasta: string) {
    localStorage.setItem("@Storage:lecturaDesde",desde);
    localStorage.setItem("@Storage:lecturaHasta",hasta);
}
export function getFechasHistorialLectura(){
    let datos = localStorage.getItem("@Storage:lecturaDesde");
    if(datos != null){
        let data = {
            desde: localStorage.getItem("@Storage:lecturaDesde"),
            hasta: localStorage.getItem("@Storage:lecturaHasta")
        }
        return data;
    }else{
        return null;
    }
}
export function setFechasHistorialReportes(desde: string, hasta: string){
    localStorage.setItem("@Storage:reporteDesde",desde);
    localStorage.setItem("@Storage:reporteHasta",hasta);
}
export function getFechasHistorialReportes(){
    let dato = localStorage.getItem("@Storage:reporteDesde");
    if(dato!=null){
        let data = {
            desde: localStorage.getItem("@Storage:reporteDesde"),
            hasta: localStorage.getItem("@Storage:reporteHasta")
        }
        return data;
    }else{
        return null;
    }
}
export function setPunteroBusqueda(puntero: number){
    console.log(puntero)
    localStorage.setItem("@Storage:punteroBusqueda",String(puntero));
}
export function getPunteroBusqueda(){
    let data = localStorage.getItem("@Storage:punteroBusqueda");
    let puntero = Number(data);
    if(isNaN(puntero)){
        return 0;
    }else{
        return puntero;
    }
}
export function setPaginasBusqueda(paginas: number){
    localStorage.setItem("@Storage:paginasBusqueda",String(paginas));
}
export function getPaginasBusqueda(){
   let data = localStorage.getItem("@Storage:paginasBusqueda");
   let pages = Number(data);
   if(isNaN(pages)){
       return 0;
   }else{
        return pages;
   }
}
export function setInspeccionPadronAgua(contribuyente: string){
    localStorage.setItem("@Storage:inspeccionPadron",contribuyente);
}
export function getInspeccionPadronAgua(){
    return localStorage.getItem("@Storage:inspeccionPadron");
}
export function obtnerCliente(){
    return localStorage.getItem("@Storage:cliente")
}
export function setCuentasPapas(papas:String){
    localStorage.setItem("@Storage:CuentasPapas",String(papas));
}
export function getCuentasPapas(){
    return localStorage.getItem("@Storage:CuentasPapas") != null ? localStorage.getItem("@Storage:CuentasPapas"): "";
}
export function setContratoCorte(item:string){
    localStorage.setItem("@Storage:ContratoCorte",item);
}
export function getContratoCorte(){
    return localStorage.getItem("@Storage:ContratoCorte") != null ? localStorage.getItem("@Storage:ContratoCorte") : "";
}
export function getIdUsuario(){
    return localStorage.getItem("@Storage:idUsuario") != null ? localStorage.getItem("@Storage:idUsuario") : 0;
}
export function setContratoReporte(idContrato:string){
    localStorage.setItem("@Storage:reporteContrato", idContrato );
}
export function getContratoReporte( ){
    return localStorage.getItem("@Storage:reporteContrato");
}
export function setIdConfiguracion( idConfiguracionCorte:string ){
    localStorage.setItem("@Storage:configuracionCorte",idConfiguracionCorte);
}
export function getIdConfiguracion( ){
    return localStorage.getItem("@Storage:configuracionCorte");
}
export function guardarTareasCortes( listaTareas:string ){
    localStorage.setItem("@Storage:listaTareas",listaTareas);
}
export function guardarIndexTareas( index:string ){
    localStorage.setItem("@Storage:indexTareas",index);
}
export function getIndexTareas(){
    return localStorage.getItem("@Storage:indexTareas");
}
export function getTareasCortes( listaTareas:string ){
    return localStorage.getItem("@Storage:listaTareas");
}
export function setNumeroPaginasTareas( totalPaginas:string ){
    localStorage.setItem("@Storage:totalPaginasTareas",totalPaginas);
}
export function getNumeroPaginasTareas(){
    let datos =  localStorage.getItem("@Storage:totalPaginasTareas")
    return (datos == null || datos == "") ? 0 : parseInt(datos) ;
}
