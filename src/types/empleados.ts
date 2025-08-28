// src/types/empleados.ts
import { z } from 'zod';

// Enum values based on DB constraints from DB-MIGRATIONS.md
export const SEXO_OPTIONS = ['Masculino', 'Femenino'] as const;
export const ESTADO_CIVIL_OPTIONS = ['Casado/a', 'Divorciado/a', 'Soltero/a', 'Viudo/a', 'Acuerdo de Unión Civil', 'Separado/a'] as const;
export const BANCO_OPTIONS = ['CHILE EDWARDS', 'BANCOESTADO', 'SCOTIABANK', 'BCI TBANC', 'CORPBANCA', 'BICE', 'HSBC', 'SANTANDER', 'ITAU', 'SECURITY', 'BBVA', 'DEL DESARROLLO', 'FALABELLA', 'RIPLEY', 'RABOBANK', 'CONSORCIO', 'PARIS', 'INTERNACIONAL'] as const;
export const TIPO_CUENTA_OPTIONS = ['Cuenta Corriente', 'Cuenta de Ahorro', 'Cuenta Vista'] as const;
export const FONDO_COTIZACION_OPTIONS = ['Capital', 'Cuprum', 'Habitat', 'Modelo', 'PlanVital', 'ProVida', 'Uno'] as const;
export const SALUD_OPTIONS = ['Fonasa', 'Banmedica', 'Colmena', 'Consalud', 'Cruz Blanca', 'Nueva Masvida', 'Vida Tres', 'Banco Estado', 'ISALUD', 'Cruz del Norte', 'Esencial', 'No Cotiza Salud'] as const;
export const AFC_OPTIONS = ['Menos de 11 Años', 'Más de 11 Años', 'No Cotiza'] as const;
export const TALLA_SUPERIOR_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export const TALLA_INFERIOR_OPTIONS = ['38 (S)', '40 (M)', '42 (M)', '44 (L)', '46 (L)', '48 (XL)', '50 (XL)', '52 (XXL)', '54 (XXL)', '56 (XXL)', '58 (XXL)', '60 (XXL)'] as const;

// Base schema for empleados table
export const EmpleadoSchema = z.object({
  id: z.string().uuid(),
  
  // Personal identity
  nombre: z.string().min(1, 'Nombre es requerido'),
  apellido: z.string().min(1, 'Apellido es requerido'),
  segundo_apellido: z.string().optional(),
  numero_documento: z.string().min(1, 'Número de documento es requerido'),
  pais_nacimiento: z.string().min(2, 'País de nacimiento es requerido'), // ISO code
  sexo: z.enum(SEXO_OPTIONS),
  estado_civil: z.enum(ESTADO_CIVIL_OPTIONS),
  fecha_nacimiento: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed < new Date();
  }, 'Fecha de nacimiento inválida'),
  
  // Contact information
  telefono_particular: z.string().min(1, 'Teléfono particular es requerido'), // E.164 format expected
  email_personal: z.string().email('Email inválido'),
  comuna: z.string().min(1, 'Comuna es requerida'),
  ciudad: z.string().min(1, 'Ciudad es requerida'),
  direccion: z.string().min(1, 'Dirección es requerida'),
  calle: z.string().optional(),
  numero_calle: z.string().optional(),
  depto_oficina: z.string().optional(),
  
  // Emergency contact
  contacto_emergencia_nombre: z.string().min(1, 'Nombre de contacto de emergencia es requerido'),
  contacto_emergencia_telefono: z.string().min(1, 'Teléfono de contacto de emergencia es requerido'),
  
  // Banking information
  banco: z.enum(BANCO_OPTIONS),
  tipo_cuenta: z.enum(TIPO_CUENTA_OPTIONS),
  numero_cuenta: z.string().min(1, 'Número de cuenta es requerido'),
  
  // Social security/health
  fondo_cotizacion: z.enum(FONDO_COTIZACION_OPTIONS),
  salud: z.enum(SALUD_OPTIONS),
  afc: z.enum(AFC_OPTIONS),
  
  // Sizes (optional)
  talla_superior: z.enum(TALLA_SUPERIOR_OPTIONS).optional(),
  talla_inferior: z.enum(TALLA_INFERIOR_OPTIONS).optional(),
  talla_zapato: z.number().int().min(36).max(46).optional(),
  
  // Metadata
  created_at: z.string().optional(),
});

// Input schema for creating new empleados (omit id and created_at)
export const EmpleadoInputSchema = EmpleadoSchema.omit({
  id: true,
  created_at: true,
});

// TypeScript types
export type Empleado = z.infer<typeof EmpleadoSchema>;
export type EmpleadoInput = z.infer<typeof EmpleadoInputSchema>;

// Filter/search types
export interface ListEmpleadosParams {
  search?: string;
  sort?: { field: keyof Empleado; asc: boolean } | null;
  filters?: {
    sexo?: string;
    salud?: string;
    fondo_cotizacion?: string;
    estado_civil?: string;
  };
  page?: number;
  pageSize?: number;
}

// API response types
export interface ListEmpleadosResponse {
  data: Empleado[];
  count: number | null;
  error: string | null;
}

export interface InsertEmpleadoResponse {
  data: Empleado | null;
  error: string | null;
}