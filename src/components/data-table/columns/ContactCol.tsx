import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';
import { formatPhoneCL } from '@/utils/format';

export const contactColumn: ColumnDef<Empleado> = {
  id: 'contact',
  header: 'Contacto',
  cell: ({ row }) => {
    const empleado = row.original;
    
    return (
      <div className="info-card">
        <div className="space-y-2">
          {/* J1: Teléfono principal */}
          <div className="font-semibold text-sm">
            {formatPhoneCL(empleado.telefono_particular)}
          </div>
          
          {/* J2: Email */}
          <div className="text-xs text-muted truncate" title={empleado.email_personal}>
            {empleado.email_personal}
          </div>
          
          {/* J3: Dirección */}
          <div className="text-xs text-subtle truncate" title={empleado.direccion}>
            {empleado.direccion}
          </div>
          
          {/* J4: Contacto emergencia */}
          {empleado.contacto_emergencia_nombre && (
            <div className="text-xs text-subtle">
              <span className="truncate" title={empleado.contacto_emergencia_nombre}>
                {empleado.contacto_emergencia_nombre}
              </span>
              <span className="mx-2">•</span>
              <span className="font-mono">
                {formatPhoneCL(empleado.contacto_emergencia_telefono)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
};