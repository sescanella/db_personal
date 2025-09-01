import { useState, useEffect } from 'react';
import { LinkGeneratorDashboard } from './LinkGeneratorDashboard';

interface LinkGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_PASSWORD = '76142966-3';
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function LinkGeneratorModal({ isOpen, onClose }: LinkGeneratorModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionEndTime, setSessionEndTime] = useState<number | null>(null);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsAuthenticated(false);
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  // Check lockout status
  useEffect(() => {
    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      setIsLocked(true);
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLockoutEndTime(null);
        setAttempts(0);
      }, lockoutEndTime - Date.now());
      return () => clearTimeout(timer);
    }
  }, [lockoutEndTime]);

  // Session timeout management
  useEffect(() => {
    if (isAuthenticated) {
      const endTime = Date.now() + SESSION_TIMEOUT;
      setSessionEndTime(endTime);
      
      const timer = setTimeout(() => {
        setIsAuthenticated(false);
        setSessionEndTime(null);
        setError('Sesión expirada. Ingresa la clave nuevamente.');
      }, SESSION_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Demasiados intentos fallidos. Espera 5 minutos.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAttempts(0);
      setPassword('');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setLockoutEndTime(Date.now() + LOCKOUT_TIME);
        setError(`Clave incorrecta. Bloqueado por 5 minutos tras ${MAX_ATTEMPTS} intentos.`);
      } else {
        setError(`Clave incorrecta. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`);
      }
      setPassword('');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError('');
    onClose();
  };

  const getRemainingLockoutTime = () => {
    if (!lockoutEndTime) return 0;
    return Math.max(0, Math.ceil((lockoutEndTime - Date.now()) / 1000));
  };


  const extendSession = () => {
    const newEndTime = Date.now() + SESSION_TIMEOUT;
    setSessionEndTime(newEndTime);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-default rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {!isAuthenticated ? (
          // Authentication Form
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Acceso Organizador
              </h2>
              <div className="h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full mx-8"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Clave de Acceso
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked || isLoading}
                  className="input-base w-full"
                  placeholder="Ingresa la clave"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                  {isLocked && (
                    <p className="text-red-300 text-xs mt-1">
                      Tiempo restante: {getRemainingLockoutTime()}s
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!password.trim() || isLocked || isLoading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="loading w-4 h-4"></div>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <span>🔑</span>
                      <span>Ingresar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Dashboard Content
          <LinkGeneratorDashboard 
            onClose={handleClose}
            sessionEndTime={sessionEndTime!}
            onExtendSession={extendSession}
          />
        )}
      </div>
    </div>
  );
}