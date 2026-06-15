import { useMemo, useState } from 'react';
import { Bot, Send, X, MessageCircle } from 'lucide-react';
import Button from '../ui/Button';

const quickReplies = [
  'Track my order',
  'Payment help',
  'Delivery availability',
  'Return policy',
  'Product recommendation',
];

const getAssistantReply = (message) => {
  const text = message.toLowerCase();

  if (text.includes('track') || text.includes('order')) {
    return 'Open Dashboard > My Orders and choose Track. If the order status is Out for Delivery, you will see the live map and delivery availability options.';
  }
  if (text.includes('payment') || text.includes('card') || text.includes('upi')) {
    return 'Checkout supports COD, card demo payment, and UPI demo payment. After payment confirmation, the order is created and you are taken to the tracking page.';
  }
  if (text.includes('delivery') || text.includes('available') || text.includes('reschedule')) {
    return 'When your order is Out for Delivery, the tracking page lets you confirm you are available, choose doorstep delivery, leave neighbor/security instructions, or reschedule.';
  }
  if (text.includes('return') || text.includes('refund')) {
    return 'For returns, contact support with your order ID, batch ID, and photos if the item is damaged or incorrect.';
  }
  if (text.includes('recommend') || text.includes('best') || text.includes('product')) {
    return 'For cooking, choose Virgin Cold-Pressed or Family Pack. For skin and hair, choose Hair & Skin Care Oil. For daily wellness, choose Ayurvedic Wellness Oil.';
  }

  return 'I can help with order tracking, payment, delivery availability, returns, product choices, and batch verification. Try asking about one of those.';
};

const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi, I am PureCoco Assist. Ask me about orders, payment, delivery, returns, or products.',
    },
  ]);

  const suggestions = useMemo(() => quickReplies.filter((reply) => !messages.some((m) => m.text === reply)), [messages]);

  const sendMessage = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: getAssistantReply(trimmed) },
    ]);
    setInput('');
    setOpen(true);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 font-sans">
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-40px))] rounded-xl bg-white dark:bg-coconut-light shadow-card border border-coconut/10 dark:border-cream/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-coconut text-cream">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-gold" />
              <span className="font-display font-semibold">PureCoco Assist</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="p-1 rounded hover:bg-cream/10" aria-label="Close assistant">
              <X size={16} />
            </button>
          </div>

          <div className="h-72 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  message.role === 'assistant'
                    ? 'bg-cream dark:bg-coconut-dark text-coconut dark:text-cream'
                    : 'bg-gold text-white ml-auto'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => sendMessage(reply)}
                className="text-xs px-2.5 py-1.5 rounded-full bg-gold/10 text-gold font-semibold hover:bg-gold/20"
              >
                {reply}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 p-3 border-t border-coconut/10 dark:border-cream/10"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for order help..."
              className="flex-1 px-3 py-2 rounded-lg bg-cream dark:bg-coconut-dark text-sm text-coconut dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <Button type="submit" variant="secondary" size="sm" aria-label="Send message">
              <Send size={15} />
            </Button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="h-12 w-12 rounded-full bg-gold text-white shadow-card flex items-center justify-center hover:bg-gold-dark transition-colors"
        aria-label="Open AI assistant"
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
};

export default AiAssistant;
