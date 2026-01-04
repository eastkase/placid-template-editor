import React from 'react';
import { ShapeLayer } from '../../types';
import useEditorStore from '../../store/editor';
import { Square, Circle, Minus, Hexagon } from 'lucide-react';

interface Props {
  layer: ShapeLayer;
}

const ShapeProperties: React.FC<Props> = ({ layer }) => {
  const { updateLayer } = useEditorStore();

  const handleUpdate = (updates: Partial<ShapeLayer>) => {
    updateLayer(layer.id, updates);
  };

  const shapeOptions = [
    { label: 'Rectangle', value: 'rectangle', icon: Square },
    { label: 'Circle', value: 'circle', icon: Circle },
    { label: 'Line', value: 'line', icon: Minus },
    { label: 'Polygon', value: 'polygon', icon: Hexagon }
  ];

  const addGradientStop = () => {
    const colors = layer.gradient?.colors || [
      { color: '#000000', offset: 0 },
      { color: '#ffffff', offset: 1 }
    ];
    const newStop = {
      color: '#808080',
      offset: 0.5
    };
    handleUpdate({
      gradient: {
        ...layer.gradient,
        type: layer.gradient?.type || 'linear',
        colors: [...colors, newStop].sort((a, b) => a.offset - b.offset)
      }
    });
  };

  const updateGradientStop = (index: number, updates: { color?: string, offset?: number }) => {
    if (!layer.gradient) return;
    
    const colors = [...layer.gradient.colors];
    colors[index] = { ...colors[index], ...updates };
    
    handleUpdate({
      gradient: {
        ...layer.gradient,
        colors
      }
    });
  };

  const removeGradientStop = (index: number) => {
    if (!layer.gradient || layer.gradient.colors.length <= 2) return;
    
    const colors = layer.gradient.colors.filter((_, i) => i !== index);
    
    handleUpdate({
      gradient: {
        ...layer.gradient,
        colors
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Shape Type</label>
        <div className="grid grid-cols-2 gap-1">
          {shapeOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleUpdate({ shape: option.value as any })}
                className={`p-2 rounded flex items-center justify-center gap-2 ${
                  layer.shape === option.value 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'hover:bg-gray-100'
                }`}
                title={option.label}
              >
                <Icon size={16} />
                <span className="text-xs">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {layer.shape === 'rectangle' && (
        <div>
          <label className="text-xs font-medium text-gray-700">Border Radius (px)</label>
          <input
            type="number"
            value={layer.borderRadius || 0}
            onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) || 0 })}
            min="0"
            max="100"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Fill Type</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!layer.gradient}
              onChange={() => handleUpdate({ gradient: undefined })}
              name="fillType"
            />
            <span className="text-sm">Solid Color</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!!layer.gradient}
              onChange={() => handleUpdate({ 
                gradient: {
                  type: 'linear',
                  colors: [
                    { color: layer.fill || '#000000', offset: 0 },
                    { color: '#ffffff', offset: 1 }
                  ],
                  angle: 0
                }
              })}
              name="fillType"
            />
            <span className="text-sm">Gradient</span>
          </label>
        </div>
      </div>

      {!layer.gradient ? (
        <div>
          <label className="text-xs font-medium text-gray-700">Fill Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={layer.fill || '#000000'}
              onChange={(e) => handleUpdate({ fill: e.target.value })}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={layer.fill || '#000000'}
              onChange={(e) => handleUpdate({ fill: e.target.value })}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-gray-700">Gradient Type</label>
            <select
              value={layer.gradient.type}
              onChange={(e) => handleUpdate({ 
                gradient: { 
                  type: e.target.value as 'linear' | 'radial',
                  colors: layer.gradient?.colors || [
                    { color: '#000000', offset: 0 },
                    { color: '#ffffff', offset: 1 }
                  ],
                  angle: layer.gradient?.angle
                }
              })}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>

          {layer.gradient.type === 'linear' && (
            <div>
              <label className="text-xs font-medium text-gray-700">Angle (degrees)</label>
              <input
                type="number"
                value={layer.gradient.angle || 0}
                onChange={(e) => handleUpdate({ 
                  gradient: { 
                    type: layer.gradient?.type || 'linear',
                    colors: layer.gradient?.colors || [],
                    angle: parseInt(e.target.value) || 0 
                  }
                })}
                min="0"
                max="360"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-700">Gradient Stops</label>
            <div className="space-y-1">
              {layer.gradient?.colors.map((stop, index) => (
                <div key={index} className="flex gap-1 items-center">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateGradientStop(index, { color: e.target.value })}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => updateGradientStop(index, { color: e.target.value })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    value={Math.round(stop.offset * 100)}
                    onChange={(e) => updateGradientStop(index, { 
                      offset: Math.min(1, Math.max(0, parseInt(e.target.value) / 100))
                    })}
                    min="0"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-xs">%</span>
                  {layer.gradient && layer.gradient.colors.length > 2 && (
                    <button
                      onClick={() => removeGradientStop(index)}
                      className="p-1 hover:bg-gray-100 rounded text-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addGradientStop}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                + Add stop
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Stroke</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600">Width (px)</label>
            <input
              type="number"
              value={layer.stroke?.width || 0}
              onChange={(e) => {
                const width = parseInt(e.target.value) || 0;
                handleUpdate({ 
                  stroke: width > 0 ? { 
                    ...layer.stroke, 
                    width,
                    color: layer.stroke?.color || '#000000'
                  } : undefined
                });
              }}
              min="0"
              max="20"
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Color</label>
            <div className="flex gap-1">
              <input
                type="color"
                value={layer.stroke?.color || '#000000'}
                onChange={(e) => handleUpdate({ 
                  stroke: { 
                    ...layer.stroke, 
                    width: layer.stroke?.width || 1,
                    color: e.target.value 
                  }
                })}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={layer.stroke?.color || '#000000'}
                onChange={(e) => handleUpdate({ 
                  stroke: { 
                    ...layer.stroke, 
                    width: layer.stroke?.width || 1,
                    color: e.target.value 
                  }
                })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeProperties;