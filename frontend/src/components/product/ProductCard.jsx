import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { formatCurrency, cn } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../common/Toast';
import wishlistService from '../../services/wishlistService';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import PurityScore from './PurityScore';

const ProductCard = ({ product, index = 0, layout = 'grid' }) => {
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await wishlistService.addToWishlist(product._id);
      addToast(`${product.name} added to wishlist`, 'success');
    } catch {
      const stored = JSON.parse(localStorage.getItem('purecoco_wishlist') || '[]');
      const exists = stored.some((item) => item._id === product._id);
      if (!exists) {
        localStorage.setItem('purecoco_wishlist', JSON.stringify([...stored, product]));
      }
      addToast(exists ? 'Already in wishlist' : `${product.name} added to wishlist`, exists ? 'info' : 'success');
    }
  };

  if (layout === 'list') {
    return (
      <Link
        to={`/product/${product._id}`}
        className="group flex gap-4 p-4 card card-hover animate-slide-up"
        style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards', opacity: 0 }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg object-cover shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted uppercase tracking-wider">{product.size}</span>
              {product.tags?.includes('bestseller') && <Badge variant="gold">Bestseller</Badge>}
              {product.tags?.includes('new') && <Badge variant="natural">New</Badge>}
            </div>
            <h3 className="font-display text-lg font-semibold text-body mb-1">{product.name}</h3>
            <p className="text-sm text-muted line-clamp-2 mb-2">{product.description}</p>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-gold text-gold" />
              <span className="text-xs font-sans font-medium text-body">{product.rating}</span>
              <span className="text-xs text-muted">({product.reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold text-body">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-muted line-through">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <PurityScore score={product.purityScore} compact />
              <Button variant="ghost" size="sm" icon={Heart} onClick={handleWishlist} aria-label="Add to wishlist" />
              <Button variant="secondary" size="sm" icon={ShoppingBag} onClick={handleAddToCart}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product._id}`}
      className={cn(
        'group block card overflow-hidden card-hover animate-slide-up opacity-0'
      )}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark dark:bg-coconut-light/20">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coconut/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {product.tags?.includes('bestseller') && (
          <Badge variant="gold" className="absolute top-3 left-3">Bestseller</Badge>
        )}
        {product.tags?.includes('new') && !product.tags?.includes('bestseller') && (
          <Badge variant="natural" className="absolute top-3 left-3">New</Badge>
        )}

        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-coconut text-coconut dark:text-cream opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold hover:text-white"
          onClick={handleWishlist}
          aria-label="Add to wishlist"
        >
          <Heart size={16} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Button variant="secondary" size="sm" className="w-full" icon={ShoppingBag} onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-coconut/60 dark:text-cream/70 uppercase tracking-wider font-sans font-medium">{product.size}</span>
          <PurityScore score={product.purityScore} compact />
        </div>
        <h3 className="font-display text-base font-bold text-coconut dark:text-cream mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="fill-gold text-gold" />
          <span className="text-xs font-sans font-semibold text-coconut dark:text-cream">{product.rating}</span>
          <span className="text-xs text-coconut/60 dark:text-cream/60">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans font-bold text-coconut dark:text-cream">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-coconut/50 dark:text-cream/50 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
