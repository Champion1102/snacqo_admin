import { request, setToken } from './client';

export { setToken } from './client';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface AdminLoginResponse {
  user: AdminUser;
  token: string;
}

/**
 * Admin login (email + password). Backend must expose e.g. POST /auth/admin-login.
 */
export function adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
  return request<AdminLoginResponse>('/auth/admin-login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), password },
  }).then((res) => {
    setToken(res.token);
    return res;
  });
}

export function getMe(): Promise<{ user: AdminUser }> {
  return request('/auth/me');
}

export function clearAuthToken(): void {
  setToken(null);
}
