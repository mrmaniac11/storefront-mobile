import NetworkService from './store';

class HttpClient {
  async get(endpoint: string, headers: Record<string, string> = {}) {
    return NetworkService.get(endpoint, headers);
  }

  async post(endpoint: string, body: Record<string, unknown>, headers: Record<string, string> = {}) {
    return NetworkService.post(endpoint, body, headers);
  }

  async put(endpoint: string, body: Record<string, unknown>, headers: Record<string, string> = {}) {
    return NetworkService.put(endpoint, body, headers);
  }

  async delete(endpoint: string, headers: Record<string, string> = {}) {
    return NetworkService.delete(endpoint, headers);
  }

  async patch(endpoint: string, body: Record<string, unknown>, headers: Record<string, string> = {}) {
    return NetworkService.patch(endpoint, body, headers);
  }
}

export default new HttpClient();
