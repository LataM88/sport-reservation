import styles from './Home.module.css';
import { Row, Col, Typography } from 'antd';
import imageHero from '../images/landing/landing_hero.png';
import { Link } from 'react-router-dom';
import {
  ThunderboltFilled,
  UserOutlined,
  AimOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useScrollReveal } from '../hooks/useScrollReveal';

const { Title, Paragraph } = Typography;

export function Home() {
  const categoriesHeader = useScrollReveal<HTMLDivElement>({ type: 'fade', duration: 600 });
  const categoryLeft = useScrollReveal<HTMLDivElement>({ delay: 0 });
  const categoryRight = useScrollReveal<HTMLDivElement>({ delay: 200 });
  const howHeader = useScrollReveal<HTMLDivElement>({ type: 'fade', duration: 600 });
  const howStep1 = useScrollReveal<HTMLDivElement>({ delay: 0 });
  const howStep2 = useScrollReveal<HTMLDivElement>({ delay: 150 });
  const howStep3 = useScrollReveal<HTMLDivElement>({ delay: 300 });

  return (
    <div className={styles.container}>
      <Row
        gutter={[24, 24]}
        justify="space-between"
        align="middle"
        className={styles.heroRow}
      >
        <Col xs={24} sm={24} md={16} lg={12} xl={10}>
          <div className={styles.startInfo}>
            <Title level={5} className={styles.startInfoText}>
              DOSTĘP DO OBIEKTÓW PREMIUM
            </Title>
            <Title level={5} className={styles.startInfoTextColor}>
              Powered by AI
            </Title>
            <div className={styles.startInfoDescription}>
              <Title level={1} className={styles.mainTitle}>
                TWOJE HOBBY
                <br />
                <span className={styles.nowrapText}>
                  <span className={styles.textBold}>NASZE</span>{' '}
                  <span className={styles.textColor}>OBIEKTY</span>
                </span>
              </Title>
              <Paragraph className={styles.textSmall}>
                Dla zalogowanych użytkowników rekomendacje i rezerwacje{' '}
                <span className={styles.textSmallColor}>AI </span>
                <br />
                Zarezerwuj interesujący Cię obiekt w mgnieniu oka, <br />
                Przeglądaj jako gość i sprawdź aktualną{' '}
                <span className={styles.textSmallColor}>oferte.</span>
              </Paragraph>
            </div>
            <div className={styles.startInfoButton}>
              <Link to="/dashboard">
                <button className={styles.button}>Przeglądaj jako gość</button>
              </Link>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={16} lg={12} xl={10}>
          <div className={styles.startImages}>
            <div className={styles.img1}></div>
            <div className={styles.img2}>
              <img src={imageHero} alt="piłkarz" />
            </div>
            <div className={styles.floatingCard}>
              <div className={styles.iconCircle}>
                <ThunderboltFilled />
              </div>
              <div className={styles.floatingCardText}>
                <span className={styles.floatingCardTitle}>
                  Błyskawiczna rejestracja
                </span>
                <span className={styles.floatingCardSubtitle}>
                  Zajmie Ci 3 minuty
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div
        id="categories"
        ref={categoriesHeader.ref}
        style={categoriesHeader.style}
        className={styles.categoriesHeader}
      >
        <Title level={2}>Kategorie</Title>
        <Title level={5} className={styles.categoriesSubtitle}>
          To co potrzebujesz w jednym miejscu.
        </Title>
      </div>

      <Row gutter={[24, 24]} justify="space-between" align="middle">
        <Col xs={24} lg={12}>
          <div ref={categoryLeft.ref} style={categoryLeft.style}>
            <div className={styles.bgImage}>
              <div className={styles.cardInfo}>
                <div className={styles.cardText}>
                  <Title className={styles.cardTitle} level={3}>
                    Hale i sale sportowe
                  </Title>
                  <Paragraph className={styles.cardPar}>
                    Profesjonalne boiska parkietowe do halówki i koszykówki,{' '}
                    <br /> siatkówki - opcjonalnie siłownie
                  </Paragraph>
                </div>
                <div className={styles.cardButton}>
                  <Link to="/dashboard">
                    <button className={styles.buttonCard}>3 Obiekty</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div ref={categoryRight.ref} style={categoryRight.style}>
            <div className={styles.rightSection}>
              <div className={styles.bgImageRight}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardText}>
                    <Title className={styles.cardTitle} level={3}>
                      Stadiony i boiska sportowe
                    </Title>
                    <Paragraph className={styles.cardPar}>
                      Profesjonalne boiska pełnowymiarowe, na otwartej <br />{' '}
                      powierzchni, jak i zadaszone ze sztuczną nawierzchnią
                    </Paragraph>
                  </div>
                  <div className={styles.cardButton}>
                    <Link to="/dashboard">
                      <button className={styles.buttonCard}>4 Obiekty</button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className={styles.rightSectionGroup}>
                <div className={styles.bgImageRightSmall}>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardText}>
                      <Title className={styles.cardTitle} level={3}>
                        Sporty rakietowe
                      </Title>
                      <Paragraph className={styles.cardPar}>
                        Tenis, badminton, padel
                      </Paragraph>
                    </div>
                    <div className={styles.cardButton}>
                      <Link to="/dashboard">
                        <button className={styles.buttonCard}>4 Obiekty</button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={styles.bgImageRightSmallGym}>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardText}>
                      <Title className={styles.cardTitle} level={3}>
                        Siłownie, sauny
                      </Title>
                      <Paragraph className={styles.cardPar}>
                        Centra odnowy biologicznej
                      </Paragraph>
                    </div>
                    <div className={styles.cardButton}>
                      <Link to="/dashboard">
                        <button className={styles.buttonCard}>4 Obiektów</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div
        id="how-it-works"
        ref={howHeader.ref}
        style={howHeader.style}
        className={styles.categoriesHeader}
      >
        <Title level={2}>Jak działa rezerwacja?</Title>
        <Title level={5} className={styles.categoriesSubtitle}>
          Trzy proste kroki
        </Title>
      </div>

      <Row gutter={[24, 24]} align="middle" justify="space-between">
        <Col xl={8} xs={24} lg={8} sm={24} md={24}>
          <div ref={howStep1.ref} style={howStep1.style}>
            <div className={styles.howItWorks}>
              <div className={styles.howIcons}>
                <div className={styles.iconNumber}>
                  <UserOutlined style={{ fontSize: '28px' }} />
                </div>
                <Title level={2}>1</Title>
              </div>
              <div className={styles.howTextMain}>
                <Paragraph className={styles.howText}>
                  Załóż konto lub zaloguj się jeśli je posiadasz, <br /> tylko w
                  ten sposób będziesz mógł <br />
                  dokonać rezerwacji
                </Paragraph>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={8} xs={24} lg={8} sm={24} md={24}>
          <div ref={howStep2.ref} style={howStep2.style}>
            <div className={styles.howItWorks}>
              <div className={styles.howIcons}>
                <div className={styles.iconNumber}>
                  <AimOutlined style={{ fontSize: '28px' }} />
                </div>
                <Title level={2}>2</Title>
              </div>
              <div className={styles.howTextMain}>
                <Paragraph className={styles.howText}>
                  Wybierz kategorie a w niej, <br /> obiekt sportowy który <br />
                  chcesz zarezerwowac
                </Paragraph>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={8} xs={24} lg={8} sm={24} md={24}>
          <div ref={howStep3.ref} style={howStep3.style}>
            <div className={styles.howItWorks}>
              <div className={styles.howIcons}>
                <div className={styles.iconNumber}>
                  <CalendarOutlined style={{ fontSize: '28px' }} />
                </div>
                <Title level={2}>3</Title>
              </div>
              <div className={styles.howTextMain}>
                <Paragraph className={styles.howText}>
                  Najpierw data w kalendarzu, potem <br />
                  wybierz wolną godzine, metode płatności <br />i kliknij
                  zarezerwuj
                </Paragraph>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
