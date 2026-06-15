import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../ui/Button';
import { AlertCircle } from 'lucide-react';

const StripePaymentForm = ({ clientSecret, onSuccess, onError, loading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;
    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {},
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        onError?.(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess?.();
      }
    } catch (err) {
      setError(err.message);
      onError?.(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 rounded-lg border border-coconut/20 dark:border-cream/20 bg-white dark:bg-coconut-light/10">
        <CardElement options={cardStyle} />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="secondary"
        className="w-full"
        size="lg"
        loading={isProcessing || loading}
        disabled={!stripe || !clientSecret || isProcessing || loading}
      >
        Complete Payment
      </Button>
    </form>
  );
};

export default StripePaymentForm;
