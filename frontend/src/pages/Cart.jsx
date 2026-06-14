import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, LogIn } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/checkout/OrderSummary';
import Button from '../components/ui/Button';

const Cart = () => {
  const { items, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-main pt-24 pb-16 text-center animate-fade-in">
        <ShoppingBag size={64} className="mx-auto text-coconut/20 mb-6" />
        <h1 className="font-display text-3xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-coconut/60 dark:text-cream/60 mb-8">Discover our premium coconut oil collection</p>
        <Button variant="secondary" size="lg" icon={ArrowRight}>
          <Link to="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-main pt-24 pb-16 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-coconut dark:text-cream mb-2">Shopping Cart</h1>
      <p className="text-coconut/70 dark:text-cream/70 font-medium mb-8">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
        <div>
          <OrderSummary />
          {!isAuthenticated ? (
            <div className="mt-4 space-y-3">
              <Button variant="secondary" className="w-full" size="lg" icon={LogIn} onClick={handleCheckout}>
                Login to Checkout
              </Button>
              <p className="text-center text-xs text-coconut/60 dark:text-cream/60">You need to login to place an order</p>
            </div>
          ) : (
            <Button variant="secondary" className="w-full mt-4" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          )}
          <Link to="/shop" className="block text-center text-sm text-gold hover:underline mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
