import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { GitCompare, X, Plus } from 'lucide-react';
import { MOCK_PRODUCTS } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';
import PurityScore from '../components/product/PurityScore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Compare = () => {
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || [];
    if (ids.length) {
      setSelected(MOCK_PRODUCTS.filter((p) => ids.includes(p._id)).slice(0, 3));
    }
  }, [searchParams]);

  const addProduct = (product) => {
    if (selected.length >= 3 || selected.find((p) => p._id === product._id)) return;
    setSelected([...selected, product]);
  };

  const removeProduct = (id) => {
    setSelected(selected.filter((p) => p._id !== id));
  };

  const compareFields = [
    { key: 'price', label: 'Price', render: (p) => formatCurrency(p.price) },
    { key: 'size', label: 'Size' },
    { key: 'purityScore', label: 'Purity Score', render: (p) => `${p.purityScore}/100` },
    { key: 'lauricAcid', label: 'Lauric Acid', render: (p) => `${p.purityMetrics.lauricAcid}%` },
    { key: 'moisture', label: 'Moisture', render: (p) => `${p.purityMetrics.moisture}%` },
    { key: 'rating', label: 'Rating', render: (p) => `${p.rating} (${p.reviewCount})` },
    { key: 'category', label: 'Category', render: (p) => <span className="capitalize">{p.category}</span> },
    { key: 'usage', label: 'Best For', render: (p) => p.usage.join(', ') },
    { key: 'farm', label: 'Farm', render: (p) => p.farm.name },
  ];

  const available = MOCK_PRODUCTS.filter((p) => !selected.find((s) => s._id === p._id));

  return (
    <div className="container-main pt-24 pb-16 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <GitCompare size={28} className="text-gold" />
        <div>
          <h1 className="font-display text-3xl font-bold text-coconut dark:text-cream">Compare Products</h1>
          <p className="text-coconut/70 dark:text-cream/70 font-medium text-sm">Select up to 3 products to compare side by side</p>
        </div>
      </div>

      {selected.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-coconut/70 dark:text-cream/70 font-medium mb-6">No products selected for comparison</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {MOCK_PRODUCTS.map((product) => (
              <button
                key={product._id}
                onClick={() => addProduct(product)}
                className="p-4 rounded-xl bg-white dark:bg-coconut-light/20 shadow-soft hover:shadow-card transition-all text-left card-hover"
              >
                <img src={product.images[0]} alt="" className="w-full aspect-square object-cover rounded-lg mb-3" />
                <p className="font-bold text-sm text-coconut dark:text-cream">{product.name}</p>
                <p className="text-gold font-semibold text-sm">{formatCurrency(product.price)}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-8">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 text-left text-sm font-bold text-coconut/70 dark:text-cream/70 w-40">Feature</th>
                  {selected.map((product) => (
                    <th key={product._id} className="p-4 text-center min-w-[200px]">
                      <div className="relative inline-block">
                        <button onClick={() => removeProduct(product._id)} className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200" aria-label="Remove">
                          <X size={12} />
                        </button>
                        <img src={product.images[0]} alt="" className="w-24 h-24 mx-auto rounded-lg object-cover mb-2" />
                        <Link to={`/product/${product._id}`} className="font-display font-semibold text-sm hover:text-gold transition-colors">
                          {product.name}
                        </Link>
                        <div className="mt-2"><PurityScore score={product.purityScore} compact /></div>
                      </div>
                    </th>
                  ))}
                  {selected.length < 3 && (
                    <th className="p-4 text-center min-w-[200px]">
                      <div className="w-24 h-24 mx-auto rounded-lg border-2 border-dashed border-coconut/20 flex items-center justify-center mb-2">
                        <Plus size={24} className="text-coconut/30" />
                      </div>
                      <p className="text-sm text-coconut/40">Add product</p>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {compareFields.map((field) => (
                  <tr key={field.key} className="border-t border-coconut/10">
                    <td className="p-4 text-sm font-semibold text-coconut/70 dark:text-cream/60">{field.label}</td>
                    {selected.map((product) => (
                      <td key={product._id} className="p-4 text-center text-sm font-medium text-coconut dark:text-cream">
                        {field.render ? field.render(product) : product[field.key]}
                      </td>
                    ))}
                    {selected.length < 3 && <td />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected.length < 3 && available.length > 0 && (
            <div>
              <h3 className="font-display font-semibold mb-4">Add More Products</h3>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {available.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => addProduct(product)}
                    className="shrink-0 w-40 p-3 rounded-xl bg-white dark:bg-coconut-light/10 shadow-soft hover:shadow-card transition-all text-left"
                  >
                    <img src={product.images[0]} alt="" className="w-full aspect-square object-cover rounded-lg mb-2" />
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <Badge variant="gold" className="mt-1">{formatCurrency(product.price)}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {selected.map((product) => (
              <Button key={product._id} variant="secondary" size="sm">
                <Link to={`/product/${product._id}`}>View {product.name.split(' ')[0]}</Link>
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Compare;
