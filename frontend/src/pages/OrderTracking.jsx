
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package, Truck, CheckCircle, MapPin, Clock, Navigation,
  Phone, Check, AlertCircle, Map, Star
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { cn } from '../utils/formatCurrency';
import api from '../services/api';
import { useToast } from '../components/common/Toast';

const trackingSteps = [
  { status: 'pending', label: 'Order Placed', icon: CheckCircle, desc: 'We have received your order' },
  { status: 'processing', label: 'Processing', icon: Package, desc: 'Items are being packed at our Pollachi facility' },
  { status: 'shipped', label: 'Shipped', icon: Truck, desc: 'Your package is on its way' },
  { status: 'out-for-delivery', label: 'Out for Delivery', icon: Navigation, desc: 'Driver is heading to your address' },
  { status: 'delivered', label: 'Delivered', icon: MapPin, desc: 'Package delivered successfully' },
];

const statusOrder = ['pending', 'processing', 'shipped', 'out-for-delivery', 'delivered'];

// Simulated route: Pollachi Hub → Customer Address (Tamil Nadu)
const ROUTE_COORDS = [
  [10.6543, 77.0062], // Pollachi Hub
  [10.7200, 77.0800],
  [10.8000, 77.2000],
  [10.9000, 77.3500],
  [11.0168, 76.9558], // Coimbatore
  [11.1271, 77.3412],
  [11.3410, 77.7172],
  [11.6500, 78.1500],
  [12.0000, 79.0000],
  [12.9716, 80.2209], // Chennai (destination)
];

