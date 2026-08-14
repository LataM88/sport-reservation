import { useState } from 'react';
import { Typography, Spin, message, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useAdminReservations, useUpdateReservationStatus, useAdminFacility } from '../../../hooks/useAdmin';
import styles from './AdminRequests.module.css';

const { Title } = Typography;

const formatTime = (t: string) => t.slice(0, 5);
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Oczekująca',
  confirmed: 'Zaakceptowana',
  cancelled: 'Odrzucona',
  completed: 'Zakończona',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#fa8c16',
  confirmed: '#52c41a',
  cancelled: '#ff4d4f',
  completed: '#1890ff',
};

export function AdminRequests() {
  const { data: reservations, isLoading: resLoading } = useAdminReservations();
  const { data: facility, isLoading: facLoading } = useAdminFacility();
  const updateStatus = useUpdateReservationStatus();
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed'>('pending');

  const isLoading = resLoading || facLoading;

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin size="large" />
      </div>
    );
  }

  const allReservations = reservations ?? [];

  const handleStatusChange = async (reservationId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ reservationId, status });
      message.success(`Zmieniono status na: ${STATUS_LABELS[status] || status}`);
    } catch {
      message.error('Nie udało się zmienić statusu rezerwacji');
    }
  };

  const filteredReservations = allReservations
    .filter((r) => {
      if (activeTab === 'pending') return r.status === 'pending';
      if (activeTab === 'confirmed') return r.status === 'confirmed';
      return r.status === 'completed' || r.status === 'cancelled';
    })
    .sort(
      (a, b) =>
        new Date(`${b.reservation_date}T${b.start_time}`).getTime() -
        new Date(`${a.reservation_date}T${a.start_time}`).getTime()
    );

  const pendingCount = allReservations.filter((r) => r.status === 'pending').length;
  const confirmedCount = allReservations.filter((r) => r.status === 'confirmed').length;
  const completedCount = allReservations.filter(
    (r) => r.status === 'completed' || r.status === 'cancelled'
  ).length;

  const tabs = [
    { key: 'pending' as const, label: 'Oczekujące', count: pendingCount },
    { key: 'confirmed' as const, label: 'Zaakceptowane' },
    { key: 'completed' as const, label: 'Zakończone / Odrzucone' },
  ];

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>
        Rezerwacje
      </Title>

      {/* Karta obiektu */}
      {facility && (
        <div className={styles.facilityCard}>
          {facility.image_url && (
            <div
              className={styles.facilityImage}
              style={{ backgroundImage: `url(${facility.image_url})` }}
            />
          )}
          <div className={styles.facilityInfo}>
            <h3 className={styles.facilityName}>{facility.name}</h3>
            <span className={styles.categoryBadge}>{facility.category}</span>
            <div className={styles.facilityMeta}>
              {facility.opening_time && facility.closing_time && (
                <div className={styles.metaItem}>
                  <ClockCircleOutlined />
                  <span>
                    {formatTime(facility.opening_time)} – {formatTime(facility.closing_time)}
                  </span>
                </div>
              )}
              {facility.base_price != null && (
                <div className={styles.metaItem}>
                  <DollarOutlined />
                  <span>{Number(facility.base_price).toFixed(0)} PLN / slot</span>
                </div>
              )}
              <div className={styles.metaItem}>
                <EnvironmentOutlined />
                <span>{facility.is_active ? 'Aktywny' : 'Nieaktywny'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statystyki */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CalendarOutlined />
            </div>
            <div>
              <span className={styles.statValue}>{allReservations.length}</span>
              <span className={styles.statLabel}>Wszystkie</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconPending}`}>
              <ClockCircleOutlined />
            </div>
            <div>
              <span className={styles.statValue}>{confirmedCount}</span>
              <span className={styles.statLabel}>Zaakceptowane</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconDone}`}>
              <CheckOutlined />
            </div>
            <div>
              <span className={styles.statValue}>{completedCount}</span>
              <span className={styles.statLabel}>Zakończone</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Taby */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.count != null && tab.count > 0 && (
              <span className={styles.badge}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className={styles.tableSection}>
        {filteredReservations.length === 0 ? (
          <p className={styles.emptyText}>Brak rezerwacji w tej kategorii.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Klient</th>
                  <th>Data</th>
                  <th>Godziny</th>
                  <th>Cena</th>
                  <th>Status</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((r) => {
                  const clientName = r.user
                    ? `${r.user.name} ${r.user.lastName}`
                    : r.guest_name || 'Nieznany';
                  const initials = r.user
                    ? `${r.user.name[0]}${r.user.lastName[0]}`
                    : clientName.slice(0, 2);

                  return (
                    <tr key={r.id}>
                      <td>
                        <div className={styles.clientCell}>
                          <div className={styles.avatar}>
                            {r.user?.avatar_url ? (
                              <img src={r.user.avatar_url} alt="avatar" />
                            ) : (
                              initials.toUpperCase()
                            )}
                          </div>
                          <span>{clientName}</span>
                        </div>
                      </td>
                      <td>{formatDate(r.reservation_date)}</td>
                      <td>
                        {formatTime(r.start_time)} – {formatTime(r.end_time)}
                      </td>
                      <td>{Number(r.total_price).toFixed(0)} PLN</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{
                            background: `${STATUS_COLORS[r.status] ?? '#999'}18`,
                            color: STATUS_COLORS[r.status] ?? '#999',
                          }}
                        >
                          {STATUS_LABELS[r.status] ?? r.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          {r.status === 'pending' && (
                            <>
                              <button
                                className={styles.iconBtnCheck}
                                onClick={() => handleStatusChange(r.id, 'confirmed')}
                                title="Akceptuj"
                              >
                                <CheckCircleOutlined />
                              </button>
                              <button
                                className={styles.iconBtnClose}
                                onClick={() => handleStatusChange(r.id, 'cancelled')}
                                title="Odrzuć"
                              >
                                <CloseCircleOutlined />
                              </button>
                            </>
                          )}
                          {r.status === 'confirmed' && (
                            <>
                              <button
                                className={styles.completeBtn}
                                onClick={() => handleStatusChange(r.id, 'completed')}
                              >
                                Zakończ
                              </button>
                              <button
                                className={styles.cancelBtn}
                                onClick={() => handleStatusChange(r.id, 'cancelled')}
                              >
                                Anuluj
                              </button>
                            </>
                          )}
                        </div>
                      </td>
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
