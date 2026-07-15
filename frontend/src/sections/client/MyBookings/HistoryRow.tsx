import { Tag } from 'antd';
import type { ReservationWithFacility } from './utils';
import { STATUS_LABELS, formatDate, formatTime } from './utils';
import styles from './HistoryRow.module.css';

interface HistoryRowProps {
  reservation: ReservationWithFacility;
}

const HistoryRow = ({ reservation }: HistoryRowProps) => (
  <div className={styles.historyRow}>
    <div
      className={styles.historyImage}
      style={{
        backgroundImage: reservation.facility?.image_url
          ? `url(${reservation.facility.image_url})`
          : undefined,
      }}
    />
    <div className={styles.historyInfo}>
      <p className={styles.historyName}>
        {reservation.facility?.name ?? 'Obiekt sportowy'}
      </p>
      <p className={styles.historyMeta}>
        {formatDate(reservation.reservation_date)} •{' '}
        {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
      </p>
    </div>
    <div className={styles.historyRight}>
      <span className={styles.historyPrice}>
        {Number(reservation.total_price).toFixed(0)} PLN
      </span>
      <Tag color={reservation.status === 'cancelled' ? 'error' : 'processing'}>
        {STATUS_LABELS[reservation.status] ?? reservation.status}
      </Tag>
    </div>
  </div>
);

export default HistoryRow;
