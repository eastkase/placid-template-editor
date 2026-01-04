import React from 'react';
import { Rnd } from 'react-rnd';
import useEditorStore from '../../store/editor';
import { Layer } from '../../types';
import ImageLayerPreview from '../LayerPreview/ImageLayerPreview';
import TextLayerPreview from '../LayerPreview/TextLayerPreview';
import ShapeLayerPreview from '../LayerPreview/ShapeLayerPreview';

const Canvas: React.FC = () => {
  const { 
    template, 
    selectedLayerId, 
    selectLayer, 
    updateLayer, 
    zoom,
    showGrid,
    snapToGrid,
    gridSize
  } = useEditorStore();

  const handleLayerUpdate = (layerId: string, updates: Partial<Layer>) => {
    updateLayer(layerId, updates);
  };

  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  return (
    <div className="canvas-container flex-1 overflow-auto p-8">
      <div className="relative inline-block">
        <div 
          className="canvas relative bg-white shadow-2xl"
          style={{
            width: template.width * zoom,
            height: template.height * zoom,
            backgroundColor: template.backgroundColor || '#ffffff',
            backgroundImage: showGrid ? `
              repeating-linear-gradient(
                0deg,
                #e5e7eb 0px,
                transparent 1px,
                transparent ${gridSize * zoom}px,
                #e5e7eb ${gridSize * zoom}px
              ),
              repeating-linear-gradient(
                90deg,
                #e5e7eb 0px,
                transparent 1px,
                transparent ${gridSize * zoom}px,
                #e5e7eb ${gridSize * zoom}px
              )
            ` : undefined
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) selectLayer(null);
          }}
        >
          {/* Render layers in z-order */}
          {[...template.layers]
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(layer => (
              <LayerWrapper
                key={layer.id}
                layer={layer}
                isSelected={layer.id === selectedLayerId}
                zoom={zoom}
                onSelect={() => selectLayer(layer.id)}
                onUpdate={(updates) => handleLayerUpdate(layer.id, updates)}
                snapToGrid={snapToGridValue}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
};

interface LayerWrapperProps {
  layer: Layer;
  isSelected: boolean;
  zoom: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<Layer>) => void;
  snapToGrid: (value: number) => number;
}

const LayerWrapper: React.FC<LayerWrapperProps> = ({ 
  layer, 
  isSelected, 
  zoom, 
  onSelect, 
  onUpdate,
  snapToGrid
}) => {
  if (!layer.visible) return null;

  if (layer.locked && !isSelected) {
    return (
      <div
        style={{
          position: 'absolute',
          left: layer.position.x * zoom,
          top: layer.position.y * zoom,
          width: layer.size.width * zoom,
          height: layer.size.height * zoom,
          opacity: layer.opacity ?? 1,
          transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
          pointerEvents: 'none'
        }}
      >
        <LayerPreview layer={layer} />
      </div>
    );
  }

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
      resizeHandleStyles={{
        top: { cursor: 'ns-resize' },
        right: { cursor: 'ew-resize' },
        bottom: { cursor: 'ns-resize' },
        left: { cursor: 'ew-resize' },
        topRight: { cursor: 'nesw-resize' },
        bottomRight: { cursor: 'nwse-resize' },
        bottomLeft: { cursor: 'nesw-resize' },
        topLeft: { cursor: 'nwse-resize' }
      }}
    >
      <div 
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: layer.opacity ?? 1,
          transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
          transformOrigin: 'center'
        }}
      >
        <LayerPreview layer={layer} />
      </div>
    </Rnd>
  );
};

const LayerPreview: React.FC<{ layer: Layer }> = ({ layer }) => {
  switch (layer.type) {
    case 'image':
      return <ImageLayerPreview layer={layer} />;
    case 'text':
      return <TextLayerPreview layer={layer} />;
    case 'shape':
      return <ShapeLayerPreview layer={layer} />;
    default:
      return null;
  }
};

export default Canvas;