import { useState } from 'react';
import styles from './Profile.module.css';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/NavLayout/Sidebar';
import { Row, Col, Typography, Skeleton, Alert, Modal, message } from 'antd';
import { UserOutlined, SafetyOutlined, MailOutlined } from '@ant-design/icons';
import { useUser } from '../../../hooks/useUser';
import Button from '../../../components/Button/Button';
import { useForm } from 'react-hook-form';
import { ApiError } from '../../../api/apiClient';
import type {
  ProfileDataChangeRequest,
  PasswordChangeRequest,
} from '../../../types/types';
import {
  useRequestProfileUpdate,
  useConfirmProfileUpdate,
  useRequestPasswordChange,
  useConfirmPasswordChange,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useUploadAvatar,
} from '../../../hooks/useProfileUpdate';

const { Title, Paragraph } = Typography;

const Profile = () => {
  const { data: user, isLoading, isError } = useUser();
  const { isAuthenticated } = useAuth();

  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [confirmType, setConfirmType] = useState<'profile' | 'password'>('profile');

  // Profile data form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileDataChangeRequest>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    setError: setPasswordError,
    watch: watchPassword,
    reset: resetPasswordForm,
    formState: { errors: errorsPassword },
  } = useForm<PasswordChangeRequest>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // Mutations
  const requestProfileUpdate = useRequestProfileUpdate();
  const confirmProfileUpdate = useConfirmProfileUpdate();
  const requestPasswordChange = useRequestPasswordChange();
  const confirmPasswordChange = useConfirmPasswordChange();
  const uploadAvatar = useUploadAvatar();

  // Notifications
  const { data: notifPrefs } = useNotificationPreferences();
  const updateNotifPrefs = useUpdateNotificationPreferences();

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar.mutateAsync(file);
      message.success('Zdjęcie profilowe zostało zaktualizowane');
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.detail
          : 'Wystąpił błąd podczas wgrywania zdjęcia';
      message.error(msg);
    }
  };

  // Handle profile data submit
  const onProfileSubmit = async (data: ProfileDataChangeRequest) => {
    try {
      await requestProfileUpdate.mutateAsync(data);
      message.success('Kod potwierdzenia został wysłany na Twój email');
      setConfirmType('profile');
      setConfirmCode('');
      setConfirmModalOpen(true);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.detail
          : 'Wystąpił nieoczekiwany błąd';
      setError('root', { message: msg });
      message.error(msg);
    }
  };

  // Handle password submit
  const onPasswordSubmit = async (data: PasswordChangeRequest) => {
    try {
      await requestPasswordChange.mutateAsync(data);
      message.success('Kod potwierdzenia został wysłany na Twój email');
      setConfirmType('password');
      setConfirmCode('');
      setConfirmModalOpen(true);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.detail
          : 'Wystąpił nieoczekiwany błąd';
      setPasswordError('root', { message: msg });
      message.error(msg);
    }
  };

  // Handle confirmation code submit
  const onConfirmCode = async () => {
    if (!confirmCode || confirmCode.length !== 6) {
      message.error('Wprowadź 6-cyfrowy kod');
      return;
    }

    try {
      if (confirmType === 'profile') {
        await confirmProfileUpdate.mutateAsync({ code: confirmCode });
        message.success('Dane profilu zostały zaktualizowane');
      } else {
        await confirmPasswordChange.mutateAsync({ code: confirmCode });
        message.success('Hasło zostało zmienione');
        resetPasswordForm();
      }
      setConfirmModalOpen(false);
      setConfirmCode('');
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.detail
          : 'Nieprawidłowy kod potwierdzenia';
      message.error(msg);
    }
  };

  // Handle notification toggle
  const onNotificationToggle = (checked: boolean) => {
    updateNotifPrefs.mutate(
      { email_notifications: checked },
      {
        onSuccess: () => {
          message.success(
            checked
              ? 'Powiadomienia e-mail zostały włączone'
              : 'Powiadomienia e-mail zostały wyłączone',
          );
        },
        onError: () => {
          message.error('Nie udało się zaktualizować preferencji');
        },
      },
    );
  };

  return (
    <div
      className={`${styles.wrapper} ${isAuthenticated ? styles.withSidebar : ''}`}
    >
      {isAuthenticated && <Sidebar />}
      {isLoading && <Skeleton active />}
      {isError && (
        <Alert
          message="Błąd"
          description="Nie udało się pobrać danych użytkownika"
          type="error"
          showIcon
        />
      )}
      {user && (
        <div className={styles.container}>
          <Title level={2}>Mój profil</Title>
          <Row gutter={[24, 24]}>
            <Col
              xl={{ span: 12, order: 1 }}
              md={{ span: 12, order: 1 }}
              sm={{ span: 24, order: 2 }}
              xs={{ span: 24, order: 2 }}
            >
              <div className={styles.dataCard}>
                <div className={styles.changeData}>
                  <UserOutlined style={{ fontSize: '24px' }} />
                  <Title style={{ margin: '0' }} level={3}>
                    Dane osobowe
                  </Title>
                </div>
                <div className={styles.changeDataDetails}>
                  <form noValidate onSubmit={handleSubmit(onProfileSubmit)}>
                    <div className={styles.inputs}>
                      <div className={styles.inputsName}>
                        <div className={styles.inputGroup}>
                          <label htmlFor="name">IMIĘ</label>
                          <input type="text" disabled placeholder={user.name} />
                        </div>
                        <div className={styles.inputGroup}>
                          <label htmlFor="lastName">NAZWISKO</label>
                          <input
                            type="text"
                            disabled
                            placeholder={user.lastName}
                          />
                        </div>
                      </div>
                      <div className={styles.inputsEmail}>
                        <div className={styles.inputGroupOther}>
                          <label htmlFor="email">EMAIL</label>
                          <input
                            type="email"
                            placeholder={user.email}
                            {...register('email', {
                              required: 'Musisz podać email',
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email musi być poprawny',
                              },
                            })}
                          />
                          {errors.email && (
                            <Paragraph style={{ color: 'red' }}>
                              {errors.email.message}
                            </Paragraph>
                          )}
                        </div>
                        <div className={styles.inputGroupOther}>
                          <label htmlFor="phoneNumber">NUMER TELEFONU</label>
                          <input
                            type="text"
                            placeholder={user.phoneNumber}
                            {...register('phoneNumber', {
                              required: 'Musisz podać numer telefonu',
                              pattern: {
                                value: /^[0-9]{9}$/,
                                message:
                                  'Numer telefonu musi składać się z 9 cyfr',
                              },
                            })}
                          />
                          {errors.phoneNumber && (
                            <Paragraph style={{ color: 'red' }}>
                              {errors.phoneNumber.message}
                            </Paragraph>
                          )}
                        </div>
                      </div>
                      {errors.root && (
                        <Paragraph style={{ color: 'red' }}>
                          {errors.root.message}
                        </Paragraph>
                      )}
                      <Button
                        type="submit"
                        style={{ marginTop: '8px' }}
                        variant="primary"
                        size="md"
                        disabled={requestProfileUpdate.isPending}
                      >
                        {requestProfileUpdate.isPending
                          ? 'Wysyłanie...'
                          : 'Zapisz zmiany'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Col>
            <Col
              xl={{ span: 12, order: 2 }}
              md={{ span: 12, order: 2 }}
              sm={{ span: 24, order: 1 }}
              xs={{ span: 24, order: 1 }}
            >
              <div className={styles.profileAppearance}>
                <div className={styles.profilePhoto}>
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <UserOutlined />
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <Title level={3}>
                    {user.name} {user.lastName}
                  </Title>
                  <Paragraph>{user.email}</Paragraph>
                </div>
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => document.getElementById('avatarInput')?.click()}
                  disabled={uploadAvatar.isPending}
                >
                  {uploadAvatar.isPending ? 'Wgrywanie...' : 'Zmień zdjęcie'}
                </Button>
              </div>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xl={12} md={12} sm={24} xs={24}>
              <div className={styles.changePassword}>
                <div className={styles.changePasswordTitle}>
                  <SafetyOutlined />
                  <Title level={3}>Bezpieczeństwo</Title>
                </div>
                <form
                  noValidate
                  onSubmit={handleSubmitPassword(onPasswordSubmit)}
                >
                  <div className={styles.oldPassword}>
                    <label htmlFor="oldPassword">STARE HASŁO</label>
                    <input
                      type="password"
                      placeholder="********"
                      {...registerPassword('oldPassword', {
                        required: 'Musisz podać obecne hasło',
                      })}
                    />
                    {errorsPassword.oldPassword && (
                      <Paragraph style={{ color: 'red' }}>
                        {errorsPassword.oldPassword.message}
                      </Paragraph>
                    )}
                  </div>
                  <div className={styles.newPassword}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="newPassword">NOWE HASŁO</label>
                      <input
                        type="password"
                        placeholder="********"
                        {...registerPassword('newPassword', {
                          required: 'Musisz podać nowe hasło',
                          minLength: {
                            value: 8,
                            message: 'Hasło musi mieć co najmniej 8 znaków',
                          },
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                            message:
                              'Hasło musi zawierać min. 8 znaków, dużą i małą literę, cyfrę oraz znak specjalny',
                          },
                        })}
                      />
                      {errorsPassword.newPassword && (
                        <Paragraph style={{ color: 'red' }}>
                          {errorsPassword.newPassword.message}
                        </Paragraph>
                      )}
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="confirmPassword">
                        POTWIERDŹ NOWE HASŁO
                      </label>
                      <input
                        type="password"
                        placeholder="********"
                        {...registerPassword('confirmPassword', {
                          required: 'Musisz potwierdzić nowe hasło',
                          validate: (value) =>
                            value === watchPassword('newPassword') ||
                            'Hasła nie są identyczne',
                        })}
                      />
                      {errorsPassword.confirmPassword && (
                        <Paragraph style={{ color: 'red' }}>
                          {errorsPassword.confirmPassword.message}
                        </Paragraph>
                      )}
                    </div>
                  </div>
                  {errorsPassword.root && (
                    <Paragraph style={{ color: 'red', marginTop: '8px' }}>
                      {errorsPassword.root.message}
                    </Paragraph>
                  )}
                  <Button
                    type="submit"
                    variant="ghost"
                    disabled={requestPasswordChange.isPending}
                  >
                    {requestPasswordChange.isPending
                      ? 'Wysyłanie...'
                      : 'Aktualizuj hasło'}
                  </Button>
                </form>
              </div>
            </Col>
            <Col xl={12} md={12} sm={24} xs={24}>
              <div className={styles.notifiactions}>
                <Title level={4}>Preferencje powiadomień</Title>
                <div className={styles.notifiactionsGroup}>
                  <MailOutlined />
                  <div className={styles.aboutNotification}>
                    <Title level={4}>Powiadomienia E-mail</Title>
                    <Paragraph>
                      Otrzymuj przypomnienie o rezerwacji 2h przed jej
                      rozpoczęciem
                    </Paragraph>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notifPrefs?.email_notifications ?? false}
                      onChange={(e) => onNotificationToggle(e.target.checked)}
                      disabled={updateNotifPrefs.isPending}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Confirmation Code Modal */}
      <Modal
        title={
          confirmType === 'profile'
            ? 'Potwierdź zmianę danych'
            : 'Potwierdź zmianę hasła'
        }
        open={confirmModalOpen}
        onCancel={() => {
          setConfirmModalOpen(false);
          setConfirmCode('');
        }}
        footer={null}
        centered
        destroyOnHidden
      >
        <div className={styles.confirmModal}>
          <Paragraph>
            Na Twój adres email został wysłany 6-cyfrowy kod potwierdzenia.
            Wprowadź go poniżej, aby zatwierdzić zmiany.
          </Paragraph>
          <input
            className={styles.codeInput}
            type="text"
            maxLength={6}
            placeholder="000000"
            value={confirmCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setConfirmCode(val);
            }}
            autoFocus
          />
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onConfirmCode}
            disabled={
              confirmProfileUpdate.isPending || confirmPasswordChange.isPending
            }
          >
            {confirmProfileUpdate.isPending || confirmPasswordChange.isPending
              ? 'Weryfikacja...'
              : 'Potwierdź'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
