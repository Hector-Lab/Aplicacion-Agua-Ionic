export interface ContratoAPI {
    A_no: number,
    Consumo: number,
    ContratoAnterior: string,
    ContratoVigente: string,
    Contribuyente: string,
    Cuenta: string,
    Diametro: number,
    Domicilio: string,
    Estatus: number,
    LecturaActual: number,
    LecturaAnterior: number,
    Localidad: string,
    Lote: string,
    M_etodoCobro: number,
    Manzana: string,
    Medidor: string,
    Mes: string,
    Municipio: string,
    NumeroDomicilio: string,
    Observaci_on: string,
    Ruta: string,
    Status: number,
    TipoToma: string,
    id: number,
    Toma:number,
    Promedio:number
    //Metodos de la interfaz
}
export interface LecturaAnteriorContrato{
    id:number,
    idPadron:number,
    A_no:number,
    Direccion:string,
    LecturaActual:number, 
    LecturaAnterior:number,
    Localidad:string,
    MetodoCobro:number,
    Mes:number,
    Municipio:string,
    TipoToma:string,
    Toma:number,
    BloquearCampos:string,
    Promedio:number
}
export interface PadronAguaPotable{
    id:number,
    ContratoVigente:string,
    Contribuyente:string,
    Estatus:number ,
    MetodoCobro:number,
    Medidor:string,
    Toma:number,
    Padron:number,
    idSector:number,
}
export interface Sector{
    id:number,
    idSuinpac:number,
    Nombre:string,
    Sector:string
}
export interface Anomalias{
    id:number,
    clave:string,
    descripci_on:string,
    AplicaFoto:number
}
export interface DatosExtra{
    id:number,
    Nombre:string,
    Valor: string,
    Descripcion:string
}
export interface DatosLectura {
    id:number,
    idbLectura: number,
    LecturaAnterior: number,
    LecturaActual: number,
    PresentaAnomalia: number,
    Consumo: number,
    MesCaptua: number,
    AnioCaptua: number,
    idAnomalia: number,
    TipoCoordenada: number,
    Lectura: number,
    Cliente: number,
    Padron: number
}
export interface MetaDatos {
    id:number,
    idUsuario:number,
    Latitud:string,
    Longitud:string,
    Ruta:string,
    idblectura:number
}
export interface Evidencia {
    id:number,
    idPadron:number,
    DireccionFisica:string,
    Tipo:string
}
export interface TotalDatosLecturas {
    route:string,
    lecturaAnterior:number,
    lecturaActual:number,
    consumoFinal: number,
    mesCaptura: number,
    anhioCaptura: number,
    fechaCaptura: string,
    anomalia: string,
    tipoCoordenada: 1,
    arregloFotos: StructuraEvidencia,
    comparaMes: number,
    comparaAnio: number,
    lectura: 1,
    arrayAnios: any[],
    indexAnio: number,
    mesLectura: number,
    nCliente: number,
    token: string,
    idUsuario: number,
    idToma: number,
    Latidude: string,
    Longitude: string
}
export interface StructuraEvidencia {
    Toma: string,
    Fachada: string,
    Calle: string
}
export interface ConfiguracionUsuario {
    id: number
    idUsuario: number,
    NombreUsuario: string,
    Email:string,
    Contrasenia:string
}