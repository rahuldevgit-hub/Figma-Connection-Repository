// utils/auth.ts
import Cookies from 'js-cookie';

export const setToken = (key:string, data: string) => {
  Cookies.set(key, data, {
    expires: 7, // Days
    secure: true,
    sameSite: 'Lax',
    path: '/',
  });
};

export const getToken = (): string | undefined => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token');
};

export const logout = () => {
  // Remove the token
  Cookies.remove('admin_token', { path: '/' });

  // Redirect to login
  window.location.href = '/administrator';
};
