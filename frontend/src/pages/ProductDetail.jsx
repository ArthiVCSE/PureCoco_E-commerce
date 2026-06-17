import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Share2, Star, Truck, Shield, RotateCcw, Minus, Plus, GitCompare } from 'lucide-react';
import productService, { MOCK_REVIEWS } from '../services/productService';
import wishlistService from '../services/wishlistService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/common/Toast';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { USAGE_RECOMMENDATIONS } from '../utils/constants';
import Gallery from '../components/product/Gallery';
import PurityScore from '../components/product/PurityScore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { PageLoader } from '../components/common/Loader';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { data } = await api.get(`/reviews/product/${id}`);
        if (Array.isArray(data) && data.length) setReviews(data);
      } catch {
        setReviews(MOCK_REVIEWS);
      }
    };
    loadReviews();
  }, [id]);

  if (loading) return <PageLoader />;
  if (!product) {
    return (
      <div className="container-main pt-24 text-center py-20">
        <h2 className="font-display text-2xl mb-4">Product not found</h2>
        <Link to="/shop" className="text-gold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleWishlist = async () => {
    try {
      await wishlistService.addToWishlist(product._id);
      addToast(`${product.name} added to wishlist`, 'success');
    } catch {
      const stored = JSON.parse(localStorage.getItem('purecoco_wishlist') || '[]');
      const exists = stored.some((item) => item._id === product._id);
      if (!exists) {
        localStorage.setItem('purecoco_wishlist', JSON.stringify([...stored, product]));
      }
      addToast(exists ? 'Already in wishlist' : `${product.name} added to wishlist`, exists ? 'info' : 'success');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      addToast('Please write a short review', 'warning');
      return;
    }
    setReviewLoading(true);
    const localReview = {
      id: `local-${Date.now()}`,
      user: user?.name || 'You',
      rating: Number(reviewRating),
      text: reviewText.trim(),
      date: new Date().toISOString(),
    };
    try {
      const { data } = await api.post('/reviews', {
        productId: product._id,
        rating: Number(reviewRating),
        text: reviewText.trim(),
      });
      setReviews((prev) => [data, ...prev]);
      addToast('Review submitted successfully', 'success');
    } catch (error) {
      if (error.response?.data?.message) {
        addToast(error.response.data.message, 'error');
      } else {
        setReviews((prev) => [localReview, ...prev]);
        addToast('Review saved locally for demo mode', 'info');
      }
    } finally {
      setReviewText('');
      setReviewRating(5);
      setReviewLoading(false);
    }
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'usage', label: 'Usage Guide' },
    { id: 'traceability', label: 'Traceability' },
    { id: 'reviews', label: `Reviews (${product.reviewCount})` },
  ];

  return (
    <div className="container-main pt-24 pb-16 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        <Gallery images={product.images} alt={product.name} />

        <div>
          <div className="flex items-center gap-2 mb-3">
            {product.tags?.map((tag) => (
              <Badge key={tag} variant={tag === 'bestseller' ? 'gold' : 'natural'}>{tag}</Badge>
            ))}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-coconut/20'} />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-coconut/40">({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gold">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-coconut/40 line-through">{formatCurrency(product.originalPrice)}</span>
                <Badge variant="success">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </Badge>
              </>
            )}
          </div>

          <p className="text-coconut/70 dark:text-cream/70 leading-relaxed mb-6">{product.description}</p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 p-4 rounded-xl bg-white dark:bg-coconut-light/20 shadow-soft border border-coconut/10 dark:border-cream/10">
            <PurityScore score={product.purityScore} />
            <div className="space-y-2 text-sm w-full flex-1">
              <div className="flex justify-between"><span className="text-coconut/60 dark:text-cream/60 font-medium">Lauric Acid</span><span className="font-bold text-coconut dark:text-cream">{product.purityMetrics.lauricAcid}%</span></div>
              <div className="flex justify-between"><span className="text-coconut/60 dark:text-cream/60 font-medium">Moisture</span><span className="font-bold text-coconut dark:text-cream">{product.purityMetrics.moisture}%</span></div>
              <div className="flex justify-between"><span className="text-coconut/60 dark:text-cream/60 font-medium">Batch ID</span><span className="font-mono text-xs text-coconut dark:text-cream">{product.batchId}</span></div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-coconut/15 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-coconut/5" aria-label="Decrease"><Minus size={16} /></button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-coconut/5" aria-label="Increase"><Plus size={16} /></button>
            </div>
            <span className="text-sm text-coconut/50">{product.stock} in stock</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Button variant="secondary" size="lg" icon={ShoppingBag} onClick={handleAddToCart} className="w-full sm:w-auto flex-1">
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" icon={Heart} onClick={handleWishlist}>Wishlist</Button>
            <Button variant="ghost" size="lg" icon={GitCompare}>
              <Link to={`/compare?ids=${product._id}`}>Compare</Link>
            </Button>
            <Button variant="ghost" size="lg" icon={Share2} aria-label="Share" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Truck, text: 'Free shipping ₹999+' },
              { icon: Shield, text: 'Batch verified' },
              { icon: RotateCcw, text: '7-day returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="p-3 rounded-lg bg-coconut/5 dark:bg-cream/5">
                <Icon size={20} className="mx-auto mb-1 text-gold" />
                <p className="text-xs text-coconut/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-coconut/10 dark:border-cream/10 mb-8">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-gold text-gold' : 'border-transparent text-coconut/50 hover:text-coconut'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl">
        {activeTab === 'description' && (
          <div className="prose dark:prose-invert">
            <p className="leading-relaxed text-coconut/70 dark:text-cream/70">{product.description}</p>
            <p className="mt-4 leading-relaxed text-coconut/70 dark:text-cream/70">
              Sourced from {product.farm.name} in {product.farm.location}, managed by {product.farm.farmer}.
              Harvested on {formatDate(product.harvestDate)} and cold-pressed within 4 hours.
            </p>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.usage.map((use) => {
              const rec = USAGE_RECOMMENDATIONS[use];
              return (
                <div key={use} className="p-5 rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft">
                  <h4 className="font-display font-semibold capitalize mb-3">{use}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-coconut/50">Daily Amount</span><span>{rec.daily}</span></div>
                    <div className="flex justify-between"><span className="text-coconut/50">Best For</span><span>{rec.bestFor}</span></div>
                    <div className="flex justify-between"><span className="text-coconut/50">Temperature</span><span>{rec.temp}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'traceability' && (
          <div className="space-y-4">
            {[
              { label: 'Farm', value: `${product.farm.name}, ${product.farm.location}` },
              { label: 'Farmer', value: product.farm.farmer },
              { label: 'Harvest Date', value: formatDate(product.harvestDate) },
              { label: 'Batch ID', value: product.batchId },
              { label: 'Processing', value: 'Cold-pressed within 4 hours' },
              { label: 'Purity Score', value: `${product.purityScore}/100` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between p-4 rounded-lg bg-white dark:bg-coconut-light/10">
                <span className="text-coconut/50">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <Link to="/traceability" className="inline-block text-gold hover:underline text-sm mt-2">
              Verify this batch online →
            </Link>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <form onSubmit={handleReviewSubmit} className="p-5 rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-sm font-semibold text-body">Your Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-coconut-light/30 border border-coconut/20 dark:border-cream/20 text-body"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>{rating} stars</option>
                  ))}
                </select>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={isAuthenticated ? 'Share your experience with this product' : 'Write a review in demo mode'}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-coconut-light/30 border border-coconut/20 dark:border-cream/20 text-body focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <Button type="submit" variant="secondary" loading={reviewLoading}>
                Submit Review
              </Button>
            </form>

            {reviews.map((review) => (
              <div key={review._id || review.id} className="p-5 rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={review.image || review.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{review.user?.name || review.user || 'Customer'}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-coconut/40">{formatDate(review.createdAt || review.date)}</span>
                </div>
                <p className="text-sm text-coconut/70 dark:text-cream/70">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
