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
};
