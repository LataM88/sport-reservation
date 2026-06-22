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

export type User = {
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  created_at: string;
};

export type Facility = {
  id: string;
  name: string;
  category: string;
  description?: string;
  slot_duration_minutes?: number;
  buffer_time_minutes?: number;
  image_url?: string;
  opening_time?: string;
  closing_time?: string;
  base_price?: number;
  is_active: boolean;
};

export type Reservations = {
  id: string;
  user_id: string;
  facility_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  created_at: string;
};

export type ReservationCreate = {
  facility_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
};
