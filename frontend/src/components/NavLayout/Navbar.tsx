import styles from './Navbar.module.css';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Button/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();

    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const navbarHeight = 68;
        const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
        window.history.pushState({}, '', `/#${sectionId}`);
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(doScroll, 150);
    } else {
      doScroll();
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          Play<span className={styles.logoAccent}>Flex</span>
        </Link>

        <div className={styles.links}>
          <Link to="/" className={styles.link} onClick={closeMenu}>Główna</Link>
          <a href="#categories" className={styles.link} onClick={scrollToSection('categories')}>Kategorie</a>
          <a href="#how-it-works" className={styles.link} onClick={scrollToSection('how-it-works')}>Jak to działa?</a>
        </div>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link to="/reservations">
                <Button variant="ghost" size="sm">Rezerwuj</Button>
              </Link>
              <Button variant="primary" size="sm" onClick={handleLogout}>
                Wyloguj
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Zaloguj</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Zarejestruj</Button>
              </Link>
            </>
          )}
        </div>

        <button
          id="navbar-menu-toggle"
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </div>

      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <Link to="/" className={styles.drawerLink} onClick={closeMenu}>Główna</Link>
        <a href="#categories" className={styles.drawerLink} onClick={scrollToSection('categories')}>Kategorie</a>
        <a href="#how-it-works" className={styles.drawerLink} onClick={scrollToSection('how-it-works')}>Jak to działa?</a>

        <div className={styles.drawerActions}>
          {isAuthenticated ? (
            <>
              <Link to="/reservations" onClick={closeMenu}>
                <Button variant="ghost" size="sm" fullWidth>Rezerwuj</Button>
              </Link>
              <Button variant="primary" size="sm" fullWidth onClick={handleLogout}>
                Wyloguj
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                <Button variant="ghost" size="sm" fullWidth>Zaloguj</Button>
              </Link>
              <Link to="/register" onClick={closeMenu}>
                <Button variant="primary" size="sm" fullWidth>Zarejestruj</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;