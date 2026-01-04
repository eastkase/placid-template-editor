import React, { useRef, useState, useEffect } from 'react';
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
  
  const layers = template.layers;
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [showCenterGuides, setShowCenterGuides] = useState(false);
  const [draggedLayer, setDraggedLayer] = useState<Layer | null>(null);

  const snapToGrid = (value: number): number => {
    if (!shouldSnap) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const checkCenterAlignment = (layer: Layer) => {
    if (!layer) return false;
    const centerX = template.width / 2;
    const centerY = template.height / 2;
    const layerCenterX = layer.position.x + layer.size.width / 2;
    const layerCenterY = layer.position.y + layer.size.height / 2;
    
    const threshold = 5; // pixels
    return (
      Math.abs(layerCenterX - centerX) < threshold ||
      Math.abs(layerCenterY - centerY) < threshold
    );
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectLayer(null);
      setEditingLayerId(null);
    }
  };

  const handleLayerDoubleClick = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.type === 'text') {
      setEditingLayerId(layerId);
    } else if (layer?.type === 'image' && !layer.src) {
      // Show image upload dialog
      const url = prompt('Enter image URL:');
      if (url) {
        updateLayer(layerId, { src: url });
      }
    }
  };

  // Sort layers by z-index for rendering
  const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

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

      {/* Center Alignment Guides */}
      {showCenterGuides && (
        <>
          <div 
            className="alignment-guide-h" 
            style={{ top: template.height / 2 }}
          />
          <div 
            className="alignment-guide-v" 
            style={{ left: template.width / 2 }}
          />
        </>
      )}

      {/* Render Layers */}
      {sortedLayers.map((layer) => {
        if (layer.visible === false) return null;

        const isSelected = layer.id === selectedLayerId;
        const isEditing = layer.id === editingLayerId;

        return (
          <LayerRenderer
            key={layer.id}
            layer={layer}
            isSelected={isSelected}
            isEditing={isEditing}
            onSelect={() => {
              selectLayer(layer.id);
              setEditingLayerId(null);
            }}
            onDoubleClick={() => handleLayerDoubleClick(layer.id)}
            onUpdate={(updates) => updateLayer(layer.id, updates)}
            onStopEditing={() => setEditingLayerId(null)}
            onDrag={(layer) => {
              setDraggedLayer(layer);
              setShowCenterGuides(checkCenterAlignment(layer));
            }}
            onDragStop={() => {
              setDraggedLayer(null);
              setShowCenterGuides(false);
            }}
            snapToGrid={snapToGrid}
            templateWidth={template.width}
            templateHeight={template.height}
          />
        );
      })}
    </div>
  );
};

// Layer Renderer Component
interface LayerRendererProps {
  layer: Layer;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onUpdate: (updates: Partial<Layer>) => void;
  onStopEditing: () => void;
  onDrag: (layer: Layer) => void;
  onDragStop: () => void;
  snapToGrid: (value: number) => number;
  templateWidth: number;
  templateHeight: number;
}

const LayerRenderer: React.FC<LayerRendererProps> = ({ 
  layer, 
  isSelected, 
  isEditing, 
  onSelect, 
  onDoubleClick, 
  onUpdate, 
  onStopEditing, 
  onDrag,
  onDragStop,
  snapToGrid,
  templateWidth,
  templateHeight
}) => {
  const [textValue, setTextValue] = useState(layer.type === 'text' ? layer.text : '');

  useEffect(() => {
    if (layer.type === 'text') {
      setTextValue(layer.text);
    }
  }, [layer]);

  const snapToCenter = (value: number, center: number, threshold = 10): number => {
    if (Math.abs(value - center) < threshold) {
      return center;
    }
    return value;
  };

  const renderLayer = () => {
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
      onDrag={(e, d) => {
        const centerX = templateWidth / 2;
        const centerY = templateHeight / 2;
        const layerCenterX = d.x + layer.size.width / 2;
        const layerCenterY = d.y + layer.size.height / 2;
        
        // Snap to center
        let snappedX = d.x;
        let snappedY = d.y;
        
        if (Math.abs(layerCenterX - centerX) < 10) {
          snappedX = centerX - layer.size.width / 2;
        }
        if (Math.abs(layerCenterY - centerY) < 10) {
          snappedY = centerY - layer.size.height / 2;
        }
        
        onDrag({
          ...layer,
          position: { x: snappedX, y: snappedY }
        });
      }}
      onDragStop={(e, d) => {
        const centerX = templateWidth / 2;
        const centerY = templateHeight / 2;
        const layerCenterX = d.x + layer.size.width / 2;
        const layerCenterY = d.y + layer.size.height / 2;
        
        let finalX = snapToGrid(d.x);
        let finalY = snapToGrid(d.y);
        
        // Snap to center if close
        if (Math.abs(layerCenterX - centerX) < 10) {
          finalX = centerX - layer.size.width / 2;
        }
        if (Math.abs(layerCenterY - centerY) < 10) {
          finalY = centerY - layer.size.height / 2;
        }
        
        onUpdate({
          position: {
            x: finalX,
            y: finalY
          }
        });
        onDragStop();
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
      className={`layer-wrapper ${isSelected ? 'selected' : ''} ${layer.locked ? 'locked' : ''}`}
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
        {renderLayer()}
        
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