export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const getUserId = (): string | null => {
  return localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user_id');
};
