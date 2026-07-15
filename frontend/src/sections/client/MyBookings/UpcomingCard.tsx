import { Tag } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ReservationWithFacility } from './utils';
import { STATUS_LABELS, formatDate, formatTime } from './utils';
import styles from './UpcomingCard.module.css';

const STATUS_TAG_COLORS: Record<string, string> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'processing',
};

interface UpcomingCardProps {
  reservation: ReservationWithFacility;
  onCancel: (id: string) => void;
  isCancelling: boolean;
}

const UpcomingCard = ({ reservation, onCancel, isCancelling }: UpcomingCardProps) => (
  <div className={styles.upcomingCard}>
    <div
      className={styles.cardImage}
      style={{
        backgroundImage: reservation.facility?.image_url
          ? `url(${reservation.facility.image_url})`
          : undefined,
      }}
    >
      <Tag
        className={styles.statusBadge}
        color={STATUS_TAG_COLORS[reservation.status] ?? 'default'}
      >
        {STATUS_LABELS[reservation.status] ?? reservation.status}
      </Tag>
    </div>

    <div className={styles.cardContent}>
      <div className={styles.cardTop}>
        <h3 className={styles.facilityName}>
          {reservation.facility?.name ?? 'Obiekt sportowy'}
        </h3>
        <span className={styles.priceAmount}>
          {Number(reservation.total_price).toFixed(0)} PLN
        </span>
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.metaRow}>
          <CalendarOutlined className={styles.metaIcon} />
          <span>{formatDate(reservation.reservation_date)}</span>
        </div>
        <div className={styles.metaRow}>
          <ClockCircleOutlined className={styles.metaIcon} />
          <span>
            {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
          </span>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button
          className={styles.btnCancel}
          onClick={() => onCancel(reservation.id)}
          disabled={isCancelling}
        >
          Anuluj
        </button>
      </div>
    </div>
  </div>
);

export default UpcomingCard;
