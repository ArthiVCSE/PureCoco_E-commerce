import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/formatCurrency';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const ToastItem = ({ toast, onRemove }) => {
  const Icon = icons[toast.type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded shadow-card animate-slide-up',
        'bg-white dark:bg-coconut-light border border-coconut/10 dark:border-cream/10',
        'min-w-[280px] max-w-sm'
      )}
      role="alert"
    >
      <Icon
        size={20}
        className={cn(
          toast.type === 'success' && 'text-natural',
          toast.type === 'error' && 'text-red-500',
          toast.type === 'warning' && 'text-gold',
          toast.type === 'info' && 'text-coconut/60'
        )}
      />
      <p className="flex-1 text-sm text-coconut dark:text-cream">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="p-1 rounded hover:bg-coconut/10" aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ToastProvider;
export default Toast;
