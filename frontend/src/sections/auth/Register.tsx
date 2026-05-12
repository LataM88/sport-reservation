import type { RegisterRequest } from '../../types/types';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../hooks/useRegister';
import { ApiError } from '../../api/apiClient';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';

export function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

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
      const result = await registerMutation.mutateAsync(data);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user_id', result.user_id);
      navigate('/');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.detail
          : 'Wystąpił nieoczekiwany błąd';
      setError('root', { message });
    }
  };

  const handleCapitalize = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value =
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  };

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
      rootError={errors.root?.message}
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
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Rejestrowanie...' : 'Zarejestruj się'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Register;
