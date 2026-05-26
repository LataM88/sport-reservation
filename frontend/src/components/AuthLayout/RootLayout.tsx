import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../NavLayout/Navbar';
import Footer from '../NavLayout/Footer';
import styles from './RootLayout.module.css';

const RootLayout = () => {
  return (
    <div className={styles.layout}>
      <ScrollRestoration />
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
