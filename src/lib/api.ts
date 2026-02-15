import { ApiTokens, CatalogItem, PaymentResponse, SubscriptionStatus } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API error: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  register(email: string, password: string) {
    return request<ApiTokens>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  login(email: string, password: string) {
    return request<ApiTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  me(accessToken: string) {
    return request<{ id: string; email: string }>('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  logout(accessToken: string) {
    return request<void>('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  catalogs(accessToken: string) {
    return request<CatalogItem[]>('/catalogs', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  subscription(accessToken: string) {
    return request<SubscriptionStatus>('/subscriptions/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  catalogAccessLink(accessToken: string, catalogId: string) {
    return request<{ url: string; expiresAt: string }>(`/catalogs/${catalogId}/access-link`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  createPayment(accessToken: string, plan: 'DAY' | 'WEEK') {
    return request<PaymentResponse>('/payments/create', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ plan }),
    });
  },
};
