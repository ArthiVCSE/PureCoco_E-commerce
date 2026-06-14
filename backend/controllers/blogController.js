const Blog = require('../models/Blog');

const mockBlogs = [
  {
    title: 'The Art of Cold-Pressing Coconut Oil in Pollachi',
    slug: 'art-of-cold-pressing',
    excerpt: 'Discover how traditional methods meet modern quality standards.',
    content: 'Cold-pressing is an age-old method of extracting oil that preserves the natural flavor, aroma, and nutritional value of coconuts. Unlike hot-pressed or refined oils, cold-pressed virgin coconut oil is extracted without heating or chemical solvents. In Pollachi, known as the coconut capital, we harvest fresh coconuts and extract oil within 4 hours using state-of-the-art wooden press systems. This ensures a rich presence of lauric acid and medium-chain fatty acids, making it incredibly healthy for cooking and wellness rituals.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
    author: 'PureCoco Team',
    category: 'Process',
    readTime: '5 min',
  },
  {
    title: '5 Ways to Use Coconut Oil in Your Daily Routine',
    slug: '5-ways-coconut-oil',
    excerpt: 'From cooking to skincare — unlock the full potential of pure coconut oil.',
    content: 'Pure cold-pressed virgin coconut oil is a multi-purpose powerhouse. Here are 5 ways you can incorporate it into your routine: 1) Daily Oil Pulling - Swish a tablespoon for 10-15 minutes for excellent oral health. 2) Healthy Cooking - High smoke point makes it great for sauteing and baking. 3) Hair Conditioner - Massage into your scalp weekly to prevent protein loss and promote shiny growth. 4) Natural Moisturizer - Hydrate dry skin without synthetic chemicals. 5) Organic Lip Balm - Apply a tiny drop to dry lips for instant soothing hydration.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    author: 'Dr. Ananya Iyer',
    category: 'Wellness',
    readTime: '4 min',
  },
  {
    title: 'Meet the Farmers: Rajan Kumar of Green Valley Estate',
    slug: 'meet-farmer-rajan',
    excerpt: 'A third-generation coconut farmer shares his passion for sustainable agriculture.',
    content: 'PureCoco works directly with farmers like Rajan Kumar from Pollachi. Rajan has been farming organically for over twenty years, employing traditional rain harvesting and composting techniques. By partnering directly with local farmers, we ensure fair trade pricing and maintain full batch-level traceability. Every bottle of PureCoco can be traced back directly to estates like Green Valley, preserving agricultural legacy and giving you peace of mind.',
    image: 'https://images.unsplash.com/photo-1500595040803-6d735ecc8d0a?w=800&q=80',
    author: 'PureCoco Team',
    category: 'Harvest Story',
    readTime: '6 min',
  }
];

// Seed default blogs if empty
const checkAndSeedBlogs = async () => {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(mockBlogs);
      console.log('✓ Mock blogs seeded in database');
    }
  } catch (err) {
    console.error('Failed to seed mock blogs:', err.message);
  }
};

exports.getBlogs = async (req, res) => {
  try {
    await checkAndSeedBlogs();
    const blogs = await Blog.find().sort('-createdAt');
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, image, author, category, readTime } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      image,
      author,
      category,
      readTime
    });
    res.status(201).json(blog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A blog post with a similar title already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title } = req.body;
    const updateData = { ...req.body };
    if (title) {
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, updateData, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
