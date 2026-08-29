import { useState, useEffect } from 'react';
import { Typography, Spin, Switch, message, Row, Col } from 'antd';
import { useAdminFacility, useUpdateAdminFacility, useUploadAdminFacilityPhoto } from '../../../hooks/useAdmin';
import Button from '../../../components/Button/Button';
import FormInput from '../../../components/FormInput/FormInput';
import styles from './AdminFacilitySettings.module.css';

const { Title } = Typography;

export function AdminFacilitySettings() {
  const { data: facility, isLoading } = useAdminFacility();
  const updateFacility = useUpdateAdminFacility();
  const uploadPhoto = useUploadAdminFacilityPhoto();

  const [price, setPrice] = useState<string>('');
  const [openingTime, setOpeningTime] = useState<string>('');
  const [closingTime, setClosingTime] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (facility) {
      setPrice(facility.base_price?.toString() || '');
      setOpeningTime(facility.opening_time || '');
      setClosingTime(facility.closing_time || '');
      setIsActive(facility.is_active);
      setImageUrl(facility.image_url || '');
    }
  }, [facility]);

  const handleSave = async () => {
    try {
      await updateFacility.mutateAsync({
        base_price: price ? parseFloat(price) : undefined,
        opening_time: openingTime || undefined,
        closing_time: closingTime || undefined,
        is_active: isActive,
      });
      message.success('Zapisano ustawienia obiektu');
    } catch (error) {
      message.error('Wystąpił błąd podczas zapisywania');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadPhoto.mutateAsync(file);
      setImageUrl(res.image_url);
      message.success('Zdjęcie główne zostało zaktualizowane');
    } catch (error) {
      message.error('Wystąpił błąd podczas wgrywania zdjęcia');
    }
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>Ustawienia Obiektu</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div className={styles.formCard}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Cena za godzinę (PLN)</h3>
              <FormInput 
                label="Cena za godzinę"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="np. 45"
              />
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Godziny otwarcia</h3>
              <div className={styles.timeInputs}>
                <FormInput 
                  type="time"
                  label="Od"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                />
                <FormInput 
                  type="time"
                  label="Do"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.sectionRow}>
              <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Aktywny do rezerwacji</h3>
              <Switch checked={isActive} onChange={setIsActive} />
            </div>

            <div className={styles.footer}>
              <Button 
                onClick={handleSave} 
                disabled={updateFacility.isPending}
                fullWidth
              >
                {updateFacility.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </Button>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className={styles.formCard}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Zdjęcie główne obiektu</h3>
              {imageUrl ? (
                <div className={styles.previewImage} style={{ backgroundImage: `url(${imageUrl})` }} />
              ) : (
                <div className={styles.noImage}>Brak zdjęcia głównego</div>
              )}
              
              <input
                type="file"
                id="facilityPhotoInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              <Button 
                variant="outline" 
                fullWidth 
                style={{ marginTop: 16 }}
                disabled={uploadPhoto.isPending}
                onClick={() => document.getElementById('facilityPhotoInput')?.click()}
              >
                {uploadPhoto.isPending ? 'Wgrywanie...' : 'Zmień zdjęcie'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
