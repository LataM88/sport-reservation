import styles from './AuthLayout.module.css';
import { Row, Col, Typography } from 'antd';
import registerImage from '../../images/sigin/bg_register.png';
import { Link } from 'react-router-dom';

const { Title } = Typography;

interface AuthLayoutProps {
  titleHighlight: string;
  titleRest: React.ReactNode;
  children: React.ReactNode;
  switchText: string;
  switchLabel: string;
  switchTo: string;
  forgotPasswordText?: string;
  forgotPasswordLabel?: string;
  forgotPasswordTo?: string;
  rootError?: string;
  image?: string;
}

export function AuthLayout({
  titleHighlight,
  titleRest,
  children,
  switchText,
  switchLabel,
  switchTo,
  forgotPasswordText,
  forgotPasswordLabel,
  forgotPasswordTo,
  rootError,
  image,
}: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <Row gutter={[80, 24]} align="middle" justify="center">
        <Col xl={12} lg={12} sm={24} xs={24}>
          <div className={styles.leftImage}>
            <div className={styles.imgBg}></div>
            <img src={image || registerImage} alt="boisko sportowe" />
          </div>
        </Col>
        <Col xl={12} lg={12} sm={24} xs={24}>
          <Title level={2}>
            <span className={styles.titleColor}>{titleHighlight} </span>
            {titleRest}
          </Title>
          <div className={styles.formGroup}>
            {children}
            {forgotPasswordText && (
              <div className={styles.switchText} style={{ marginTop: '0' }}>
                {forgotPasswordText}{' '}
                <Link
                  to={forgotPasswordTo || '#'}
                  className={styles.switchLink}
                >
                  {forgotPasswordLabel}
                </Link>
              </div>
            )}
            <div className={styles.switchText}>
              {switchText}{' '}
              <Link to={switchTo} className={styles.switchLink}>
                {switchLabel}
              </Link>
            </div>
            {rootError && <span className={styles.error}>{rootError}</span>}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AuthLayout;
