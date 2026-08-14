import { Tag } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
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

function isWithin12Hours(reservation: ReservationWithFacility): boolean {
  const startDt = new Date(
    `${reservation.reservation_date}T${reservation.start_time}`
  );
  const now = new Date();
  const hoursLeft = (startDt.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursLeft < 12;
}

const UpcomingCard = ({ reservation, onCancel, isCancelling }: UpcomingCardProps) => {
  const cancelBlocked = isWithin12Hours(reservation);

  return (
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
            disabled={isCancelling || cancelBlocked}
          >
            Anuluj
          </button>
        </div>
        {cancelBlocked && (
          <div className={styles.cancelInfo}>
            <InfoCircleOutlined />
            <span>Anulowanie możliwe do 12h przed wizytą</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingCard;
