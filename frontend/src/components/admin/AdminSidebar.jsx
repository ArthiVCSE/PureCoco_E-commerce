import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, FileText, Settings, LogOut, BarChart3, X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/formatCurrency';

const links = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', path: '/admin/customers', icon: Users },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Blog', path: '/admin/blog', icon: FileText },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminSidebar = ({ onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-coconut dark:bg-coconut-dark text-cream h-full flex flex-col shadow-card">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-cream/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-natural flex items-center justify-center text-white font-display font-bold text-sm">
            P
          </div>
          <div>
            <span className="font-display font-bold text-cream">PureCoco</span>
            <p className="text-[10px] text-cream/50 uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-cream/10 text-cream/70 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {links.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors',
              location.pathname === path
                ? 'bg-gold text-white shadow-sm'
                : 'text-cream/80 hover:bg-cream/15 hover:text-cream'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-cream/10">
        <button
          onClick={() => { logout(); onClose?.(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-medium text-cream/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
