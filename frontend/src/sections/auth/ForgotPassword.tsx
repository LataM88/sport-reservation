import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../../types/types';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import { useState } from 'react';
import {
  useForgotPassword,
  useResetPassword,
} from '../../hooks/useForgotPassword';
import { ApiError } from '../../api/apiClient';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export function ForgotPassword() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    setError: setEmailError,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordRequest>();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    setError: setResetError,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordRequest>();

  const onForgotPassword = async (data: ForgotPasswordRequest) => {
    if (cooldown > 0) return;

    try {
      await forgotPasswordMutation.mutateAsync(data);
      setEmail(data.email);
      setStep(2);

      setCooldown(30);
      const intervalId = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        setCooldown(0);
      }, 30000);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.detail : 'Wystąpił błąd';
      setEmailError('root', { message });
    }
  };

  const onResetPassword = async (data: ResetPasswordRequest) => {
    try {
      await resetPasswordMutation.mutateAsync({ ...data, email });
      navigate('/login');
    } catch (error) {
      const message =
        error instanceof ApiError ? error.detail : 'Wystąpił błąd';
      setResetError('root', { message });
    }
  };

  return (
    <AuthLayout
      titleHighlight={step === 1 ? 'Resetuj hasło' : 'Weryfikacja'}
      titleRest={
        step === 1 ? (
          <>
            podaj swój email <br /> aby otrzymać kod
          </>
        ) : (
          <>
            wpisz kod <br /> oraz nowe hasło
          </>
        )
      }
      switchText="Pamiętasz hasło?"
      switchLabel="Zaloguj się"
      switchTo="/login"
      rootError={emailErrors.root?.message || resetErrors.root?.message}
    >
      {step === 1 ? (
        <form noValidate onSubmit={handleSubmitEmail(onForgotPassword)}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <FormInput
              label="Email"
              type="email"
              error={emailErrors.email?.message}
              {...registerEmail('email', {
                required: 'Podaj email',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Niepoprawny format email',
                },
              })}
            />
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={forgotPasswordMutation.isPending || cooldown > 0}
            >
              {forgotPasswordMutation.isPending
                ? 'Wysyłanie...'
                : cooldown > 0
                ? `Wyślij kod (${cooldown}s)`
                : 'Wyślij kod'}
            </Button>
          </div>
        </form>
      ) : (
        <form noValidate onSubmit={handleSubmitReset(onResetPassword)}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
              Kod został wysłany na adres: <strong>{email}</strong>
            </p>
            <FormInput
              label="Kod z maila"
              type="text"
              placeholder="123456"
              error={resetErrors.code?.message}
              {...registerReset('code', {
                required: 'Podaj kod',
                minLength: { value: 6, message: 'Kod ma 6 cyfr' },
                maxLength: { value: 6, message: 'Kod ma 6 cyfr' },
              })}
            />
            <FormInput
              label="Nowe hasło"
              type="password"
              error={resetErrors.new_password?.message}
              {...registerReset('new_password', {
                required: 'Podaj nowe hasło',
                minLength: { value: 8, message: 'Hasło min. 8 znaków' },
              })}
            />
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? 'Zmienianie...' : 'Zmień hasło'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              disabled={resetPasswordMutation.isPending}
            >
              Wróć do podawania emaila
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
