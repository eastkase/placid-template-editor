import React from 'react';
import { 
  Move,
  Type, 
  Image, 
  Square,
  Circle,
  Minus,
  MousePointer,
  Hand,
  Layers,
  Grid,
  Settings
} from 'lucide-react';
import useEditorStore, { 
  createDefaultTextLayer, 
  createDefaultImageLayer, 
  createDefaultShapeLayer 
} from '../../store/editor';

const LeftSidebar: React.FC = () => {
  const { 
    addLayer,
    showGrid,
    toggleGrid 
  } = useEditorStore();
  
  const [selectedTool, setSelectedTool] = React.useState<string>('select');

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Pan' },
  ];

  const addTools = [
    { 
      id: 'text', 
      icon: Type, 
      label: 'Add Text',
      action: () => {
        const layer = createDefaultTextLayer();
        addLayer(layer);
      }
    },
    { 
      id: 'image', 
      icon: Image, 
      label: 'Add Image',
      action: () => {
        const layer = createDefaultImageLayer();
        addLayer(layer);
      }
    },
    { 
      id: 'rectangle', 
      icon: Square, 
      label: 'Add Rectangle',
      action: () => {
        const shape = createDefaultShapeLayer();
        shape.shape = 'rectangle';
        addLayer(shape);
      }
    },
    { 
      id: 'circle', 
      icon: Circle, 
      label: 'Add Circle',
      action: () => {
        const shape = createDefaultShapeLayer();
        shape.shape = 'circle';
        addLayer(shape);
      }
    },
    { 
      id: 'line', 
      icon: Minus, 
      label: 'Add Line',
      action: () => {
        const shape = createDefaultShapeLayer();
        shape.shape = 'line';
        addLayer(shape);
      }
    },
  ];

  const bottomTools = [
    { 
      id: 'layers', 
      icon: Layers, 
      label: 'Layers',
      action: () => {}
    },
    { 
      id: 'grid', 
      icon: Grid, 
      label: 'Grid',
      active: showGrid,
      action: toggleGrid
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings',
      action: () => {}
    },
  ];

  return (
    <aside className="left-sidebar">
      {/* Selection Tools */}
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
          onClick={() => setSelectedTool(tool.id)}
          title={tool.label}
        >
          <tool.icon size={20} />
        </button>
      ))}
      
      <div className="tool-divider" />
      
      {/* Add Element Tools */}
      {addTools.map(tool => (
        <button
          key={tool.id}
          className="tool-button"
          onClick={tool.action}
          title={tool.label}
        >
          <tool.icon size={20} />
        </button>
      ))}
      
      {/* Spacer */}
      <div style={{ flex: 1 }} />
      
      {/* Bottom Tools */}
      {bottomTools.map(tool => (
        <button
          key={tool.id}
          className={`tool-button ${tool.active ? 'active' : ''}`}
          onClick={tool.action}
          title={tool.label}
        >
          <tool.icon size={20} />
        </button>
      ))}
    </aside>
  );
};

export default LeftSidebar;