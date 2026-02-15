export interface ApiTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface SubscriptionStatus {
  active: boolean;
  endsAt: string | null;
}

export interface PaymentResponse {
  id: string;
  status: string;
  confirmationUrl: string | null;
}
