import { Suspense, useEffect } from 'react';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/common/Toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartSidebar from './components/cart/CartSidebar';
import AiAssistant from './components/common/AiAssistant';
import { PageLoader } from './components/common/Loader';
import { routes } from './routes';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main id="main-content" className="min-h-screen">
      {children}
    </main>
    <Footer />
    <CartSidebar />
    <AiAssistant />
  </>
);

const PageLayout = ({ layout, children }) => {
  if (layout === 'admin' || layout === 'auth') return children;
  return <MainLayout>{children}</MainLayout>;
};

const ScrollToTop = () => {
  const location = useLocation();

  // scroll to top on route change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname]);


  return null;
};




function App() {

  return (
    <BrowserRouter>

      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Suspense fallback={<PageLoader />}>
                <ScrollToTop />
                <Routes>

                  {routes.map(({ path, element: Component, layout }) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <PageLayout layout={layout}>
                          <Component />
                        </PageLayout>
                      }
                    />
                  ))}
                </Routes>
              </Suspense>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
