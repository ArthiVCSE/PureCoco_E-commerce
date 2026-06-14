import { X, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, cn } from '../../utils/formatCurrency';
import CartItem from './CartItem';
import Button from '../ui/Button';

const CartSidebar = () => {
  const { items, isOpen, setIsOpen, subtotal, shipping, total, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-coconut/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-cream dark:bg-coconut-dark shadow-card',
          'flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-5 border-b border-coconut/10 dark:border-cream/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="font-display text-lg font-semibold">
              Your Cart ({itemCount})
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded hover:bg-coconut/10 dark:hover:bg-cream/10 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={48} className="text-coconut/20 dark:text-cream/20" />
              <p className="text-coconut/60 dark:text-cream/60">Your cart is empty</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => <CartItem key={item._id} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-coconut/10 dark:border-cream/10 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-coconut/70 dark:text-cream/70 font-medium">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-coconut/70 dark:text-cream/70 font-medium">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-coconut/15">
                <span>Total</span>
                <span className="text-gold">{formatCurrency(total)}</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={handleCheckout}>
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
