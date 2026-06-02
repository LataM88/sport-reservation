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

export type Facility = {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  opening_time?: string;
  closing_time?: string;
  base_price?: number;
  is_active: boolean;
};