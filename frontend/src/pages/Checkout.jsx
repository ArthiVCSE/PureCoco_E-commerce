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
import paymentService from '../services/paymentService';

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: Building2, desc: 'Pay when you receive' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm (Coming Soon)' },
];

const Checkout = () => {
  const { items, total, subtotal, shipping, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState('cod');
  const [orderId, setOrderId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', pincode: '', state: 'Tamil Nadu',
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

  // Hard guard — redirect to login if not authenticated
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

  const handlePaymentMethod = async (method) => {
    setPayment(method);

    // If card is selected, create PaymentIntent
    if (method === 'card') {
      await handleCreateOrder();
    }
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.images?.[0] || '',
        })),
        shippingAddress: form,
        paymentMethod: payment,
        subtotal,
        shipping,
        total,
      };

      const { data: orderData } = await api.post('/orders', orderPayload);
      setOrderId(orderData._id);

      // Create PaymentIntent if card payment
      if (payment === 'card') {
        const paymentData = await paymentService.createPaymentIntent(orderData._id);
        setClientSecret(paymentData.clientSecret);
      }

      addToast('Order created. Proceed to payment.', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Error creating order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCODPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.images?.[0] || '',
        })),
        shippingAddress: form,
        paymentMethod: 'cod',
        subtotal,
        shipping,
        total,
      };

      const { data: orderData } = await api.post('/orders', orderPayload);
      clearCart();
      addToast('Order placed successfully! (COD)', 'success');
      navigate(`/track/${orderData._id}`);
    } catch (error) {
      addToast(error.response?.data?.message || 'Error placing order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (payment === 'cod') {
      handleCODPayment(e);
    }
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
              <Button type="submit" variant="secondary" className="w-full" size="lg">Continue to Payment</Button>
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
                      onChange={() => handlePaymentMethod(id)}
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

              {payment === 'card' && clientSecret && (
                <div className="border-t border-coconut/20 dark:border-cream/20 pt-6 pb-6">
                  <h3 className="font-semibold mb-3">Card Details</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-2">✓ Order Created Successfully</p>
                    <p className="text-xs">Order ID: {orderId}</p>
                    <p className="text-xs mt-2">Amount: ₹{total}</p>
                    <p className="text-xs mt-3 font-semibold">Complete payment flow activated (see console for clientSecret)</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-coconut/20 dark:border-cream/20">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                {payment === 'cod' ? (
                  <Button type="submit" variant="secondary" className="flex-1" size="lg" loading={loading}>
                    Place Order (COD)
                  </Button>
                ) : payment === 'card' ? (
                  <Button variant="secondary" className="flex-1" size="lg" disabled={!clientSecret} loading={!clientSecret}>
                    {clientSecret ? 'Proceed to Payment' : 'Preparing...'}
                  </Button>
                ) : (
                  <Button variant="secondary" className="flex-1" size="lg" disabled>
                    Coming Soon
                  </Button>
                )}
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
