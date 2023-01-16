export const DBNAME = "DBL";
const AUTOINCREMENT = "id INTEGER PRIMARY KEY AUTOINCREMENT";
export const QUERYTABLES = `
CREATE TABLE IF NOT EXISTS Sectores (${AUTOINCREMENT} ,idSuinpac INTEGER, Nombre TEXT );
CREATE TABLE IF NOT EXISTS DatosLectura (${AUTOINCREMENT},idbLectura INTEGER, LecturaAnterior INTEGER,LecturaActual INTEGER, PresentaAnomalia INTEGER, Consumo INTEGER, MesCaptua INTEGER, AnioCaptua INTEGER, idAnomalia INTEGER, TipoCoordenada INTEGER,Lectura INTEGER, Cliente INTEGER, Padron INTEGER);
CREATE TABLE IF NOT EXISTS Padron (${AUTOINCREMENT},ContratoVigente TEXT,Contribuyente TEXT, Estatus INTEGER,MetodoCobro INTEGER, Medidor TEXT, Toma TEXT, Padron INTEGER,idSector INTEGER,Promedio INTEGER);
CREATE TABLE IF NOT EXISTS Anomalias (${AUTOINCREMENT}, idSuinpac INTEGER , Clave TEXT, Descripcion TEXT,AplicaFoto INTEGER);
CREATE TABLE IF NOT EXISTS MetaDatos (${AUTOINCREMENT},idUsuario INTEGER ,Latitud TEXT, Longitud TEXT, Ruta INTEGER, idblectura INTEGER);
CREATE TABLE IF NOT EXISTS Evidencia (${AUTOINCREMENT},idPadron INTEGER, DireccionFisica TEXT, Tipo TEXT);
CREATE TABLE IF NOT EXISTS LecturaAnterior(${AUTOINCREMENT},idPadron INTEGER, A_no INTEGER, Direccion TEXT,LecturaActual INTEGER, LecturaAnterior INTEGER, Localidad TEXT, MetodoCobro INTEGER, Mes INTEGER,Municipio TEXT, TipoToma INTEGER, Toma TEXT, BloquearCampos INTEGER, ValorLectura INTEGER,Promedio INTEGER);
CREATE TABLE IF NOT EXISTS ConfiguracionUsuario(${AUTOINCREMENT},idUsuario INTEGER, NombreUsuario TEXT, Email TEXT, Contrasenia TEXT);
CREATE TABLE IF NOT EXISTS DatosExtra (${AUTOINCREMENT},Nombre TEXT, Valor TEXT, Descripcion TEXT );`;
export const TIPOTOMA = 
{
1:'Domestica',
2:'Residencial',
3:'Comercial',
4:'Industrial',
5:'Tarifa Especial',
6:'Fija',
7:'Publica',
8:'Micro Comercial',
9:'Domestica Popular',
10:'Domestica Medio',
11:'Domestica Residencial',
12:'Domestica - Alcantarillado',
13:'Comercial - Alcantarillado',
14:'Industrial - Alcantarillado',
15:'Contrato',
16:'Comercial B',
18:'Comercia C',
20:'Comercia E',
21:'Dometico Residencial Medio',
22:'Domestico Residencial Alto',
23:'Domestica Localidades',
24:'Predio Publico',
25:'Dometica Cabecera Municipal.',
26:'Dometica Atliaca y Acatempa.',
27:'Dometica Almolonga y Zoquiapa.',
28:'Dometica Otras Localidades.',
29:'Mixta - Alcantarillado',
30:'Especial - Alcantarillado',
31:'Mixta',
32:'Tarifa Especial'
}