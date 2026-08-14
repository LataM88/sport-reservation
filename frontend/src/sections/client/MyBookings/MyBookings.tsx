import { useMemo } from 'react';
import { Row, Col, Typography, Spin } from 'antd';
import styles from './MyBookings.module.css';
import Sidebar from '../../../components/NavLayout/Sidebar';
import { useAuth } from '../../../context/AuthContext';
import {
  useMyReservations,
  useCancelReservation,
} from '../../../hooks/useReservations';
import { useFacilities } from '../../../hooks/useFacility';
import type { Facility } from '../../../types/types';
import type { ReservationWithFacility } from './utils';
import { isUpcoming } from './utils';
import UpcomingCard from './UpcomingCard';
import HistoryRow from './HistoryRow';

const { Title, Paragraph } = Typography;

const HISTORY_LIMIT = 5;

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const { data: reservations, isLoading } = useMyReservations();
  const { data: facilities } = useFacilities();
  const cancelMutation = useCancelReservation();

  const enriched: ReservationWithFacility[] = useMemo(() => {
    if (!reservations) return [];
    const facilityMap = new Map<string, Facility>();
    facilities?.forEach((f) => facilityMap.set(f.id, f));
    return reservations.map((r) => ({
      ...r,
      facility: facilityMap.get(r.facility_id),
    }));
  }, [reservations, facilities]);

  const upcoming = useMemo(
    () =>
      enriched
        .filter(isUpcoming)
        .sort(
          (a, b) =>
            new Date(`${b.reservation_date}T${b.start_time}`).getTime() -
            new Date(`${a.reservation_date}T${a.start_time}`).getTime()
        ),
    [enriched]
  );

  const recentHistory = useMemo(() => {
    return enriched
      .filter((r) => !isUpcoming(r))
      .sort(
        (a, b) =>
          new Date(`${b.reservation_date}T${b.start_time}`).getTime() -
          new Date(`${a.reservation_date}T${a.start_time}`).getTime()
      )
      .slice(0, HISTORY_LIMIT);
  }, [enriched]);

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id);
  };

  return (
    <div
      className={`${styles.wrapper} ${isAuthenticated ? styles.withSidebar : ''}`}
    >
      {isAuthenticated && <Sidebar />}
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Title level={1}>Moje Rezerwacje</Title>
            <Paragraph className={styles.subtitle}>
              Masz {upcoming.length} nadchodzące{' '}
              {upcoming.length === 1
                ? 'wizytę'
                : upcoming.length >= 2 && upcoming.length <= 4
                  ? 'wizyty'
                  : 'wizyt'}
            </Paragraph>
          </div>
        </div>

        {isLoading && (
          <div className={styles.loadingWrapper}>
            <Spin size="large" />
          </div>
        )}

        {!isLoading && (
          <>
            {upcoming.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📅</div>
                <p className={styles.emptyText}>
                  Nie masz nadchodzących rezerwacji
                </p>
              </div>
            ) : (
              <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                {upcoming.map((r) => (
                  <Col key={r.id} xl={12} md={12} sm={24} xs={24}>
                    <UpcomingCard
                      reservation={r}
                      onCancel={handleCancel}
                      isCancelling={cancelMutation.isPending}
                    />
                  </Col>
                ))}
              </Row>
            )}

            {recentHistory.length > 0 && (
              <>
                <Title level={3} className={styles.historyTitle}>
                  Ostatnie wizyty
                </Title>
                <div className={styles.historyList}>
                  {recentHistory.map((r) => (
                    <HistoryRow key={r.id} reservation={r} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
