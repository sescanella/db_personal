import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';

export const previsionColumn: ColumnDef<Empleado> = {
  id: 'prevision',
  header: 'Previsión',
  cell: ({ row }) => {
    const empleado = row.original;

    return (
      <div className="info-card">
        <div className="space-y-1.5">
          <div className="font-semibold text-sm text-primary">
            {empleado.fondo_cotizacion}
          </div>

          <div className="text-xs text-muted">
            {empleado.salud}
          </div>

          <div className="text-xs text-muted">
            {empleado.afc}
          </div>
        </div>
      </div>
    );
  },
};