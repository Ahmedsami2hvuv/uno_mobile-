/**
 * عميل API — يقرأ رابط ريلوي من railwayConfig.js (ملف الربط مثل توكن البوت).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RAILWAY_APP_URL } from './railwayConfig';

const BASE_URL = RAILWAY_APP_URL;

export async function getStoredToken() {
  try {
    return await AsyncStorage.getItem('uno_token');
  } catch (e) {
    return null;
  }
}

export async function setStoredToken(token) {
  try {
    if (token) await AsyncStorage.setItem('uno_token', token);
    else await AsyncStorage.removeItem('uno_token');
  } catch (e) {}
}

export async function register(playerName, usernameKey, passwordKey) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      player_name: playerName,
      username_key: usernameKey,
      password_key: passwordKey,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'فشل التسجيل');
  return data;
}

export async function login(usernameKey, passwordKey) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username_key: usernameKey,
      password_key: passwordKey,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'فشل الدخول');
  return data;
}

export async function getProfile(token) {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'فشل جلب البروفايل');
  return data;
}

export async function healthCheck() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json().catch(() => ({}));
    return res.ok && data.status === 'ok';
  } catch (e) {
    return false;
  }
}

export function getBaseUrl() {
  return BASE_URL;
}
