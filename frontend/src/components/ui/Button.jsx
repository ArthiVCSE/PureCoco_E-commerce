import { cn } from '../../utils/formatCurrency';

const variants = {
  primary: 'bg-coconut text-cream hover:bg-coconut-light active:scale-[0.98] shadow-sm',
  secondary: 'bg-gold text-white hover:bg-gold-dark active:scale-[0.98] shadow-sm',
  outline: 'border-2 border-coconut text-coconut hover:bg-coconut hover:text-cream dark:border-cream dark:text-cream dark:hover:bg-cream dark:hover:text-coconut font-semibold',
  ghost: 'text-coconut hover:bg-coconut/10 dark:text-cream dark:hover:bg-cream/10 font-medium',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  icon: Icon,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded transition-all duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : 18} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
