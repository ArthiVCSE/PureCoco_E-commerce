import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const pageContent = {
  '/about': {
    badge: 'About PureCoco',
    title: 'Cold-pressed coconut oil, traceable from Pollachi farms.',
    intro:
      'PureCoco works with coconut growers around Pollachi to make small-batch oil with clear sourcing, lab-style purity metrics, and fresh harvest records customers can verify.',
    sections: [
      {
        heading: 'What We Stand For',
        body:
          'Every bottle is built around freshness, transparent batches, responsible farming, and a simple promise: customers should know where their oil came from and how it was made.',
      },
      {
        heading: 'Farm To Bottle',
        body:
          'Our catalog includes batch IDs, harvest dates, farmer details, and quality metrics so buyers can compare products with confidence before ordering.',
      },
    ],
  },
  '/faq': {
    badge: 'Help Center',
    title: 'Frequently asked questions',
    intro: 'Quick answers for ordering, delivery, returns, purity checks, and product use.',
    faqs: [
      ['How do I track my order?', 'Sign in, open your dashboard, and choose Track Order. When the order is out for delivery, the live map and delivery availability form are shown.'],
      ['Can I update delivery availability?', 'Yes. On the tracking page, customers can mark themselves available, request doorstep delivery, leave neighbor/security instructions, or reschedule.'],
      ['How do I verify a batch?', 'Use the Traceability page and enter the batch ID printed on the bottle or shown on the product detail page.'],
      ['What payment methods are supported?', 'The checkout supports UPI, card, and cash on delivery options in the project flow.'],
      ['Can admins manage products and orders?', 'Yes. Admin pages include product CRUD, blog CRUD, customer management, order status updates, and delivery preference visibility.'],
    ],
  },
  '/contact': {
    badge: 'Contact',
    title: 'We are here to help with orders, batches, and support.',
    intro: 'Reach the PureCoco team for product guidance, delivery help, and wholesale enquiries.',
    contact: true,
  },
  '/privacy': {
    badge: 'Privacy Policy',
    title: 'How PureCoco handles customer data',
    intro:
      'This page explains how customer data is collected and used to support shopping, delivery, and account management. Review these details for your live business before launch.',
    sections: [
      {
        heading: 'Information We Collect',
        body:
          'We collect account details, shipping contact information, order history, payment method selection, and delivery preference notes needed to process purchases.',
      },
      {
        heading: 'How We Use It',
        body:
          'Data is used for authentication, order fulfilment, delivery coordination, customer support, analytics, and admin operations.',
      },
      {
        heading: 'Customer Choices',
        body:
          'Customers can contact support to request corrections, account assistance, or deletion where legally and operationally permitted.',
      },
    ],
  },
  '/terms': {
    badge: 'Terms & Conditions',
    title: 'Terms for using PureCoco',
    intro:
      'These terms describe the expected buying and account rules for the project. Get legal approval before using them in a live business.',
    sections: [
      {
        heading: 'Orders',
        body:
          'Orders are confirmed after checkout details are submitted. Admins may update status, tracking information, and delivery estimates.',
      },
      {
        heading: 'Delivery',
        body:
          'Delivery availability preferences are used to help the delivery partner complete the order on the scheduled day.',
      },
      {
        heading: 'Returns And Support',
        body:
          'Customers should contact support with the order ID, product batch, and photos if a product arrives damaged or incorrect.',
      },
    ],
  },
};

const StaticPage = ({ type }) => {
  const path = type || window.location.pathname;
  const content = pageContent[path] || pageContent['/about'];

  return (
    <div className="container-main pt-28 pb-16 max-w-5xl animate-fade-in">
      <div className="mb-10">
        <Badge variant="gold" className="mb-4">{content.badge}</Badge>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-coconut dark:text-cream max-w-3xl">
          {content.title}
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted font-sans leading-relaxed max-w-3xl">
          {content.intro}
        </p>
      </div>

      {content.contact && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
            { icon: Mail, label: 'Email', value: 'hello@purecoco.in' },
            { icon: MapPin, label: 'Address', value: 'Green Valley Estate, Pollachi, Tamil Nadu 642001' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card p-5">
              <Icon size={20} className="text-gold mb-3" />
              <p className="text-xs uppercase tracking-wider text-muted font-semibold">{label}</p>
              <p className="mt-1 font-sans font-semibold text-coconut dark:text-cream">{value}</p>
            </div>
          ))}
        </div>
      )}

      {content.faqs && (
        <div className="space-y-3">
          {content.faqs.map(([question, answer]) => (
            <details key={question} className="card p-5 group">
              <summary className="cursor-pointer font-display font-semibold text-coconut dark:text-cream">
                {question}
              </summary>
              <p className="mt-3 text-sm text-muted font-sans leading-relaxed">{answer}</p>
            </details>
          ))}
        </div>
      )}

      {content.sections && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {content.sections.map((section) => (
            <section key={section.heading} className="card p-6">
              <h2 className="font-display text-xl font-bold text-coconut dark:text-cream mb-3">
                {section.heading}
              </h2>
              <p className="text-sm text-muted font-sans leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/shop">
          <Button variant="secondary">Shop Products</Button>
        </Link>
        <Link to="/traceability">
          <Button variant="outline">Verify Batch</Button>
        </Link>
      </div>
    </div>
  );
};

export default StaticPage;
