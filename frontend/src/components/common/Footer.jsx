import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { APP_NAME, FOOTER_LINKS } from '../../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-coconut text-cream/90" role="contentinfo">
      <div className="container-main section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-natural flex items-center justify-center text-white font-display font-bold text-sm">
                P
              </div>
              <span className="font-display text-xl font-semibold text-cream">{APP_NAME}</span>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed mb-4">
              Premium cold-pressed coconut oil from Pollachi farms. Farm-to-bottle traceability with verified purity.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="p-2 rounded bg-cream/10 hover:bg-gold/30 transition-colors"
                  aria-label="Social media"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-display text-lg font-semibold text-cream mb-4 capitalize">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-cream/85 hover:text-gold transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-lg font-semibold text-cream mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-cream/85 font-medium">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                Green Valley Estate, Pollachi, Tamil Nadu 642001
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-gold" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-gold" />
                hello@purecoco.in
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-cream/50">
          <p className="text-sm text-cream/70">&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
