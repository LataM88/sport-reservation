import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../../components/AdminSidebar/AdminSidebar';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
