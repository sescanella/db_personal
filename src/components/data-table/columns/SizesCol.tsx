import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';

export const sizesColumn: ColumnDef<Empleado> = {
  id: 'sizes',
  header: 'Tallas',
  cell: ({ row }) => {
    const empleado = row.original;

    return (
      <div className="info-card">
        <div className="space-y-1.5">
          <div className="text-xs text-muted flex items-center justify-between">
            <span>Superior:</span>
            <span className="font-medium text-primary">{empleado.talla_superior || 'N/A'}</span>
          </div>

          <div className="text-xs text-muted flex items-center justify-between">
            <span>Inferior:</span>
            <span className="font-medium text-primary">{empleado.talla_inferior || 'N/A'}</span>
          </div>

          <div className="text-xs text-muted flex items-center justify-between">
            <span>Zapato:</span>
            <span className="font-medium text-primary">{empleado.talla_zapato || 'N/A'}</span>
          </div>
        </div>
      </div>
    );
  },
};