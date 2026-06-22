const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const { headers: customHeaders, ...restOptions } = options || {};

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    let detail = 'Wystąpił nieoczekiwany błąd';

    if (typeof errorBody.detail === 'string') {
      detail = errorBody.detail;
    } else if (Array.isArray(errorBody.detail) && errorBody.detail.length > 0) {
      detail = errorBody.detail.map((e: { msg?: string; loc?: string[] }) => {
        const field = e.loc?.slice(-1)[0] || '';
        return field ? `${field}: ${e.msg}` : (e.msg || '');
      }).join('; ');
    }

    throw new ApiError(response.status, detail);
  }

  return response.json();
}
