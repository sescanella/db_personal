// Valores constantes según DB-MIGRATIONS.md

export const BANCOS = [
  'CHILE EDWARDS',
  'BANCOESTADO', 
  'SCOTIABANK',
  'BCI TBANC',
  'CORPBANCA',
  'BICE',
  'HSBC',
  'SANTANDER',
  'ITAU',
  'SECURITY',
  'BBVA',
  'DEL DESARROLLO',
  'FALABELLA',
  'RIPLEY',
  'RABOBANK',
  'CONSORCIO',
  'PARIS',
  'INTERNACIONAL'
].map(banco => ({ value: banco, label: banco }))

export const TIPOS_CUENTA = [
  'Cuenta Corriente',
  'Cuenta de Ahorro', 
  'Cuenta Vista'
].map(tipo => ({ value: tipo, label: tipo }))

export const ESTADOS_CIVIL = [
  'Casado/a',
  'Divorciado/a',
  'Soltero/a', 
  'Viudo/a',
  'Acuerdo de Unión Civil',
  'Separado/a'
].map(estado => ({ value: estado, label: estado }))

export const SEXOS = [
  'Masculino',
  'Femenino'
].map(sexo => ({ value: sexo, label: sexo }))

export const AFPS = [
  'Capital',
  'Cuprum',
  'Habitat',
  'Modelo',
  'PlanVital',
  'ProVida',
  'Uno'
].map(afp => ({ value: afp, label: afp }))

export const SALUD = [
  'Fonasa',
  'Banmedica',
  'Colmena',
  'Consalud',
  'Cruz Blanca',
  'Nueva Masvida',
  'Vida Tres',
  'Banco Estado',
  'ISALUD Isapre de Codelco',
  'Cruz del Norte',
  'Esencial',
  'No Cotiza Salud'
].map(salud => ({ value: salud, label: salud }))

export const AFC = [
  'Menos de 11 Años',
  'Más de 11 Años',
  'No Cotiza'
].map(afc => ({ value: afc, label: afc }))

export const TALLAS_SUPERIOR = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL'
].map(talla => talla)

export const TALLAS_INFERIOR = [
  '38 (S)', '40 (M)', '42 (M)', '44 (L)', '46 (L)', 
  '48 (XL)', '50 (XL)', '52 (XXL)', '54 (XXL)', 
  '56 (XXL)', '58 (XXL)', '60 (XXL)'
].map(talla => talla)

export const TALLAS_ZAPATO = [
  36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46
].map(talla => talla)