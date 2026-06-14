import { cn } from '../../utils/formatCurrency';

const Input = ({
  label,
  error,
  icon: Icon,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-sans font-medium text-body mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
        )}
        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg font-sans bg-white dark:bg-coconut-light/30',
            'border-2 border-coconut/20 dark:border-cream/20',
            'text-coconut dark:text-cream placeholder:text-coconut/40 dark:placeholder:text-cream/40',
            'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold',
            'transition-all duration-200',
            Icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
