import { getPurityLabel, cn } from '../../utils/formatCurrency';

const PurityScore = ({ score, compact = false, showLabel = true }) => {
  const { label, color } = getPurityLabel(score);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  if (compact) {
    return (
      <div className="flex items-center gap-1" title={`Purity Score: ${score}%`}>
        <div className="w-8 h-8 relative">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-coconut/10" />
            <circle
              cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" className="text-natural transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-natural">{score}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-coconut/10 dark:text-cream/10" />
          <circle
            cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="text-natural transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-natural">{score}</span>
          <span className="text-[10px] uppercase tracking-wider text-coconut/50">Purity</span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium', color)}>{label}</span>
      )}
    </div>
  );
};

export default PurityScore;
