import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface LinkData {
  nv: string;
  count: number;
  url: string;
}

interface LinkGeneratorDashboardProps {
  onClose: () => void;
  sessionEndTime: number;
  onExtendSession: () => void;
}

export function LinkGeneratorDashboard({ onClose, sessionEndTime, onExtendSession }: LinkGeneratorDashboardProps) {
  const [newNV, setNewNV] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  // Get existing NV codes with employee counts
  const { data: nvData, isLoading, refetch } = useQuery({
    queryKey: ['nv-links'],
    queryFn: async (): Promise<LinkData[]> => {
      const { data, error } = await supabase
        .from('empleados')
        .select('nv')
        .not('nv', 'is', null);

      if (error) throw error;

      // Count employees by NV code
      const nvCounts = data.reduce((acc: Record<string, number>, item) => {
        acc[item.nv] = (acc[item.nv] || 0) + 1;
        return acc;
      }, {});

      // Convert to LinkData format
      return Object.entries(nvCounts).map(([nv, count]) => ({
        nv,
        count,
        url: `${window.location.origin}/formulario?nv=${nv}`
      }));
    }
  });

  // Session warning management
  useEffect(() => {
    const checkSessionTime = () => {
      const remaining = sessionEndTime - Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (remaining <= fiveMinutes && remaining > 0) {
        setShowSessionWarning(true);
      } else {
        setShowSessionWarning(false);
      }
    };

    checkSessionTime();
    const interval = setInterval(checkSessionTime, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [sessionEndTime]);

  const getRemainingSessionTime = () => {
    const remaining = Math.max(0, Math.ceil((sessionEndTime - Date.now()) / 1000));
    return {
      minutes: Math.floor(remaining / 60),
      seconds: remaining % 60
    };
  };

  const validateNVInput = (input: string): boolean => {
    return /^\d{3}$/.test(input);
  };

  const generateNVLink = async () => {
    if (!validateNVInput(newNV)) {
      setGenerationError('Debe ingresar exactamente 3 dígitos (ej: 499)');
      return;
    }

    const nvCode = `NV${newNV}`;
    
    // Check if NV already exists
    const existingNV = nvData?.find(item => item.nv === nvCode);
    if (existingNV) {
      setGenerationError(`El código ${nvCode} ya existe`);
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      // Generate URL
      const url = `${window.location.origin}/formulario?nv=${nvCode}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      
      // Refresh the list
      await refetch();
      
      // Clear input
      setNewNV('');
      
      // Show success (could be a toast notification)
      alert(`✅ Link ${nvCode} creado y copiado al portapapeles!\n\n${url}`);
      
    } catch (error) {
      setGenerationError('Error al generar el link');
      console.error('Error generating link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (url: string, nvCode: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert(`✅ Link ${nvCode} copiado al portapapeles!`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('❌ Error al copiar al portapapeles');
    }
  };

  const { minutes, seconds } = getRemainingSessionTime();
  const totalLinks = nvData?.length || 0;
  const totalEmployees = nvData?.reduce((sum, item) => sum + item.count, 0) || 0;
  const historicalCount = nvData?.find(item => item.nv === 'NV000')?.count || 0;

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
          <span className="text-2xl">🔗</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Generador de Links - BD Personal
        </h2>
        <div className="h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full mx-8"></div>
      </div>

      {/* Session Warning */}
      {showSessionWarning && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">⚠️ Sesión por expirar</p>
              <p className="text-yellow-300 text-xs">Tiempo restante: {minutes}m {seconds}s</p>
            </div>
            <button
              onClick={onExtendSession}
              className="btn-secondary text-xs px-3 py-1"
            >
              Extender
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface border border-default rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">{totalLinks}</div>
          <div className="text-xs text-muted">Links Activos</div>
        </div>
        <div className="bg-surface border border-default rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{totalEmployees}</div>
          <div className="text-xs text-muted">Total Empleados</div>
        </div>
        <div className="bg-surface border border-default rounded-lg p-3 text-center col-span-2 md:col-span-1">
          <div className="text-2xl font-bold text-gray-400">{historicalCount}</div>
          <div className="text-xs text-muted">Históricos</div>
        </div>
      </div>

      {/* Generate New Link */}
      <div className="bg-elevated border border-default/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">➕ Generar Nuevo Link</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="bg-surface border border-default rounded-l-lg px-3 py-2 text-sm text-muted">
                NV
              </span>
              <input
                type="text"
                value={newNV}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                  setNewNV(value);
                  if (generationError) setGenerationError('');
                }}
                placeholder="499"
                maxLength={3}
                className="input-base rounded-l-none flex-1"
              />
            </div>
            {generationError && (
              <p className="text-red-400 text-xs mt-1">{generationError}</p>
            )}
            {newNV && validateNVInput(newNV) && (
              <p className="text-green-400 text-xs mt-1">
                Se creará: NV{newNV}
              </p>
            )}
          </div>
          <button
            onClick={generateNVLink}
            disabled={!validateNVInput(newNV) || isGenerating}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="loading w-4 h-4"></div>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Crear</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Links List */}
      <div className="bg-elevated border border-default/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">📋 Links Activos</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="loading w-8 h-8 mx-auto mb-2"></div>
            <p className="text-muted">Cargando links...</p>
          </div>
        ) : !nvData || nvData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted mb-2">No hay links generados</p>
            <p className="text-sm text-subtle">Crea el primer link usando el formulario de arriba</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {nvData.map((item) => (
              <div
                key={item.nv}
                className="flex items-center justify-between p-3 bg-surface border border-default/30 rounded-lg hover:bg-elevated/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                      item.nv === 'NV000' 
                        ? 'bg-gray-100 text-gray-600 border border-gray-300' 
                        : 'bg-orange-50 text-orange-800 border border-orange-200'
                    }`}>
                      {item.nv === 'NV000' ? 'HISTÓRICO' : item.nv}
                    </div>
                    <div className="text-sm text-muted">
                      {item.count} empleado{item.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-xs text-subtle truncate mt-1">
                    {item.url}
                  </div>
                </div>
                {item.nv !== 'NV000' && (
                  <button
                    onClick={() => copyToClipboard(item.url, item.nv)}
                    className="btn-secondary text-xs px-3 py-1 ml-2"
                    title="Copiar al portapapeles"
                  >
                    📋 Copiar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-default/30">
        <div className="text-xs text-subtle">
          Sesión: {minutes}m {seconds}s restantes
        </div>
        <button
          onClick={onClose}
          className="btn-secondary"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}