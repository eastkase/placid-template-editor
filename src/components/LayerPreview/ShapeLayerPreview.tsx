import React from 'react';
import { ShapeLayer } from '../../types';

interface Props {
  layer: ShapeLayer;
}

const ShapeLayerPreview: React.FC<Props> = ({ layer }) => {
  const hexToRgba = (hex: string, opacity: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const renderGradient = () => {
    if (!layer.gradient) return layer.fill || 'transparent';
    
    const { type, colors, angle = 0, centerX = 0.5, centerY = 0.5 } = layer.gradient;
    const colorStops = colors
      .map(c => `${hexToRgba(c.color, c.opacity || 1)} ${c.offset * 100}%`)
      .join(', ');
    
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${colorStops})`;
    } else {
      const cx = centerX * 100;
      const cy = centerY * 100;
      return `radial-gradient(circle at ${cx}% ${cy}%, ${colorStops})`;
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