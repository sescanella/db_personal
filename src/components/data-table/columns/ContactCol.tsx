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
        <div className="space-y-1.5">
          <div className="font-semibold text-sm text-primary font-mono">
            {formatPhoneCL(empleado.telefono_particular)}
          </div>

          <div className="text-xs text font-mono" title={empleado.email_personal}>
            {empleado.email_personal}
          </div>

          <div className="text-xs text-muted truncate" title={empleado.direccion}>
            {empleado.direccion}
          </div>

          <div className="text-xs text-muted flex items-center gap-2">
            <span>{empleado.contacto_emergencia_nombre}</span>
            <span>•</span>
            <span>{formatPhoneCL(empleado.contacto_emergencia_telefono)}</span>
          </div>
        </div>
      </div>
    );
  },
};