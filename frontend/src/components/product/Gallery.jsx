import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '../../utils/formatCurrency';

const Gallery = ({ images, alt = 'Product' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-dark group">
        <img
          src={images[activeIndex]}
          alt={`${alt} - view ${activeIndex + 1}`}
          className={cn(
            'w-full h-full object-cover transition-transform duration-500',
            zoomed && 'scale-150 cursor-zoom-out'
          )}
          onClick={() => setZoomed(!zoomed)}
        />

        <button
          onClick={() => setZoomed(!zoomed)}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/80 dark:bg-coconut/80 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
        >
          <ZoomIn size={18} />
        </button>
      </div>


    </div>
  );
};

export default Gallery;
