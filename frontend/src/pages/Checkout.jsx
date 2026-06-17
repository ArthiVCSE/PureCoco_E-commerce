import { useState, useEffect } from 'react';
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
import { paymentService } from '../services/paymentService';

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: Building2, desc: 'Pay when you receive the package' },
  { id: 'card', label: 'Online Payment (Razorpay)', icon: CreditCard, desc: 'Pay securely via Credit/Debit/UPI' },
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

  const completeOrder = (order, message, type = 'success') => {
    clearCart();
    addToast(message, type);
    navigate(`/track/${order._id}`);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = buildOrderPayload(payment);

    try {
      // 1. Create order in backend
      const { data: orderData } = await api.post('/orders', payload);

      if (payment === 'cod') {
        completeOrder(orderData, 'Order placed successfully! (COD)');
        return;
      }

      if (payment === 'card') {
        // 2. Load Razorpay script
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          addToast('Failed to load Razorpay SDK. Please check your connection.', 'error');
          setLoading(false);
          return;
        }

        // 3. Create Razorpay order
        const rzpOrder = await paymentService.createRazorpayOrder(orderData._id);

        if (!rzpOrder || !rzpOrder.id) {
          addToast('Razorpay is not configured on the server. Falling back to local offline mode.', 'info');
          const paidOrder = await paymentService.completeDemoPayment(orderData._id);
          completeOrder(paidOrder, 'Demo payment completed. Order placed!', 'info');
          return;
        }

        // 4. Initialize Razorpay Checkout
        const rzpKey = process.env.REACT_APP_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
        
        const options = {
          key: rzpKey,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: 'PureCoco',
          description: 'Premium Cold-Pressed Coconut Oil',
          order_id: rzpOrder.id,
          handler: async function (response) {
            try {
              // 5. Verify Signature
              await paymentService.verifyRazorpayPayment({
                orderId: orderData._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              completeOrder(orderData, 'Payment successful! Order placed.', 'success');
            } catch (err) {
              addToast('Payment verification failed on the server', 'error');
            }
          },
          prefill: {
            name: form.fullName,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: '#D4AF37',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          addToast(response.error.description || 'Payment failed', 'error');
        });
        rzp.open();
        setLoading(false);
      }
    } catch (err) {
      addToast(err?.message || err?.response?.data?.message || 'Payment failed', 'error');
      setLoading(false);
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
              <Button type="submit" variant="secondary" className="w-full" size="lg">
                Continue to Payment
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4 p-6 rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft">
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
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-coconut/20 dark:border-cream/20">
                <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>Back</Button>
                <Button
                  type="button"
                  onClick={handlePayment}
                  variant="secondary"
                  className="flex-1"
                  size="lg"
                  loading={loading}
                >
                  {payment === 'cod' ? 'Place Order (COD)' : 'Proceed to Razorpay'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <OrderSummary />
      </div>
    </div>
  );
};

export default Checkout;
