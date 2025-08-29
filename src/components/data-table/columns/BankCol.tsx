import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';

export const bankColumn: ColumnDef<Empleado> = {
  id: 'bank',
  header: 'Información Bancaria',
  cell: ({ row }) => {
    const empleado = row.original;

    return (
      <div className="info-card">
        <div className="space-y-1.5">
          <div className="font-semibold text-sm text-primary">
            {empleado.banco}
          </div>

          <div className="text-xs text-muted">
            {empleado.tipo_cuenta}
          </div>

          <div className="text-xs text-muted font-mono bg-orange-500/10 rounded px-1 py-0.5">
            {empleado.numero_cuenta}
          </div>
        </div>
      </div>
    );
  },
};