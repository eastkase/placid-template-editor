import React from 'react';
import useEditorStore from '../../store/editor';
import TextProperties from './TextProperties';
import ImageProperties from './ImageProperties';
import ShapeProperties from './ShapeProperties';
import { Settings, Move, Maximize2, RotateCw, Eye } from 'lucide-react';

const PropertiesPanel: React.FC = () => {
  const { 
    template, 
    selectedLayerId, 
    updateLayer 
  } = useEditorStore();

  const selectedLayer = template.layers.find(l => l.id === selectedLayerId);

  if (!selectedLayer) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h2 className="font-semibold">Properties</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Select a layer to edit properties</p>
        </div>
      </div>
    );
  }

  const renderLayerProperties = () => {
    switch (selectedLayer.type) {
      case 'text':
        return <TextProperties layer={selectedLayer} />;
      case 'image':
        return <ImageProperties layer={selectedLayer} />;
      case 'shape':
        return <ShapeProperties layer={selectedLayer} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h2 className="font-semibold">Properties</h2>
          </div>
          <span className="text-xs text-gray-500 capitalize">{selectedLayer.type}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Common Properties */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-1">Transform</h3>
            
            {/* Position */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block flex items-center gap-1">
                <Move size={12} />
                Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">X</label>
                  <input
                    type="number"
                    value={selectedLayer.position.x}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      position: { ...selectedLayer.position, x: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Y</label>
                  <input
                    type="number"
                    value={selectedLayer.position.y}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      position: { ...selectedLayer.position, y: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block flex items-center gap-1">
                <Maximize2 size={12} />
                Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Width</label>
                  <input
                    type="number"
                    value={selectedLayer.size.width}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      size: { ...selectedLayer.size, width: parseInt(e.target.value) || 100 }
                    })}
                    min="1"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Height</label>
                  <input
                    type="number"
                    value={selectedLayer.size.height}
                    onChange={(e) => updateLayer(selectedLayer.id, {
                      size: { ...selectedLayer.size, height: parseInt(e.target.value) || 100 }
                    })}
                    min="1"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block flex items-center gap-1">
                <RotateCw size={12} />
                Rotation (degrees)
              </label>
              <input
                type="number"
                value={selectedLayer.rotation || 0}
                onChange={(e) => updateLayer(selectedLayer.id, {
                  rotation: parseInt(e.target.value) || 0
                })}
                min="-360"
                max="360"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Opacity */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block flex items-center gap-1">
                <Eye size={12} />
                Opacity
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  value={selectedLayer.opacity || 1}
                  onChange={(e) => updateLayer(selectedLayer.id, {
                    opacity: parseFloat(e.target.value)
                  })}
                  min="0"
                  max="1"
                  step="0.01"
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12 text-right">
                  {Math.round((selectedLayer.opacity || 1) * 100)}%
                </span>
              </div>
            </div>

            {/* Z-Index */}
            <div>
              <label className="text-xs font-medium text-gray-700">Z-Index</label>
              <input
                type="number"
                value={selectedLayer.zIndex}
                onChange={(e) => updateLayer(selectedLayer.id, {
                  zIndex: parseInt(e.target.value) || 0
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Type-specific Properties */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b pb-1 capitalize">
              {selectedLayer.type} Properties
            </h3>
            {renderLayerProperties()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;