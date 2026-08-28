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
  const hasSidebar =
    isAuthenticated &&
    (location.pathname.startsWith('/dashboard') ||
      location.pathname.startsWith('/my-bookings') ||
      location.pathname.startsWith('/profile') ||
      location.pathname.startsWith('/ai-reservations'));

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  const smoothScrollTo = (targetY: number, duration: number = 600) => {
    const startY =
      window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetY - startY;
    if (Math.abs(distance) < 5) return;
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      // easeInOutCubic for a smooth acceleration & deceleration
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();

    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const navbarHeight = 68;
        const targetY =
          el.getBoundingClientRect().top +
          (window.scrollY || window.pageYOffset) -
          navbarHeight -
          16;
        smoothScrollTo(Math.max(0, targetY), 650);
        window.history.pushState({}, '', `/#${sectionId}`);
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
  };

  return (
    <nav
      className={`${styles.navbar} ${hasSidebar ? styles.navbarWithSidebar : ''}`}
    >
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          Play<span className={styles.logoAccent}>Flex</span>
        </Link>

        <div className={styles.links}>
          <a
            href="/"
            className={styles.link}
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              if (location.pathname === '/') {
                smoothScrollTo(0, 500);
              } else {
                navigate('/');
              }
            }}
          >
            Główna
          </a>
          <a
            href="#categories"
            className={styles.link}
            onClick={scrollToSection('categories')}
          >
            Kategorie
          </a>
          <a
            href="#how-it-works"
            className={styles.link}
            onClick={scrollToSection('how-it-works')}
          >
            Jak to działa?
          </a>
        </div>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link to="/ai-reservations">
                <Button variant="ghost" size="sm">
                  Rezerwuj z AI
                </Button>
              </Link>
              <Button variant="primary" size="sm" onClick={handleLogout}>
                Wyloguj
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Zaloguj
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Zarejestruj
                </Button>
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
        <a
          href="/"
          className={styles.drawerLink}
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            if (location.pathname === '/') {
              smoothScrollTo(0, 500);
            } else {
              navigate('/');
            }
          }}
        >
          Główna
        </a>
        <a
          href="#categories"
          className={styles.drawerLink}
          onClick={scrollToSection('categories')}
        >
          Kategorie
        </a>
        <a
          href="#how-it-works"
          className={styles.drawerLink}
          onClick={scrollToSection('how-it-works')}
        >
          Jak to działa?
        </a>

        <div className={styles.drawerActions}>
          {isAuthenticated ? (
            <>
              <Link to="/reservations" onClick={closeMenu}>
                <Button variant="ghost" size="sm" fullWidth>
                  Rezerwuj
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleLogout}
              >
                Wyloguj
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                <Button variant="ghost" size="sm" fullWidth>
                  Zaloguj
                </Button>
              </Link>
              <Link to="/register" onClick={closeMenu}>
                <Button variant="primary" size="sm" fullWidth>
                  Zarejestruj
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
