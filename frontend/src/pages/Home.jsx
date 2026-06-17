import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck, Star, ChevronRight, ChevronDown, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Loader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useToast } from '../components/common/Toast';
import { MOCK_REVIEWS } from '../services/productService';
import messageService from '../services/messageService';
import { APP_TAGLINE } from '../utils/constants';
import { IMAGES } from '../utils/images';

const faqs = [
  { q: 'How is PureCoco oil different from regular coconut oil?', a: 'Our oil is cold-pressed within 4 hours of harvest using traditional wood press methods. Every batch is lab-tested and traceable back to the exact farm and harvest date in Pollachi.' },
  { q: 'How do I verify my batch?', a: 'Enter the batch ID printed on your bottle at our Traceability page, or scan the QR code on the label. You will see farm origin, harvest date, purity score, and lab metrics.' },
  { q: 'What is the purity score?', a: 'The purity score (0–100) is calculated from lauric acid content, moisture level, free fatty acids, and peroxide value. Scores above 95 are considered exceptional.' },
  { q: 'Is shipping free?', a: 'Free shipping on all orders above ₹999. Orders below that have a flat ₹79 delivery fee across India.' },
];

const Home = () => {
  const { products, loading } = useProducts();
  const { addToast } = useToast();
  const [openFaq, setOpenFaq] = useState(null);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);

  const features = [
    { icon: Leaf, title: 'Farm Fresh', desc: 'Harvested within 24 hours from Pollachi farms' },
    { icon: Shield, title: 'Purity Verified', desc: 'Lab-tested with transparent purity scores' },
    { icon: Truck, title: 'Farm to Door', desc: 'Direct delivery with batch traceability' },
  ];

  const traceSteps = [
    { step: '01', title: 'Harvest', desc: 'Hand-picked mature coconuts from certified organic farms', image: IMAGES.harvest },
    { step: '02', title: 'De-husk & Grind', desc: 'Coconuts de-husked and kernel ground within hours of harvest', image: IMAGES.processing.dehusk },
    { step: '03', title: 'Cold Press', desc: 'Extracted using traditional wood press at below 45°C', image: IMAGES.processing.press },
    { step: '04', title: 'Filter & Test', desc: 'Lab analysis for lauric acid, moisture & purity metrics', image: IMAGES.processing.lab },
    { step: '05', title: 'Bottle & Seal', desc: 'Glass bottled and sealed with batch verification QR', image: IMAGES.processing.bottle },
  ];

  const handleContact = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      await messageService.sendMessage(contact);
      addToast('Message sent successfully! We will reply within 24 hours.', 'success');
      setContact({ name: '', email: '', message: '' });
    } catch (error) {
      addToast(error?.response?.data?.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="animate-fade-in font-sans">
      {/* Hero — natural full background */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
          <img
            src={IMAGES.hero}

            alt="Natural coconut background"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Removed dark/brown hero shade overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-coconut/20 via-coconut/10 to-transparent" />


        </div>
        <div className="container-main relative z-10 py-20">
          <Badge variant="gold" className="mb-4">From Pollachi Farms</Badge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-cream max-w-2xl leading-tight mb-4">
            Pure Coconut Oil,<br/>
            <span className="text-gold">Straight from the Source</span>
          </h1>
          <p className="text-cream/90 text-lg max-w-lg mb-8 leading-relaxed font-sans">
            {APP_TAGLINE}. Cold-pressed, lab-verified, and fully traceable from farm to your bottle.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop">
              <Button variant="secondary" size="lg" icon={ArrowRight}>Shop Now</Button>
            </Link>
            <Link to="/traceability">
              <Button variant="outline" size="lg" className="border-cream text-cream hover:bg-cream hover:text-coconut">
                Verify a Batch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white dark:bg-coconut-light/5">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 card card-hover">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold/15 flex items-center justify-center">
                  <Icon size={28} className="text-gold" />
                </div>
                <h3 className="font-display text-lg font-bold text-coconut dark:text-cream mb-2">{title}</h3>
                <p className="text-sm text-coconut/70 dark:text-cream/70 font-sans">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-main">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="heading-section mb-2">Featured Products</h2>
              <p className="text-muted font-sans">Handpicked from our latest harvest</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1 text-gold hover:text-gold-dark transition-colors text-sm font-sans font-medium">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.slice(0, 4).map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
          </div>
        </div>
      </section>

      {/* Harvest Story */}
      <section id="story" className="section-padding bg-coconut">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src={IMAGES.plantation} alt="Pollachi coconut plantation" className="rounded-xl shadow-card w-full aspect-[4/3] object-cover" />
              <div className="absolute -bottom-6 -right-6 bg-gold text-white p-6 rounded-xl shadow-glow hidden sm:block">
                <p className="font-display text-3xl font-bold">3rd Gen</p>
                <p className="text-sm font-sans opacity-90">Family of Farmers</p>
              </div>
            </div>
            <div>
              <Badge variant="gold" className="mb-4">Harvest Story</Badge>
              <h2 className="font-display text-3xl font-bold text-cream mb-4">
                Rooted in Pollachi,<br />Crafted with Care
              </h2>
              <p className="text-cream/75 leading-relaxed mb-6 font-sans">
                For over three generations, our partner farms in Pollachi have cultivated the finest
                coconuts using sustainable, chemical-free methods. Every bottle of PureCoco carries
                the story of the farmer who nurtured it — from seedling to harvest.
              </p>
              <Link to="/blog/meet-farmer-rajan" className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-sans font-medium">
                Read the Full Story <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Traceability Steps */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="heading-section mb-2">Farm-to-Bottle Journey</h2>
            <p className="text-muted max-w-lg mx-auto font-sans">
              Every batch is tracked from harvest to delivery. Scan your bottle to verify authenticity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {traceSteps.map(({ step, title, desc, image }) => (
              <div key={step} className="card card-hover overflow-hidden">
                <img src={image} alt={title} className="w-full h-36 object-cover" />
                <div className="p-4">
                  <span className="font-display text-2xl font-bold text-gold/30">{step}</span>
                  <h3 className="font-display text-base font-bold text-coconut dark:text-cream mt-1 mb-1">{title}</h3>
                  <p className="text-xs text-coconut/70 dark:text-cream/70 font-sans leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oil Processing Gallery */}
      <section className="section-padding bg-coconut">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-cream mb-2">Inside Our Cold-Press Process</h2>
            <p className="text-cream/75 font-sans max-w-lg mx-auto">
              Every drop is crafted with precision. Here’s how we turn fresh coconuts into pure oil.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { src: IMAGES.processing.dehusk, label: 'De-husking' },
              { src: IMAGES.processing.grind,  label: 'Grinding Kernel' },
              { src: IMAGES.processing.press,  label: 'Wood Press Extraction' },
              { src: IMAGES.processing.filter, label: 'Filtering' },
              { src: IMAGES.processing.lab,    label: 'Lab Quality Test' },
              { src: IMAGES.processing.bottle, label: 'Glass Bottling' },
            ].map(({ src, label }) => (
              <div key={label} className="relative group overflow-hidden rounded-xl aspect-[4/3]">
                <img
                  src={src}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coconut/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 left-3 text-cream text-sm font-sans font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding bg-white dark:bg-coconut-light/5">
        <div className="container-main">
          <h2 className="heading-section text-center mb-10">What Our Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="p-6 card card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <img src={review.image} alt={review.user} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-sans font-bold text-sm text-coconut dark:text-cream">{review.user}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-coconut/75 dark:text-cream/75 font-sans leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding">
        <div className="container-main max-w-3xl">
          <h2 className="heading-section text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-sans"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-medium text-body pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`text-gold shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-muted font-sans leading-relaxed border-t border-coconut/5 dark:border-cream/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-padding bg-white dark:bg-coconut-light/5">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="heading-section mb-4">Get in Touch</h2>
              <p className="text-muted font-sans mb-8 leading-relaxed">
                Have questions about our products or farm visits? We'd love to hear from you.
              </p>
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: 'Green Valley Estate, Pollachi, Tamil Nadu 642001' },
                  { icon: Phone, text: '+91 98765 43210' },
                  { icon: Mail, text: 'hello@purecoco.in' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-body font-sans">
                    <div className="p-2 rounded-lg bg-gold/10"><Icon size={18} className="text-gold" /></div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleContact} className="p-6 card space-y-4">
              <Input label="Your Name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
              <Input label="Email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
              <div>
                <label className="block text-sm font-sans font-medium text-body mb-1.5">Message</label>
                <textarea
                  rows={4}
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-coconut/20 dark:border-cream/20 text-coconut dark:text-cream font-sans focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold resize-none bg-white dark:bg-coconut-light/30"
                  required
                />
              </div>
              <Button type="submit" variant="secondary" icon={Send} className="w-full" disabled={contactLoading}>
                {contactLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
