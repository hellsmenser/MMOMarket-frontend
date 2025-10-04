import { api } from './api';

export interface LoginPayload { username: string; password: string; }
export interface RegisterPayload { username: string; password: string; invite_code: string; }

const LOGIN_URL = 'auth/login';
const REGISTER_URL = 'auth/register';
const ME_URL = 'auth/me';

export async function login(payload: LoginPayload) {
  const res = await api.post(LOGIN_URL, payload);
  return res.data; // { token | access_token | ... }
}

export async function register(payload: RegisterPayload) {
  const res = await api.post(REGISTER_URL, payload);
  return res.data; // { token? }
}

// Проверка валидности текущей cookie/токена (200 ok, 403 invalid)
export async function me() {
  const res = await api.get(ME_URL);
  return res.data;
}
