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
  email_notifications: boolean;
  avatar_url?: string;
  role: 'user' | 'admin';
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

export interface Reservations {
  id: string;
  facility_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
}

export interface AdminReservation extends Reservations {
  user: User | null;
  guest_name?: string;
  guest_phone?: string;
  created_at: string;
}

export interface ReservationCreate {
  facility_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
}

export interface ManualReservationCreate extends ReservationCreate {
  guest_name: string;
  guest_phone: string;
}

export interface FacilityUpdate {
  name?: string;
  description?: string;
  image_url?: string;
  opening_time?: string;
  closing_time?: string;
  base_price?: number;
  is_active?: boolean;
}

export type ProfileDataChangeRequest = {
  phoneNumber: string;
  email: string;
};

export type PasswordChangeRequest = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ConfirmChangeRequest = {
  code: string;
};

export type NotificationPreferences = {
  email_notifications: boolean;
};

// typy do rezerwacji z Ai

export type AiMessage = {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
};

export type RecommendedFacility = {
  id: string;
  name: string;
  category: string;
  location?: string;
  image_url?: string;
  base_price?: number;
};
