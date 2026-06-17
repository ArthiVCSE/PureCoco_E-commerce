import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/formatCurrency';

const Modal = ({ isOpen, onClose, title, children, size = 'md', className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-coconut/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative w-full bg-cream dark:bg-coconut-dark rounded-xl shadow-card animate-scale-in flex flex-col max-h-[90vh]',
          sizes[size],
          className
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-coconut/10 dark:border-cream/10 shrink-0">
          <h2 id="modal-title" className="text-lg font-display font-semibold text-coconut dark:text-cream">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-coconut/10 dark:hover:bg-cream/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
