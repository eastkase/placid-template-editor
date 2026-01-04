import React from 'react';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Trash2,
  Type,
  Image,
  Square,
  Circle,
  Minus,
  Lock,
  Unlock
} from 'lucide-react';
import useEditorStore from '../../store/editor';
import type { Layer } from '../../types';

const LayersPanel: React.FC = () => {
  const { 
    layers, 
    selectedLayerId, 
    selectLayer, 
    updateLayer, 
    deleteLayer,
    reorderLayers 
  } = useEditorStore();

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== dropIndex) {
      reorderLayers(dragIndex, dropIndex);
    }
  };

  const getLayerIcon = (layer: Layer) => {
    switch (layer.type) {
      case 'text':
        return <Type size={16} />;
      case 'image':
        return <Image size={16} />;
      case 'shape':
        if (layer.shape === 'circle') return <Circle size={16} />;
        if (layer.shape === 'line') return <Minus size={16} />;
        return <Square size={16} />;
      default:
        return <Square size={16} />;
    }
  };

  const reversedLayers = [...layers].reverse();

  return (
    <div>
      <div className="section-header">Layers ({layers.length})</div>
      
      <div className="layer-list">
        {reversedLayers.length === 0 ? (
          <div className="empty-state">
            <p className="text-center text-gray-500">No layers yet</p>
            <p className="text-center text-gray-400 text-sm mt-2">
              Add layers using the toolbar
            </p>
          </div>
        ) : (
          reversedLayers.map((layer, index) => {
            const originalIndex = layers.length - 1 - index;
            return (
              <div
                key={layer.id}
                className={`layer-item ${selectedLayerId === layer.id ? 'selected' : ''}`}
                onClick={() => selectLayer(layer.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, originalIndex)}
              >
                <div
                  className="layer-drag-handle"
                  draggable
                  onDragStart={(e) => handleDragStart(e, originalIndex)}
                >
                  <GripVertical size={16} />
                </div>
                
                <div className="layer-icon">
                  {getLayerIcon(layer)}
                </div>
                
                <div className="layer-name">
                  {layer.name}
                </div>
                
                <div className="layer-actions">
                  <button
                    className="layer-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLayer(layer.id, { locked: !layer.locked });
                    }}
                    title={layer.locked ? 'Unlock' : 'Lock'}
                  >
                    {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                  
                  <button
                    className="layer-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLayer(layer.id, { visible: !layer.visible });
                    }}
                    title={layer.visible ? 'Hide' : 'Show'}
                  >
                    {layer.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  
                  <button
                    className="layer-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete layer "${layer.name}"?`)) {
                        deleteLayer(layer.id);
                      }
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {layers.length > 0 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-purple-700">
            Drag layers to reorder • Click to select • Top layer appears in front
          </p>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;