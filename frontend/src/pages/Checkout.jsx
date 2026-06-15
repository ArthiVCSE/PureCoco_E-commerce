import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, Loader } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/common/Toast';
import { validateCheckoutForm } from '../utils/validators';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import OrderSummary from '../components/checkout/OrderSummary';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { cn } from '../utils/formatCurrency';
import api from '../services/api';

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: Building2, desc: 'Pay when you receive the package' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Demo card payment confirmation' },
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Demo UPI confirmation' },
];

const Checkout = () => {
  const { items, total, subtotal, shipping, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState('cod');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: 'Tamil Nadu',
  });
  const [errors, setErrors] = useState({});

  if (items.length === 0) {
    return (
      <div className="container-main pt-24 text-center py-20">
        <h2 className="font-display text-2xl mb-4">Nothing to checkout</h2>
        <Link to="/shop" className="text-gold hover:underline">Go to Shop</Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleShipping = (e) => {
    e.preventDefault();
    const validation = validateCheckoutForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setStep(2);
  };

  const buildOrderPayload = (method) => ({
    items: items.map((item) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images?.[0] || item.image || '',
    })),
    shippingAddress: form,
    paymentMethod: method,
    subtotal,
    shipping,
    total,
  });

  const saveLocalOrder = (payload, paymentStatus) => {
    const order = {
      ...payload,
      _id: `LOCAL${Date.now()}`,
      status: 'processing',
      paymentStatus,
      createdAt: new Date().toISOString(),
      tracking: {
        carrier: 'PureCoco Delivery',
        trackingId: `PC${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
      },
    };
    const stored = JSON.parse(localStorage.getItem('purecoco_orders') || '[]');
    localStorage.setItem('purecoco_orders', JSON.stringify([order, ...stored]));
    return order;
  };

  const placeOrder = async (method) => {
    setLoading(true);
    const payload = buildOrderPayload(method);
    const paymentStatus = method === 'cod' ? 'pending' : 'paid';

    try {
      const { data } = await api.post('/orders', payload);
      clearCart();
      addToast(method === 'cod' ? 'Order placed successfully! (COD)' : 'Payment successful. Order placed!', 'success');
      navigate(`/track/${data._id}`);
    } catch {
      const localOrder = saveLocalOrder(payload, paymentStatus);
      clearCart();
      addToast(method === 'cod' ? 'Order placed locally (offline mode)' : 'Demo payment completed. Order placed locally.', 'info');
      navigate(`/track/${localOrder._id}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    await placeOrder(payment);
  };

  return (
    <div className="container-main pt-24 pb-16 animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-8 text-center">Checkout</h1>
      <CheckoutSteps currentStep={step + 1} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={handleShipping} className="space-y-4 p-6 rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft">
              <h2 className="font-display text-xl font-semibold mb-4">Shipping Details</h2>
              <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
                <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} required />
              </div>
              <Input label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} required />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} required />
                <Input label="State" name="state" value={form.state} onChange={handleChange} />
                <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} required />
              </div>
              <Button type="submit" variant="secondary" className="w-full" size="lg">
                Continue to Payment
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePayment} className="space-y-4 p-6 rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft">
              <h2 className="font-display text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {paymentMethods.map(({ id, label, icon: Icon, desc }) => (
                  <label
                    key={id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                      payment === id ? 'border-gold bg-gold/10' : 'border-coconut/20 dark:border-cream/20 hover:border-coconut/40'
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={payment === id}
                      onChange={() => setPayment(id)}
                      className="sr-only"
                      disabled={loading}
                    />
                    <Icon size={24} className="text-gold" />
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-xs text-coconut/50">{desc}</p>
                    </div>
                    {loading && payment === id && <Loader size={20} className="ml-auto animate-spin text-gold" />}
                  </label>
                ))}
              </div>

              {payment !== 'cod' && (
                <div className="border-t border-coconut/20 dark:border-cream/20 pt-6 pb-6">
                  <h3 className="font-semibold mb-3">{payment === 'upi' ? 'UPI Confirmation' : 'Card Confirmation'}</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-2">Demo payment mode</p>
                    <p className="text-xs">Amount: ₹{total}</p>
                    <p className="text-xs mt-2">Click the button below to mark payment successful and place the order.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-coconut/20 dark:border-cream/20">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" variant="secondary" className="flex-1" size="lg" loading={loading}>
                  {payment === 'cod' ? 'Place Order (COD)' : 'Pay & Place Order'}
                </Button>
              </div>
            </form>
          )}
        </div>

        <OrderSummary />
      </div>
    </div>
  );
};

export default Checkout;
