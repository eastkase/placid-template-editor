import { Template } from '../types';
import { localStorageService } from './localStorage';

const API_URL = import.meta.env.VITE_API_URL || 'https://placid-replace-media-generator-production.up.railway.app';
const API_KEY = import.meta.env.VITE_API_KEY || '';
const USE_LOCAL_STORAGE = true; // Set to true to use localStorage instead of API

class TemplateAPI {
  private headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` })
  };

  async listTemplates(): Promise<Template[]> {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.listTemplates();
    }

    const response = await fetch(`${API_URL}/api/templates`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }

    const data = await response.json();
    return data.templates;
  }

  async getTemplate(id: string): Promise<Template> {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.getTemplate(id);
    }

    const response = await fetch(`${API_URL}/api/templates/${id}`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch template');
    }

    const data = await response.json();
    return data.template;
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.createTemplate(template);
    }

    const response = await fetch(`${API_URL}/api/templates`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(template)
    });

    if (!response.ok) {
      throw new Error('Failed to create template');
    }

    const data = await response.json();
    return data.template;
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.updateTemplate(id, updates);
    }

    const response = await fetch(`${API_URL}/api/templates/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update template');
    }

    const data = await response.json();
    return data.template;
  }

  async deleteTemplate(id: string): Promise<void> {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.deleteTemplate(id);
    }

    const response = await fetch(`${API_URL}/api/templates/${id}`, {
      method: 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error('Failed to delete template');
    }
  }

  async duplicateTemplate(id: string, name?: string): Promise<Template> {
    if (USE_LOCAL_STORAGE) {
      return localStorageService.duplicateTemplate(id, name);
    }

    const response = await fetch(`${API_URL}/api/templates/${id}/duplicate`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error('Failed to duplicate template');
    }

    const data = await response.json();
    return data.template;
  }

  async previewTemplate(id: string, fields?: Record<string, any>): Promise<string> {
    const response = await fetch(`${API_URL}/api/templates/${id}/preview`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ fields })
    });

    if (!response.ok) {
      throw new Error('Failed to preview template');
    }

    const data = await response.json();
    return data.url;
  }

  async renderTemplate(template: Template, data: Record<string, any> = {}): Promise<Blob> {
    const response = await fetch(`${API_URL}/render`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ template, data })
    });

    if (!response.ok) {
      throw new Error('Failed to render template');
    }

    return response.blob();
  }
}

export const templateAPI = new TemplateAPI();
export { API_URL };