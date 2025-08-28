import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';

export const previsionColumn: ColumnDef<Empleado> = {
  id: 'prevision',
  header: 'Previsión',
  cell: ({ row }) => {
    const empleado = row.original;
    
    return (
      <div className="info-card">
        <div className="space-y-2">
          <div className="font-semibold text-sm">
            {empleado.fondo_cotizacion}
          </div>
          
          <div className="text-sm text-muted">
            {empleado.salud}
          </div>
          
          <div className="text-sm text-subtle">
            {empleado.afc}
          </div>
        </div>
      </div>
    );
  },
};