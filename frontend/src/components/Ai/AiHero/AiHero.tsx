import { Row, Col, Typography } from 'antd';
import { RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';
import robotAiImg from '../../../images/dashboard/robotAi.png';
import styles from './AiHero.module.css';

const { Title, Paragraph } = Typography;

const SUGGESTED_QUESTIONS = [
  'Znajdź wolny kort tenisowy jutro',
  'Gdzie mogę pograć w squasha dziś?',
  'Pływalnia rano w weekend',
];

interface AiHeroProps {
  input: string;
  onInputChange: (value: string) => void;
  onSearch: () => void;
  onSuggestedClick: (question: string) => void;
}

const AiHero = ({
  input,
  onInputChange,
  onSearch,
  onSuggestedClick,
}: AiHeroProps) => {
  return (
    <div className={styles.heroSection}>
      <Row gutter={[32, 32]} align="middle">
        <Col xs={24} md={14}>
          <span className={styles.heroBadge}>
            <ThunderboltOutlined /> Napędzane przez AI
          </span>

          <Title level={1} className={styles.heroTitle}>
            Inteligentny Asystent Rezerwacji
          </Title>

          <Paragraph className={styles.heroSubtitle}>
            Znajdź idealny termin w kilka sekund. Rozmawiaj ze swoim asystentem
            tak, jak z trenerem.
          </Paragraph>

          <div className={styles.heroInputWrapper}>
            <RobotOutlined className={styles.heroInputIcon} />
            <input
              className={styles.heroInput}
              placeholder="Znajdź mi wolny kort tenisowy..."
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
            <button className={styles.heroButton} onClick={() => onSearch()}>
              Szukaj
            </button>
          </div>

          <div className={styles.suggestedRow}>
            <span className={styles.suggestedLabel}>Często pytane:</span>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                className={styles.suggestedChip}
                onClick={() => onSuggestedClick(q)}
              >
                "{q}"
              </button>
            ))}
          </div>
        </Col>

        <Col xs={0} md={10} className={styles.heroImageCol}>
          <img
            src={robotAiImg}
            alt="AI Asystent"
            className={styles.heroImage}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AiHero;
