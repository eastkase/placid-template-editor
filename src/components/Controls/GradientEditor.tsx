import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface GradientStop {
  offset: number;
  color: string;
  opacity?: number;
}

interface GradientConfig {
  type: 'linear' | 'radial';
  colors: GradientStop[];
  angle?: number;
  centerX?: number;
  centerY?: number;
}

interface Props {
  gradient?: GradientConfig;
  onChange: (gradient: GradientConfig | undefined) => void;
  label?: string;
}

const GradientEditor: React.FC<Props> = ({ gradient, onChange, label = "Gradient" }) => {
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(!!gradient);

  const defaultGradient: GradientConfig = {
    type: 'linear',
    colors: [
      { offset: 0, color: '#ffffff', opacity: 1 },
      { offset: 1, color: '#000000', opacity: 1 }
    ],
    angle: 90
  };

  const currentGradient = gradient || defaultGradient;

  const handleEnable = (checked: boolean) => {
    setEnabled(checked);
    if (checked) {
      onChange(defaultGradient);
      setExpanded(true);
    } else {
      onChange(undefined);
      setExpanded(false);
    }
  };

  const updateGradient = (updates: Partial<GradientConfig>) => {
    onChange({ ...currentGradient, ...updates });
  };

  const addColorStop = () => {
    const newColors = [...currentGradient.colors];
    const lastOffset = newColors[newColors.length - 1]?.offset || 0;
    newColors.push({
      offset: Math.min(lastOffset + 0.5, 1),
      color: '#808080',
      opacity: 1
    });
    // Sort by offset
    newColors.sort((a, b) => a.offset - b.offset);
    updateGradient({ colors: newColors });
  };

  const removeColorStop = (index: number) => {
    if (currentGradient.colors.length <= 2) return; // Keep at least 2 stops
    const newColors = currentGradient.colors.filter((_, i) => i !== index);
    updateGradient({ colors: newColors });
  };

  const updateColorStop = (index: number, updates: Partial<GradientStop>) => {
    const newColors = [...currentGradient.colors];
    newColors[index] = { ...newColors[index], ...updates };
    updateGradient({ colors: newColors });
  };

  const hexToRgba = (hex: string, opacity: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getGradientCSS = (): string => {
    if (!enabled || !gradient) return '';
    
    const colorStops = gradient.colors
      .map(c => `${hexToRgba(c.color, c.opacity || 1)} ${c.offset * 100}%`)
      .join(', ');
    
    if (gradient.type === 'linear') {
      return `linear-gradient(${gradient.angle || 90}deg, ${colorStops})`;
    } else {
      const cx = (gradient.centerX || 0.5) * 100;
      const cy = (gradient.centerY || 0.5) * 100;
      return `radial-gradient(circle at ${cx}% ${cy}%, ${colorStops})`;
    }
  };

  return (
    <div className="form-group">
      <div className="flex items-center justify-between mb-2">
        <label className="toggle-switch">
          <input
            type="checkbox"
            className="toggle-switch-input"
            checked={enabled}
            onChange={(e) => handleEnable(e.target.checked)}
          />
          <span className="toggle-switch-slider"></span>
          <span className="toggle-switch-label">{label}</span>
        </label>
        {enabled && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-ghost p-1"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {enabled && expanded && (
        <div className="gradient-editor">
          {/* Gradient Preview */}
          <div 
            className="gradient-preview"
            style={{
              background: getGradientCSS(),
              height: '40px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              marginBottom: '12px'
            }}
          />

          {/* Gradient Type */}
          <div className="form-group">
            <label className="form-label text-xs">Type</label>
            <select
              className="form-select"
              value={currentGradient.type}
              onChange={(e) => updateGradient({ 
                type: e.target.value as 'linear' | 'radial',
                angle: e.target.value === 'linear' ? 90 : undefined,
                centerX: e.target.value === 'radial' ? 0.5 : undefined,
                centerY: e.target.value === 'radial' ? 0.5 : undefined
              })}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>

          {/* Angle for Linear Gradient */}
          {currentGradient.type === 'linear' && (
            <div className="form-group">
              <label className="form-label text-xs">Angle</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={currentGradient.angle || 90}
                  onChange={(e) => updateGradient({ angle: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={currentGradient.angle || 90}
                  onChange={(e) => updateGradient({ angle: parseInt(e.target.value) || 0 })}
                  className="form-input w-16"
                />
                <span className="text-xs text-gray-500">°</span>
              </div>
            </div>
          )}

          {/* Center for Radial Gradient */}
          {currentGradient.type === 'radial' && (
            <>
              <div className="form-group">
                <label className="form-label text-xs">Center X</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentGradient.centerX || 0.5) * 100}
                    onChange={(e) => updateGradient({ centerX: parseInt(e.target.value) / 100 })}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-10">
                    {Math.round((currentGradient.centerX || 0.5) * 100)}%
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label text-xs">Center Y</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentGradient.centerY || 0.5) * 100}
                    onChange={(e) => updateGradient({ centerY: parseInt(e.target.value) / 100 })}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-10">
                    {Math.round((currentGradient.centerY || 0.5) * 100)}%
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Color Stops */}
          <div className="form-group">
            <div className="flex items-center justify-between mb-2">
              <label className="form-label text-xs">Color Stops</label>
              <button
                onClick={addColorStop}
                className="btn btn-ghost p-1"
                title="Add color stop"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              {currentGradient.colors.map((stop, index) => (
                <div key={index} className="color-stop-item">
                  <div className="flex items-center gap-2">
                    {/* Color Picker */}
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="color-picker-swatch"
                        style={{ 
                          backgroundColor: hexToRgba(stop.color, stop.opacity || 1),
                          width: '32px',
                          height: '32px'
                        }}
                      >
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateColorStop(index, { color: e.target.value })}
                          style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                        />
                      </div>
                      
                      {/* Position */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.offset * 100}
                        onChange={(e) => updateColorStop(index, { offset: parseInt(e.target.value) / 100 })}
                        className="flex-1"
                      />
                      
                      {/* Position Value */}
                      <span className="text-xs text-gray-500 w-10">
                        {Math.round(stop.offset * 100)}%
                      </span>
                      
                      {/* Opacity */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(stop.opacity || 1) * 100}
                        onChange={(e) => updateColorStop(index, { opacity: parseInt(e.target.value) / 100 })}
                        className="w-16"
                        title="Opacity"
                      />
                      
                      {/* Remove Button */}
                      {currentGradient.colors.length > 2 && (
                        <button
                          onClick={() => removeColorStop(index)}
                          className="btn btn-ghost p-1 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradientEditor;