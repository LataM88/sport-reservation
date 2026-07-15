import { useState } from 'react';
import type { RegisterRequest } from '../../types/types';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegister, useVerifyEmail, useResendActivationCode } from '../../hooks/useRegister';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/apiClient';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import { message } from 'antd';

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const registerMutation = useRegister();
  const verifyEmailMutation = useVerifyEmail();
  const resendMutation = useResendActivationCode();
  const { login } = useAuth();

  const [registeredEmail, setRegisteredEmail] = useState<string | null>(
    location.state?.email || null
  );
  const [verificationCode, setVerificationCode] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterRequest>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const handleRegister = async (data: RegisterRequest) => {
    try {
      await registerMutation.mutateAsync(data);
      message.success('Konto zostało utworzone. Wysłaliśmy kod aktywacyjny.');
      setRegisteredEmail(data.email);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.detail
          : 'Wystąpił nieoczekiwany błąd';
      setError('root', { message: msg });
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredEmail) return;

    if (verificationCode.length !== 6) {
      message.error('Kod musi mieć dokładnie 6 cyfr');
      return;
    }

    try {
      const result = await verifyEmailMutation.mutateAsync({
        email: registeredEmail,
        code: verificationCode,
      });
      message.success('Konto zostało pomyślnie aktywowane!');
      login(result.token, result.user_id, true);
      navigate('/');
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.detail
          : 'Błąd podczas aktywacji konta';
      setError('root', { message: msg });
      message.error(msg);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) return;
    try {
      await resendMutation.mutateAsync({ email: registeredEmail });
      message.success('Nowy kod aktywacyjny został wysłany na Twój e-mail');
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.detail
          : 'Nie udało się wysłać nowego kodu';
      message.error(msg);
    }
  };

  const handleCapitalize = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value =
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  };

  if (registeredEmail) {
    return (
      <AuthLayout
        titleHighlight="Potwierdź e-mail"
        titleRest={<>i aktywuj swoje konto</>}
        switchText="Posiadasz konto?"
        switchLabel="Zaloguj się"
        switchTo="/login"
      >
        <form noValidate onSubmit={handleVerify}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <span style={{ textAlign: 'center', color: '#555', fontSize: '14px', lineHeight: '1.5' }}>
              Wysłaliśmy 6-cyfrowy kod aktywacyjny na adres: <br />
              <strong>{registeredEmail}</strong>. Wprowadź go poniżej, aby aktywować konto.
            </span>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              style={{
                width: '220px',
                height: '56px',
                textAlign: 'center',
                fontSize: '32px',
                fontFamily: 'Courier New, Consolas, monospace',
                fontWeight: 700,
                letterSpacing: '10px',
                border: '2px solid #ddd',
                borderRadius: '12px',
                outline: 'none',
                background: '#fafafa',
                color: '#000',
                boxSizing: 'border-box',
                paddingLeft: '10px'
              }}
              autoFocus
            />
            {errors.root && (
              <span style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>
                {errors.root.message}
              </span>
            )}
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={verifyEmailMutation.isPending}
            >
              {verifyEmailMutation.isPending ? 'Weryfikacja...' : 'Aktywuj konto'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={handleResend}
              disabled={resendMutation.isPending}
            >
              {resendMutation.isPending ? 'Wysyłanie...' : 'Wyślij kod ponownie'}
            </Button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      titleHighlight="Załóż konto"
      titleRest={
        <>
          i korzystaj <br />z wszystkich funkcji
        </>
      }
      switchText="Posiadasz konto?"
      switchLabel="Zaloguj się"
      switchTo="/login"
    >
      <form noValidate onSubmit={handleSubmit(handleRegister)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FormInput
            label="Imie"
            type="text"
            error={errors.name?.message}
            {...register('name', {
              required: 'Musisz podać imię',
              minLength: {
                value: 2,
                message: 'Imię musi mieć co najmniej 2 znaki',
              },
              pattern: {
                value: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
                message: 'Imie musi się składać tylko z liter',
              },
              onChange: handleCapitalize,
            })}
          />
          <FormInput
            label="Nazwisko"
            type="text"
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'Musisz podać nazwisko',
              minLength: {
                value: 2,
                message: 'Nazwisko musi mieć co najmniej 2 znaki',
              },
              pattern: {
                value: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/,
                message: 'Nazwisko musi się składać tylko z liter',
              },
              onChange: handleCapitalize,
            })}
          />
          <FormInput
            label="Numer telefonu"
            type="text"
            error={errors.phoneNumber?.message}
            {...register('phoneNumber', {
              required: 'Musisz podać numer telefonu',
              minLength: {
                value: 9,
                message: 'Numer telefonu musi mieć co najmniej 9 cyfr',
              },
              pattern: {
                value: /^[0-9]+$/,
                message: 'Numer telefonu musi się składać tylko z cyfr',
              },
            })}
          />
          <FormInput
            label="Email"
            type="text"
            error={errors.email?.message}
            {...register('email', {
              required: 'Musisz podać email',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email musi być poprawny',
              },
            })}
          />
          <FormInput
            label="Hasło"
            type="password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Musisz podać hasło',
              minLength: {
                value: 8,
                message: 'Hasło musi mieć co najmniej 8 znaków',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message:
                  'Hasło musi zawierać min. 8 znaków, dużą i małą literę, cyfrę oraz znak specjalny',
              },
            })}
          />
          {errors.root && (
            <span style={{ color: 'red', fontSize: '13px', marginTop: '-12px' }}>
              {errors.root.message}
            </span>
          )}
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? 'Rejestrowanie...'
              : 'Zarejestruj się'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Register;
