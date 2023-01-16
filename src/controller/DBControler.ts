import { capSQLiteChanges, capSQLiteResult, DBSQLiteValues, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { sqlite,existingConn } from '../App';
import { DBNAME,QUERYTABLES } from '../constantes/constantes';
import { PadronAguaPotable,LecturaAnteriorContrato,Sector, Anomalias, DatosExtra, DatosLectura,MetaDatos, StructuraEvidencia, Evidencia} from '../Objetos/Interfaces';

//INDEV: Verificadores
export async function CrearTablas(){
    let db = await CrearConexion();
    db.open();
    let result: any = await db.execute(QUERYTABLES);
    console.log(JSON.stringify(result))
    db.close();
}
export async function VerificarTablas(){
    let db = await RecuperacConexion();
    await db.open();
    let sa: DBSQLiteValues = await db.getTableList();
    sa.values?.map((value,index)=>{
        console.log(value);
    })
    await db.close();
}

//SECCION: Seccion de operaciones
export async function SQLITETruncarTablas():Promise<void> {
    try{
        //NOTE: falta validar si existe la base de datos
        
        let db = await RecuperacConexion();
        if(db.isExists()){
            await db.open();
            let eliminarTablaPadron = await db.run("DELETE FROM Padron;");
            let eliminarTablaDatosLectura = await db.run("DELETE FROM DatosLectura;");
            let eliminarTablaSectores = await db.run("DELETE FROM Sectores;");
            let eliminarTablaAnomalias = await db.run("DELETE FROM Anomalias;");
            let eliminarTablaLecturaAnterior = await db.run("DELETE FROM LecturaAnterior;");
            let eliminarTablaConfiguracionUsuario = await db.run("DELETE FROM ConfiguracionUsuario;");
            console.log(`Padron: ${eliminarTablaPadron.changes?.changes}, Lectura: ${eliminarTablaDatosLectura.changes?.changes}, Sectores: ${eliminarTablaSectores.changes?.changes}, Anomalias: ${eliminarTablaAnomalias.changes?.changes}, Lecturas: ${eliminarTablaLecturaAnterior.changes?.changes}, Configuraciones: ${eliminarTablaConfiguracionUsuario.changes?.changes}`);
            await db.close();   
        }else{
            console.log("La base de datos no existe");
        }
    }catch(error){
        return Promise.reject(error);
    }
}
//SECCION: Seccion de insertar
export async function SQLITEInsertarSector(idSuinpac: number,Sector:string){
    let db = await RecuperacConexion();
    await db.open();
    let resultSector: capSQLiteChanges =  await db.run(ConstructorSector(idSuinpac,Sector));
    //await db.close();
    console.log(JSON.stringify(resultSector));
}
export async function SQLITEInsertarAnomalias(id:number,clave:string,descripci_on:string,AplicaFoto:number){
    let db = await RecuperacConexion();
    await db.open();
    let resultAnomalia:capSQLiteChanges = await db.run(ConstructorAnomalia(id,clave,descripci_on,AplicaFoto));
    //await db.close();
    return (resultAnomalia.changes?.changes);
}
export async function SQLITEInsertarConfiguracionUsuario( idUsuario: number,NombreUsuario: string, Email: string, Contrasenia: string ){
    let db = await RecuperacConexion();
    await db.open();
    let resultConfiguracion = await db.run(ConstructorConfiguracionUsuario(idUsuario,NombreUsuario,Email,Contrasenia));
    //await db.close();
}
export async function SQLITEGuardarPadronAgua(Padron:PadronAguaPotable) {
    let db = await RecuperacConexion();
    await db.open();
    let resultInsertPadron:capSQLiteChanges = await db.run(ConstructorPadronAguaPotable(Padron));
    //await db.close();
    return resultInsertPadron.changes?.changes;
}
export async function SQLITEGuardarLecturaAnteriorContrato(LecturaAnterior:LecturaAnteriorContrato){
    let db = await RecuperacConexion();
    await db.open();
    let resultInsertLecturaAnterior = await db.run(ContructorPadronAguaPotableLecturaAnterior(LecturaAnterior));
    //await db.close();
    return resultInsertLecturaAnterior.changes?.changes;
}
export async function SQLITEInsertarDatosExtra( Nombre:string,Valor:string,Descripcion:string ){
    try{
        let db = await RecuperacConexion();
        await db.open();
        let resultInsertarDatoExtra:capSQLiteChanges = await db.run(ConstructorDatosExtra(Nombre,Valor,Descripcion));
        //await db.close();
        return Promise.resolve(resultInsertarDatoExtra.changes?.changes);
    }catch(error){
        return Promise.reject(error);
    }
}

export async function SQLITEInsertarEvidencia(Evidencia: StructuraEvidencia ,Padron:number){
    try {

        let queryToma = ( (Evidencia.Toma != null && Evidencia.Toma != "") ? ConstructorEvidencia(Evidencia.Toma,"Toma",Padron) : "" );
        let queryFachada = ( (Evidencia.Fachada != null && Evidencia.Fachada != "") ? ConstructorEvidencia(Evidencia.Fachada,"Facha",Padron) : "" );
        let queryCalle = ( (Evidencia.Calle != null && Evidencia.Calle != "") ? ConstructorEvidencia(Evidencia.Calle,"Calle",Padron) : "" );
        let db = await RecuperacConexion();
        await db.open();
        let resultInsertEvidenciaToma:capSQLiteChanges = await db.run(queryToma);
        let resultInsertEvidenciaFachada:capSQLiteChanges = await db.run(queryFachada);
        let resultInsertEvidenciaCalle:capSQLiteChanges = await db.run(queryCalle);

        await db.close();
        return Promise.resolve(`Evidencia toma: ${resultInsertEvidenciaToma.changes?.lastId} Evidencia toma: ${resultInsertEvidenciaFachada.changes?.lastId} Evidencia toma: ${resultInsertEvidenciaCalle.changes?.lastId}`);
    }catch( error ){
        return Promise.reject(error);
    }
}
export async function SQLITEInsertarLecturaActual(LecturaActual:DatosLectura){
    try{
        let db = await RecuperacConexion();
        await db.open();
        let resultLecturaActual:capSQLiteChanges = await db.run(ConstructorLecturaActual(LecturaActual));
        await db.close();
        return Promise.resolve(resultLecturaActual.changes?.changes);
    }catch( error ){
        return Promise.reject(error);
    }
}
export async function SQLITEInsertatGeoreferencia( Coordenadas:MetaDatos  ){
    try{
        let db = await RecuperacConexion();
        await db.open();
        let resultCoordenadas:capSQLiteChanges = await db.run(ConstructorGeocordenadas(Coordenadas));
        await db.close();
        return Promise.resolve(resultCoordenadas.changes?.changes);
    }catch( error ){
        return Promise.reject(error);
    }
}
//SECCION: seccion de borrado
export async function SQLITEBorrarLecturaActual( Padron:number ):Promise<void>{
    try{
        let db = await RecuperacConexion();
        await db.open();
        let resultBorrarLectura = await db.run(`DELETE FROM DatosLectura WHERE Padron = ${Padron}`);
        let resultBorrarEvidencias = await db.run(`DELETE FROM Evidencia WHERE idPadron = ${Padron}`);
        let resultBorrarGeoreferecnia = await db.run(`DELETE FROM MetaDatos WHERE idblectura = ${Padron}`);
        console.error(`Eliminando Lectrua: ${resultBorrarLectura.changes?.changes} Eliminando Evidencias: ${resultBorrarEvidencias.changes?.changes} EliminarMetadatos ${resultBorrarGeoreferecnia.changes?.changes}`);
    }catch( error ){
        return Promise.reject(error);
    }
}

//SECCION: Seccion de lectura
export async function SQLITEObtenerListaBaseDatos():Promise<void>{
    /*try{
        let db = await RecuperacConexion();
        let arreglo:Array<Sector> = new Array();
        await db.open();
        let lectorSector: DBSQLiteValues = await db.query("SELECT * FROM Sectores;");
        console.log(JSON.stringify(lectorSector));
        lectorSector.values?.map(( Sector:Sector,index:number )=>{
            arreglo.push(Sector);
        });
        await db.close();
        return Promise.resolve(arreglo);
    }catch(error){
        return Promise.reject(error)
    }*/
}
export async function SQLITEObtenerListaSectores():Promise<Array<Sector>>{
    try{
        let db = await RecuperacConexion();
        let listaSectores:Array<Sector> = new Array();
        await db.open();
        let lectorSector: DBSQLiteValues = await db.query("SELECT * FROM Sectores;");
        lectorSector.values?.map(( Sector:Sector,index:number )=>{
            Sector.id = Sector.idSuinpac;
            Sector.Sector = Sector.Nombre;
            listaSectores.push(Sector);
        });
        await db.close();
        return Promise.resolve(listaSectores);
    }catch(error){
        return Promise.reject(error)
    }
}
export async function SQLITEObtenerContratosFiltroContrato( Contrato:string ):Promise<Array<PadronAguaPotable>>{
    try {
        let db = await RecuperacConexion();
        let listaContratos:Array<PadronAguaPotable> = new Array();
        await db.open();
        let lectorContratos: DBSQLiteValues = await db.query(`SELECT * FROM Padron WHERE ContratoVigente LIKE '%${Contrato}%'`);
        console.error(JSON.stringify(lectorContratos));
        lectorContratos.values?.map(( Padron:PadronAguaPotable,index:number )=>{
            listaContratos.push(Padron);
        });
        await db.close();
        return Promise.resolve(listaContratos);
    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerContratosFiltroMedidor(Medidor:string):Promise<Array<PadronAguaPotable>> {
    try{
        let db = await RecuperacConexion();
        let listaContratos: Array<PadronAguaPotable> = new Array();
        await db.open();
        let lectorContratos: DBSQLiteValues = await db.query(`SELECT * FROM Padron WHERE Medidor LIKE '%${Medidor}%'`);
        console.log(JSON.stringify(lectorContratos));
        lectorContratos.values?.map(( Padron:PadronAguaPotable,index:number )=>{
            listaContratos.push(Padron);
        });
        await db.close();
        return Promise.resolve(listaContratos);
    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerTotalContratosPadron(idSector:number):Promise<number>{
    try{
        let db = await RecuperacConexion();
        await db.open();
        let totalContratos: DBSQLiteValues = await db.query(`SELECT COUNT(id) as Total FROM Padron WHERE idSector = ${idSector}`);
        if(totalContratos.values !== undefined ){
            await db.close();
            return Promise.resolve(parseInt(totalContratos.values[0].Total));
        }else{
            await db.close();
            return Promise.resolve(-1);
        }
    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerPadronPagina(idSector:number, Offset:number ):Promise<Array<PadronAguaPotable>>{
    try{
        let db = await RecuperacConexion();
        let listaContrato: Array<PadronAguaPotable> = new Array();
        await db.open();
        let contratosPagina: DBSQLiteValues = await db.query(`SELECT * FROM Padron WHERE idSector = ${idSector} LIMIT 20 OFFSET ${Offset * 20}`);
        contratosPagina.values?.map(( Padron:PadronAguaPotable,index:number ) => {
            listaContrato.push(Padron);
        });
        await db.open();
        return listaContrato;
    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerLecturaContrato(idContrato:number):Promise<LecturaAnteriorContrato> {
    try { // LecturaAnterior
        let db = await RecuperacConexion();
        await db.open();
        let Lectura: Array<LecturaAnteriorContrato> = new Array();
        let lecturaContrato: DBSQLiteValues = await db.query(`SELECT * FROM LecturaAnterior WHERE idPadron = ${idContrato}`);
        lecturaContrato.values?.map((lectura:LecturaAnteriorContrato,index:number) => {
            Lectura.push(lectura);
        });
        console.log(JSON.stringify(lecturaContrato));
        await db.close();
        return Promise.resolve(Lectura[0]);
    }catch(error){
        return Promise.reject(error);
    }

}
export async function SQLITEObtenerAnomaliasAgua( ):Promise<Array<Anomalias>>{
    try {
        let db = await RecuperacConexion();
        await db.open();
        let ListaAnomalias: Array<Anomalias> = new Array();
        let lectorAnomalias: DBSQLiteValues = await db.query(`SELECT * FROM Anomalias`);
        lectorAnomalias.values?.map(( anomalia:Anomalias,index:number )=>{
            ListaAnomalias.push(anomalia);
        });
        await db.close();
        return Promise.resolve(ListaAnomalias);
    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerAnomalia(Clave:number):Promise<{id:number, idSuinpac:number , Clave:string, Descripcion:string,AplicaFoto:number}> {
    try {
        let db = await RecuperacConexion();
        await db.open();
        let listaAnomalia:Array<{id:number, idSuinpac:number , Clave:string, Descripcion:string,AplicaFoto:number}> = new Array();
        let lectorAnomalias: DBSQLiteValues = await db.query(`SELECT * FROM Anomalias WHERE Clave = ${Clave}`);
        lectorAnomalias.values?.map(( anomalia:{id:number, idSuinpac:number , Clave:string, Descripcion:string,AplicaFoto:number}, index:number ) => {
            listaAnomalia.push(anomalia);
        });
        return Promise.resolve(listaAnomalia[0]);
    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerDatoExtra(nombreDato:string):Promise<DatosExtra>{
    try{
        let db = await RecuperacConexion();
        await db.open();
        let listaDatosExtra: Array<DatosExtra> = new Array();
        let lectorDatosExtra: DBSQLiteValues = await db.query(`SELECT * FROM DatosExtra WHERE Nombre = "${nombreDato}"`);
        lectorDatosExtra.values?.map((datosExtra:DatosExtra,index:number)=>{
            listaDatosExtra.push(datosExtra);
        });
        await db.close();
        return Promise.resolve(listaDatosExtra[0]);
    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerLecturaActual( Padron:number ):Promise<DatosLectura|null>{
    try{
        let db = await RecuperacConexion();
        await db.open();
        let listaLectura: Array<DatosLectura> = new Array();
        let lectorLecturaActual: DBSQLiteValues = await db.query(`SELECT * FROM DatosLectura WHERE idbLectura = ${Padron}`);
        lectorLecturaActual.values?.map(( Lectura:DatosLectura )=>{
            listaLectura.push(Lectura);
        })
        await db
        if(listaLectura.length > 0){
            return Promise.resolve(listaLectura[0]);
        }else{
            return Promise.resolve(null);
        }
    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerEvidencias( Padron:number ): Promise<Array<Evidencia>> {
    try{
        let db = await RecuperacConexion();
        await db.open();
        let listaEvidencias: Array<Evidencia> = new Array();
        let lectorEvidencias: DBSQLiteValues = await db.query(`SELECT * FROM Evidencia`);
        lectorEvidencias.values?.map(( evidencia:Evidencia, index:number )=>{
            listaEvidencias.push(evidencia);
        });
        await db.close();
        return Promise.resolve(listaEvidencias);
    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerGeoreferencia( Padron:number ) {
    try {
        let db = await RecuperacConexion();
        await db.open();
        let listaGeoreferencia: Array<MetaDatos> = new Array();
        let lectorGeoreferencia: DBSQLiteValues = await db.query(`SELECT * FROM MetaDatos WHERE idblectura = ${ Padron }`);
        lectorGeoreferencia.values?.map(( metadatos:MetaDatos, index:number )=>{
            listaGeoreferencia.push(metadatos);
        })
        await db.close();
        return Promise.resolve(listaGeoreferencia[0]);
    }catch( error ){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerListaLecturas(){
    try {
        let db = await RecuperacConexion();
        await db.open();
        let listaLecturas:Array<DatosLectura> = new Array();
        let lectorListaLecturas = await db.query("SELECT * FROM DatosLectura");
        lectorListaLecturas.values?.map(( Lectura:DatosLectura,index:number )=>{
            listaLecturas.push(Lectura);
        });
        await db.close();
        return Promise.resolve(listaLecturas);

    }catch(error){
        return Promise.reject(error);
    }
}
export async function SQLITEObtenerContratoVigente(idPadron:number):Promise<string>{
    try{
        let db = await RecuperacConexion();
        await db.open();
        let contratoVigente:string = "";
        let lectorContrato:DBSQLiteValues = await db.query(`SELECT * FROM Padron WHERE Padron = ${idPadron}`);
        lectorContrato.values?.map(( padron:PadronAguaPotable,index:number )=>{
            contratoVigente = padron.ContratoVigente;
        });
        await db.close();
        return Promise.resolve(contratoVigente);
    }catch(error){
        return Promise.reject(error);
    }
}
//INDEV: Funciones internar
function ConstructorSector( idSuinpac:number,Sectores:string ):string {
    return `INSERT INTO Sectores (id,idSuinpac,Nombre) VALUES (NULL,${idSuinpac},"${Sectores}")`;
}
function ConstructorAnomalia(id:number,clave:string,descripci_on:string,AplicaFoto:number):string{
    return `INSERT INTO Anomalias (id,idSuinpac,Clave,Descripcion,AplicaFoto) VALUES (NULL,${id},"${clave}","${descripci_on}","${AplicaFoto}")`;
}
function ConstructorConfiguracionUsuario( idUsuario: number,NombreUsuario: string, Email: string, Contrasenia: string ):string{
    //(${AUTOINCREMENT},idUsuario INTEGER, NombreUsuario TEXT, Email TEXT, Contrasenia TEXT)
    return `INSERT INTO ConfiguracionUsuario (id,idUsuario,NombreUsuario,Email,Contrasenia) VALUES (NULL,${idUsuario},"${NombreUsuario}","${Email}","${Contrasenia}")`;
}
function ConstructorPadronAguaPotable( Padron:PadronAguaPotable ):string {
    return `INSERT INTO Padron (id,ContratoVigente ,Contribuyente , Estatus,MetodoCobro, Medidor, Toma, Padron,idSector) VALUES (NULL,"${Padron.ContratoVigente}","${Padron.Contribuyente}","${Padron.Estatus}","${Padron.MetodoCobro}","${Padron.Medidor}","${Padron.Toma}","${Padron.Padron}","${Padron.idSector}")`;
}
function ContructorPadronAguaPotableLecturaAnterior(LecturaAnteriorio:LecturaAnteriorContrato){
    return `INSERT INTO LecturaAnterior (id,idPadron,A_no,Direccion,LecturaActual,LecturaAnterior,Localidad,MetodoCobro,Mes,Municipio,TipoToma,Toma,BloquearCampos,ValorLectura,Promedio) VALUES (NULL,${LecturaAnteriorio.idPadron},"${LecturaAnteriorio.A_no}","${LecturaAnteriorio.Direccion}","${LecturaAnteriorio.LecturaActual}","${LecturaAnteriorio.LecturaAnterior}","${LecturaAnteriorio.Localidad}","${LecturaAnteriorio.MetodoCobro}","${LecturaAnteriorio.Mes}","${LecturaAnteriorio.Municipio}","${LecturaAnteriorio.TipoToma}","${LecturaAnteriorio.Toma}","${LecturaAnteriorio.BloquearCampos}","0",${LecturaAnteriorio.Promedio})`;
}
function ConstructorDatosExtra( Nombre:string,Valor:string,Descripcion:string ){
    return `INSERT INTO DatosExtra (id,Nombre,Valor,Descripcion) VALUES (NULL,"${Nombre}","${Valor}","${Descripcion}")`;
}
function ConstructorEvidencia( Direccion:string,Tipo:string,Padron:number ){
    //(${AUTOINCREMENT},idPadron INTEGER, DireccionFisica TEXT, Tipo TEXT)
    return `INSERT INTO Evidencia (id,idPadron,DireccionFisica,Tipo) VALUES (NULL,"${Padron}","${Direccion}","${Tipo}");`;
}
function ConstructorLecturaActual( LecturaActual:DatosLectura ){
    //${AUTOINCREMENT},idbLectura INTEGER, LecturaAnterior INTEGER,LecturaActual INTEGER, PresentaAnomalia INTEGER, Consumo INTEGER, MesCaptua INTEGER, AnioCaptua INTEGER, idAnomalia INTEGER, TipoCoordenada INTEGER,Lectura INTEGER, Cliente INTEGER, Padron INTEGER
    return `INSERT INTO DatosLectura
            (id,idbLectura,LecturaAnterior,LecturaActual,PresentaAnomalia,Consumo,MesCaptua,AnioCaptua,idAnomalia,TipoCoordenada,Lectura,Cliente,Padron) VALUES
            (NULL,"${LecturaActual.idbLectura}","${LecturaActual.LecturaAnterior}","${LecturaActual.LecturaActual}","${LecturaActual.PresentaAnomalia}",
            "${LecturaActual.Consumo}","${LecturaActual.MesCaptua}","${LecturaActual.AnioCaptua}","${LecturaActual.idAnomalia}","${LecturaActual.TipoCoordenada}",
            "${LecturaActual.Lectura}","${LecturaActual.Cliente}","${LecturaActual.Padron}")`;
}
function ConstructorGeocordenadas( Coordenadas:MetaDatos ){
    //(${AUTOINCREMENT},idUsuario INTEGER ,Latitud TEXT, Longitud TEXT, Ruta INTEGER, idblectura INTEGER)
    return `INSERT INTO MetaDatos (id, idUsuario,Latitud,Longitud,Ruta,idblectura) VALUES (NULL,"${Coordenadas.idUsuario}","${Coordenadas.Latitud}","${Coordenadas.Longitud}","${Coordenadas.Ruta}","${Coordenadas.idblectura}")`;
}
//INDEV: Funciones internar
async function CrearConexion( ) {
    return await sqlite.createConnection(DBNAME,false,"no-encryption",1);
}
async function RecuperacConexion() {
    return await sqlite.retrieveConnection(DBNAME,false);
}
