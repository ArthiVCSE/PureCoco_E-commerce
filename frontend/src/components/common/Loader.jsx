import { cn } from '../../utils/formatCurrency';

export const Skeleton = ({ className }) => (
  <div className={cn('skeleton', className)} aria-hidden="true" />
);

export const ProductCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-white dark:bg-coconut-light/10 shadow-soft">
    <Skeleton className="aspect-[4/5] w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" role="status" aria-label="Loading">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-gold/20" />
      <div className="absolute inset-0 rounded-full border-4 border-gold border-t-transparent animate-spin" />
    </div>
    <p className="text-sm text-coconut/60 dark:text-cream/60 animate-pulse-soft">Loading...</p>
  </div>
);

const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/80 dark:bg-coconut-dark/80 backdrop-blur-sm">
        <PageLoader />
      </div>
    );
  }
  return <PageLoader />;
};

export default Loader;
