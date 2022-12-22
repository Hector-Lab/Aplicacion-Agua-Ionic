import { capSQLiteChanges, DBSQLiteValues } from '@capacitor-community/sqlite';
import { sqlite,existingConn } from '../App';
import { DBNAME,QUERYTABLES } from '../constantes/constantes';

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

//INDEV: Operaciones
export async function SQLITEInsertarSector(idSuinpac: number,Sector:string){
    let db = await RecuperacConexion();
    await db.open();
    let sa: capSQLiteChanges =  await db.run(ConstructorSector(idSuinpac,Sector));
}
export async function SQLITEObtenerListaSectores(){
    let db = await RecuperacConexion();
    await db.open();
    let lectorSector: DBSQLiteValues = await db.query("SELECT * FROM Sectores");
    lectorSector.values?.map(( Sector:{ id:number,idSuinpac:number,Nombre:string },index )=>{
            console.log(`Datos en la SB: id: ${Sector.id} - idSuinpac: ${Sector.idSuinpac} - Nombre: ${Sector.Nombre}`);
    });
}
export async function SQLITEInsertarAnomalias(id:number,clave:string,descripci_on:string,AplicaFoto:number){
    let db = await RecuperacConexion();
    await db.open();
    let resultAnomalia = await db.run(ConstructorAnomalia(id,clave,descripci_on,AplicaFoto));
    return (resultAnomalia.changes?.changes);
}
export async function SQLITEInsertarConfiguracionUsuario( idUsuario: number,NombreUsuario: string, Email: string, Contrasenia: string ){
    let db = await RecuperacConexion();
    await db.open();
    let resultConfiguracion = await db.run(ConstructorConfiguracionUsuario(idUsuario,NombreUsuario,Email,Contrasenia));
}
export async function SQLITETruncarTablas() {
    let db = await RecuperacConexion();
    await db.open();
    let deleteResult: capSQLiteChanges = await db.execute(`
    DELETE FROM DatosExtra;
    DELETE FROM ConfiguracionUsuario;
    DELETE FROM LecturaAnterior;
    DELETE FROM Evidencia;
    DELETE FROM MetaDatos;
    DELETE FROM Anomalias;
    DELETE FROM Padron;
    DELETE FROM DatosLectura;
    DELETE FROM Sectores;`);
    await db.close();
    return deleteResult.changes != undefined;
}
//INDEV: Funciones internar
function ConstructorSector( idSuinpac:number,Sectores:string ):string {
    return `INSERT INTO Sectores (id,idSuinpac,Nombre) VALUES (NULL,${idSuinpac},"${Sectores}")`;
}
function ConstructorAnomalia(id:number,clave:string,descripci_on:string,AplicaFoto:number) {
    return `INSERT INTO Anomalias (id,idSuinpac,Clave,Descripcion) VALUES (NULL,${id},"${clave}","${descripci_on}","${AplicaFoto}")`;
}
function ConstructorConfiguracionUsuario( idUsuario: number,NombreUsuario: string, Email: string, Contrasenia: string ){
    return `INSERT INTO Anomalias (id,idSuinpac,Clave,Descripcion) VALUES (NULL,${idUsuario},"${NombreUsuario}","${Email}","${Contrasenia}")`;
}
//INDEV: Funciones internar
async function CrearConexion( ) {
    return await sqlite.createConnection(DBNAME,false,"no-encryption",1);
}
async function RecuperacConexion() {
    return await sqlite.retrieveConnection(DBNAME,false);
}
