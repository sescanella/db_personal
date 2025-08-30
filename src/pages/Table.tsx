import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listEmpleados, getEmpleadosQueryKey } from '@/services/empleados';
import type { ListEmpleadosParams } from '@/types/empleados';
import { DataTable } from '@/components/data-table/DataTable';
import {
  nvColumn,
  personalColumn,
  contactColumn,
  bankColumn,
  previsionColumn,
  sizesColumn,
} from '@/components/data-table/columns';
import { FiltersBar } from '@/components/FiltersBar';
import { ErrorState } from '@/components/ErrorState';
import logoBlanco from '@/assets/logo-horizontal-blanco.svg';

const columns = [
  nvColumn,
  personalColumn,
  contactColumn,
  bankColumn,
  previsionColumn,
  sizesColumn,
];

export function Table() {
  const [params, setParams] = useState<ListEmpleadosParams>({
    sort: { field: 'created_at', asc: false },
    page: 1,
    pageSize: 100, // Load more for virtualization
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: getEmpleadosQueryKey(params),
    queryFn: () => listEmpleados(params),
  });

  const handleParamsChange = (newParams: ListEmpleadosParams) => {
    setParams({
      ...newParams,
      page: 1,
      pageSize: 100,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-7xl mx-auto p-4 xl:p-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between p-4 h-20">
            <h1 className="text-3xl font-mono text-white">
              BD DEL PERSONAL
            </h1>
            <img
              src={logoBlanco}
              alt="Logo empresa"
              className="h-15 object-contain"
            />
          </div>

          <FiltersBar
            value={params}
            onChange={handleParamsChange}
            totalResults={response?.count || 0}
          />
        </div>

        {/* Data Table */}
        <div className="glass-effect rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="p-4 border-b border-default">
            <div className="table-grid font-medium text-lg" style={{ color: '#d56301' }}>
              <div className="text-center">PROYECTO</div>
              <div className="text-center">PERSONAL</div>
              <div className="text-center">CONTACTO</div>
              <div className="text-center">BANCARIA</div>
              <div className="text-center">PREVISIÓN</div>
              <div className="text-center">TALLAS</div>
            </div>
          </div>

          {/* Table Content */}
          <div
            ref={scrollRef}
            className="h-[700px] overflow-y-auto overflow-x-hidden"
            style={{ contain: 'strict' }}
          >
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <div className="loading w-12 h-12 mx-auto"></div>
                  <div className="text-muted">Cargando empleados...</div>
                </div>
              </div>
            )}

            {error && <ErrorState error="Error al cargar empleados" />}

            {response?.error && <ErrorState error={response.error} />}

            {response && !response.error && response.data.length === 0 && (
              <div className="text-center py-20 space-y-6">
                <div className="text-6xl opacity-50">🔍</div>
                <div>
                  <h3 className="text-lg font-semibold text-muted mb-2">
                    No se encontraron empleados
                  </h3>
                  <p className="text-sm text-subtle">
                    Intenta ajustar los filtros de búsqueda para encontrar más resultados
                  </p>
                </div>
              </div>
            )}

            {response && !response.error && response.data.length > 0 && (
              <DataTable
                data={response.data}
                columns={columns}
                parentRef={scrollRef}
              />
            )}
          </div>

          {/* Footer */}
          {response && !response.error && response.data.length > 0 && (
            <div className="p-4 border-t border-default/30 bg-gradient-to-r from-surface/50 to-elevated/50">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-muted">
                  <span>📊 Mostrando {response.data.length} de {response.count || 0} empleados</span>
                  {response.count && response.count > response.data.length && (
                    <span className="text-subtle">
                      • Carga más desplazándote hacia abajo
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-subtle">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>Conectado</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}