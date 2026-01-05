import React, { useState } from 'react';
import GradientEditor from './GradientEditor';

interface Props {
  backgroundColor?: string;
  backgroundGradient?: any;
  onUpdate: (updates: { backgroundColor?: string; backgroundGradient?: any }) => void;
}

const BackgroundEditor: React.FC<Props> = ({ backgroundColor, backgroundGradient, onUpdate }) => {
  const [useGradient, setUseGradient] = useState(!!backgroundGradient);

  return (
    <div className="section">
      <h3 className="section-header">Canvas Background</h3>
      
      {/* Background Type Toggle */}
      <div className="form-group">
        <label className="form-label">Background Type</label>
        <div className="button-group">
          <button
            className={`btn btn-ghost ${!useGradient ? 'active' : ''}`}
            onClick={() => {
              setUseGradient(false);
              onUpdate({ backgroundGradient: undefined });
            }}
          >
            Solid Color
          </button>
          <button
            className={`btn btn-ghost ${useGradient ? 'active' : ''}`}
            onClick={() => {
              setUseGradient(true);
              if (!backgroundGradient) {
                onUpdate({
                  backgroundGradient: {
                    type: 'linear',
                    colors: [
                      { offset: 0, color: '#ffffff', opacity: 1 },
                      { offset: 1, color: '#f3f4f6', opacity: 1 }
                    ],
                    angle: 90
                  }
                });
              }
            }}
          >
            Gradient
          </button>
        </div>
      </div>

      {/* Solid Color Picker */}
      {!useGradient && (
        <div className="form-group">
          <label className="form-label">Background Color</label>
          <div className="color-picker-group">
            <div 
              className="color-picker-swatch"
              style={{ backgroundColor: backgroundColor || '#ffffff' }}
            >
              <input
                type="color"
                value={backgroundColor || '#ffffff'}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
              />
            </div>
            <input
              type="text"
              className="form-input color-picker-input"
              value={backgroundColor || '#ffffff'}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Gradient Editor */}
      {useGradient && (
        <GradientEditor
          gradient={backgroundGradient}
          onChange={(gradient) => onUpdate({ backgroundGradient: gradient })}
          label="Background Gradient"
        />
      )}
    </div>
  );
};

export default BackgroundEditor;