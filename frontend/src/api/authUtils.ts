export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const getUserId = (): string | null => {
  return localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
};

export const getRole = (): string | null => {
  return localStorage.getItem('role') || sessionStorage.getItem('role');
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('role');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user_id');
  sessionStorage.removeItem('role');
};
