import { useState } from 'react';
import { Typography, Spin, Row, Col } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { useAdminFacilityUsers } from '../../../hooks/useAdmin';
import styles from './AdminUsers.module.css';

const { Title } = Typography;

export function AdminUsers() {
  const { data: users, isLoading } = useAdminFacilityUsers();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin size="large" />
      </div>
    );
  }

  const allUsers = users || [];

  const filteredUsers = allUsers.filter((u) =>
    `${u.name} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Row gutter={[24, 16]} align="bottom" className={styles.header}>
        <Col xs={24} sm={16}>
          <Title level={2} className={styles.title}>
            Klienci obiektu
          </Title>
          <p className={styles.subtitle}>
            Lista klientów, którzy korzystali z Twojego obiektu.
          </p>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TeamOutlined />
            </div>
            <div>
              <span className={styles.statValue}>{allUsers.length}</span>
              <span className={styles.statLabel}>Łącznie klientów</span>
            </div>
          </div>
        </Col>
      </Row>

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Szukaj po imieniu, nazwisku lub email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableSection}>
        {filteredUsers.length === 0 ? (
          <p className={styles.emptyText}>
            {searchTerm ? 'Nie znaleziono klientów.' : 'Brak klientów dla tego obiektu.'}
          </p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Klient</th>
                  <th>Email</th>
                  <th>Telefon</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const initials = `${u.name[0]}${u.lastName[0]}`;
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className={styles.clientCell}>
                          <div className={styles.avatar}>
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt="avatar" />
                            ) : (
                              initials.toUpperCase()
                            )}
                          </div>
                          <span>
                            {u.name} {u.lastName}
                          </span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
