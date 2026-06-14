import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import { cn } from '../../utils/formatCurrency';

const AdminLayout = ({ children, title, subtitle }) => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen bg-cream dark:bg-coconut-dark">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-coconut/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full z-50 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 p-4 border-b border-coconut/10 dark:border-cream/10 bg-white dark:bg-coconut-light/20 lg:hidden sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-coconut/10 dark:hover:bg-cream/10 text-coconut dark:text-cream"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <div>
            {title && <h1 className="font-display text-lg font-bold text-coconut dark:text-cream">{title}</h1>}
            {subtitle && <p className="text-xs text-coconut/60 dark:text-cream/60">{subtitle}</p>}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {(title || subtitle) && (
            <div className="mb-8 hidden lg:block">
              {title && <h1 className="font-display text-2xl font-bold text-coconut dark:text-cream">{title}</h1>}
              {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
