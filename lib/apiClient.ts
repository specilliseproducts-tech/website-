import type { Product, ProductInsert } from '@/app/dashboard/products/schema';
import type {
  Solution,
  SolutionInsert,
} from '@/app/dashboard/solutions/schema';
import type {
  PrincipalProduct,
  PrincipalProductInsert,
} from '@/app/dashboard/principal-products/schema';

type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};

export type PaginationParams = {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

class ApiClient {
  async getCollaborators(params?: PaginationParams & { search?: string }) {
    const query = params
      ? '?' +
        new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== '')
            .map(([k, v]) => [k, String(v)]),
        )
      : '';
    return this.request<{ collaborators: any[]; pagination: any }>(
      `/collaborators${query}`,
    );
  }

  async getCollaborator(id: string) {
    return this.request<any>(`/collaborators/${id}`);
  }

  async createCollaborator(data: any) {
    return this.request<any>(`/collaborators`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCollaborator(id: string, data: any) {
    return this.request<any>(`/collaborators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCollaborator(id: string) {
    return this.request<any>(`/collaborators/${id}`, {
      method: 'DELETE',
    });
  }
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
        };
      }

      // Return the API response directly since it already has the correct format
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  private buildQueryString(
    params: Record<string, string | number | boolean | undefined | null>,
  ): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value.toString());
      }
    });
    return query.toString();
  }

  // Account methods (placeholder types for now)
  async getAccounts(params?: PaginationParams & { companyId?: string }) {
    const queryString = this.buildQueryString(params || {});
    return this.request<PaginatedResponse<Record<string, unknown>>>(
      `/accounts${queryString ? `?${queryString}` : ''}`,
    );
  }

  async createAccount(data: {
    name: string;
    parentId?: string;
    isGroup: boolean;
    companyId: string;
  }) {
    return this.request<Record<string, unknown>>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(
    id: string,
    data: {
      name: string;
      parentId?: string;
      isGroup: boolean;
      companyId: string;
    },
  ) {
    return this.request<Record<string, unknown>>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string) {
    return this.request<{ success: boolean }>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Product methods
  async getProducts(params?: PaginationParams) {
    const queryString = this.buildQueryString(params || {});
    return this.request<{
      products: Product[];
      pagination: {
        page: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(data: ProductInsert) {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: ProductInsert) {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Solution methods
  async getSolutions(params?: PaginationParams) {
    const queryString = this.buildQueryString(params || {});
    return this.request<{
      solutions: Solution[];
      pagination: {
        page: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/solutions${queryString ? `?${queryString}` : ''}`);
  }

  async createSolution(data: SolutionInsert) {
    return this.request<Solution>('/solutions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSolution(id: string, data: SolutionInsert) {
    return this.request<Solution>(`/solutions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSolution(id: string) {
    return this.request<{ success: boolean }>(`/solutions/${id}`, {
      method: 'DELETE',
    });
  }

  // Principal Product methods
  async getPrincipalProducts(params?: PaginationParams) {
    const queryString = this.buildQueryString(params || {});
    return this.request<{
      principalProducts: PrincipalProduct[];
      pagination: {
        page: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/principal-products${queryString ? `?${queryString}` : ''}`);
  }

  async createPrincipalProduct(data: PrincipalProductInsert) {
    return this.request<PrincipalProduct>('/principal-products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePrincipalProduct(id: string, data: PrincipalProductInsert) {
    return this.request<PrincipalProduct>(`/principal-products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePrincipalProduct(id: string) {
    return this.request<{ success: boolean }>(`/principal-products/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact Form methods
  async getContactForms(params?: PaginationParams & { search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.perPage)
      searchParams.append('limit', params.perPage.toString());
    if (params?.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    return this.request<{
      contactForms: any[];
      pagination: {
        page: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/contact-forms${query ? `?${query}` : ''}`);
  }

  async getContactForm(id: string) {
    return this.request<{ contactForm: any }>(`/contact-forms/${id}`);
  }

  async createContactForm(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) {
    return this.request<{ id: string; message: string }>('/contact-forms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContactForm(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
    }>,
  ) {
    return this.request<{ contactForm: any; message: string }>(
      `/contact-forms/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );
  }

  async deleteContactForm(id: string) {
    return this.request<{ message: string }>(`/contact-forms/${id}`, {
      method: 'DELETE',
    });
  }

  // Gallery methods
  async getGalleryItems(
    params?: PaginationParams & { search?: string; category?: string },
  ) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.perPage)
      searchParams.append('limit', params.perPage.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);

    const query = searchParams.toString();
    return this.request<{
      galleryItems: any[];
      pagination: {
        page: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/gallery${query ? `?${query}` : ''}`);
  }

  async getGalleryItem(id: string) {
    return this.request<{ galleryItem: any }>(`/gallery/${id}`);
  }

  async createGalleryItem(data: {
    category: string;
    title: string;
    subtitle: string;
    imagePath: string;
  }) {
    return this.request<{ galleryItem: any; message: string }>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGalleryItem(
    id: string,
    data: Partial<{
      category: string;
      title: string;
      subtitle: string;
      imagePath: string;
    }>,
  ) {
    return this.request<{ galleryItem: any; message: string }>(
      `/gallery/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );
  }

  async deleteGalleryItem(id: string) {
    return this.request<{ message: string }>(`/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  // Team methods
  async getTeams(
    params?: PaginationParams & { search?: string; position?: string },
  ) {
    const query = params
      ? new URLSearchParams(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== '',
          ) as [string, string][],
        ).toString()
      : '';

    return this.request<{
      teams: any[];
      pagination: {
        page: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/teams${query ? `?${query}` : ''}`);
  }

  async getTeam(id: string) {
    return this.request<{ team: any }>(`/teams/${id}`);
  }

  async createTeam(data: {
    name: string;
    position: string;
    imagePath: string;
  }) {
    return this.request<{ team: any; message: string }>('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeam(
    id: string,
    data: Partial<{
      name: string;
      position: string;
      imagePath: string;
    }>,
  ) {
    return this.request<{ team: any; message: string }>(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeam(id: string) {
    return this.request<{ message: string }>(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // SystemIntegrator methods
  async getSystemIntegrators(params?: PaginationParams & { search?: string }) {
    const query = params
      ? new URLSearchParams(
          Object.entries(params).filter(
            ([, value]) => value !== undefined && value !== '',
          ) as [string, string][],
        ).toString()
      : '';

    return this.request<{
      systemIntegrators: any[];
      pagination: {
        page: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/system-integrators${query ? `?${query}` : ''}`);
  }

  async getSystemIntegrator(id: string) {
    return this.request<{ systemIntegrator: any }>(`/system-integrators/${id}`);
  }

  async createSystemIntegrator(data: {
    title: string;
    description: string;
    icon: string;
    slug: string;
  }) {
    return this.request<{ systemIntegrator: any; message: string }>(
      '/system-integrators',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );
  }

  async updateSystemIntegrator(
    id: string,
    data: {
      title: string;
      description: string;
      icon: string;
      slug: string;
    },
  ) {
    return this.request<{ systemIntegrator: any; message: string }>(
      `/system-integrators/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );
  }

  async deleteSystemIntegrator(id: string) {
    return this.request<{ message: string }>(`/system-integrators/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse };
