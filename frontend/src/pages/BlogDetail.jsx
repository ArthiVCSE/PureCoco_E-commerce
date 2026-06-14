import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import productService from '../services/productService';
import { formatDate } from '../utils/formatCurrency';
import Badge from '../components/ui/Badge';
import { PageLoader } from '../components/common/Loader';

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: blog, loading } = useFetch(() => productService.getBlogBySlug(slug));

  if (loading) return <PageLoader />;
  if (!blog) {
    return (
      <div className="container-main pt-24 text-center py-20">
        <h2 className="font-display text-2xl mb-4">Article not found</h2>
        <Link to="/blog" className="text-gold hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="animate-fade-in">
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-coconut/80 to-transparent" />
      </div>

      <div className="container-main max-w-3xl -mt-20 relative z-10 pb-16">
        <Link to="/blog" className="inline-flex items-center gap-1 text-cream/80 hover:text-cream text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <div className="p-6 md:p-10 rounded-xl bg-cream dark:bg-coconut-dark shadow-card">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="gold">{blog.category}</Badge>
            <span className="text-sm text-coconut/50 flex items-center gap-1"><Clock size={14} /> {blog.readTime}</span>
            <span className="text-sm text-coconut/50 flex items-center gap-1"><User size={14} /> {blog.author}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-body mb-4">{blog.title}</h1>
          <p className="text-muted font-sans mb-8">{formatDate(blog.date)}</p>

          <div className="max-w-none font-sans">
            <p className="text-lg leading-relaxed text-body mb-6">{blog.excerpt}</p>

            {blog.slug === 'art-of-cold-pressing' && (
              <>
                <p className="leading-relaxed text-muted mb-4">
                  In the heart of Pollachi, Tamil Nadu, where the Western Ghats meet fertile plains, our partner farms have perfected the art of cold-pressing coconut oil for over three generations. Unlike industrial extraction methods that use heat and chemicals, our traditional wood-press technique preserves the natural nutrients, aroma, and flavor of pure coconut oil.
                </p>
                <p className="leading-relaxed text-muted mb-4">
                  The process begins at dawn when mature coconuts are hand-selected from trees that are at least 12 years old. Within 4 hours of dehusking, the white kernel is fed into a traditional wooden press (chekku). The slow, mechanical pressure extracts oil at temperatures below 45°C — ensuring that lauric acid, the key health compound, remains intact at levels above 45%.
                </p>
                <h2 className="font-display text-2xl font-semibold text-body mt-8 mb-4">Quality at Every Step</h2>
                <p className="leading-relaxed text-muted mb-4">
                  Every batch undergoes rigorous lab testing for lauric acid content, moisture levels, free fatty acids, and peroxide value. Our purity score system gives you complete transparency — scan the QR code on your bottle to see the exact metrics for your batch.
                </p>
              </>
            )}

            {blog.slug === '5-ways-coconut-oil' && (
              <>
                <h2 className="font-display text-2xl font-semibold text-body mt-4 mb-4">1. Cooking & Baking</h2>
                <p className="leading-relaxed text-muted mb-4">Use 1-2 tablespoons daily for sautéing, stir-frying, and baking. Coconut oil's high smoke point (350°F) makes it ideal for Indian cooking.</p>
                <h2 className="font-display text-2xl font-semibold text-body mt-6 mb-4">2. Hair Care</h2>
                <p className="leading-relaxed text-muted mb-4">Warm 2-3 teaspoons and massage into scalp. Leave for 30 minutes before washing for deep conditioning.</p>
                <h2 className="font-display text-2xl font-semibold text-body mt-6 mb-4">3. Skin Nourishment</h2>
                <p className="leading-relaxed text-muted mb-4">Apply a teaspoon as a natural moisturizer or makeup remover. Its antimicrobial properties benefit all skin types.</p>
              </>
            )}

            {blog.slug === 'meet-farmer-rajan' && (
              <>
                <p className="leading-relaxed text-muted mb-4">
                  Rajan Kumar stands among his 500 coconut trees at Green Valley Estate, a 40-acre farm his grandfather established in 1962. "My grandfather taught me that a coconut tree is like a family member — you nurture it for years before it gives back," Rajan says with a warm smile.
                </p>
                <p className="leading-relaxed text-muted mb-4">
                  Today, Rajan supplies PureCoco with some of our finest harvests. His farm is certified organic, using only natural compost and intercropping with turmeric and banana for soil health. Every coconut that becomes PureCoco oil can be traced back to the exact row of trees where it was harvested.
                </p>
              </>
            )}

            {blog.slug === 'cooking-guide' && (
              <>
                <p className="leading-relaxed text-muted mb-4">
                  South Indian cuisine and coconut oil are inseparable. From the crackle of mustard seeds in hot oil to the golden crust on a perfectly fried appam, pure coconut oil brings an authenticity that no substitute can match.
                </p>
                <h2 className="font-display text-2xl font-semibold text-body mt-6 mb-4">Tempering (Tadka)</h2>
                <p className="leading-relaxed text-muted mb-4">Heat 1-2 tablespoons of PureCoco oil until shimmering. Add mustard seeds, urad dal, curry leaves, and dried red chillies. Pour over sambar, rasam, or dal for the signature South Indian aroma.</p>
                <h2 className="font-display text-2xl font-semibold text-body mt-6 mb-4">Deep Frying</h2>
                <p className="leading-relaxed text-muted mb-4">With a smoke point of 350°F, our oil is ideal for frying banana chips, vada, and bajji. The oil remains stable and imparts a subtle sweetness to fried foods.</p>
                <h2 className="font-display text-2xl font-semibold text-body mt-6 mb-4">Baking Substitute</h2>
                <p className="leading-relaxed text-muted mb-4">Replace butter 1:1 in cakes and cookies for a dairy-free alternative with a delicate coconut note. Works beautifully in Kerala-style plum cakes.</p>
              </>
            )}

            {blog.slug === 'sustainable-farming' && (
              <>
                <p className="leading-relaxed text-muted mb-4">
                  Sustainability isn't a marketing label for us — it's how our partner farms in Pollachi have operated for decades. Every PureCoco bottle represents a farming system that respects the land, the farmer, and the future.
                </p>
                <h2 className="font-display text-2xl font-semibold text-body mt-6 mb-4">Organic Certification</h2>
                <p className="leading-relaxed text-muted mb-4">All partner farms are certified organic. No synthetic pesticides or fertilizers are used. Natural compost from coconut husk and intercropped legumes replenish soil nitrogen.</p>
                <h2 className="font-display text-2xl font-semibold text-body mt-6 mb-4">Water Conservation</h2>
                <p className="leading-relaxed text-muted mb-4">Drip irrigation systems reduce water usage by 40%. Rainwater harvesting ponds on each estate ensure farms remain productive even during dry seasons.</p>
                <h2 className="font-display text-2xl font-semibold text-body mt-6 mb-4">Fair Trade Practices</h2>
                <p className="leading-relaxed text-muted mb-4">Farmers receive above-market prices with transparent contracts. A portion of every PureCoco sale goes directly to farm infrastructure improvements and children's education funds.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;
