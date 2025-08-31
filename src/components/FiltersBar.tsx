import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ListEmpleadosParams } from '@/types/empleados';

interface FiltersBarProps {
  value: ListEmpleadosParams;
  onChange: (params: ListEmpleadosParams) => void;
  totalResults?: number;
  onOpenLinkGenerator?: () => void;
}

const SORT_OPTIONS = [
  { value: JSON.stringify({ field: 'created_at', asc: false }), label: 'Más recientes', icon: '⬇️' },
  { value: JSON.stringify({ field: 'created_at', asc: true }), label: 'Más antiguos', icon: '⬆️' },
  { value: JSON.stringify({ field: 'nombre', asc: true }), label: 'Nombre A-Z', icon: '🔤' },
  { value: JSON.stringify({ field: 'nombre', asc: false }), label: 'Nombre Z-A', icon: '🔤' },
];

export function FiltersBar({ value, onChange, totalResults, onOpenLinkGenerator }: FiltersBarProps) {
  const [searchInput, setSearchInput] = useState(value.search || '');
  const [isSearching, setIsSearching] = useState(false);

  // Get unique NV codes from database
  const { data: nvCodes } = useQuery({
    queryKey: ['unique-nv-codes'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('empleados')
        .select('nv')
        .not('nv', 'is', null)
        .order('nv', { ascending: true });

      if (error) throw error;

      // Get unique NV codes
      const uniqueNVs = [...new Set(data.map(item => item.nv))];
      return uniqueNVs;
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  // Debounce search with loading state
  useEffect(() => {
    if (searchInput !== (value.search || '')) {
      setIsSearching(true);
    }
    
    const timer = setTimeout(() => {
      onChange({ ...value, search: searchInput.trim() || undefined });
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSortChange = (sortJson: string) => {
    const sort = sortJson ? JSON.parse(sortJson) : null;
    onChange({ ...value, sort });
  };

  const handleFilterChange = (filterKey: keyof NonNullable<ListEmpleadosParams['filters']>, filterValue: string) => {
    const filters = { ...value.filters };
    
    if (filterValue) {
      filters[filterKey] = filterValue;
    } else {
      delete filters[filterKey];
    }
    
    onChange({ ...value, filters: Object.keys(filters).length > 0 ? filters : undefined });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    onChange({ 
      search: undefined, 
      sort: { field: 'created_at', asc: false }, 
      filters: undefined 
    });
  };

  const activeFilters = value.filters ? Object.entries(value.filters).filter(([_, v]) => v) : [];
  const hasActiveFilters = !!(value.search || activeFilters.length > 0);
  const activeFiltersCount = activeFilters.length + (value.search ? 1 : 0);

  const getFilterChipLabel = (key: string, value: string) => {
    const labels: { [key: string]: string } = {
      sexo: '👤',
      salud: '⚕️',
      fondo_cotizacion: '🏦',
      estado_civil: '💑',
      nv: '🏗️'
    };
    return `${labels[key] || '🔍'} ${value}`;
  };

  const removeFilter = (filterKey: string) => {
    if (filterKey === 'search') {
      setSearchInput('');
      return;
    }
    handleFilterChange(filterKey as keyof NonNullable<ListEmpleadosParams['filters']>, '');
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center">
          {/* Results Counter */}
          {totalResults !== undefined && (
            <div className="bg-surface border border-default rounded-lg px-3 py-2 min-h-[44px] min-w-[130px] flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm">👥</span>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-primary leading-none">
                    {totalResults.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted leading-none mt-0.5">
                    Registros
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isSearching ? (
                <div className="loading w-4 h-4"></div>
              ) : (
                <span className="text-muted">🔍</span>
              )}
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre, apellido, RUT o email..."
              className="input-base w-full pl-10 pr-4"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="interactive-icon text-muted hover:text-primary">✕</span>
              </button>
            )}
          </div>
          
          {/* Sort and Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={value.sort ? JSON.stringify(value.sort) : JSON.stringify({ field: 'created_at', asc: false })}
                onChange={(e) => handleSortChange(e.target.value)}
                className="select-base min-w-[140px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <select
                value={value.filters?.nv || ''}
                onChange={(e) => handleFilterChange('nv', e.target.value)}
                className="select-base min-w-[120px]"
              >
                <option value="">🏗️ Todas las NV</option>
                {nvCodes?.map((nv) => (
                  <option key={nv} value={nv}>
                    {nv === 'NV000' ? '📄' : '🏗️'} {nv === 'NV000' ? 'Históricos' : nv}
                  </option>
                ))}
              </select>
            </div>

            {onOpenLinkGenerator && (
              <div className="relative">
                <button
                  onClick={onOpenLinkGenerator}
                  className="bg-surface border border-input rounded-lg px-3 py-2 min-h-[44px] min-w-[80px] flex items-center justify-center gap-2 text-base hover:border-primary hover:bg-primary/5 hover:scale-105 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 ease-in-out"
                  title="Administrar Links de Proyecto"
                >
                  <span>🔗</span>
                  <span>Links</span>
                </button>
              </div>
            )}
            
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="btn-secondary flex items-center gap-2"
              >
                <span>🧹</span>
                <span>Limpiar</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Additional filter info */}
        {hasActiveFilters && totalResults !== undefined && (
          <div className="mt-4 pt-4 border-t border-default/30 flex items-center justify-end">
            <div className="text-xs text-subtle">
              Con {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {value.search && (
            <div className="filter-chip">
              <span>🔍 "{value.search}"</span>
              <button
                onClick={() => removeFilter('search')}
                className="filter-chip-remove"
              >
                ✕
              </button>
            </div>
          )}
          {activeFilters.map(([key, value]) => (
            <div key={key} className="filter-chip">
              <span>{getFilterChipLabel(key, value)}</span>
              <button
                onClick={() => removeFilter(key)}
                className="filter-chip-remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}