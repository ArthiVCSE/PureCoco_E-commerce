import { Tag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency, cn } from '../../utils/formatCurrency';

const OrderSummary = ({ showItems = true }) => {
  const { items, subtotal, shipping, total } = useCart();

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft sticky top-24">
      <h3 className="font-display text-lg font-semibold mb-4">Order Summary</h3>

      {showItems && (
        <div className="space-y-3 mb-4 pb-4 border-b border-coconut/10 dark:border-cream/10">
          {items.map((item) => (
            <div key={item._id} className="flex gap-3">
              <img src={item.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-coconut/50">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-coconut/70 dark:text-cream/70 font-medium">Subtotal</span>
          <span className="font-semibold text-coconut dark:text-cream">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-coconut/70 dark:text-cream/70 font-medium">Shipping</span>
          <span className={cn(shipping === 0 ? 'text-natural font-bold' : 'font-semibold text-coconut dark:text-cream')}>
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>
        {subtotal < 999 && (
          <p className="text-xs text-gold flex items-center gap-1">
            <Tag size={12} />
            Add {formatCurrency(999 - subtotal)} more for free shipping
          </p>
        )}
      </div>

      <div className="flex justify-between font-semibold text-lg pt-4 border-t border-coconut/10">
        <span>Total</span>
        <span className="text-gold">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
