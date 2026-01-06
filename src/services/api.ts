import { Template } from '../types';

const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3001/api';

class ApiService {
  async listTemplates(): Promise<Template[]> {
    const response = await fetch(`${API_URL}/templates`);
    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await fetch(`${API_URL}/templates/${id}`);
    if (!response.ok) throw new Error('Template not found');
    return response.json();
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const response = await fetch(`${API_URL}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    });
    if (!response.ok) throw new Error('Failed to create template');
    return response.json();
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update template');
    return response.json();
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete template');
  }

  async duplicateTemplate(id: string, name?: string): Promise<Template> {
    const response = await fetch(`${API_URL}/templates/${id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to duplicate template');
    return response.json();
  }
}

export const apiService = new ApiService();