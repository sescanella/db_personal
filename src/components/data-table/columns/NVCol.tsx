import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';

export const nvColumn: ColumnDef<Empleado> = {
  id: 'nv',
  header: 'Proyecto',
  cell: ({ row }) => {
    const empleado = row.original;
    const isHistorical = empleado.nv === 'NV000';

    return (
      <div className="info-card">
        <div>
          <div 
            className={`font-mono text-xs font-semibold px-3 py-2 rounded text-center cursor-pointer hover:opacity-80 transition-opacity ${
              isHistorical 
                ? 'bg-gray-100 text-gray-600 border border-gray-300' 
                : 'bg-orange-50 text-orange-800 border border-orange-200'
            }`}
            title={isHistorical ? 'Registro histórico sin proyecto asignado' : `Proyecto ${empleado.nv}`}
          >
            {isHistorical ? 'HISTÓRICO' : empleado.nv}
          </div>
        </div>
      </div>
    );
  },
  size: 100,
};