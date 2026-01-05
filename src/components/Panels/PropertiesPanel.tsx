import React from 'react';
import useEditorStore from '../../store/editor';
import type { TextLayer, ImageLayer, ShapeLayer } from '../../types';
import GradientEditor from '../Controls/GradientEditor';
import BackgroundEditor from '../Controls/BackgroundEditor';

const PropertiesPanel: React.FC = () => {
  const { selectedLayerId, template, updateLayer, updateTemplate } = useEditorStore();
  
  const selectedLayer = template.layers.find(layer => layer.id === selectedLayerId);
  
  if (!selectedLayer) {
    return (
      <BackgroundEditor
        backgroundColor={template.backgroundColor}
        backgroundGradient={template.backgroundGradient}
        onUpdate={updateTemplate}
      />
    );
  }

  const handleUpdate = (updates: Partial<typeof selectedLayer>) => {
    updateLayer(selectedLayer.id, updates);
  };

  return (
    <div>
      {/* Basic Properties */}
      <div className="section">
        <h3 className="section-header">General</h3>
        
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-input"
            value={selectedLayer.name}
            onChange={(e) => handleUpdate({ name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Position</label>
          <div className="input-group">
            <div className="input-group-item">
              <input
                type="number"
                className="form-input"
                placeholder="X"
                value={selectedLayer.position.x}
                onChange={(e) => handleUpdate({ 
                  position: { ...selectedLayer.position, x: parseInt(e.target.value) || 0 } 
                })}
              />
            </div>
            <div className="input-group-item">
              <input
                type="number"
                className="form-input"
                placeholder="Y"
                value={selectedLayer.position.y}
                onChange={(e) => handleUpdate({ 
                  position: { ...selectedLayer.position, y: parseInt(e.target.value) || 0 } 
                })}
              />
            </div>
          </div>
          <button
            className="btn btn-ghost mt-2"
            style={{ width: '100%' }}
            onClick={() => {
              const centerX = Math.round((template.width - selectedLayer.size.width) / 2);
              const centerY = Math.round((template.height - selectedLayer.size.height) / 2);
              handleUpdate({ 
                position: { x: centerX, y: centerY } 
              });
            }}
          >
            Center on Canvas
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Size</label>
          <div className="input-group">
            <div className="input-group-item">
              <input
                type="number"
                className="form-input"
                placeholder="Width"
                value={selectedLayer.size.width}
                onChange={(e) => handleUpdate({ 
                  size: { ...selectedLayer.size, width: parseInt(e.target.value) || 0 } 
                })}
              />
            </div>
            <div className="input-group-item">
              <input
                type="number"
                className="form-input"
                placeholder="Height"
                value={selectedLayer.size.height}
                onChange={(e) => handleUpdate({ 
                  size: { ...selectedLayer.size, height: parseInt(e.target.value) || 0 } 
                })}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Rotation</label>
          <div className="slider-control">
            <input
              type="range"
              min="0"
              max="360"
              value={selectedLayer.rotation || 0}
              onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) })}
              style={{ flex: 1 }}
            />
            <span className="slider-value">{selectedLayer.rotation || 0}°</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Opacity</label>
          <div className="slider-control">
            <input
              type="range"
              min="0"
              max="100"
              value={(selectedLayer.opacity || 1) * 100}
              onChange={(e) => handleUpdate({ opacity: parseInt(e.target.value) / 100 })}
              style={{ flex: 1 }}
            />
            <span className="slider-value">{Math.round((selectedLayer.opacity || 1) * 100)}%</span>
          </div>
        </div>

        <div className="form-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              className="toggle-switch-input"
              checked={selectedLayer.visible !== false}
              onChange={(e) => handleUpdate({ visible: e.target.checked })}
            />
            <span className="toggle-switch-slider"></span>
            <span className="toggle-switch-label">Visible</span>
          </label>
        </div>
      </div>

      {/* Type-specific Properties */}
      {selectedLayer.type === 'text' && (
        <TextProperties 
          layer={selectedLayer as TextLayer} 
          onUpdate={handleUpdate} 
        />
      )}
      
      {selectedLayer.type === 'image' && (
        <ImageProperties 
          layer={selectedLayer as ImageLayer} 
          onUpdate={handleUpdate} 
        />
      )}
      
      {selectedLayer.type === 'shape' && (
        <ShapeProperties 
          layer={selectedLayer as ShapeLayer} 
          onUpdate={handleUpdate} 
        />
      )}
    </div>
  );
};

