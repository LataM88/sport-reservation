import styles from './FacilityModal.module.css';
import { useState, useEffect, useMemo } from 'react';
import { Typography, Skeleton, Alert, Calendar, ConfigProvider } from 'antd';
import { useFacilities } from '../../hooks/useFacility';
import { CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button } from '../Button/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCreateReservation, useFacilityReservations } from '../../hooks/useReservations';
import { useQueryClient } from '@tanstack/react-query';
import type { ReservationCreate } from '../../types/types';
import { ApiError } from '../../api/apiClient';
import lockImg from '../../images/dashboard/locker.png';
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
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const createReservationMutation = useCreateReservation();
  const queryClient = useQueryClient();

  const { data: existingReservations } = useFacilityReservations(
    id,
    selectedDate.format('YYYY-MM-DD'),
  );

  const reservedSlots = useMemo(() => {
    if (!existingReservations) return new Set<string>();
    const blocked = new Set<string>();

    for (const r of existingReservations) {
      const startParts = r.start_time.split(':').map(Number);
      const endParts = r.end_time.split(':').map(Number);
      const startMin = startParts[0] * 60 + startParts[1];
      const endMin = endParts[0] * 60 + endParts[1];

      // Oznacz każdy pełnogodzinny slot, który koliduje z tą rezerwacją
      for (let m = 0; m < 24 * 60; m += 60) {
        const slotEnd = m + 60;
        // Slot [m, slotEnd) koliduje z rezerwacją [startMin, endMin)
        if (m < endMin && slotEnd > startMin) {
          const hh = Math.floor(m / 60).toString().padStart(2, '0');
          const mm = (m % 60).toString().padStart(2, '0');
          blocked.add(`${hh}:${mm}`);
        }
      }
    }

    return blocked;
  }, [existingReservations]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleReservation = async () => {
    if (!selectedSlot || !facility) return;

    setReservationError(null);

    const slotDuration = facility.slot_duration_minutes ?? 60;
    const startTime = dayjs(`2000-01-01 ${selectedSlot}`);
    const endTime = startTime.add(slotDuration, 'minute');

    const data: ReservationCreate = {
      facility_id: facility.id,
      reservation_date: selectedDate.format('YYYY-MM-DD'),
      start_time: `${selectedSlot}:00`,
      end_time: endTime.format('HH:mm:ss'),
      total_price: Number(facility.base_price ?? 0),
    };

    try {
      await createReservationMutation.mutateAsync(data);
      setReservationSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['facilityReservations', id] });
    } catch (error) {
      if (error instanceof ApiError) {
        setReservationError(error.detail);
      } else {
        setReservationError('Nie udało się utworzyć rezerwacji');
      }
    }
  };

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

  const isToday = selectedDate.isSame(dayjs(), 'day');
  const currentHour = dayjs().hour();

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

  const isSlotPast = (slot: string): boolean => {
    if (!isToday) return false;
    const slotHour = parseInt(slot.split(':')[0], 10);
    return slotHour <= currentHour;
  };

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
                    setReservationSuccess(false);
                    setReservationError(null);
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
                {avaibleSlots.map((slot) => {
                  const past = isSlotPast(slot);
                  const reserved = reservedSlots.has(slot);
                  const isDisabled = past || reserved;
                  return (
                    <button
                      key={slot}
                      className={`${styles.slotButton} ${selectedSlot === slot ? styles.slotButtonActive : ''} ${past ? styles.slotButtonDisabled : ''} ${reserved ? styles.slotButtonReserved : ''}`}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedSlot(selectedSlot === slot ? null : slot);
                          setReservationSuccess(false);
                          setReservationError(null);
                        }
                      }}
                      disabled={isDisabled}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.lowerRight}>
            <div className={styles.summaryCard}>
              {!isAuthenticated ? (
                <>
                  <Title level={3} className={styles.summaryTitle}>
                    Rezerwacja zablokowana
                  </Title>
                  <div className={styles.blockedContent}>
                    <span
                      className={styles.blockedText}
                      style={{ fontSize: '16px' }}
                    >
                      Musisz posiadać konto aby móc dokonać rezerwacji
                    </span>
                    <div className={styles.blockedImg}>
                      <img
                        src={lockImg}
                        alt="ikona kłódki"
                        style={{ width: '130px' }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/login')}
                  >
                    Przejdź do logowania
                  </Button>
                </>
              ) : reservationSuccess ? (
                <>
                  <div className={styles.successContent}>
                    <CheckCircleOutlined className={styles.successIcon} />
                    <Title level={3} className={styles.summaryTitle}>
                      Rezerwacja wysłana!
                    </Title>
                    <Paragraph className={styles.successText}>
                      Twoja rezerwacja została przesłana do właściciela obiektu.
                      Gdy zostanie potwierdzona, otrzymasz wiadomość e-mail z
                      potwierdzeniem.
                    </Paragraph>
                  </div>
                  <Button variant="primary" fullWidth onClick={onClose}>
                    Zamknij
                  </Button>
                </>
              ) : (
                <>
                  <Title level={3} className={styles.summaryTitle}>
                    Podsumowanie rezerwacji
                  </Title>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Obiekt</span>
                      <span className={styles.summaryValue}>
                        {facility.name}
                      </span>
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
                  {reservationError && (
                    <Alert
                      type="error"
                      message={reservationError}
                      showIcon
                      style={{ borderRadius: '10px' }}
                    />
                  )}
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={!selectedSlot || createReservationMutation.isPending}
                    onClick={handleReservation}
                  >
                    {createReservationMutation.isPending ? 'Rezerwowanie...' : 'Zarezerwuj'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityModal;
