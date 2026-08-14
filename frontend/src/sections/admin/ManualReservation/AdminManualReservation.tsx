import { useState, useMemo } from 'react';
import { Typography, Spin, message } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useAdminFacility, useCreateManualReservation } from '../../../hooks/useAdmin';
import { useFacilityReservations } from '../../../hooks/useReservations';
import Button from '../../../components/Button/Button';
import styles from './AdminManualReservation.module.css';

const { Title } = Typography;

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00'
];

export function AdminManualReservation() {
  const { data: facility, isLoading } = useAdminFacility();
  const createReservation = useCreateManualReservation();

  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(60);
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');

  const { data: existingReservations } = useFacilityReservations(
    facility?.id ?? '',
    date,
  );

  const reservedSlots = useMemo(() => {
    if (!existingReservations) return new Set<string>();
    const blocked = new Set<string>();

    for (const r of existingReservations) {
      const startParts = r.start_time.split(':').map(Number);
      const endParts = r.end_time.split(':').map(Number);
      const startMin = startParts[0] * 60 + startParts[1];
      const endMin = endParts[0] * 60 + endParts[1];

      for (let m = 0; m < 24 * 60; m += 60) {
        const slotEnd = m + 60;
        if (m < endMin && slotEnd > startMin) {
          const hh = Math.floor(m / 60).toString().padStart(2, '0');
          const mm = (m % 60).toString().padStart(2, '0');
          blocked.add(`${hh}:${mm}`);
        }
      }
    }

    return blocked;
  }, [existingReservations]);

  const calculateEndTime = (start: string, dur: number) => {
    const [h, m] = start.split(':').map(Number);
    const totalMin = h * 60 + m + dur;
    const endH = Math.floor(totalMin / 60);
    const endM = totalMin % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!facility) return;

    if (!date || !startTime || !guestName) {
      message.error('Wypełnij wymagane pola (Data, Godzina, Imię i nazwisko)');
      return;
    }

    try {
      await createReservation.mutateAsync({
        facility_id: facility.id,
        reservation_date: date,
        start_time: startTime + ':00',
        end_time: calculateEndTime(startTime, duration),
        guest_name: guestName,
        guest_phone: guestPhone,
      });

      message.success('Rezerwacja została pomyślnie dodana');
      
      // Clear form
      setDate('');
      setStartTime('');
      setDuration(60);
      setGuestName('');
      setGuestPhone('');
    } catch (error: any) {
      message.error(error.detail || 'Wystąpił błąd podczas dodawania rezerwacji');
    }
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  const basePrice = Number(facility?.base_price) || 0;
  const totalPrice = (basePrice / 60) * duration;

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>Dodaj rezerwację manualnie</Title>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Section 1 */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepCircle}>1</div>
            <h3 className={styles.sectionTitle}>Dane klienta</h3>
          </div>
          
          <div className={styles.clientInputs}>
            <div className={styles.inputGroup}>
              <label>Imię i nazwisko (Gość)</label>
              <input 
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="np. Jan Kowalski"
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Telefon kontaktowy</label>
              <input 
                type="text"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="np. +48 123 456 789"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepCircle}>2</div>
            <h3 className={styles.sectionTitle}>Szczegóły rezerwacji</h3>
          </div>

          <div className={styles.topRow}>
            <div className={styles.facilitySelect}>
              <label>Wybrany Obiekt</label>
              <div className={styles.facilityCard}>
                <span className={styles.facilityType}>{facility?.category?.toUpperCase() || 'SPORT'}</span>
                <span className={styles.facilityName}>{facility?.name}</span>
              </div>
            </div>

            <div className={styles.dateSelect}>
              <label>Data Rezerwacji</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.slotsSection}>
            <label>Dostępne godziny</label>
            <div className={styles.slotsGrid}>
              {TIME_SLOTS.map(time => {
                const isReserved = reservedSlots.has(time);
                return (
                  <button
                    key={time}
                    type="button"
                    className={`${styles.slotBtn} ${startTime === time ? styles.slotActive : ''} ${isReserved ? styles.slotReserved : ''}`}
                    onClick={() => !isReserved && setStartTime(time)}
                    disabled={isReserved}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.durationSelect}>
              <label>Czas trwania (Minuty)</label>
              <div className={styles.durationControl}>
                <button 
                  type="button" 
                  className={styles.durBtn} 
                  onClick={() => setDuration(prev => Math.max(30, prev - 30))}
                >
                  <MinusOutlined />
                </button>
                <span className={styles.durValue}>{duration}</span>
                <button 
                  type="button" 
                  className={styles.durBtn} 
                  onClick={() => setDuration(prev => prev + 30)}
                >
                  <PlusOutlined />
                </button>
              </div>
            </div>

            <div className={styles.priceSection}>
              <label>Szacowana cena (PLN)</label>
              <div className={styles.priceBox}>
                <span className={styles.priceValue}>{totalPrice.toFixed(2)} PLN</span>
                <span className={styles.priceBase}>Baza: {basePrice.toFixed(2)} PLN/h</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button 
            type="submit"
            disabled={createReservation.isPending}
            fullWidth
            style={{ padding: '16px', fontSize: '16px' }}
          >
            {createReservation.isPending ? 'Dodawanie...' : 'Utwórz rezerwację'}
          </Button>
        </div>
      </form>
    </div>
  );
}
