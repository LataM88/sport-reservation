export type RegisterRequest = {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  remember?: boolean;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  email: string;
  code: string;
  new_password: string;
};
