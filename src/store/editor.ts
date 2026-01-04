import { create } from 'zustand';
import { Template, Layer, TextLayer, ImageLayer, ShapeLayer } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface EditorState {
  // Template data
  template: Template;
  savedTemplateId: string | null;
  hasUnsavedChanges: boolean;
  
  // UI state
  selectedLayerId: string | null;
  zoom: number;
  panOffset: { x: number; y: number };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  
  // History for undo/redo
  history: Template[];
  historyIndex: number;
  
  // Computed properties
  layers: Layer[];
  
  // Actions
  setTemplate: (template: Template) => void;
  loadTemplate: (template: Template) => void;
  setSavedTemplateId: (id: string | null) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  updateTemplate: (updates: Partial<Template>) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  addLayer: (layer: Layer) => void;
  deleteLayer: (layerId: string) => void;
  duplicateLayer: (layerId: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  selectLayer: (layerId: string | null) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  
  // Canvas actions
  setZoom: (zoom: number) => void;
  setPan: (offset: { x: number; y: number }) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Export/Import
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

function createDefaultTemplate(): Template {
  return {
    name: 'Untitled Template',
    width: 1080,
    height: 1080,
    backgroundColor: '#ffffff',
    layers: [],
    outputFormat: 'png'
  };
}

function createDefaultTextLayer(): TextLayer {
  return {
    id: uuidv4(),
    name: 'Text Layer',
    type: 'text',
    position: { x: 100, y: 100 },
    size: { width: 400, height: 100 },
    zIndex: 0,
    visible: true,
    opacity: 1,
    text: 'Add your text here',
    fontSize: 32,
    fontFamily: 'Arial',
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'center',
    font: {
      family: 'Arial',
      size: 32,
      weight: 400,
      style: 'normal'
    },
    color: '#000000',
    alignment: 'center',
    verticalAlignment: 'middle',
    lineHeight: 1.2,
    textBox: {
      enabled: true,
      maxWidth: 400,
      maxHeight: 100,
      overflow: 'shrink',
      autoShrink: false,
      minFontSize: 12,
      maxFontSize: 32,
      padding: { top: 10, right: 10, bottom: 10, left: 10 }
    }
  };
}

function createDefaultImageLayer(): ImageLayer {
  return {
    id: uuidv4(),
    name: 'Image Layer',
    type: 'image',
    position: { x: 100, y: 100 },
    size: { width: 400, height: 300 },
    zIndex: 0,
    visible: true,
    opacity: 1,
    fit: 'cover'
  };
}

function createDefaultShapeLayer(): ShapeLayer {
  return {
    id: uuidv4(),
    name: 'Shape Layer',
    type: 'shape',
    position: { x: 100, y: 100 },
    size: { width: 200, height: 200 },
    zIndex: 0,
    visible: true,
    opacity: 1,
    shape: 'rectangle',
    fill: '#7c3aed'
  };
}

const useEditorStore = create<EditorState>((set, get) => ({
  template: createDefaultTemplate(),
  savedTemplateId: null,
  hasUnsavedChanges: false,
  selectedLayerId: null,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  showGrid: false,
  snapToGrid: true,
  gridSize: 10,
  history: [],
  historyIndex: -1,
  
  // Computed properties
  get layers() {
    return get().template.layers;
  },
  
  setTemplate: (template) => {
    set({ template, selectedLayerId: null, hasUnsavedChanges: true });
  },

  loadTemplate: (template) => {
    set({ 
      template, 
      selectedLayerId: null, 
      hasUnsavedChanges: false,
      history: [],
      historyIndex: -1
    });
  },

  setSavedTemplateId: (id) => {
    set({ savedTemplateId: id });
  },

  setHasUnsavedChanges: (hasChanges) => {
    set({ hasUnsavedChanges: hasChanges });
  },

  updateTemplate: (updates) => {
    set(state => ({
      template: { ...state.template, ...updates },
      hasUnsavedChanges: true
    }));
  },
  
  updateLayer: (layerId, updates) => {
    set(state => {
      const newLayers = state.template.layers.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } as Layer : layer
      );
      const newTemplate = { ...state.template, layers: newLayers };
      
      // Add to history
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        newTemplate
      ];
      
      return {
        template: newTemplate,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        hasUnsavedChanges: true
      };
    });
  },
  
  addLayer: (layer) => {
    set(state => {
      // Find highest zIndex
      const maxZIndex = Math.max(0, ...state.template.layers.map(l => l.zIndex));
      const newLayer = { ...layer, zIndex: maxZIndex + 1 };
      
      return {
        template: {
          ...state.template,
          layers: [...state.template.layers, newLayer]
        },
        selectedLayerId: newLayer.id
      };
    });
  },
  
  deleteLayer: (layerId) => {
    set(state => ({
      template: {
        ...state.template,
        layers: state.template.layers.filter(layer => layer.id !== layerId)
      },
      selectedLayerId: state.selectedLayerId === layerId ? null : state.selectedLayerId
    }));
  },
  
  duplicateLayer: (layerId) => {
    set(state => {
      const layer = state.template.layers.find(l => l.id === layerId);
      if (!layer) return state;
      
      const newLayer = {
        ...layer,
        id: uuidv4(),
        name: `${layer.name} Copy`,
        position: {
          x: layer.position.x + 20,
          y: layer.position.y + 20
        }
      };
      
      return {
        template: {
          ...state.template,
          layers: [...state.template.layers, newLayer]
        },
        selectedLayerId: newLayer.id
      };
    });
  },
  
  reorderLayers: (fromIndex, toIndex) => {
    set(state => {
      const newLayers = [...state.template.layers];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      
      // Update z-indexes
      const reindexedLayers = newLayers.map((layer, index) => ({
        ...layer,
        zIndex: index
      }));
      
      return {
        template: {
          ...state.template,
          layers: reindexedLayers
        }
      };
    });
  },
  
  selectLayer: (layerId) => {
    set({ selectedLayerId: layerId });
  },
  
  toggleLayerVisibility: (layerId) => {
    set(state => {
      const newLayers = state.template.layers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      );
      return {
        template: { ...state.template, layers: newLayers }
      };
    });
  },
  
  toggleLayerLock: (layerId) => {
    set(state => {
      const newLayers = state.template.layers.map(layer =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      );
      return {
        template: { ...state.template, layers: newLayers }
      };
    });
  },
  
  setZoom: (zoom) => {
    set({ zoom: Math.max(0.1, Math.min(3, zoom)) });
  },
  
  setPan: (offset) => {
    set({ panOffset: offset });
  },
  
  toggleGrid: () => {
    set(state => ({ showGrid: !state.showGrid }));
  },
  
  toggleSnap: () => {
    set(state => ({ snapToGrid: !state.snapToGrid }));
  },
  
  undo: () => {
    set(state => {
      if (state.historyIndex > 0) {
        return {
          template: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1
        };
      }
      return state;
    });
  },
  
  redo: () => {
    set(state => {
      if (state.historyIndex < state.history.length - 1) {
        return {
          template: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1
        };
      }
      return state;
    });
  },
  
  canUndo: () => {
    return get().historyIndex > 0;
  },
  
  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },
  
  exportJSON: () => {
    const { template } = get();
    // Remove editor-only properties
    const exportTemplate = {
      ...template,
      layers: template.layers.map(layer => {
        const { locked, ...rest } = layer as any;
        return rest;
      })
    };
    return JSON.stringify(exportTemplate, null, 2);
  },
  
  importJSON: (json) => {
    try {
      const template = JSON.parse(json);
      set({ template, selectedLayerId: null, history: [], historyIndex: -1 });
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  }
}));

export default useEditorStore;
export { createDefaultTextLayer, createDefaultImageLayer, createDefaultShapeLayer };