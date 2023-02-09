export const DBNAME = "DBL";
const AUTOINCREMENT = "id INTEGER PRIMARY KEY AUTOINCREMENT";
export const DEBBUG = false;
export const QUERYTABLES = `
CREATE TABLE IF NOT EXISTS Sectores (${AUTOINCREMENT} ,idSuinpac INTEGER, Nombre TEXT );
CREATE TABLE IF NOT EXISTS DatosLectura (${AUTOINCREMENT},idbLectura INTEGER, LecturaAnterior INTEGER,LecturaActual INTEGER, PresentaAnomalia INTEGER, Consumo INTEGER, MesCaptua INTEGER, AnioCaptua INTEGER, idAnomalia INTEGER, TipoCoordenada INTEGER,Lectura INTEGER, Cliente INTEGER, Padron INTEGER);
CREATE TABLE IF NOT EXISTS Padron (${AUTOINCREMENT},ContratoVigente TEXT,Contribuyente TEXT, Estatus INTEGER,MetodoCobro INTEGER, Medidor TEXT, Toma TEXT, Padron INTEGER,idSector INTEGER,Promedio INTEGER);
CREATE TABLE IF NOT EXISTS Anomalias (${AUTOINCREMENT}, idSuinpac INTEGER , Clave TEXT, Descripcion TEXT,AplicaFoto INTEGER);
CREATE TABLE IF NOT EXISTS MetaDatos (${AUTOINCREMENT},idUsuario INTEGER ,Latitud TEXT, Longitud TEXT, Ruta INTEGER, idblectura INTEGER);
CREATE TABLE IF NOT EXISTS Evidencia (${AUTOINCREMENT},idPadron INTEGER, DireccionFisica TEXT, Tipo TEXT);
CREATE TABLE IF NOT EXISTS LecturaAnterior(${AUTOINCREMENT},idPadron INTEGER,iA_no INTEGER, Direccion TEXT,LecturaActual INTEGER, LecturaAnterior INTEGER, Localidad TEXT, MetodoCobro INTEGER, Mes INTEGER,Municipio TEXT, TipoToma INTEGER, Toma TEXT, BloquearCampos INTEGER, ValorLectura INTEGER,Promedio INTEGER);
CREATE TABLE IF NOT EXISTS ConfiguracionUsuario(${AUTOINCREMENT},idUsuario INTEGER, NombreUsuario TEXT, Email TEXT, Contrasenia TEXT);
CREATE TABLE IF NOT EXISTS DatosExtra (${AUTOINCREMENT},Nombre TEXT, Valor TEXT, Descripcion TEXT );`;
export const TIPOTOMA = 
[
'Domestica',
'Residencial',
'Comercial',
'Industrial',
'Tarifa Especial',
'Fija',
'Publica',
'Micro Comercial',
'Domestica Popular',
'Domestica Medio',
'Domestica Residencial',
'Domestica - Alcantarillado',
'Comercial - Alcantarillado',
'Industrial - Alcantarillado',
'Contrato',
'Comercial B',
'Comercia C',
'Comercia E',
'Dometico Residencial Medio',
'Domestico Residencial Alto',
'Domestica Localidades',
'Predio Publico',
'Dometica Cabecera Municipal.',
'Dometica Atliaca y Acatempa.',
'Dometica Almolonga y Zoquiapa.',
'Dometica Otras Localidades.',
'Mixta - Alcantarillado',
'Especial - Alcantarillado',
'Mixta',
'Tarifa Especial'
]
