import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://www.linkfit.app';

class NetworkService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor: Add JWT and Custom Header dynamically
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await this.getAuthToken(); // Get JWT
        const customHeader = await this.getCustomHeader('customHeader'); // Get Custom Header

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (customHeader) {
          config.headers['X-CUSTOM-HEADER'] = customHeader;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor: Handle errors globally
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Unauthorized. Redirect to login or handle token refresh.');
          // Optionally, clear stored tokens or refresh
        }
        return Promise.reject(error);
      }
    );
  }

  // SecureStore management methods
  private async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('authToken');
    } catch (error) {
      console.error('Error fetching auth token:', error);
      return null;
    }
  }

  private async getCustomHeader(headerName: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(headerName);
    } catch (error) {
      console.error(`Error fetching custom header ${headerName}:`, error);
      return null;
    }
  }

  async get(endpoint: string, params: Record<string, unknown> = {}): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  async post(endpoint: string, data: Record<string, unknown>, params: Record<string, unknown> = {}): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.post(endpoint, data, { params });
      return response.data;
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  async put(endpoint: string, data: Record<string, unknown>, params: Record<string, unknown> = {}): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.put(endpoint, data, { params });
      return response.data;
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  async delete(endpoint: string, params: Record<string, unknown> = {}): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.delete(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }

  async patch(endpoint: string, data: Record<string, unknown>, params: Record<string, unknown> = {}): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.patch(endpoint, data, { params });
      return response.data;
    } catch (error) {
      console.error('PATCH request failed:', error);
      throw error;
    }
  }
}

const networkService = new NetworkService();
export const { get, post, put, delete: del, patch } = networkService;
export default networkService;
