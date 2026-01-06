import { Template } from '../types';
import { localStorageService } from './localStorage';

// Determine if we should use API or localStorage
const USE_API = import.meta.env.VITE_USE_API === 'true' || import.meta.env.PROD;

// Dynamic import to avoid loading API service if not needed
let apiService: any = null;

async function getApiService() {
  if (!apiService && USE_API) {
    const module = await import('./api');
    apiService = module.apiService;
  }
  return apiService;
}

class TemplateService {
  async listTemplates(): Promise<Template[]> {
    if (USE_API) {
      const api = await getApiService();
      try {
        return await api.listTemplates();
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return localStorageService.listTemplates();
      }
    }
    return localStorageService.listTemplates();
  }

  async getTemplate(id: string): Promise<Template> {
    if (USE_API) {
      const api = await getApiService();
      try {
        return await api.getTemplate(id);
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return localStorageService.getTemplate(id);
      }
    }
    return localStorageService.getTemplate(id);
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    if (USE_API) {
      const api = await getApiService();
      try {
        return await api.createTemplate(template);
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return localStorageService.createTemplate(template);
      }
    }
    return localStorageService.createTemplate(template);
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    if (USE_API) {
      const api = await getApiService();
      try {
        return await api.updateTemplate(id, updates);
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return localStorageService.updateTemplate(id, updates);
      }
    }
    return localStorageService.updateTemplate(id, updates);
  }

  async deleteTemplate(id: string): Promise<void> {
    if (USE_API) {
      const api = await getApiService();
      try {
        return await api.deleteTemplate(id);
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return localStorageService.deleteTemplate(id);
      }
    }
    return localStorageService.deleteTemplate(id);
  }

  async duplicateTemplate(id: string, name?: string): Promise<Template> {
    if (USE_API) {
      const api = await getApiService();
      try {
        return await api.duplicateTemplate(id, name);
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        return localStorageService.duplicateTemplate(id, name);
      }
    }
    return localStorageService.duplicateTemplate(id, name);
  }
}

export const templateService = new TemplateService();