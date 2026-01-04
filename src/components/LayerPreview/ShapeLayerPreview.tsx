import React from 'react';
import { ShapeLayer } from '../../types';

interface Props {
  layer: ShapeLayer;
}

const ShapeLayerPreview: React.FC<Props> = ({ layer }) => {
  const renderGradient = () => {
    if (!layer.gradient) return layer.fill || 'transparent';
    
    const { type, colors, angle = 0 } = layer.gradient;
    const colorStops = colors.map(c => `${c.color} ${c.offset * 100}%`).join(', ');
    
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${colorStops})`;
    } else {
      return `radial-gradient(circle, ${colorStops})`;
    }
  };

  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: renderGradient(),
    border: layer.stroke ? `${layer.stroke.width}px solid ${layer.stroke.color}` : undefined
  };

  switch (layer.shape) {
    case 'circle':
      return (
        <div
          style={{
            ...style,
            borderRadius: '50%'
          }}
        />
      );
    
    case 'rectangle':
      return (
        <div
          style={{
            ...style,
            borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : undefined
          }}
        />
      );
    
    case 'line':
      return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke={layer.stroke?.color || layer.fill || '#000'}
            strokeWidth={layer.stroke?.width || 2}
          />
        </svg>
      );
    
    case 'polygon':
      if (!layer.points || layer.points.length < 3) {
        return <div style={style} />;
      }
      
      const points = layer.points.map(p => `${p.x},${p.y}`).join(' ');
      return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <polygon
            points={points}
            fill={layer.fill || 'transparent'}
            stroke={layer.stroke?.color}
            strokeWidth={layer.stroke?.width}
          />
        </svg>
      );
    
    default:
      return <div style={style} />;
  }
};

export default ShapeLayerPreview;