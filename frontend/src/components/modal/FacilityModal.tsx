import styles from './FacilityModal.module.css';
import { useState, useEffect } from 'react';
import { Typography, Skeleton, Alert, Calendar, ConfigProvider } from 'antd';
import { useFacilities } from '../../hooks/useFacility';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from '../Button/Button';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/pl';

dayjs.locale('pl');

const { Title, Paragraph } = Typography;

interface FacilityModalProps {
  id: string;
  onClose: () => void;
}

const FacilityModal = ({ id, onClose }: FacilityModalProps) => {
  const { data: facilities, isLoading, isError } = useFacilities();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    // Disable body scroll when modal is mounted
    document.body.style.overflow = 'hidden';
    return () => {
      // Re-enable body scroll when modal is unmounted
      document.body.style.overflow = '';
    };
  }, []);

  const facility = facilities?.find((f) => f.id === id);

  if (isLoading || isError || !facility) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
          style={{
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Zamknij"
          >
            <CloseOutlined />
          </button>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <Alert
              type="error"
              style={{ width: '100%' }}
              message={isError ? 'Błąd' : 'Nie znaleziono'}
              description={
                isError
                  ? 'Nie udało się pobrać danych obiektu'
                  : 'Obiekt nie istnieje'
              }
              showIcon
            />
          )}
        </div>
      </div>
    );
  }

  const generateAvaibleSlots = () => {
    let startHour = 6;
    let endHour = 22;

    if (facility.opening_time && facility.closing_time) {
      startHour = parseInt(facility.opening_time.split(':')[0], 10);
      endHour = parseInt(facility.closing_time.split(':')[0], 10);
    }

    const slots: string[] = [];
    for (let i = startHour; i < endHour; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const avaibleSlots = generateAvaibleSlots();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Zamknij"
        >
          <CloseOutlined />
        </button>
        <div className={styles.upperSection}>
        <div className={styles.image}>
          <img src={facility.image_url} alt="zdjecie obiektu" />
          <div className={styles.imageText}>
            <Title level={2}>{facility.name}</Title>
            <Paragraph className={styles.paragraphAnt}>
              {facility.category}
            </Paragraph>
          </div>
        </div>
        <div className={styles.descriptionUpper}>
          <div className={styles.mainDescription}>
            <Title level={3}>Opis obiektu</Title>
            <Paragraph
              className={styles.paragraphAntMobile}
              style={{
                fontSize: '20px',
                fontFamily: 'Inter',
                fontWeight: '300',
              }}
            >
              {facility.description}
            </Paragraph>
          </div>
          <div className={styles.belowDescription}>
            <div className={styles.belowDescriptionItem}>
              <Title className={styles.titleAnt} level={4}>
                Cena
              </Title>
              <Title className={styles.titleAnt} level={4}>
                Czas rezerwacji
              </Title>
              <Title className={styles.titleAnt} level={4}>
                Czas przebierania
              </Title>
            </div>
            <div className={styles.belowDescriptionDetails}>
              <Paragraph>{facility.base_price} zł/h</Paragraph>
              <Paragraph>{facility.slot_duration_minutes} min</Paragraph>
              <Paragraph>{facility.buffer_time_minutes} min</Paragraph>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoBar}>
        <div className={styles.infoBarItem}>
          <span className={styles.infoBarLabel}>Godziny otwarcia</span>
          <span className={styles.infoBarValue}>
            {facility.opening_time ?? '—'} - {facility.closing_time ?? '—'}
          </span>
        </div>
      </div>

      <div className={styles.lowerSection}>
        <div className={styles.lowerLeft}>
          <Title level={3} className={styles.sectionTitle}>
            Wybierz datę i godzinę
          </Title>

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#a2ff00',
                colorBgContainer: '#fafafa',
                borderRadius: 10,
                fontFamily: "'Inter', sans-serif",
              },
            }}
          >
            <div className={styles.calendarWrapper}>
              <Calendar
                fullscreen={false}
                value={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                disabledDate={(current) =>
                  current && current.isBefore(dayjs().startOf('day'), 'day')
                }
              />
            </div>
          </ConfigProvider>

          <div className={styles.slotsSection}>
            <Title level={4} className={styles.slotsTitle}>
              Dostępne godziny
            </Title>
            <div className={styles.slotsGrid}>
              {avaibleSlots.map((slot) => (
                <button
                  key={slot}
                  className={`${styles.slotButton} ${selectedSlot === slot ? styles.slotButtonActive : ''}`}
                  onClick={() =>
                    setSelectedSlot(selectedSlot === slot ? null : slot)
                  }
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.lowerRight}>
          <div className={styles.summaryCard}>
            <Title level={3} className={styles.summaryTitle}>
              Podsumowanie rezerwacji
            </Title>
            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Obiekt</span>
                <span className={styles.summaryValue}>{facility.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Data</span>
                <span className={styles.summaryValue}>
                  {selectedDate.format('DD.MM.YYYY')}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Przygotowanie</span>
                <span className={styles.summaryValue}>
                  {facility.buffer_time_minutes} min (15 przed / po)
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Godzina</span>
                <span className={styles.summaryValue}>
                  {selectedSlot ?? '—'}
                </span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Do zapłaty</span>
                <span className={styles.summaryPrice}>
                  {facility.base_price != null
                    ? `${Number(facility.base_price).toFixed(2)} zł`
                    : '—'}
                </span>
              </div>
            </div>
            <Button variant="primary" fullWidth disabled={!selectedSlot}>
              Zarezerwuj
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default FacilityModal;
