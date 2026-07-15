import styles from './Sidebar.module.css';
import { Typography } from 'antd';
import { useUser } from '../../hooks/useUser';
import {
  PicLeftOutlined,
  SnippetsOutlined,
  UserOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const Sidebar = () => {
  const { data: user, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div className={styles.sidebar}>
        <Title level={3}>Ładowanie...</Title>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.sidebar}>
        <Title level={3}>Błąd ładowania danych</Title>
      </div>
    );
  }

  return (
    <div className={styles.sidebar}>
      <Title className={styles.greeting} level={3}>
        Witaj {user.name}!
      </Title>
      <div className={styles.layout}>
        <Link to="/dashboard">
          <div className={styles.content}>
            <PicLeftOutlined className={styles.icon} />
            <Title className={styles.text} level={5}>
              Główna strona
            </Title>
          </div>
        </Link>
        <div className={styles.content}>
          <RocketOutlined className={styles.icon} />
          <Title className={styles.text} level={5}>
            Rezerwacja z AI
          </Title>
        </div>
        <Link to="/my-bookings">
          <div className={styles.content}>
            <SnippetsOutlined className={styles.icon} />
            <Title className={styles.text} level={5}>
              Moje rezerwacje
            </Title>
          </div>
        </Link>
        <Link to="/profile">
          <div className={styles.content}>
            <UserOutlined className={styles.icon} />
            <Title className={styles.text} level={5}>
              Mój profil
            </Title>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
