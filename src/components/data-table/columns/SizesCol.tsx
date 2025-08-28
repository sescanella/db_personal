import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';

export const sizesColumn: ColumnDef<Empleado> = {
  id: 'sizes',
  header: 'Tallas',
  cell: ({ row }) => {
    const empleado = row.original;
    
    return (
      <div className="info-card">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted">Superior:</span>{' '}
            <span className="font-medium">{empleado.talla_superior || 'N/A'}</span>
          </div>
          
          <div className="text-sm">
            <span className="text-muted">Inferior:</span>{' '}
            <span className="font-medium">{empleado.talla_inferior || 'N/A'}</span>
          </div>
          
          <div className="text-sm">
            <span className="text-muted">Zapato:</span>{' '}
            <span className="font-medium">{empleado.talla_zapato || 'N/A'}</span>
          </div>
        </div>
      </div>
    );
  },
};