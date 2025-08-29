import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';
import { fullName, formatRUT, formatDateCL, edadFrom } from '@/utils/format';

export const personalColumn: ColumnDef<Empleado> = {
  id: 'personal',
  header: 'Información Personal',
  cell: ({ row }) => {
    const empleado = row.original;
    const nombre = fullName(empleado.nombre, empleado.apellido, empleado.segundo_apellido);
    const edad = edadFrom(empleado.fecha_nacimiento);
    const fechaFormatted = formatDateCL(empleado.fecha_nacimiento);

    return (
      <div className="info-card">
        <div className="space-y-1.5 flex flex-col justify-center h-full">
          <div className="font-semibold text-sm text-primary">
            {nombre}
          </div>

          <div className="text-xs text font-mono">
            {formatRUT(empleado.numero_documento)}
          </div>

          <div className="text-xs text-muted">
            {fechaFormatted} ({edad} años)
          </div>

          <div className="text-xs text-muted flex items-center gap-2">
            <span>{empleado.sexo}</span>
            <span>•</span>
            <span>{empleado.estado_civil}</span>
          </div>
        </div>
      </div>
    );
  },
};