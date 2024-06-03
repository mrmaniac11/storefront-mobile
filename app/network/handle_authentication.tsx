import * as SecureStore from 'expo-secure-store';

class AuthStore {
  async saveAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('authToken', token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }

  async saveCustomHeader(headerName: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(headerName, value);
    } catch (error) {
      console.error(`Error saving custom header ${headerName}:`, error);
    }
  }

  async clearAuthToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  }

  async clearCustomHeader(headerName: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(headerName);
    } catch (error) {
      console.error(`Error clearing custom header ${headerName}:`, error);
    }
  }
}

const secureStore = new AuthStore();
export default secureStore;
  

  
