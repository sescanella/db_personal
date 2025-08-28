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
        <div className="space-y-2">
          <div className="font-semibold text-base">
            {nombre}
          </div>
          
          <div className="text-sm text-muted">
            {formatRUT(empleado.numero_documento)}
          </div>
          
          <div className="text-sm text-subtle">
            {fechaFormatted} ({edad} años)
          </div>
          
          <div className="text-xs text-subtle">
            <span>{empleado.sexo}</span>
            <span className="mx-2">•</span>
            <span>{empleado.estado_civil}</span>
          </div>
        </div>
      </div>
    );
  },
};