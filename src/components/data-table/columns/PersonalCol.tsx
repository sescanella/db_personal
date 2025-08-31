import type { ColumnDef } from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';
import { fullName, formatRUT, formatDateCL, edadFrom } from '@/utils/format';

// Función para obtener información del país
const getCountryInfo = (countryCode: string): { flagUrl: string; name: string } => {
  if (!countryCode || countryCode.length !== 2) {
    return { 
      flagUrl: 'https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/flags/xx.svg',
      name: 'Desconocido' 
    };
  }

  const code = countryCode.toLowerCase();
  
  // Mapa de países con nombres
  const countryNames: { [key: string]: string } = {
    'cl': 'Chile',
    'ar': 'Argentina',
    'pe': 'Perú',
    'bo': 'Bolivia',
    've': 'Venezuela',
    'co': 'Colombia',
    'br': 'Brasil',
    'us': 'Estados Unidos',
    'es': 'España',
    'mx': 'México',
    'ec': 'Ecuador',
    'uy': 'Uruguay',
    'py': 'Paraguay',
  };
  
  return {
    flagUrl: `https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/flags/${code}.svg`,
    name: countryNames[code] || countryCode.toUpperCase()
  };
};

export const personalColumn: ColumnDef<Empleado> = {
  id: 'personal',
  header: 'Información Personal',
  cell: ({ row }) => {
    const empleado = row.original;
    const nombre = fullName(empleado.nombre, empleado.apellido, empleado.segundo_apellido);
    const edad = edadFrom(empleado.fecha_nacimiento);
    const fechaFormatted = formatDateCL(empleado.fecha_nacimiento);
    const countryInfo = getCountryInfo(empleado.pais_nacimiento);

    return (
      <div className="info-card relative">
        {/* Badge de bandera circular en esquina superior derecha */}
        <div 
          className="absolute top-2 right-2 w-6 h-6 rounded-full overflow-hidden border-2 border-white/20 shadow-sm"
          title={`País: ${countryInfo.name}`}
        >
          <img
            src={countryInfo.flagUrl}
            alt={`Bandera de ${countryInfo.name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback si la imagen no carga
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-gray-500 flex items-center justify-center text-white text-xs font-bold">${empleado.pais_nacimiento?.toUpperCase() || '??'}</div>`;
              }
            }}
          />
        </div>
        
        <div className="space-y-1.5">
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