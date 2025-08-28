// src/services/empleados.ts
import { supabase } from '@/lib/supabase';
import type { 
  Empleado, 
  EmpleadoInput, 
  ListEmpleadosParams, 
  ListEmpleadosResponse, 
  InsertEmpleadoResponse 
} from '@/types/empleados';

const PAGE_SIZE = 20; // Default from README.md

export async function listEmpleados(params: ListEmpleadosParams = {}): Promise<ListEmpleadosResponse> {
  try {
    const {
      search = '',
      sort = { field: 'created_at', asc: false }, // Default: created_at desc
      filters = {},
      page = 1,
      pageSize = PAGE_SIZE,
    } = params;

    // Build query
    let query = supabase
      .from('empleados')
      .select('*', { count: 'exact' });

    // Apply search (OR conditions)
    if (search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      query = query.or(
        `nombre.ilike.${searchPattern},apellido.ilike.${searchPattern},numero_documento.ilike.${searchPattern},email_personal.ilike.${searchPattern}`
      );
    }

    // Apply filters (AND conditions)
    if (filters.sexo) {
      query = query.eq('sexo', filters.sexo);
    }
    if (filters.salud) {
      query = query.eq('salud', filters.salud);
    }
    if (filters.fondo_cotizacion) {
      query = query.eq('fondo_cotizacion', filters.fondo_cotizacion);
    }
    if (filters.estado_civil) {
      query = query.eq('estado_civil', filters.estado_civil);
    }

    // Apply sorting
    if (sort) {
      query = query.order(sort.field, { ascending: sort.asc });
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching empleados:', error);
      return {
        data: [],
        count: null,
        error: error.message,
      };
    }

    return {
      data: data as Empleado[],
      count,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error in listEmpleados:', error);
    return {
      data: [],
      count: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function insertEmpleado(empleadoData: EmpleadoInput): Promise<InsertEmpleadoResponse> {
  try {
    const { data, error } = await supabase
      .from('empleados')
      .insert([empleadoData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting empleado:', error);
      return {
        data: null,
        error: error.message,
      };
    }

    return {
      data: data as Empleado,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error in insertEmpleado:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// React Query hooks
export const EMPLEADOS_QUERY_KEY = 'empleados';

export function getEmpleadosQueryKey(params: ListEmpleadosParams = {}) {
  return [EMPLEADOS_QUERY_KEY, params] as const;
}