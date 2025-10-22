// web/lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '' // Use relative URLs in production if API_URL not set
    : 'http://localhost:3001/api');

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Récupérer le token JWT depuis localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const config: RequestInit = {
      credentials: 'include', // cookies si nécessaire
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // inclure le token
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    investmentGoals?: string[];
  }) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }

  async login(email: string, password: string) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Stocker le token JWT pour les futures requêtes
    if ((res as any).token) {
      localStorage.setItem('token', (res as any).token);
    }

    return res;
  }

  async logout() {
    localStorage.removeItem('token');
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    investmentGoals?: string[];
  }) {
    return this.request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request('/auth/change-password', { method: 'PUT', body: JSON.stringify(data) });
  }

  // Properties endpoints
  async getProperties(params?: {
    page?: number;
    limit?: number;
    country?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    return this.request(`/properties${searchParams.toString() ? `?${searchParams}` : ''}`);
  }

  async getProperty(id: string) {
    return this.request(`/properties/${id}`);
  }

  async createProperty(data: any) {
    return this.request('/properties', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateProperty(id: string, data: any) {
    return this.request(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteProperty(id: string) {
    return this.request(`/properties/${id}`, { method: 'DELETE' });
  }

  // Favorites endpoints
  async getFavorites() {
    return this.request('/favorites');
  }

  async addFavorite(propertyId: string) {
    return this.request(`/favorites/${propertyId}`, { method: 'POST' });
  }

  async removeFavorite(propertyId: string) {
    return this.request(`/favorites/${propertyId}`, { method: 'DELETE' });
  }

  async checkFavorite(propertyId: string) {
    return this.request(`/favorites/check/${propertyId}`);
  }

  // Inquiries endpoints
  async createInquiry(data: { propertyId: string; name: string; email: string; phone?: string; message?: string }) {
    return this.request('/inquiries', { method: 'POST', body: JSON.stringify(data) });
  }

  async getMyInquiries() {
    return this.request('/inquiries/my');
  }

  async getInquiries(params?: { page?: number; limit?: number; propertyId?: string }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });
    }
    return this.request(`/inquiries${searchParams.toString() ? `?${searchParams}` : ''}`);
  }

  async getInquiry(id: string) {
    return this.request(`/inquiries/${id}`);
  }

  async deleteInquiry(id: string) {
    return this.request(`/inquiries/${id}`, { method: 'DELETE' });
  }

  // Portfolio endpoints
  async getPortfolio() {
    return this.request('/portfolio');
  }

  async addToPortfolio(data: { customName: string; purchasePrice: number; purchaseDate: string; initialMortgage?: number; currentRent?: number; notes?: string; propertyId?: string }) {
    return this.request('/portfolio', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePortfolioItem(id: string, data: any) {
    return this.request(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async removeFromPortfolio(id: string) {
    return this.request(`/portfolio/${id}`, { method: 'DELETE' });
  }

  async getPortfolioStats() {
    return this.request('/portfolio/stats');
  }

  // Users endpoints (admin)
  async getUsers(params?: { page?: number; limit?: number; role?: string; search?: string; isActive?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && searchParams.append(k, v.toString()));
    return this.request(`/users${searchParams.toString() ? `?${searchParams}` : ''}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUserRole(id: string, role: string) {
    return this.request(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
  }

  async banUser(id: string, reason: string) {
    return this.request(`/users/${id}/ban`, { method: 'POST', body: JSON.stringify({ reason }) });
  }

  async unbanUser(id: string) {
    return this.request(`/users/${id}/unban`, { method: 'POST' });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  async inviteAdmin(email: string, role: string) {
    return this.request('/users/invite', { method: 'POST', body: JSON.stringify({ email, role }) });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAuditLogs(params?: { page?: number; limit?: number; action?: string; adminId?: string }) {
    const searchParams = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && searchParams.append(k, v.toString()));
    return this.request(`/admin/audit-logs${searchParams.toString() ? `?${searchParams}` : ''}`);
  }

  async createSuperAdmin(email: string, password: string) {
    return this.request('/admin/create-super-admin', { method: 'POST', body: JSON.stringify({ email, password }) });
  }

  async getSystemHealth() {
    return this.request('/admin/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
