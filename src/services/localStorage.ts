import { Template } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'template_editor_templates';

class LocalStorageService {
  private getTemplates(): Template[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load templates from localStorage:', error);
      return [];
    }
  }

  private saveTemplates(templates: Template[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save templates to localStorage:', error);
    }
  }

  async listTemplates(): Promise<Template[]> {
    return this.getTemplates();
  }

  async getTemplate(id: string): Promise<Template> {
    const templates = this.getTemplates();
    const template = templates.find(t => t.id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const newTemplate: Template = {
      ...template,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const templates = this.getTemplates();
    templates.push(newTemplate);
    this.saveTemplates(templates);
    
    return newTemplate;
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    const templates = this.getTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveTemplates(templates);
    return templates[index];
  }

  async deleteTemplate(id: string): Promise<void> {
    const templates = this.getTemplates();
    const filtered = templates.filter(t => t.id !== id);
    
    if (filtered.length === templates.length) {
      throw new Error('Template not found');
    }
    
    this.saveTemplates(filtered);
  }

  async duplicateTemplate(id: string, name?: string): Promise<Template> {
    const template = await this.getTemplate(id);
    const newTemplate: Template = {
      ...template,
      id: uuidv4(),
      name: name || `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const templates = this.getTemplates();
    templates.push(newTemplate);
    this.saveTemplates(templates);
    
    return newTemplate;
  }
}

export const localStorageService = new LocalStorageService();