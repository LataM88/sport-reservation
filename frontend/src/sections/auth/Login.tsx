import type { LoginRequest } from '../../types/types';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/apiClient';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';

import { message } from 'antd';

export function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const handleLogin = async (data: LoginRequest) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      login(result.token, result.user_id, !!data.remember);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        message.warning('Konto jest nieaktywne. Przekierowujemy do weryfikacji e-mail.');
        navigate('/register', { state: { email: data.email } });
        return;
      }
      const messageText =
        error instanceof ApiError
          ? error.detail
          : 'Wystąpił nieoczekiwany błąd';
      setError('root', { message: messageText });
    }
  };

  return (
    <AuthLayout
      titleHighlight="Zaloguj się"
      titleRest={
        <>
          i wybierz <br />
          swoje miejsce treningu
        </>
      }
      switchText="Nie masz konta?"
      switchLabel="Zarejestruj się"
      switchTo="/register"
      forgotPasswordText="Nie pamiętasz hasła?"
      forgotPasswordLabel="Zresetuj hasło"
      forgotPasswordTo="/forgot-password"
    >
      <form noValidate onSubmit={handleSubmit(handleLogin)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            })}
          />
          {errors.root && (
            <span style={{ color: 'red', fontSize: '13px', marginTop: '-12px' }}>
              {errors.root.message}
            </span>
          )}
          <FormInput
            type="checkbox"
            label="Zapamiętaj mnie"
            {...register('remember')}
          />
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logowanie...' : 'Zaloguj się'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;
