import React, { useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import useEditorStore from '../../store/editor';
import { Layer } from '../../types';
import TextLayerPreview from '../LayerPreview/TextLayerPreview';
import ImageLayerPreview from '../LayerPreview/ImageLayerPreview';
import ShapeLayerPreview from '../LayerPreview/ShapeLayerPreview';

const Canvas: React.FC = () => {
  const { 
    template, 
    selectedLayerId, 
    selectLayer, 
    updateLayer,
    zoom,
    showGrid,
    snapToGrid: shouldSnap,
    gridSize
  } = useEditorStore();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasScale, setCanvasScale] = React.useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const containerWidth = container.clientWidth - 80; // padding
          const containerHeight = container.clientHeight - 80;
          const scaleX = containerWidth / template.width;
          const scaleY = containerHeight / template.height;
          const newScale = Math.min(scaleX, scaleY, 1) * zoom;
          setCanvasScale(newScale);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [template.width, template.height, zoom]);

  const snapToGrid = (value: number): number => {
    if (!shouldSnap) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const renderLayer = (layer: Layer) => {
    switch (layer.type) {
      case 'text':
        return <TextLayerPreview layer={layer} />;
      case 'image':
        return <ImageLayerPreview layer={layer} />;
      case 'shape':
        return <ShapeLayerPreview layer={layer} />;
      default:
        return null;
    }
  };

  const handleBackgroundClick = () => {
    selectLayer(null);
  };

  // Sort layers by z-index for rendering
  const sortedLayers = [...template.layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="canvas-container" onClick={handleBackgroundClick}>
      <div className="relative">
        {/* Canvas Board */}
        <div
          ref={canvasRef}
          className="canvas-board"
          style={{
            width: template.width,
            height: template.height,
            backgroundColor: template.backgroundColor || '#ffffff',
            transform: `scale(${canvasScale})`,
            transformOrigin: 'center',
            position: 'relative'
          }}
        >
          {/* Grid Overlay */}
          {showGrid && (
            <div className="canvas-grid" />
          )}

          {/* Render Layers */}
          {sortedLayers.map((layer) => {
            if (!layer.visible) return null;

            const isSelected = layer.id === selectedLayerId;

            return (
              <LayerRenderer
                key={layer.id}
                layer={layer}
                isSelected={isSelected}
                zoom={1} // We use canvas scale instead of per-layer zoom
                onSelect={() => selectLayer(layer.id)}
                onUpdate={(updates) => updateLayer(layer.id, updates)}
                snapToGrid={snapToGrid}
              />
            );
          })}
        </div>

        {/* Canvas Info */}
        <div className="absolute -bottom-8 left-0 text-xs text-gray-500">
          {template.width} × {template.height}px • Zoom: {Math.round(canvasScale * 100)}%
        </div>
      </div>
    </div>
  );
};

// Separate component for layer rendering with Rnd
const LayerRenderer: React.FC<{
  layer: Layer;
  isSelected: boolean;
  zoom: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<Layer>) => void;
  snapToGrid: (value: number) => number;
}> = ({ layer, isSelected, zoom, onSelect, onUpdate, snapToGrid }) => {
  const renderLayer = (layer: Layer) => {
    switch (layer.type) {
      case 'text':
        return <TextLayerPreview layer={layer} />;
      case 'image':
        return <ImageLayerPreview layer={layer} />;
      case 'shape':
        return <ShapeLayerPreview layer={layer} />;
      default:
        return null;
    }
  };

  return (
    <Rnd
      size={{
        width: layer.size.width * zoom,
        height: layer.size.height * zoom
      }}
      position={{
        x: layer.position.x * zoom,
        y: layer.position.y * zoom
      }}
      onDragStop={(e, d) => {
        onUpdate({
          position: {
            x: snapToGrid(Math.round(d.x / zoom)),
            y: snapToGrid(Math.round(d.y / zoom))
          }
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate({
          size: {
            width: snapToGrid(Math.round(parseInt(ref.style.width) / zoom)),
            height: snapToGrid(Math.round(parseInt(ref.style.height) / zoom))
          },
          position: {
            x: snapToGrid(Math.round(position.x / zoom)),
            y: snapToGrid(Math.round(position.y / zoom))
          }
        });
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`layer-wrapper ${isSelected ? 'selected' : ''} ${layer.locked ? 'cursor-not-allowed' : 'cursor-move'}`}
      bounds="parent"
      enableResizing={isSelected && !layer.locked}
      disableDragging={layer.locked}
      lockAspectRatio={false}
      resizeHandleClasses={{
        top: 'react-resizable-handle react-resizable-handle-n',
        right: 'react-resizable-handle react-resizable-handle-e',
        bottom: 'react-resizable-handle react-resizable-handle-s',
        left: 'react-resizable-handle react-resizable-handle-w',
        topLeft: 'react-resizable-handle react-resizable-handle-nw',
        topRight: 'react-resizable-handle react-resizable-handle-ne',
        bottomLeft: 'react-resizable-handle react-resizable-handle-sw',
        bottomRight: 'react-resizable-handle react-resizable-handle-se'
      }}
      resizeHandleStyles={{
        top: { top: '-5px', left: '50%', marginLeft: '-5px' },
        right: { right: '-5px', top: '50%', marginTop: '-5px' },
        bottom: { bottom: '-5px', left: '50%', marginLeft: '-5px' },
        left: { left: '-5px', top: '50%', marginTop: '-5px' },
        topLeft: { top: '-5px', left: '-5px' },
        topRight: { top: '-5px', right: '-5px' },
        bottomLeft: { bottom: '-5px', left: '-5px' },
        bottomRight: { bottom: '-5px', right: '-5px' }
      }}
    >
      <div 
        className="relative w-full h-full"
        style={{
          transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
          opacity: layer.opacity || 1,
          pointerEvents: layer.locked ? 'none' : 'auto'
        }}
      >
        {renderLayer(layer)}
        
        {/* Selection Indicator */}
        {isSelected && !layer.locked && (
          <div className="absolute inset-0 border-2 border-purple-500 pointer-events-none rounded-sm">
            <div className="absolute -top-6 left-0 text-xs bg-purple-500 text-white px-2 py-1 rounded">
              {layer.name}
            </div>
          </div>
        )}
      </div>
    </Rnd>
  );
};

export default Canvas;