const STREETS = [
  'Pollachi Highway',
  'NH-544 West',
  'Coimbatore Bypass',
  'Salem Main Road',
  'Tiruchengode Junction',
  'Krishnagiri NH-44',
  'Vellore Approach Road',
  'OMR Floodplain',
  'Tambaram Flyover',
  'Entering Delivery Area',
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [availability, setAvailability] = useState('');
  const [notes, setNotes] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00 AM - 01:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapProgress, setMapProgress] = useState(0);
  const [currentStreet, setCurrentStreet] = useState(STREETS[0]);
  const [showMapView, setShowMapView] = useState(false);
  const [loading, setLoading] = useState(true);


  const [loadError, setLoadError] = useState('');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const truckMarkerRef = useRef(null);
  const { addToast } = useToast();

  // Load order on mount / when orderId changes
  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Load Leaflet CSS + JS dynamically
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);




  // Animate map progress for out-for-delivery
  useEffect(() => {
    if (order && order.status === 'out-for-delivery') {
      const interval = setInterval(() => {
        setMapProgress(prev => {
          if (prev >= 100) return prev;
          const next = Math.min(prev + 0.8, 100);
          const idx = Math.min(Math.floor((next / 100) * STREETS.length), STREETS.length - 1);
          setCurrentStreet(STREETS[idx]);
          return next;
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [order]);

  // Initialize Leaflet map when showMapView is toggled
  useEffect(() => {
    if (!showMapView || !mapRef.current || order?.status !== 'out-for-delivery') return;

    const initMap = () => {
      if (!window.L) { setTimeout(initMap, 300); return; }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Draw the full route polyline
      const polyline = L.polyline(ROUTE_COORDS, {
        color: '#C89B3C', weight: 4, dashArray: '8 6', opacity: 0.85,
      }).addTo(map);

      // Origin marker (Pollachi Hub)
      const originIcon = L.divIcon({
        className: '',
        html: `<div style="background:#4F7942;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(79,121,66,0.3)"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8],
      });
      L.marker(ROUTE_COORDS[0], { icon: originIcon }).addTo(map)
        .bindPopup('<b>📦 PureCoco Pollachi Hub</b><br>Order dispatched');

      // Destination marker (Customer)
      const destIcon = L.divIcon({
        className: '',
        html: `<div style="background:#e11d48;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(225,29,72,0.3)"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8],
      });
      L.marker(ROUTE_COORDS[ROUTE_COORDS.length - 1], { icon: destIcon }).addTo(map)
        .bindPopup('<b>🏠 Your Delivery Address</b>');

      // Truck marker (animated)
      const truckIcon = L.divIcon({
        className: '',
        html: `<div style="background:#C89B3C;width:28px;height:28px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:14px">🚚</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      });
      const initialIdx = Math.floor((mapProgress / 100) * (ROUTE_COORDS.length - 1));
      const truckMarker = L.marker(ROUTE_COORDS[Math.min(initialIdx, ROUTE_COORDS.length - 1)], { icon: truckIcon })
        .addTo(map)
        .bindPopup('<b>🚚 Delivery Agent: Ramesh Kumar</b><br>En route to your address');
      truckMarkerRef.current = truckMarker;

      map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
    };

    initMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMapView]);

  // Update truck position on the Leaflet map as mapProgress changes
  useEffect(() => {
    if (!truckMarkerRef.current || !window.L) return;
    const idx = Math.floor((mapProgress / 100) * (ROUTE_COORDS.length - 1));
    const safeIdx = Math.min(idx, ROUTE_COORDS.length - 1);
    truckMarkerRef.current.setLatLng(ROUTE_COORDS[safeIdx]);
  }, [mapProgress]);

  const loadOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data);
      if (data.deliveryAvailability) setAvailability(data.deliveryAvailability);
      if (data.deliveryNotes) setNotes(data.deliveryNotes);
    } catch {
      // fallback to local offline storage

      const orders = JSON.parse(localStorage.getItem('purecoco_orders') || '[]');
      const found = orders.find(o => o._id === orderId);
      if (found) {
        setOrder(found);
        setAvailability(found.deliveryAvailability || '');
        setNotes(found.deliveryNotes || '');
      } else {
        setLoadError('Unable to load order details. Please check your order ID or try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    if (!availability) { addToast('Please select an availability option', 'warning'); return; }
    setIsSubmitting(true);

    let finalNotes = notes;
    if (availability === 'reschedule') {
      if (!rescheduleDate) { addToast('Please select a reschedule date', 'warning'); setIsSubmitting(false); return; }
      finalNotes = `Rescheduled to ${rescheduleDate} (${rescheduleTime})`;
    }

    const payload = { deliveryAvailability: availability, deliveryNotes: finalNotes };

    try {
      const { data } = await api.put(`/orders/${orderId}/availability`, payload);
      setOrder(data);
      const stored = JSON.parse(localStorage.getItem('purecoco_orders') || '[]');
      localStorage.setItem('purecoco_orders', JSON.stringify(stored.map(o => o._id === orderId ? { ...o, ...data } : o)));
      addToast('✅ Delivery preference saved! Driver has been notified.', 'success');
    } catch {
      const updated = { ...order, ...payload };
      setOrder(updated);
      const stored = JSON.parse(localStorage.getItem('purecoco_orders') || '[]');
      localStorage.setItem('purecoco_orders', JSON.stringify(stored.map(o => o._id === orderId ? updated : o)));
      addToast('✅ Preference saved! (offline mode)', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-main pt-32 text-center py-20">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted font-sans">Loading order details...</p>
      </div>
    );
  }



  if (!order && loadError) {
    return (
      <div className="container-main pt-32 text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto mb-5">
          <AlertCircle size={28} />
        </div>
        <h2 className="font-display text-2xl font-bold text-coconut dark:text-cream mb-2">Order not found</h2>
        <p className="text-muted font-sans mb-6 max-w-lg mx-auto">{loadError}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-white font-semibold hover:bg-gold-dark transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(order.status);
  const orderedPaymentPaid = order.paymentStatus === 'paid';

  const isOutForDelivery = order.status === 'out-for-delivery';
  const distLeft = Math.max(0.1, (3.4 - (mapProgress / 100) * 3.4)).toFixed(1);
  const minsLeft = Math.max(1, Math.round(15 - (mapProgress / 100) * 15));
  const prefsaved = order.deliveryAvailability && order.deliveryAvailability !== 'pending';

  return (
    <div className="container-main pt-24 pb-16 animate-fade-in max-w-5xl">

      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="gold" className="mb-3">Order Tracking</Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-coconut dark:text-cream mb-2">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-coconut/60 dark:text-cream/60 font-sans font-medium">
          Placed on {formatDate(order.createdAt)}
        </p>
        {!orderedPaymentPaid && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-coconut/10 border border-coconut/20 rounded-full text-coconut text-sm font-sans font-semibold animate-pulse">
            <Check size={14} /> Waiting for payment confirmation…
          </div>
        )}
        {orderedPaymentPaid && order.paymentStatus === 'failed' && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full text-red-700 dark:text-red-300 text-sm font-sans font-semibold">
            <AlertCircle size={14} /> Payment failed. Please retry.
          </div>
        )}
        {isOutForDelivery && (

          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-sans font-semibold animate-pulse">
            <Navigation size={14} /> Your order is out for delivery right now!
          </div>
        )}
      </div>

      {/* Progress Stepper */}
      <div className="p-6 rounded-2xl bg-white dark:bg-coconut-light/10 shadow-soft mb-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
          {trackingSteps.map((step, index) => {
            const isComplete = index <= currentIndex;
            const isActive = index === currentIndex;
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex md:flex-col items-center flex-1 relative">
                <div className="flex items-center md:flex-col gap-4 md:gap-2 z-10">
                  <div className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm',
                    isComplete ? 'bg-natural text-white scale-110' : 'bg-coconut/10 dark:bg-cream/10 text-coconut/30 dark:text-cream/30',
                    isActive && 'ring-4 ring-natural/30 animate-pulse'
                  )}>
                    <Icon size={18} />
                  </div>
                  <div className="text-left md:text-center">
                    <p className={cn('font-semibold text-sm font-sans', isComplete ? 'text-coconut dark:text-cream' : 'text-coconut/40 dark:text-cream/40')}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted leading-tight max-w-[120px] hidden md:block mt-1 font-sans">{step.desc}</p>
                  </div>
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className={cn(
                    'hidden md:block absolute top-[22px] left-[50%] w-[100%] h-0.5',
                    index < currentIndex ? 'bg-natural' : 'bg-coconut/10 dark:bg-cream/10'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════ SPECIAL MODULE: OUT FOR DELIVERY ═══════════════════ */}
      {isOutForDelivery && (
        <div className="mb-8 space-y-6">

          {/* Map Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-gold/10 via-amber-50 to-natural/10 dark:from-gold/5 dark:via-coconut-light/10 dark:to-natural/5 border border-gold/20 dark:border-gold/15 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-coconut dark:text-cream text-xl flex items-center gap-2">
                  <Map className="text-gold" size={22} />
                  Live Delivery Tracking
                </h2>
                <p className="text-sm text-muted font-sans mt-1">
                  Your package is moving from <strong>Pollachi</strong> to <strong>{order.shippingAddress?.city || 'your address'}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowMapView(v => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-white font-sans font-semibold text-sm hover:bg-gold-dark transition-colors shadow-sm"
              >
                <Map size={16} />
                {showMapView ? 'Hide Map' : 'View Live Map'}
              </button>
            </div>

            {/* Live stats bar */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white/70 dark:bg-coconut-dark/40 rounded-xl p-3 text-center border border-coconut/8 dark:border-cream/8">
                <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block">Current Street</span>
                <span className="text-xs font-bold text-coconut dark:text-cream flex items-center justify-center gap-1 mt-0.5">
                  <Navigation size={10} className="text-gold" /> {currentStreet}
                </span>
              </div>
              <div className="bg-white/70 dark:bg-coconut-dark/40 rounded-xl p-3 text-center border border-coconut/8 dark:border-cream/8">
                <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block">Distance Left</span>
                <span className="text-xs font-bold text-natural">{distLeft} km</span>
              </div>
              <div className="bg-white/70 dark:bg-coconut-dark/40 rounded-xl p-3 text-center border border-coconut/8 dark:border-cream/8">
                <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block">ETA</span>
                <span className="text-xs font-bold text-coconut dark:text-cream">{minsLeft} mins</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-muted font-sans mb-1">
                <span>📦 Pollachi Hub</span>
                <span>🏠 {order.shippingAddress?.city || 'Your Address'}</span>
              </div>
              <div className="h-2 bg-coconut/10 dark:bg-cream/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-natural rounded-full transition-all duration-1000"
                  style={{ width: `${mapProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Leaflet Map (togglable) */}
          {showMapView && (
            <div className="rounded-2xl overflow-hidden shadow-card border border-coconut/10 dark:border-cream/10" style={{ height: '380px' }}>
              <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
            </div>
          )}

          {/* SVG Animated Map (always visible fallback) */}
          {!showMapView && (
            <div className="p-5 rounded-2xl bg-white dark:bg-coconut-light/10 shadow-soft">
              <h3 className="font-display font-bold text-coconut dark:text-cream text-base mb-3 flex items-center gap-2">
                <Navigation className="text-gold animate-spin-slow" size={18} />
                Route Preview
              </h3>
              <div className="relative w-full h-[240px] bg-[#f8f5ef] dark:bg-coconut-darker rounded-xl border border-coconut/10 dark:border-cream/10 overflow-hidden">
                {/* SVG Map */}
                <svg viewBox="0 0 480 280" className="w-full h-full">
                  {/* Road grid */}
                  <line x1="20" y1="130" x2="460" y2="130" stroke="#e8dfd0" strokeWidth="20" strokeLinecap="round" opacity="0.5" />
                  <line x1="240" y1="10" x2="240" y2="270" stroke="#e8dfd0" strokeWidth="20" strokeLinecap="round" opacity="0.4" />
                  <line x1="60" y1="240" x2="420" y2="50" stroke="#e8dfd0" strokeWidth="26" strokeLinecap="round" opacity="0.35" />
                  <line x1="100" y1="10" x2="100" y2="270" stroke="#e8dfd0" strokeWidth="12" opacity="0.3" />
                  <line x1="380" y1="10" x2="380" y2="270" stroke="#e8dfd0" strokeWidth="12" opacity="0.3" />

                  {/* City blocks */}
                  <rect x="120" y="50" width="60" height="40" rx="4" fill="#ede8df" opacity="0.5" />
                  <rect x="290" y="150" width="55" height="45" rx="4" fill="#ede8df" opacity="0.5" />
                  <rect x="150" y="170" width="50" height="35" rx="4" fill="#ede8df" opacity="0.4" />

                  {/* Bezier delivery path */}
                  <path d="M 60 230 C 150 80, 300 240, 420 50" fill="none" stroke="#C89B3C" strokeWidth="3.5" strokeDasharray="8 5" opacity="0.9" />

                  {/* Origin */}
                  <circle cx="60" cy="230" r="9" fill="#4F7942" />
                  <circle cx="60" cy="230" r="16" fill="#4F7942" fillOpacity="0.2" className="animate-ping" style={{ transformOrigin: '60px 230px' }} />
                  <text x="76" y="245" fontSize="9" fill="#4F7942" fontFamily="sans-serif" fontWeight="bold">Hub</text>

                  {/* Destination */}
                  <circle cx="420" cy="50" r="9" fill="#e11d48" />
                  <circle cx="420" cy="50" r="16" fill="#e11d48" fillOpacity="0.2" />
                  <text x="426" y="68" fontSize="9" fill="#e11d48" fontFamily="sans-serif" fontWeight="bold">You</text>

                  {/* Road labels */}
                  <text x="110" y="220" fontSize="9" fill="#a18276" transform="rotate(-30 110 220)" fontFamily="sans-serif" fontWeight="bold">Pollachi Express</text>
                  <text x="290" y="110" fontSize="9" fill="#a18276" transform="rotate(-30 290 110)" fontFamily="sans-serif" fontWeight="bold">NH-544</text>

                  {/* Truck marker */}
                  {(() => {
                    const t = mapProgress / 100;
                    const mt = 1 - t;
                    const x = Math.round(mt * mt * mt * 60 + 3 * mt * mt * t * 150 + 3 * mt * t * t * 300 + t * t * t * 420);
                    const y = Math.round(mt * mt * mt * 230 + 3 * mt * mt * t * 80 + 3 * mt * t * t * 240 + t * t * t * 50);
                    return (
                      <g transform={`translate(${x - 14}, ${y - 14})`}>
                        <circle cx="14" cy="14" r="18" fill="#C89B3C" fillOpacity="0.2" className="animate-pulse" />
                        <circle cx="14" cy="14" r="12" fill="#C89B3C" />
                        <text x="8" y="18" fontSize="12" fill="white">🚚</text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Delivery Agent Card */}
              <div className="mt-4 p-4 rounded-xl bg-cream/60 dark:bg-coconut-light/5 border border-coconut/10 dark:border-cream/10 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-lg">R</div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-coconut dark:text-cream">Ramesh Kumar</h4>
                    <p className="text-xs text-muted flex items-center gap-1">
                      <Star size={10} className="fill-gold text-gold" />
                      4.9 · Verified PureCoco Delivery Partner
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href="tel:+919012345678" className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-natural text-white hover:bg-natural/90 transition-colors font-sans">
                    <Phone size={12} /> Call Agent
                  </a>
                  <button
                    onClick={() => setShowMapView(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gold text-white hover:bg-gold-dark transition-colors font-sans"
                  >
                    <Map size={12} /> Open Map
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Availability Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-coconut-light/10 shadow-soft">
            <h3 className="font-display font-bold text-coconut dark:text-cream text-lg mb-1 flex items-center gap-2">
              <Clock className="text-natural" size={20} />
              Delivery Day Availability
            </h3>
            <p className="text-sm text-muted mb-5 font-sans">
              Let our delivery agent know if you're available to receive the package today.
            </p>

            {prefsaved ? (
              <div className="p-6 rounded-xl bg-natural/10 border border-natural/20 text-center space-y-4 animate-scale-in">
                <div className="w-14 h-14 rounded-full bg-natural/20 flex items-center justify-center mx-auto text-natural">
                  <Check size={28} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-coconut dark:text-cream text-lg">Preference Saved!</h4>
                  <p className="text-xs text-muted mt-1 font-sans">Driver Ramesh has been notified of your preference.</p>
                </div>
                <div className="p-3 bg-white dark:bg-coconut-dark/40 rounded-lg border border-natural/10 text-left text-xs">
                  <span className="text-muted block text-[10px] font-semibold uppercase tracking-wider mb-1">Your Preference</span>
                  <span className="font-bold text-coconut dark:text-cream font-sans">
                    {order.deliveryAvailability === 'available' && '✅ I am home & ready to receive.'}
                    {order.deliveryAvailability === 'neighbor' && '🏠 Leave with neighbor / security.'}
                    {order.deliveryAvailability === 'doorstep' && '📦 Leave at my doorstep.'}
                    {order.deliveryAvailability === 'reschedule' && '📅 Reschedule delivery.'}
                  </span>
                  {order.deliveryNotes && <p className="text-muted mt-1 font-sans">{order.deliveryNotes}</p>}
                </div>
                <button
                  onClick={() => { setAvailability(''); setOrder({ ...order, deliveryAvailability: 'pending' }); }}
                  className="text-sm text-gold font-sans font-bold hover:underline"
                >
                  Change Preference
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveAvailability} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'available', label: '🏠 I am home & available', desc: 'Hand over directly to me' },
                    { id: 'neighbor', label: '👥 Leave with neighbor/security', desc: 'I will specify who below' },
                    { id: 'doorstep', label: '📦 Leave at my doorstep', desc: 'Contactless delivery' },
                    { id: 'reschedule', label: '📅 Reschedule delivery', desc: 'Pick another date & time' },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={cn(
                        'flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200',
                        availability === opt.id
                          ? 'border-gold bg-gold/8 dark:bg-gold/10 shadow-sm'
                          : 'border-coconut/10 dark:border-cream/10 hover:border-gold/40'
                      )}
                    >
                      <input
                        type="radio" name="availability" value={opt.id}
                        checked={availability === opt.id}
                        onChange={() => setAvailability(opt.id)}
                        className="mt-0.5 w-4 h-4 text-gold border-coconut/20 focus:ring-gold"
                      />
                      <div>
                        <span className="font-semibold text-sm block text-coconut dark:text-cream">{opt.label}</span>
                        <span className="text-xs text-muted">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {availability === 'neighbor' && (
                  <div className="animate-fade-in">
                    <Input
                      label="Neighbor / Security Instructions"
                      required
                      placeholder="e.g. Leave with security guard at Gate B"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                )}

                {availability === 'reschedule' && (
                  <div className="space-y-3 animate-fade-in">
                    <Input
                      label="Select New Date"
                      type="date"
                      required
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                      value={rescheduleDate}
                      onChange={e => setRescheduleDate(e.target.value)}
                    />
                    <div>
                      <label className="block text-sm font-sans font-medium text-body mb-1.5">Select Time Slot</label>
                      <select
                        className="w-full px-4 py-2.5 rounded-lg font-sans bg-white dark:bg-coconut-light/30 border-2 border-coconut/20 dark:border-cream/20 text-coconut dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold/50"
                        value={rescheduleTime}
                        onChange={e => setRescheduleTime(e.target.value)}
                      >
                        <option>10:00 AM - 01:00 PM</option>
                        <option>01:00 PM - 04:00 PM</option>
                        <option>04:00 PM - 07:00 PM</option>
                      </select>
                    </div>
                  </div>
                )}

                {availability === 'doorstep' && (
                  <div className="animate-fade-in">
                    <Input
                      label="Any special instructions? (Optional)"
                      placeholder="e.g. Door is on the left side"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                )}

                <Button type="submit" variant="secondary" className="w-full" size="lg" loading={isSubmitting}>
                  Confirm Delivery Preference
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Shipping Address */}
        <div className="p-6 rounded-2xl bg-white dark:bg-coconut-light/10 shadow-soft md:col-span-2">
          <h3 className="font-display font-semibold text-coconut dark:text-cream mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-gold" /> Shipping Address
          </h3>
          <div className="text-sm font-sans text-coconut/80 dark:text-cream/80 space-y-1">
            <p className="font-bold text-base text-coconut dark:text-cream">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
            {order.shippingAddress?.phone && (
              <p className="pt-2 flex items-center gap-1 font-semibold text-coconut dark:text-cream">
                <Phone size={12} /> {order.shippingAddress.phone}
              </p>
            )}
          </div>
        </div>

        {/* Courier Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-coconut-light/10 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-coconut dark:text-cream mb-4 flex items-center gap-2">
              <Truck size={18} className="text-gold" /> Courier
            </h3>
            <div className="text-sm font-sans space-y-3">
              <div>
                <span className="text-xs text-muted block">Carrier</span>
                <span className="font-semibold text-body">{order.tracking?.carrier || 'BlueDart'}</span>
              </div>
              <div>
                <span className="text-xs text-muted block">Tracking ID</span>
                <span className="font-mono text-xs font-bold bg-cream dark:bg-coconut-dark px-2 py-1 rounded border border-coconut/10 dark:border-cream/10 inline-block">
                  {order.tracking?.trackingId || 'PC-74920489'}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted block">Payment</span>
                <span className="font-semibold text-body capitalize">{order.paymentMethod?.toUpperCase() || 'COD'}</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-coconut/10 dark:border-cream/10 mt-4 flex items-center gap-2 text-natural text-xs font-semibold">
            <Clock size={14} />
            Est. Delivery: {formatDate(order.tracking?.estimatedDelivery || order.createdAt)}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6 rounded-2xl bg-white dark:bg-coconut-light/10 shadow-soft mb-8">
        <h3 className="font-display font-semibold text-coconut dark:text-cream mb-4">Ordered Products</h3>
        <div className="space-y-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-coconut/10 dark:border-cream/10 last:border-0 items-center justify-between">
              <div className="flex gap-3 items-center">
                <img
                  src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&q=80'}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover border border-coconut/10 dark:border-cream/10"
                />
                <div>
                  <p className="font-sans font-bold text-sm text-coconut dark:text-cream">{item.name}</p>
                  <p className="text-xs text-muted">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                </div>
              </div>
              <span className="font-sans font-bold text-coconut dark:text-cream text-sm">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-coconut/10 dark:border-cream/10 space-y-1 text-sm font-sans">
          {order.subtotal && (
            <div className="flex justify-between text-coconut/70 dark:text-cream/70">
              <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
            </div>
          )}
          {order.shipping !== undefined && (
            <div className="flex justify-between text-coconut/70 dark:text-cream/70">
              <span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-2 border-t border-coconut/10 dark:border-cream/10 mt-2">
            <span className="text-coconut dark:text-cream">Grand Total</span>
            <span className="text-gold">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <Link to="/shop">
          <Button variant="secondary">Continue Shopping</Button>
        </Link>
        {order.status === 'delivered' && order.items?.length > 0 && (
          <Link to={`/product/${order.items[0].product || order.items[0]._id}`}>
            <Button variant="ghost">
              <Star size={16} /> Write a Review
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
