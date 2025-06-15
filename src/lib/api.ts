const API_BASE_URL = 'http://127.0.0.1:8000';

export interface Book {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderRequest {
  phone_number: string;
  address: string;
  payment_method: string;
  books: Book[];
}

export interface OrderResponse {
  id: number;
  phone_number: string;
  address: string;
  payment_method: string;
  payment_status: string;
  books: Book[];
  total_amount: number;
  order_status: string;
  created_at: string;
  verified: boolean;
}

export interface InitiateOrderResponse {
  message: string;
  session_token: string;
  expires_in_seconds: number;
  total_amount: number;
}

export interface VerificationRequest {
  session_token: string;
  pin_code: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async initiateOrder(orderData: OrderRequest): Promise<InitiateOrderResponse> {
    return this.request('/orders/initiate', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async verifyOrder(verificationData: VerificationRequest): Promise<OrderResponse> {
    return this.request('/orders/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  async resendCode(sessionToken: string): Promise<{ message: string; expires_in_seconds: number }> {
    return this.request('/orders/resend-code', {
      method: 'POST',
      body: JSON.stringify({ session_token: sessionToken }),
    });
  }

  async getOrders(phoneNumber?: string): Promise<OrderResponse[]> {
    const params = phoneNumber ? `?phone_number=${encodeURIComponent(phoneNumber)}` : '';
    return this.request(`/orders/${params}`);
  }

  async getOrder(orderId: number): Promise<OrderResponse> {
    return this.request(`/orders/${orderId}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;