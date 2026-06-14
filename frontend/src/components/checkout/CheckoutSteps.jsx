import { Check } from 'lucide-react';
import { cn } from '../../utils/formatCurrency';

const steps = ['Cart', 'Shipping', 'Payment', 'Confirmation'];

const CheckoutSteps = ({ currentStep = 0 }) => {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-between max-w-lg mx-auto">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                  index < currentStep && 'bg-natural text-white',
                  index === currentStep && 'bg-gold text-white ring-4 ring-gold/20',
                  index > currentStep && 'bg-coconut/10 dark:bg-cream/10 text-coconut/40'
                )}
              >
                {index < currentStep ? <Check size={16} /> : index + 1}
              </div>
              <span
                className={cn(
                  'text-xs hidden sm:block',
                  index <= currentStep ? 'text-coconut dark:text-cream font-medium' : 'text-coconut/40'
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300',
                  index < currentStep ? 'bg-natural' : 'bg-coconut/10 dark:bg-cream/10'
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CheckoutSteps;
