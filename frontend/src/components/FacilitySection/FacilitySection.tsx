import { useState } from "react";
import { Row, Col, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import type { Facility } from "../../types/types";
import Button from "../Button/Button";
import styles from "./FacilitySection.module.css";

const { Title, Paragraph } = Typography;

interface FacilitySectionProps {
    title: string;
    facilities: Facility[] | undefined;
    initialCount?: number;
}

const FacilityCard = ({ facility }: { facility: Facility }) => (
    <div
        className={styles.facilityCard}
        style={{
            backgroundImage: facility.image_url
                ? `url(${facility.image_url})`
                : undefined,
        }}
    >
        <div className={styles.facilityCardOverlay} />
        <div className={styles.facilityCardDetails}>
            <Title level={4} className={styles.facilityCardTitle}>
                {facility.name}
            </Title>
            <div className={styles.amenities}>
                <div className={styles.amentitiesInfo}>
                    <Paragraph style={{ margin: "0", color: "white" }}>
                        {facility.category.toUpperCase()}
                    </Paragraph>
                </div>
                {facility.base_price != null && (
                    <div className={styles.amentitiesInfo}>
                        <Paragraph style={{ margin: "0", color: "white" }}>
                            od {Number(facility.base_price).toFixed(2)} zł
                        </Paragraph>
                    </div>
                )}
            </div>
            <Button variant="primary">Sprawdź terminy</Button>
        </div>
    </div>
);

const FacilitySection = ({ title, facilities, initialCount = 3 }: FacilitySectionProps) => {
    const [showAll, setShowAll] = useState(false);
    const count = facilities?.length ?? 0;
    const visible = showAll ? facilities : facilities?.slice(0, initialCount);

    return (
        <>
            <div className={styles.showAll}>
                <Title level={2}>{title} ({count})</Title>
                {count > initialCount && (
                    <button
                        className={`${styles.showAllButton} ${styles.showAllButtonDesktop}`}
                        onClick={() => setShowAll(prev => !prev)}
                    >
                        {showAll ? "Ukryj" : "Zobacz wszystkie"}
                        {!showAll && <ArrowRightOutlined style={{ marginLeft: 6 }} />}
                    </button>
                )}
            </div>

            {/* Mobile: poziomy scroll — pokazuje wszystkie karty */}
            <div className={styles.mobileScroll}>
                {facilities?.map((facility) => (
                    <div key={facility.id} className={styles.mobileCard}>
                        <FacilityCard facility={facility} />
                    </div>
                ))}
            </div>

            {/* Desktop: grid z opcją "Zobacz wszystkie" */}
            <Row gutter={[24, 24]} className={styles.desktopGrid}>
                {visible?.map((facility) => (
                    <Col key={facility.id} xl={8} md={12}>
                        <FacilityCard facility={facility} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default FacilitySection;
