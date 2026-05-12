import styles from './Home.module.css';
import { Row, Col, Typography } from 'antd';
import imageHero from '../images/landing/landing_hero.png';
import {
  ThunderboltFilled,
  UserOutlined,
  AimOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export function Home() {
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
                Zarezerwuj interesujący Cię obiekt w mgnieniu oka, <br />
                Przeglądaj jako gość i sprawdź aktualną{' '}
                <span className={styles.textSmallColor}>oferte.</span>
              </Paragraph>
            </div>
            <div className={styles.startInfoButton}>
              <button className={styles.button}>Przeglądaj jako gość</button>
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
      <div className={styles.categoriesHeader}>
        <Title level={2}>Kategorie</Title>
        <Title level={5} className={styles.categoriesSubtitle}>
          To co potrzebujesz w jednym miejscu.
        </Title>
      </div>
      <Row gutter={[24, 24]} justify="space-between" align="middle">
        <Col xs={24} lg={12}>
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
                <button className={styles.buttonCard}>3 Obiekty</button>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={12}>
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
                  <button className={styles.buttonCard}>4 Obiekty</button>
                </div>
              </div>
            </div>
            <div className={styles.rightSectionGroup}>
              <div className={styles.bgImageRightSmall}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardText}>
                    <Title className={styles.cardTitle} level={3}>
                      Strefy aktywnego wypoczynku
                    </Title>
                  </div>
                  <div className={styles.cardButton}>
                    <button className={styles.buttonCard}>4 Obiekty</button>
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
                    <button className={styles.buttonCard}>5 Obiektów</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div className={styles.categoriesHeader}>
        <Title level={2}>Jak działa rezerwacja?</Title>
        <Title level={5} className={styles.categoriesSubtitle}>
          Trzy proste kroki
        </Title>
      </div>
      <Row gutter={[24, 24]} align="middle" justify="space-between">
        <Col xl={8} xs={24} lg={8} sm={24} md={24}>
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
        </Col>
        <Col xl={8} xs={24} lg={8} sm={24} md={24}>
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
        </Col>
        <Col xl={8} xs={24} lg={8} sm={24} md={24}>
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
        </Col>
      </Row>
    </div>
  );
}

export default Home;
