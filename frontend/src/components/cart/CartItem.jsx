import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 p-3 rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft">
      <img
        src={item.images[0]}
        alt={item.name}
        className="w-20 h-20 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{item.name}</h4>
        <p className="text-xs text-coconut/50 dark:text-cream/50 mb-2">{item.size}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              className="p-1 rounded border border-coconut/15 hover:bg-coconut/5 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="p-1 rounded border border-coconut/15 hover:bg-coconut/5 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</span>
        </div>
      </div>
      <button
        onClick={() => removeItem(item._id)}
        className="p-1.5 h-fit rounded hover:bg-red-50 hover:text-red-500 transition-colors self-start"
        aria-label="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;
