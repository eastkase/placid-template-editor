import React from 'react';
import useEditorStore from '../../store/editor';
import Canvas from '../Canvas/Canvas';

const CanvasArea: React.FC = () => {
  const { template, showGrid } = useEditorStore();

  return (
    <div className="canvas-area">
      <div className="canvas-wrapper">
        <div 
          className="canvas-stage"
          style={{
            width: template.width,
            height: template.height,
            position: 'relative'
          }}
        >
          {showGrid && <div className="canvas-grid" />}
          <Canvas />
        </div>
        <div className="canvas-info">
          <span>{template.width} × {template.height}px</span>
          <span>•</span>
          <span>100% zoom</span>
        </div>
      </div>
    </div>
  );
};

export default CanvasArea;