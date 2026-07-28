import { Row, Col, Typography, Skeleton } from 'antd';
import { ThunderboltOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRecommendations } from '../../../hooks/useRecommendations';
import styles from './AiRecommended.module.css';

const { Title, Paragraph } = Typography;

const CATEGORY_LABELS: Record<string, string> = {
  hala: 'Hala sportowa',
  stadiony: 'Stadion',
  ogolne: 'Sporty rakietowe',
  fizyczne: 'Siłownia / Sauna',
  rekreacja: 'Basen / Rekreacja',
};

interface AiRecommendedProps {
  onReserveClick?: (facilityId: string) => void;
}

const AiRecommended = ({ onReserveClick }: AiRecommendedProps) => {
  const { data: facilities, isLoading, isError } = useRecommendations(3);

  return (
    <div className={styles.section}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={3} className={styles.title}>
            Rekomendowane dla Ciebie
          </Title>
          <Paragraph className={styles.subtitle}>
            Na podstawie Twojej aktywności w ostatnim miesiącu.
          </Paragraph>
        </Col>
      </Row>

      {isError && (
        <Paragraph className={styles.errorMsg}>
          Nie udało się załadować rekomendacji.
        </Paragraph>
      )}

      <Row gutter={[24, 24]}>
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <Col key={i} xs={24} sm={12} md={8}>
                <div className={styles.card}>
                  <Skeleton.Image
                    active
                    style={{ width: '100%', height: 160 }}
                  />
                  <div className={styles.cardBody}>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                </div>
              </Col>
            ))
          : facilities?.map((facility) => (
              <Col key={facility.id} xs={24} sm={12} md={8}>
                <div className={styles.card}>
                  <div
                    className={styles.cardImage}
                    style={
                      facility.image_url
                        ? { backgroundImage: `url(${facility.image_url})` }
                        : undefined
                    }
                  >
                    <span className={styles.matchBadge}>
                      <ThunderboltOutlined /> AI Match
                    </span>
                    {facility.base_price && (
                      <span className={styles.priceBadge}>
                        {facility.base_price} zł/h
                      </span>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardTitleRow}>
                      <span className={styles.name}>{facility.name}</span>
                    </div>

                    {facility.location && (
                      <p className={styles.location}>📍 {facility.location}</p>
                    )}

                    <div className={styles.tags}>
                      <span className={styles.tag}>
                        {CATEGORY_LABELS[facility.category] ??
                          facility.category}
                      </span>
                    </div>

                    <div className={styles.buttonGroup}>
                      <button
                        className={styles.buttonOutline}
                        onClick={() => onReserveClick?.(facility.id)}
                      >
                        <CalendarOutlined /> Rezerwacja
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
      </Row>
    </div>
  );
};

export default AiRecommended;
