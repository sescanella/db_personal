import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';

const getTagColor = (nv: string) => {
  if (nv === 'NV000') return 'bg-aux-gray-dark text-white border-2 border-aux-gray';
  
  // Asignar colores rotativos basado en el número del NV
  const nvNumber = parseInt(nv.replace('NV', ''));
  const colors = [
    'bg-primary text-white border-2 border-primary',           // Naranjo principal
    'bg-aux-blue-dark text-white border-2 border-aux-blue',   // Azul oscuro con borde azul original
    'bg-aux-green-dark text-white border-2 border-aux-green', // Verde oscuro con borde verde original
    'bg-aux-purple-dark text-white border-2 border-aux-purple', // Morado oscuro con borde morado original
    'bg-aux-gold-dark text-white border-2 border-aux-gold',   // Dorado oscuro con borde dorado original
  ];
  
  return colors[nvNumber % colors.length];
};

export const nvColumn: ColumnDef<Empleado> = {
  id: 'nv',
  header: 'NV',
  cell: ({ row }) => {
    const empleado = row.original;
    const displayNV = empleado.nv === 'NV000' || !empleado.nv ? 'NV000' : empleado.nv;
    const isHistorical = displayNV === 'NV000';
    const tagColor = getTagColor(displayNV);

    return (
      <div className="flex justify-center">
        <div 
          className={`${tagColor} font-mono text-xs font-bold px-2 py-1 rounded-full text-center cursor-pointer hover:opacity-80 transition-opacity shadow-sm`}
          title={isHistorical ? 'Registro histórico sin proyecto asignado' : `Proyecto ${displayNV}`}
        >
          {displayNV}
        </div>
      </div>
    );
  },
  size: 80,
};