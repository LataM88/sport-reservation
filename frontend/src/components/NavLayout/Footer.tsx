import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>
              Play<span className={styles.logoAccent}>Flex</span>
            </span>
            <p className={styles.tagline}>
              Twoje hobby. Nasze obiekty.
              <br />
              Rezerwuj sport w mgnieniu oka.
            </p>
          </div>

          <div className={styles.cols}>
            <div className={styles.col}>
              <span className={styles.colTitle}>Platforma</span>
              <Link to="/" className={styles.colLink}>Strona główna</Link>
              <Link to="/#categories" className={styles.colLink}>Kategorie</Link>
              <Link to="/#how-it-works" className={styles.colLink}>Jak to działa?</Link>
            </div>
            <div className={styles.col}>
              <span className={styles.colTitle}>Konto</span>
              <Link to="/login" className={styles.colLink}>Zaloguj się</Link>
              <Link to="/register" className={styles.colLink}>Zarejestruj się</Link>
              <Link to="/forgot-password" className={styles.colLink}>Reset hasła</Link>
            </div>
            <div className={styles.col}>
              <span className={styles.colTitle}>Kontakt</span>
              <a href="mailto:kontakt@playflex.pl" className={styles.colLink}>kontakt@playflex.pl</a>
              <a href="tel:+48000000000" className={styles.colLink}>+48 000 000 000</a>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <span className={styles.copy}>
            &copy; {new Date().getFullYear()} PlayFlex. Wszystkie prawa zastrzeżone.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
