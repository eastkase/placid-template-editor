import React, { useEffect, useRef, useState } from 'react';
import { TextLayer } from '../../types';

interface Props {
  layer: TextLayer;
}

const TextLayerPreview: React.FC<Props> = ({ layer }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fontSize = layer.font?.size || layer.fontSize || 32;
  const fontFamily = layer.font?.family || layer.fontFamily || 'Arial';
  const fontWeight = layer.font?.weight || layer.fontWeight || 'normal';
  const fontStyle = layer.font?.style || 'normal';
  const [computedFontSize, setComputedFontSize] = useState(fontSize);
  
  console.log('TextLayerPreview render:', {
    layerId: layer.id,
    'layer.font': layer.font,
    'layer.fontSize': layer.fontSize,
    'computed fontSize': fontSize,
    'computedFontSize state': computedFontSize
  });
  
  // Update computedFontSize when fontSize prop changes
  useEffect(() => {
    console.log('Setting computedFontSize to:', fontSize);
    setComputedFontSize(fontSize);
  }, [fontSize]);

  // Simulate text fitting algorithm to match API behavior
  useEffect(() => {
    // Only calculate if auto-shrink is enabled
    if (!layer.textBox?.enabled || layer.textBox?.overflow !== 'shrink' || !containerRef.current) {
      // Don't override, let the other useEffect handle it
      return;
    }
    console.log('Running shrink calculation');

    const container = containerRef.current;
    const padding = layer.textBox.padding || { top: 0, right: 0, bottom: 0, left: 0 };
    const maxWidth = layer.textBox.maxWidth - padding.left - padding.right;
    const maxHeight = layer.textBox.maxHeight - padding.top - padding.bottom;
    const minSize = layer.textBox.minFontSize || 12;

    // Binary search for optimal font size
    let low = minSize;
    let high = fontSize;
    let optimalSize = minSize;

    // Create temp element for measurement
    const temp = document.createElement('div');
    temp.style.cssText = `
      position: absolute;
      visibility: hidden;
      font-family: "${fontFamily}";
      font-weight: ${fontWeight || 400};
      font-style: ${fontStyle || 'normal'};
      line-height: ${layer.lineHeight || 1.2};
      letter-spacing: ${layer.letterSpacing || 0}px;
      white-space: pre-wrap;
      word-wrap: break-word;
      width: ${maxWidth}px;
      text-transform: ${layer.textTransform || 'none'};
    `;
    document.body.appendChild(temp);

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      temp.style.fontSize = `${mid}px`;
      temp.textContent = layer.text;

      if (temp.scrollHeight <= maxHeight) {
        optimalSize = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    document.body.removeChild(temp);
    setComputedFontSize(optimalSize);
  }, [layer.textBox?.enabled, layer.textBox?.overflow, layer.text, fontSize, fontFamily, fontWeight, fontStyle, layer.lineHeight, layer.letterSpacing, layer.textTransform]);

  // Parse alternate styling
  const renderText = () => {
    if (!layer.alternateStyle?.enabled) {
      return layer.text;
    }

    const separator = layer.alternateStyle.separator || '~';
    const regex = new RegExp(`${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+)${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(layer.text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(layer.text.substring(lastIndex, match.index));
      }
      // Add the styled text
      parts.push(
        <span
          key={match.index}
          style={{
            fontFamily: layer.alternateStyle?.font?.family || fontFamily,
            fontSize: layer.alternateStyle?.font?.size || computedFontSize,
            fontWeight: layer.alternateStyle?.font?.weight || fontWeight,
            color: layer.alternateStyle?.color || layer.color
          }}
        >
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    // Add any remaining text
    if (lastIndex < layer.text.length) {
      parts.push(layer.text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : layer.text;
  };

  const padding = layer.textBox?.padding || { top: 0, right: 0, bottom: 0, left: 0 };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: layer.verticalAlignment === 'top' ? 'flex-start' :
                   layer.verticalAlignment === 'bottom' ? 'flex-end' : 'center',
        justifyContent: layer.alignment === 'left' ? 'flex-start' :
                       layer.alignment === 'right' ? 'flex-end' : 'center',
        padding: layer.textBox?.enabled 
          ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` 
          : undefined,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          fontFamily: `"${fontFamily}", sans-serif`,
          fontSize: `${computedFontSize}px`,
          fontWeight: fontWeight || 400,
          fontStyle: fontStyle || 'normal',
          color: layer.color,
          textAlign: layer.alignment,
          lineHeight: layer.lineHeight || 1.2,
          letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : undefined,
          textTransform: layer.textTransform,
          textShadow: layer.shadow 
            ? `${layer.shadow.offsetX}px ${layer.shadow.offsetY}px ${layer.shadow.blur}px ${layer.shadow.color}` 
            : undefined,
          WebkitTextStroke: layer.stroke 
            ? `${layer.stroke.width}px ${layer.stroke.color}` 
            : undefined,
          backgroundColor: layer.background?.color,
          padding: layer.background ? `${layer.background.padding}px` : undefined,
          borderRadius: layer.background?.borderRadius ? `${layer.background.borderRadius}px` : undefined,
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          width: '100%',
          overflow: layer.textBox?.overflow === 'ellipsis' ? 'hidden' : undefined,
          textOverflow: layer.textBox?.overflow === 'ellipsis' ? 'ellipsis' : undefined
        }}
      >
        {renderText()}
      </div>
    </div>
  );
};

export default TextLayerPreview;