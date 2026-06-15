import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Menu, X, ShoppingBag, User, Sun, Moon, Search, ShieldCheck, Bell } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { NAV_LINKS, APP_NAME } from '../../utils/constants';
import { cn } from '../../utils/formatCurrency';
import notificationService from '../../services/notificationService';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { itemCount, setIsOpen } = useCart();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, user, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      setNotifications([]);
      return;
    }
    notificationService.getUserNotifications(user._id)
      .then((data) => setNotifications(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => setNotifications([]));
  }, [isAuthenticated, user?._id, location.pathname]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const markNotificationRead = async (id) => {
    setNotifications((items) => items.map((item) => item._id === id ? { ...item, isRead: true } : item));
    try {
      await notificationService.markAsRead(id);
    } catch {
      // Keep the optimistic UI state; the next reload will sync from the API.
    }
  };

  const linkClass = (path) =>
    cn(
      'text-sm font-sans font-semibold transition-colors hover:text-gold',
      location.pathname === path ? 'text-gold' : 'text-coconut dark:text-cream'
    );

  const iconClass = 'p-2 rounded transition-colors text-coconut dark:text-cream hover:bg-coconut/10 dark:hover:bg-cream/10';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-coconut-dark border-b border-coconut/10 dark:border-cream/10 shadow-[0_2px_12px_rgba(90,70,51,0.10)]">
      <nav className="container-main flex items-center justify-between py-3.5" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-natural flex items-center justify-center text-white font-display font-bold text-sm">
            P
          </div>
          <span className="font-display text-xl font-semibold text-coconut dark:text-cream transition-colors group-hover:text-gold">
            {APP_NAME}
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className={linkClass(link.path)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/shop" className={iconClass} aria-label="Search products">
            <Search size={20} />
          </Link>

          <button
            onClick={toggleTheme}
            className={iconClass}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className={cn(iconClass, 'relative')}
            aria-label={`Shopping cart, ${itemCount} items`}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((open) => !open)}
                className={cn(iconClass, 'relative')}
                aria-label={`Notifications, ${unreadCount} unread`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-coconut/10 dark:border-cream/10 bg-white dark:bg-coconut-dark shadow-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-coconut/10 dark:border-cream/10">
                    <p className="text-sm font-bold text-coconut dark:text-cream">Notifications</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-muted">No notifications yet</p>
                    ) : notifications.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => markNotificationRead(item._id)}
                        className="w-full text-left px-4 py-3 border-b border-coconut/5 dark:border-cream/5 hover:bg-coconut/5 dark:hover:bg-cream/5"
                      >
                        <div className="flex items-start gap-2">
                          {!item.isRead && <span className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-coconut dark:text-cream truncate">{item.title}</p>
                            <p className="text-xs text-muted line-clamp-2">{item.message}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'}
            className={cn(iconClass, 'hidden sm:flex')}
            aria-label={isAuthenticated ? (isAdmin ? 'Admin panel' : 'Dashboard') : 'Login'}
          >
            {isAdmin ? <ShieldCheck size={20} /> : <User size={20} />}
          </Link>

          <button
            className={cn(iconClass, 'lg:hidden')}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-coconut/10 dark:border-cream/10 bg-white dark:bg-coconut-dark animate-slide-up">
          <ul className="container-main py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-sans font-semibold transition-colors',
                    location.pathname === link.path
                      ? 'bg-gold/15 text-gold'
                      : 'text-coconut dark:text-cream hover:bg-coconut/8 dark:hover:bg-cream/8'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'}
                className="block px-4 py-3 rounded-lg text-sm font-sans font-semibold text-coconut dark:text-cream hover:bg-coconut/8 dark:hover:bg-cream/8"
              >
                {isAuthenticated ? (isAdmin ? 'Admin Panel' : `Hi, ${user?.name?.split(' ')[0]}`) : 'Login / Register'}
              </Link>
            </li>
            {isAuthenticated && isAdmin && (
              <li>
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 rounded-lg text-sm font-sans font-semibold text-coconut dark:text-cream hover:bg-coconut/8 dark:hover:bg-cream/8"
                >
                  User Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
