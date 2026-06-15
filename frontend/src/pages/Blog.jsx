import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import productService from '../services/productService';
import { formatDate, truncateText } from '../utils/formatCurrency';
import Badge from '../components/ui/Badge';
import { ProductCardSkeleton } from '../components/common/Loader';

const Blog = () => {
  const { data, loading } = useFetch(() => productService.getBlogs());
  const blogs = data?.blogs || [];

  return (
    <div className="animate-fade-in">
      <section className="bg-coconut text-cream pt-20 pb-16">
        <div className="container-main text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">PureCoco Journal</h1>
          <p className="text-cream/70 max-w-lg mx-auto">
            Stories from our farms, wellness tips, and the art of pure coconut oil
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, i) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog.slug}`}
                  className="group rounded-xl overflow-hidden bg-white dark:bg-coconut-light/10 shadow-soft card-hover animate-slide-up opacity-0"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="gold">{blog.category}</Badge>
                      <span className="text-xs text-coconut/60 dark:text-cream/60 flex items-center gap-1 font-medium">
                        <Clock size={12} /> {blog.readTime}
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-coconut dark:text-cream mb-2 group-hover:text-gold transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-coconut/70 dark:text-cream/70 mb-4 line-clamp-2">
                      {truncateText(blog.excerpt, 120)}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-coconut/60 dark:text-cream/60 font-medium">
                        {formatDate(blog.createdAt || blog.date, 'Recently published')}
                      </span>
                      <span className="text-gold flex items-center gap-1 font-semibold group-hover:gap-2 transition-all">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
