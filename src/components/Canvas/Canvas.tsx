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
    showGrid,
    snapToGrid: shouldSnap,
    gridSize
  } = useEditorStore();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editingLayerId, setEditingLayerId] = React.useState<string | null>(null);

  const snapToGrid = (value: number): number => {
    if (!shouldSnap) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const handleBackgroundClick = () => {
    selectLayer(null);
    setEditingLayerId(null);
  };

  const handleLayerDoubleClick = (layerId: string) => {
    const layer = template.layers.find(l => l.id === layerId);
    if (layer?.type === 'text') {
      setEditingLayerId(layerId);
    }
  };

  // Sort layers by z-index for rendering
  const sortedLayers = [...template.layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div 
      ref={canvasRef}
      className="canvas-board"
      style={{
        width: template.width,
        height: template.height,
        backgroundColor: template.backgroundColor || '#ffffff',
        position: 'relative'
      }}
      onClick={handleBackgroundClick}
    >
      {/* Grid Overlay */}
      {showGrid && (
        <div className="canvas-grid" />
      )}

      {/* Render Layers */}
      {sortedLayers.map((layer) => {
        if (!layer.visible) return null;

        const isSelected = layer.id === selectedLayerId;
        const isEditing = layer.id === editingLayerId;

        return (
          <LayerRenderer
            key={layer.id}
            layer={layer}
            isSelected={isSelected}
            isEditing={isEditing}
            onSelect={() => selectLayer(layer.id)}
            onDoubleClick={() => handleLayerDoubleClick(layer.id)}
            onUpdate={(updates) => updateLayer(layer.id, updates)}
            onStopEditing={() => setEditingLayerId(null)}
            snapToGrid={snapToGrid}
          />
        );
      })}
    </div>
  );
};

// Separate component for layer rendering with Rnd
const LayerRenderer: React.FC<{
  layer: Layer;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onUpdate: (updates: Partial<Layer>) => void;
  onStopEditing: () => void;
  snapToGrid: (value: number) => number;
}> = ({ layer, isSelected, isEditing, onSelect, onDoubleClick, onUpdate, onStopEditing, snapToGrid }) => {
  const [textValue, setTextValue] = React.useState(layer.type === 'text' ? layer.text : '');

  React.useEffect(() => {
    if (layer.type === 'text') {
      setTextValue(layer.text);
    }
  }, [layer]);

  const renderLayer = (layer: Layer) => {
    if (layer.type === 'text' && isEditing) {
      return (
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onBlur={() => {
            onUpdate({ text: textValue });
            onStopEditing();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setTextValue(layer.text);
              onStopEditing();
            }
          }}
          className="w-full h-full resize-none outline-none p-2"
          style={{
            fontSize: layer.font?.size || layer.fontSize || 32,
            fontFamily: layer.font?.family || layer.fontFamily || 'Arial',
            fontWeight: layer.font?.weight || layer.fontWeight || 'normal',
            textAlign: layer.alignment || layer.textAlign || 'left',
            color: layer.color || '#000000',
            lineHeight: layer.lineHeight || 1.2,
            border: '2px solid #9333ea',
            borderRadius: '4px',
            background: 'white'
          }}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

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
        width: layer.size.width,
        height: layer.size.height
      }}
      position={{
        x: layer.position.x,
        y: layer.position.y
      }}
      onDragStop={(e, d) => {
        onUpdate({
          position: {
            x: snapToGrid(d.x),
            y: snapToGrid(d.y)
          }
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate({
          size: {
            width: snapToGrid(parseInt(ref.style.width)),
            height: snapToGrid(parseInt(ref.style.height))
          },
          position: {
            x: snapToGrid(position.x),
            y: snapToGrid(position.y)
          }
        });
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      className={`layer-wrapper ${isSelected ? 'selected' : ''} ${layer.locked ? 'cursor-not-allowed' : ''}`}
      bounds="parent"
      enableResizing={isSelected && !layer.locked && !isEditing}
      disableDragging={layer.locked || isEditing}
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
    >
      <div 
        className="w-full h-full"
        style={{
          transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
          opacity: layer.opacity || 1,
          pointerEvents: layer.locked ? 'none' : 'auto',
          cursor: layer.locked ? 'not-allowed' : isEditing ? 'text' : 'move'
        }}
      >
        {renderLayer(layer)}
        
        {/* Selection Indicator */}
        {isSelected && !layer.locked && !isEditing && (
          <div className="absolute inset-0 border-2 border-purple-500 pointer-events-none rounded">
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