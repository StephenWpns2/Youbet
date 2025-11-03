import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  roi?: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  phone: string;
  name?: string;
  avatar?: string;
  message?: string;
  sentAt: string;
  userExists: boolean;
}

export interface Invitation {
  id: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
    roi?: number;
  };
  message?: string;
  receivedAt: string;
}

export class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired - try to refresh
          await this.refreshToken();
          // Retry original request
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  clearToken() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // ============================================================================
  // AUTH
  // ============================================================================

  async sendOtp(phone: string) {
    const { data } = await this.client.post('/auth/phone/send-otp', { phone });
    return data;
  }

  async verifyOtp(phone: string, code: string, name?: string, email?: string): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/auth/phone/verify-otp', {
      phone,
      code,
      name,
      email,
    });
    this.setToken(data.accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  }

  async googleAuth(idToken: string, name: string, email: string): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/auth/google', {
      idToken,
      name,
      email,
    });
    this.setToken(data.accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  }

  async appleAuth(idToken: string, name: string, email: string): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/auth/apple', {
      idToken,
      name,
      email,
    });
    this.setToken(data.accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data;
  }

  async getProfile(): Promise<User> {
    const { data } = await this.client.get<User>('/auth/me');
    return data;
  }

  async logout() {
    await this.client.post('/auth/logout');
    this.clearToken();
  }

  private async refreshToken() {
    if (typeof window === 'undefined') return;
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.clearToken();
      throw new Error('No refresh token available');
    }

    const { data } = await this.client.post<AuthResponse>('/auth/refresh', { refreshToken });
    this.setToken(data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }

  // ============================================================================
  // CONTACTS
  // ============================================================================

  async sendContactRequest(phone: string, message?: string) {
    const { data } = await this.client.post('/contacts/request', { phone, message });
    return data;
  }

  async getContacts(search?: string, limit?: number, offset?: number): Promise<{ contacts: Contact[]; count: number }> {
    const { data } = await this.client.get('/contacts', {
      params: { search, limit, offset },
    });
    return data;
  }

  async getSentRequests(): Promise<{ requests: ContactRequest[] }> {
    const { data } = await this.client.get('/contacts/requests/sent');
    return data;
  }

  async getReceivedRequests(): Promise<{ invitations: Invitation[] }> {
    const { data } = await this.client.get('/contacts/requests/received');
    return data;
  }

  async approveContactRequest(requestId: string) {
    const { data } = await this.client.post(`/contacts/requests/${requestId}/approve`);
    return data;
  }

  async declineContactRequest(requestId: string) {
    const { data } = await this.client.post(`/contacts/requests/${requestId}/decline`);
    return data;
  }

  async cancelContactRequest(requestId: string) {
    const { data } = await this.client.delete(`/contacts/requests/${requestId}`);
    return data;
  }

  async removeContact(contactId: string) {
    const { data } = await this.client.delete(`/contacts/${contactId}`);
    return data;
  }

  async blockContact(contactId: string) {
    const { data} = await this.client.post(`/contacts/${contactId}/block`);
    return data;
  }

  // ============================================================================
  // USERS
  // ============================================================================

  async getUserProfile(handle: string) {
    const { data } = await this.client.get(`/users/${handle}`);
    return data;
  }

  async updateProfile(updates: Partial<User>) {
    const { data } = await this.client.patch('/users/me', updates);
    return data;
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await this.client.post('/uploads/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  // ============================================================================
  // PICKS & FEED
  // ============================================================================

  async getFeed(limit?: number, offset?: number) {
    const { data } = await this.client.get('/feed', {
      params: { limit, offset },
    });
    return data;
  }

  async createPick(pickData: any) {
    const { data } = await this.client.post('/picks', pickData);
    return data;
  }

  async likePick(pickId: string) {
    const { data } = await this.client.post(`/picks/${pickId}/like`);
    return data;
  }

  async commentOnPick(pickId: string, content: string) {
    const { data } = await this.client.post(`/picks/${pickId}/comments`, { content });
    return data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

