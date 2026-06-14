import { useState } from 'react';
import { Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Loader';
import Badge from '../components/ui/Badge';
import { cn } from '../utils/formatCurrency';

const categories = ['all', 'cooking', 'beauty', 'wellness'];
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'purity', label: 'Highest Purity' },
];

const Shop = () => {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popular');
  const [view, setView] = useState('grid');

  let filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || p.category === category;
    return matchSearch && matchCategory;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'price-high') return b.price - a.price;
    if (sort === 'purity') return b.purityScore - a.purityScore;
    return b.reviewCount - a.reviewCount;
  });

  return (
    <div className="container-main pt-24 pb-16 animate-fade-in font-sans">
      <div className="mb-10">
        <h1 className="heading-section mb-2">Shop</h1>
        <p className="text-muted font-sans">Premium coconut oil products from Pollachi farms</p>
      </div>

      <div className="flex flex-col gap-3 mb-8 p-4 sm:p-5 card">
        <div className="relative max-w-lg w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-coconut/50 dark:text-cream/50" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-coconut/20 dark:border-cream/20 text-sm font-sans text-coconut dark:text-cream placeholder:text-coconut/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white dark:bg-coconut-light/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-sans font-semibold capitalize transition-colors',
                  category === cat
                    ? 'bg-coconut text-cream dark:bg-gold dark:text-white'
                    : 'text-coconut dark:text-cream bg-coconut/10 dark:bg-cream/10 hover:bg-coconut/20 dark:hover:bg-cream/20'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 w-full sm:w-auto sm:ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-coconut/20 dark:border-cream/20 text-sm font-sans font-medium text-coconut dark:text-cream bg-white dark:bg-coconut-light/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="flex border-2 border-coconut/20 dark:border-cream/20 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={cn('p-2 text-coconut dark:text-cream transition-colors', view === 'grid' ? 'bg-coconut/15 dark:bg-cream/15' : 'hover:bg-coconut/10')}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn('p-2 text-coconut dark:text-cream transition-colors', view === 'list' ? 'bg-coconut/15 dark:bg-cream/15' : 'hover:bg-coconut/10')}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted font-sans">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>
        <Badge variant="natural">Free shipping over ₹999</Badge>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <SlidersHorizontal size={48} className="mx-auto text-muted mb-4" />
          <p className="text-muted font-sans">No products match your filters</p>
        </div>
      ) : (
        <div className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col gap-4'
        )}>
          {filtered.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} layout={view} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
