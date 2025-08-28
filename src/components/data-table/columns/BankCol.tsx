import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';

export const bankColumn: ColumnDef<Empleado> = {
  id: 'bank',
  header: 'Información Bancaria',
  cell: ({ row }) => {
    const empleado = row.original;
    
    return (
      <div className="info-card">
        <div className="space-y-2">
          <div className="font-semibold text-sm">
            {empleado.banco}
          </div>
          
          <div className="text-sm text-muted">
            {empleado.tipo_cuenta}
          </div>
          
          <div className="text-sm text-subtle font-mono">
            {empleado.numero_cuenta}
          </div>
        </div>
      </div>
    );
  },
};