// Text Layer Properties
const TextProperties: React.FC<{
  layer: TextLayer;
  onUpdate: (updates: Partial<TextLayer>) => void;
}> = ({ layer, onUpdate }) => (
  <div className="section">
    <h3 className="section-header">Text Properties</h3>
    
    <div className="form-group">
      <label className="form-label">Text</label>
      <textarea
        className="form-input"
        rows={3}
        value={layer.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Font Family</label>
      <select
        className="form-select"
        value={layer.font?.family || layer.fontFamily || 'Arial'}
        onChange={(e) => onUpdate({ 
          font: { 
            family: e.target.value,
            size: layer.font?.size || layer.fontSize || 32,
            weight: layer.font?.weight || layer.fontWeight || 400,
            style: layer.font?.style || 'normal'
          },
          fontFamily: e.target.value 
        })}
      >
        <option value="Inter">Inter</option>
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>
    </div>

    <div className="form-group">
      <label className="form-label">Font Size</label>
      <input
        type="number"
        className="form-input"
        value={layer.font?.size || layer.fontSize || 32}
        onChange={(e) => {
          const size = parseInt(e.target.value) || 16;
          onUpdate({ 
            font: { 
              family: layer.font?.family || layer.fontFamily || 'Arial',
              size: size,
              weight: layer.font?.weight || layer.fontWeight || 400,
              style: layer.font?.style || 'normal'
            },
            fontSize: size 
          });
        }}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Font Weight</label>
      <select
        className="form-select"
        value={layer.font?.weight || layer.fontWeight || 'normal'}
        onChange={(e) => onUpdate({ 
          font: { 
            family: layer.font?.family || layer.fontFamily || 'Arial',
            size: layer.font?.size || layer.fontSize || 32,
            weight: e.target.value,
            style: layer.font?.style || 'normal'
          },
          fontWeight: e.target.value 
        })}
      >
        <option value="normal">Normal</option>
        <option value="bold">Bold</option>
        <option value="lighter">Light</option>
      </select>
    </div>

    <div className="form-group">
      <label className="form-label">Text Color</label>
      <div className="color-picker-group">
        <div 
          className="color-picker-swatch"
          style={{ backgroundColor: layer.color }}
        >
          <input
            type="color"
            value={layer.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          />
        </div>
        <input
          type="text"
          className="form-input color-picker-input"
          value={layer.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
        />
      </div>
    </div>

    <div className="form-group">
      <label className="form-label">Text Align</label>
      <div className="button-group">
        <button
          className={`btn btn-ghost ${layer.textAlign === 'left' ? 'active' : ''}`}
          onClick={() => onUpdate({ textAlign: 'left' })}
        >
          Left
        </button>
        <button
          className={`btn btn-ghost ${layer.textAlign === 'center' ? 'active' : ''}`}
          onClick={() => onUpdate({ textAlign: 'center' })}
        >
          Center
        </button>
        <button
          className={`btn btn-ghost ${layer.textAlign === 'right' ? 'active' : ''}`}
          onClick={() => onUpdate({ textAlign: 'right' })}
        >
          Right
        </button>
      </div>
    </div>

    <div className="form-group">
      <label className="toggle-switch">
        <input
          type="checkbox"
          className="toggle-switch-input"
          checked={layer.textBox?.enabled && layer.textBox?.overflow === 'shrink'}
          onChange={(e) => onUpdate({ 
            textBox: { 
              ...layer.textBox, 
              enabled: e.target.checked,
              overflow: e.target.checked ? 'shrink' : 'wrap',
              maxWidth: layer.size.width,
              maxHeight: layer.size.height,
              maxFontSize: 200
            } 
          })}
        />
        <span className="toggle-switch-slider"></span>
        <span className="toggle-switch-label">Auto-fit text</span>
      </label>
    </div>
  </div>
);

// Image Layer Properties
const ImageProperties: React.FC<{
  layer: ImageLayer;
  onUpdate: (updates: Partial<ImageLayer>) => void;
}> = ({ layer, onUpdate }) => (
  <div className="section">
    <h3 className="section-header">Image Properties</h3>
    
    <div className="form-group">
      <label className="form-label">Image URL</label>
      <input
        type="text"
        className="form-input"
        value={layer.src || ''}
        onChange={(e) => onUpdate({ src: e.target.value })}
        placeholder="https://example.com/image.jpg"
      />
    </div>

    <div className="form-group">
      <label className="form-label">Object Fit</label>
      <select
        className="form-select"
        value={layer.fit || 'cover'}
        onChange={(e) => onUpdate({ fit: e.target.value as any })}
      >
        <option value="cover">Cover</option>
        <option value="contain">Contain</option>
        <option value="fill">Fill</option>
        <option value="none">None</option>
      </select>
    </div>
  </div>
);

// Shape Layer Properties
const ShapeProperties: React.FC<{
  layer: ShapeLayer;
  onUpdate: (updates: Partial<ShapeLayer>) => void;
}> = ({ layer, onUpdate }) => (
  <div className="section">
    <h3 className="section-header">Shape Properties</h3>
    
    <div className="form-group">
      <label className="form-label">Shape Type</label>
      <select
        className="form-select"
        value={layer.shape}
        onChange={(e) => onUpdate({ shape: e.target.value as any })}
      >
        <option value="rectangle">Rectangle</option>
        <option value="circle">Circle</option>
        <option value="line">Line</option>
      </select>
    </div>

    {/* Gradient Editor */}
    <GradientEditor
      gradient={layer.gradient}
      onChange={(gradient) => onUpdate({ gradient })}
      label="Gradient Fill"
    />

    {/* Solid Fill Color (shown when gradient is disabled) */}
    {!layer.gradient && (
      <div className="form-group">
        <label className="form-label">Fill Color</label>
        <div className="color-picker-group">
          <div 
            className="color-picker-swatch"
            style={{ backgroundColor: layer.fill }}
          >
            <input
              type="color"
              value={layer.fill || '#7c3aed'}
              onChange={(e) => onUpdate({ fill: e.target.value })}
              style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </div>
          <input
            type="text"
            className="form-input color-picker-input"
            value={layer.fill || '#7c3aed'}
            onChange={(e) => onUpdate({ fill: e.target.value })}
          />
        </div>
      </div>
    )}

    {layer.shape === 'rectangle' && (
      <div className="form-group">
        <label className="form-label">Border Radius</label>
        <input
          type="number"
          className="form-input"
          value={layer.borderRadius || 0}
          onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) || 0 })}
        />
      </div>
    )}

    <div className="form-group">
      <label className="form-label">Stroke Color</label>
      <div className="color-picker-group">
        <div 
          className="color-picker-swatch"
          style={{ backgroundColor: layer.stroke?.color || 'transparent' }}
        >
          <input
            type="color"
            value={layer.stroke?.color || '#000000'}
            onChange={(e) => onUpdate({ 
              stroke: { 
                ...layer.stroke, 
                color: e.target.value,
                width: layer.stroke?.width || 1
              } 
            })}
            style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          />
        </div>
        <input
          type="text"
          className="form-input color-picker-input"
          value={layer.stroke?.color || ''}
          placeholder="None"
          onChange={(e) => onUpdate({ 
            stroke: e.target.value ? { 
              color: e.target.value,
              width: layer.stroke?.width || 1
            } : undefined
          })}
        />
      </div>
    </div>

    <div className="form-group">
      <label className="form-label">Stroke Width</label>
      <input
        type="number"
        className="form-input"
        value={layer.stroke?.width || 0}
        onChange={(e) => onUpdate({ 
          stroke: layer.stroke ? {
            ...layer.stroke,
            width: parseInt(e.target.value) || 0
          } : {
            color: '#000000',
            width: parseInt(e.target.value) || 0
          }
        })}
      />
    </div>
  </div>
);

export default PropertiesPanel;