import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../NavLayout/Navbar';
import Footer from '../NavLayout/Footer';
import styles from './RootLayout.module.css';

const RootLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin/dashboard');
  const prevPathname = useRef(location.pathname);

  // Scroll to top when navigating to a different page (pathname change),
  // but NOT when just scrolling to an anchor on the same page.
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      prevPathname.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <div className={styles.layout}>
      {!isAdminRoute && <Navbar />}
      <main className={`${styles.main} ${isAdminRoute ? styles.adminMain : ''}`}>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default RootLayout;
