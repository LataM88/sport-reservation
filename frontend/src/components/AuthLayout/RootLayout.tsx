import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Navbar from '../NavLayout/Navbar';
import Footer from '../NavLayout/Footer';
import styles from './RootLayout.module.css';

const RootLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin/dashboard');

  return (
    <div className={styles.layout}>
      <ScrollRestoration />
      {!isAdminRoute && <Navbar />}
      <main className={`${styles.main} ${isAdminRoute ? styles.adminMain : ''}`}>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default RootLayout;
