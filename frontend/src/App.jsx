import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Suspense fallback={<PageLoader />}>
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
