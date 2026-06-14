import { useState } from 'react';
import { Search, Shield, CheckCircle, XCircle, Leaf, Factory, FlaskConical, Package } from 'lucide-react';
import productService from '../services/productService';
import { formatDate } from '../utils/formatCurrency';
import PurityScore from '../components/product/PurityScore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const traceSteps = [
  { icon: Leaf, title: 'Organic Farm', desc: 'Pollachi, Tamil Nadu' },
  { icon: Factory, title: 'Cold Press', desc: 'Within 4 hours' },
  { icon: FlaskConical, title: 'Lab Tested', desc: 'Purity verified' },
  { icon: Package, title: 'Bottled', desc: 'Glass packaging' },
];

const Traceability = () => {
  const [batchId, setBatchId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!batchId.trim()) return;
    setLoading(true);
    const data = await productService.verifyBatch(batchId.trim().toUpperCase());
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <section className="bg-coconut text-cream pt-20 pb-16">
        <div className="container-main text-center max-w-2xl mx-auto">
          <Shield size={48} className="mx-auto mb-4 text-gold" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Batch Verification</h1>
          <p className="text-cream/70 text-lg">
            Enter the batch ID printed on your bottle to verify authenticity and view complete traceability data.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main max-w-xl mx-auto">
          <form onSubmit={handleVerify} className="flex gap-3 mb-8">
            <div className="flex-1">
              <Input
                placeholder="e.g. PC-2026-A7K9M2"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                icon={Search}
              />
            </div>
            <Button type="submit" variant="secondary" loading={loading}>Verify</Button>
          </form>

          <p className="text-center text-sm text-coconut/60 dark:text-cream/60 mb-8 font-medium">
            Try: <button onClick={() => setBatchId('PC-2026-A7K9M2')} className="text-gold hover:underline font-mono font-bold">PC-2026-A7K9M2</button>
          </p>

          {result && (
            <div className="animate-scale-in">
              {result.verified ? (
                <div className="p-6 rounded-xl bg-white dark:bg-coconut-light/10 shadow-card">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle size={32} className="text-natural" />
                    <div>
                      <h2 className="font-display text-xl font-semibold text-natural">Verified Authentic</h2>
                      <p className="text-sm text-coconut/60">{result.message}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="flex justify-center">
                      <PurityScore score={result.product.purityScore} />
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between p-3 rounded-lg bg-coconut/8 dark:bg-cream/10"><span className="text-coconut/60 dark:text-cream/60 font-medium">Product</span><span className="font-semibold text-coconut dark:text-cream">{result.product.name}</span></div>
                      <div className="flex justify-between p-3 rounded-lg bg-coconut/8 dark:bg-cream/10"><span className="text-coconut/60 dark:text-cream/60 font-medium">Batch ID</span><span className="font-mono font-semibold text-coconut dark:text-cream">{result.product.batchId}</span></div>
                      <div className="flex justify-between p-3 rounded-lg bg-coconut/8 dark:bg-cream/10"><span className="text-coconut/60 dark:text-cream/60 font-medium">Harvest</span><span className="font-semibold text-coconut dark:text-cream">{formatDate(result.product.harvestDate)}</span></div>
                      <div className="flex justify-between p-3 rounded-lg bg-coconut/8 dark:bg-cream/10"><span className="text-coconut/60 dark:text-cream/60 font-medium">Farm</span><span className="font-semibold text-coconut dark:text-cream">{result.product.farm.name}</span></div>
                      <div className="flex justify-between p-3 rounded-lg bg-coconut/8 dark:bg-cream/10"><span className="text-coconut/60 dark:text-cream/60 font-medium">Farmer</span><span className="font-semibold text-coconut dark:text-cream">{result.product.farm.farmer}</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {traceSteps.map(({ icon: Icon, title, desc }) => (
                      <div key={title} className="text-center p-3 rounded-lg bg-natural/5">
                        <Icon size={24} className="mx-auto mb-2 text-natural" />
                        <p className="text-xs font-medium">{title}</p>
                        <p className="text-[10px] text-coconut/50">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 text-center">
                  <XCircle size={32} className="mx-auto mb-3 text-red-500" />
                  <h2 className="font-display text-xl font-semibold text-red-600 mb-1">Not Verified</h2>
                  <p className="text-sm text-red-500/80">{result.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-white dark:bg-coconut-light/5">
        <div className="container-main">
          <h2 className="font-display text-3xl font-bold text-center mb-10">How Traceability Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Scan QR Code', desc: 'Find the QR code on your bottle label' },
              { step: '2', title: 'Enter Batch ID', desc: 'Type or scan the unique batch identifier' },
              { step: '3', title: 'View Results', desc: 'See farm origin, harvest date, and purity data' },
              { step: '4', title: 'Trust Verified', desc: '100% authentic PureCoco product guaranteed' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center p-5">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gold text-white flex items-center justify-center font-bold">{step}</div>
                <h3 className="font-display font-semibold mb-1">{title}</h3>
                <p className="text-sm text-coconut/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Traceability;
