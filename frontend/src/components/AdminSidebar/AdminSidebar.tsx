import { NavLink } from 'react-router-dom';
import {
  InboxOutlined,
  SettingOutlined,
  TeamOutlined,
  PlusCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminSidebar.module.css';

export function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.logo}>
          Play<span>Flex</span>
        </h2>
        <span className={styles.badge}>Panel Gospodarza</span>
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <InboxOutlined className={styles.icon} />
          Rezerwacje
        </NavLink>
        <NavLink
          to="/admin/dashboard/settings"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <SettingOutlined className={styles.icon} />
          Ustawienia obiektu
        </NavLink>
        <NavLink
          to="/admin/dashboard/users"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <TeamOutlined className={styles.icon} />
          Klienci
        </NavLink>
        <NavLink
          to="/admin/dashboard/manual-reservation"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <PlusCircleOutlined className={styles.icon} />
          Dodaj rezerwację
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <button onClick={logout} className={styles.logoutButton}>
          <LogoutOutlined className={styles.icon} />
          Wyloguj się
        </button>
      </div>
    </aside>
  );
}
