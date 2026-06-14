import { cn } from '../../utils/formatCurrency';

const variants = {
  default: 'bg-coconut/15 text-coconut dark:bg-cream/20 dark:text-cream font-semibold',
  gold: 'bg-gold/25 text-coconut-dark dark:bg-gold/30 dark:text-gold-light font-semibold',
  natural: 'bg-natural/20 text-natural dark:bg-natural/30 dark:text-natural-light font-semibold',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 font-semibold',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 font-semibold',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 font-semibold',
};

const Badge = ({ children, variant = 'default', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
