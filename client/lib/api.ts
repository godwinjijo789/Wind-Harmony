import {
  AuthRequest,
  AuthResponse,
  User,
  Project,
  ProjectRequest,
  MusicLayer,
  CompositionSettings,
  Feedback,
  FeedbackRequest,
  Payment,
  PaymentRequest,
  AdminStats,
  BankDetails,
  PaymentMethods,
  TermsContent,
  ApiResponse,
  PaginatedResponse,
} from "@shared/api";

// API configuration
const API_BASE_URL = process.env.VITE_API_URL || "/api";

// Token management
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem("authToken");
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response.data || response;
  },

  async signup(userData: AuthRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response.data || response;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiRequest<User>("/auth/me");
    return response.data!;
  },

  async generateOTP(email: string): Promise<{ otp: string }> {
    const response = await apiRequest<{ otp: string }>("/auth/otp/generate", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return response.data!;
  },

  async verifyOTP(email: string, otp: string): Promise<void> {
    await apiRequest("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  logout(): void {
    removeAuthToken();
  },
};

// Projects API
export const projectsAPI = {
  async getProjects(page = 1, limit = 10): Promise<PaginatedResponse<Project>> {
    const response = await apiRequest<PaginatedResponse<Project>>(
      `/projects?page=${page}&limit=${limit}`,
    );
    return response.data!;
  },

  async getProject(id: string): Promise<Project> {
    const response = await apiRequest<Project>(`/projects/${id}`);
    return response.data!;
  },

  async createProject(projectData: ProjectRequest): Promise<Project> {
    const response = await apiRequest<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
    return response.data!;
  },

  async updateProject(
    id: string,
    updates: Partial<ProjectRequest>,
  ): Promise<Project> {
    const response = await apiRequest<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return response.data!;
  },

  async deleteProject(id: string): Promise<void> {
    await apiRequest(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  async getProjectLayers(id: string): Promise<MusicLayer[]> {
    const response = await apiRequest<MusicLayer[]>(`/projects/${id}/layers`);
    return response.data!;
  },

  async saveProjectLayer(
    projectId: string,
    layerData: Partial<MusicLayer>,
  ): Promise<MusicLayer> {
    const response = await apiRequest<MusicLayer>(
      `/projects/${projectId}/layers`,
      {
        method: "POST",
        body: JSON.stringify(layerData),
      },
    );
    return response.data!;
  },
};

// Music API
export const musicAPI = {
  async getCompositionSettings(): Promise<CompositionSettings> {
    const response = await apiRequest<CompositionSettings>("/music/settings");
    return response.data!;
  },

  async updateCompositionSettings(
    settings: CompositionSettings,
  ): Promise<CompositionSettings> {
    const response = await apiRequest<CompositionSettings>("/music/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
    return response.data!;
  },

  async saveRecording(recordingData: {
    title: string;
    audioData: string;
    duration?: string;
    instrument?: string;
  }): Promise<any> {
    const response = await apiRequest("/music/recordings", {
      method: "POST",
      body: JSON.stringify(recordingData),
    });
    return response.data!;
  },

  async getRecordings(): Promise<any[]> {
    const response = await apiRequest<any[]>("/music/recordings");
    return response.data!;
  },

  async deleteRecording(id: string): Promise<void> {
    await apiRequest(`/music/recordings/${id}`, {
      method: "DELETE",
    });
  },

  async getInstruments(): Promise<any> {
    const response = await apiRequest("/music/instruments");
    return response.data!;
  },

  async exportComposition(projectId: string, format = "json"): Promise<any> {
    const response = await apiRequest("/music/export", {
      method: "POST",
      body: JSON.stringify({ projectId, format }),
    });
    return response.data!;
  },
};

// Feedback API
export const feedbackAPI = {
  async submitFeedback(feedbackData: FeedbackRequest): Promise<Feedback> {
    const response = await apiRequest<Feedback>("/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    });
    return response.data!;
  },

  async getAllFeedback(
    page = 1,
    limit = 10,
    filters?: {
      status?: string;
      category?: string;
    },
  ): Promise<PaginatedResponse<Feedback>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await apiRequest<PaginatedResponse<Feedback>>(
      `/feedback?${params}`,
    );
    return response.data!;
  },

  async getFeedback(id: string): Promise<Feedback> {
    const response = await apiRequest<Feedback>(`/feedback/${id}`);
    return response.data!;
  },

  async updateFeedbackStatus(id: string, status: string): Promise<Feedback> {
    const response = await apiRequest<Feedback>(`/feedback/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return response.data!;
  },

  async getFeedbackStats(): Promise<any> {
    const response = await apiRequest("/feedback/stats");
    return response.data!;
  },

  async deleteFeedback(id: string): Promise<void> {
    await apiRequest(`/feedback/${id}`, {
      method: "DELETE",
    });
  },
};

// Payments API
export const paymentsAPI = {
  async processPayment(paymentData: PaymentRequest): Promise<Payment> {
    const response = await apiRequest<Payment>("/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
    return response.data!;
  },

  async getPaymentStatus(transactionId: string): Promise<Payment> {
    const response = await apiRequest<Payment>(
      `/payments/status/${transactionId}`,
    );
    return response.data!;
  },

  async getUserPayments(
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Payment>> {
    const response = await apiRequest<PaginatedResponse<Payment>>(
      `/payments/user?page=${page}&limit=${limit}`,
    );
    return response.data!;
  },
};

// Admin API
export const adminAPI = {
  async getStats(): Promise<AdminStats> {
    const response = await apiRequest<AdminStats>("/admin/stats");
    return response.data!;
  },

  async getBankDetails(): Promise<BankDetails> {
    const response = await apiRequest<BankDetails>("/admin/bank-details");
    return response.data!;
  },

  async updateBankDetails(
    bankDetails: Partial<BankDetails>,
  ): Promise<BankDetails> {
    const response = await apiRequest<BankDetails>("/admin/bank-details", {
      method: "PUT",
      body: JSON.stringify(bankDetails),
    });
    return response.data!;
  },

  async getPaymentMethods(): Promise<PaymentMethods> {
    const response = await apiRequest<PaymentMethods>("/admin/payment-methods");
    return response.data!;
  },

  async updatePaymentMethods(
    methods: Partial<PaymentMethods>,
  ): Promise<PaymentMethods> {
    const response = await apiRequest<PaymentMethods>(
      "/admin/payment-methods",
      {
        method: "PUT",
        body: JSON.stringify(methods),
      },
    );
    return response.data!;
  },

  async getTermsContent(): Promise<TermsContent> {
    const response = await apiRequest<TermsContent>("/admin/terms");
    return response.data!;
  },

  async updateTermsContent(content: TermsContent): Promise<TermsContent> {
    const response = await apiRequest<TermsContent>("/admin/terms", {
      method: "PUT",
      body: JSON.stringify(content),
    });
    return response.data!;
  },

  async getAllUsers(): Promise<any[]> {
    const response = await apiRequest<any[]>("/admin/users");
    return response.data!;
  },

  async getStorageAnalytics(): Promise<any> {
    const response = await apiRequest("/admin/storage");
    return response.data!;
  },

  async updateUserStorage(userId: string, maxStorage: number): Promise<void> {
    await apiRequest(`/admin/users/${userId}/storage`, {
      method: "PUT",
      body: JSON.stringify({ maxStorage }),
    });
  },

  async getAllPayments(
    page = 1,
    limit = 10,
    filters?: {
      status?: string;
      plan?: string;
    },
  ): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await apiRequest<PaginatedResponse<Payment>>(
      `/payments/admin/all?${params}`,
    );
    return response.data!;
  },

  async updatePaymentStatus(
    id: string,
    status: string,
    refundAmount?: number,
  ): Promise<Payment> {
    const response = await apiRequest<Payment>(`/payments/admin/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, refundAmount }),
    });
    return response.data!;
  },

  async getPaymentStats(): Promise<any> {
    const response = await apiRequest("/payments/admin/stats");
    return response.data!;
  },

  async refundPayment(id: string, refundAmount?: number): Promise<Payment> {
    const response = await apiRequest<Payment>(`/payments/admin/${id}/refund`, {
      method: "POST",
      body: JSON.stringify({ refundAmount }),
    });
    return response.data!;
  },

  async exportData(type: "users" | "payments" | "feedback"): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/admin/export/${type}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    return response.blob();
  },
};

// Utility functions
export const api = {
  setBaseUrl: (url: string) => {
    // Update API_BASE_URL if needed
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  getToken: getAuthToken,
  setToken: setAuthToken,
  removeToken: removeAuthToken,
};

export default {
  auth: authAPI,
  projects: projectsAPI,
  music: musicAPI,
  feedback: feedbackAPI,
  payments: paymentsAPI,
  admin: adminAPI,
  ...api,
};
