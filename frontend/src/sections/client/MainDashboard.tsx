import styles from './MainDashboard.module.css';
import { Row, Col, Typography, Skeleton, Alert } from 'antd';
import { useState } from 'react';
import {
  FaThLarge,
  FaFutbol,
  FaRunning,
  FaDumbbell,
  FaSwimmingPool,
} from 'react-icons/fa';
import { MdSportsBasketball } from 'react-icons/md';
import type { Category } from '../../types/iconCategory';
import { useFacilities } from '../../hooks/useFacility';
import FacilitySection from '../../components/FacilitySection/FacilitySection';
import Sidebar from '../../components/NavLayout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import FacilityModal from '../../components/modal/FacilityModal';

const { Title, Paragraph } = Typography;

const CATEGORIES: Category[] = [
  { label: 'Wszystkie', icon: FaThLarge, key: null },
  { label: 'Hale sportowe', icon: MdSportsBasketball, key: 'hala' },
  { label: 'Stadiony', icon: FaFutbol, key: 'stadiony' },
  { label: 'Squash/Tenis/Badminton', icon: FaRunning, key: 'ogolne' },
  { label: 'Siłownie i sauny', icon: FaDumbbell, key: 'fizyczne' },
  { label: 'Baseny', icon: FaSwimmingPool, key: 'rekreacja' },
];

const SECTIONS = [
  { title: 'Hale sportowe', key: 'hala' },
  { title: 'Stadiony', key: 'stadiony' },
  { title: 'Tenis/Squash/Badminton', key: 'ogolne' },
  { title: 'Siłownie i sauny', key: 'fizyczne' },
  { title: 'Baseny', key: 'rekreacja' },
];

const MainDashboard = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const { data: facilities, isLoading, isError } = useFacilities();
  const { isAuthenticated } = useAuth();

  const visibleSections = selectedKey
    ? SECTIONS.filter((s) => s.key === selectedKey)
    : SECTIONS;

  return (
    <div
      className={`${styles.wrapper} ${isAuthenticated ? styles.withSidebar : ''}`}
    >
      {isAuthenticated && <Sidebar />}
      <div className={styles.container}>
        <Title level={2}>Wybierz miejsce do gry</Title>
        <Title className={styles.subtitle} level={4}>
          Znajdź najlepsze obiekty sportowe w Twojej okolicy i zarezerwuj
          termin.
        </Title>
        <div className={styles.categoriesScrollWrapper}>
          <Row gutter={[12, 12]} justify="space-between">
            {CATEGORIES.map((cat) => {
              const isActive = selectedKey === cat.key;
              const Icon = cat.icon;
              return (
                <Col key={cat.label}>
                  <button
                    className={`${styles.categoriesCardDetails} ${isActive ? styles.categoriesCardDetailsActive : ''}`}
                    onClick={() => setSelectedKey(isActive ? null : cat.key)}
                  >
                    <Icon
                      className={styles.categoriesCardDetailsText}
                      style={{ color: isActive ? 'white' : undefined }}
                    />
                    <Paragraph
                      className={styles.categoriesCardDetailsText}
                      style={{
                        margin: 0,
                        color: isActive ? 'white' : undefined,
                      }}
                    >
                      {cat.label}
                    </Paragraph>
                  </button>
                </Col>
              );
            })}
          </Row>
        </div>

        {isError && (
          <Alert
            className={styles.errorAlert}
            type="error"
            message="Błąd połączenia"
            description="Nie udało się pobrać obiektów sportowych. Spróbuj odświeżyć stronę."
            showIcon
          />
        )}

        {isLoading && (
          <div className={styles.skeletonWrapper}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <Skeleton.Image
                  active
                  style={{ width: '100%', height: 220, borderRadius: 16 }}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading &&
          !isError &&
          visibleSections.map((section) => (
            <FacilitySection
              key={section.key}
              title={section.title}
              facilities={facilities?.filter(
                (f) => f.category.toLowerCase() === section.key
              )}
              onFacilityClick={(id) => setSelectedFacilityId(id)}
            />
          ))}
      </div>
      {selectedFacilityId && (
        <FacilityModal
          id={selectedFacilityId}
          onClose={() => setSelectedFacilityId(null)}
        />
      )}
    </div>
  );
};

export default MainDashboard;
