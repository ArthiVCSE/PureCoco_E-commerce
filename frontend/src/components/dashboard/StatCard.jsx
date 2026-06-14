import { cn } from '../../utils/formatCurrency';

const StatCard = ({ title, value, change, icon: Icon, trend = 'up' }) => {
  return (
    <div className="p-5 card card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-gold/10">
          <Icon size={20} className="text-gold" />
        </div>
        {change && (
          <span
            className={cn(
              'text-xs font-sans font-medium px-2 py-0.5 rounded-full',
              trend === 'up' ? 'bg-natural/15 text-natural dark:text-natural-light' : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-sans font-bold text-coconut dark:text-cream mb-0.5">{value}</p>
      <p className="text-sm text-coconut/70 dark:text-cream/70 font-sans font-medium">{title}</p>
    </div>
  );
};

export default StatCard;
