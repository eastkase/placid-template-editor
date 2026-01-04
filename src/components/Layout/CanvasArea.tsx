import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import useEditorStore from '../../store/editor';
import Canvas from '../Canvas/Canvas';

const CanvasArea: React.FC = () => {
  const { template, showGrid, zoom, setZoom } = useEditorStore();

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.25));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  const handleZoomFit = () => {
    // Calculate zoom to fit canvas in viewport
    const canvasArea = document.querySelector('.canvas-area');
    if (canvasArea) {
      const areaWidth = canvasArea.clientWidth - 100; // padding
      const areaHeight = canvasArea.clientHeight - 100; // padding
      const scaleX = areaWidth / template.width;
      const scaleY = areaHeight / template.height;
      const fitZoom = Math.min(scaleX, scaleY, 1);
      setZoom(fitZoom);
    }
  };

  return (
    <div className="canvas-area">
      {/* Zoom Controls */}
      <div className="canvas-controls">
        <div className="zoom-controls">
          <button
            onClick={handleZoomOut}
            className="zoom-btn"
            title="Zoom Out"
            disabled={zoom <= 0.25}
          >
            <ZoomOut size={16} />
          </button>
          
          <button
            onClick={handleZoomReset}
            className="zoom-value"
            title="Reset Zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          
          <button
            onClick={handleZoomIn}
            className="zoom-btn"
            title="Zoom In"
            disabled={zoom >= 3}
          >
            <ZoomIn size={16} />
          </button>
          
          <div className="zoom-divider" />
          
          <button
            onClick={handleZoomFit}
            className="zoom-btn"
            title="Fit to Screen"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        <div 
          className="canvas-stage"
          style={{
            width: template.width,
            height: template.height,
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            position: 'relative'
          }}
        >
          {showGrid && <div className="canvas-grid" />}
          <Canvas />
        </div>
        <div className="canvas-info">
          <span>{template.width} × {template.height}px</span>
          <span>•</span>
          <span>{Math.round(zoom * 100)}% zoom</span>
        </div>
      </div>
    </div>
  );
};

export default CanvasArea;