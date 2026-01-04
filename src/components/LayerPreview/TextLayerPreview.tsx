import React, { useEffect, useRef, useState } from 'react';
import { TextLayer } from '../../types';

interface Props {
  layer: TextLayer;
}

const TextLayerPreview: React.FC<Props> = ({ layer }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedFontSize, setComputedFontSize] = useState(layer.font.size);

  // Simulate text fitting algorithm to match API behavior
  useEffect(() => {
    if (!layer.textBox?.enabled || !containerRef.current) {
      setComputedFontSize(layer.font.size);
      return;
    }

    const container = containerRef.current;
    const padding = layer.textBox.padding || { top: 0, right: 0, bottom: 0, left: 0 };
    const maxWidth = layer.textBox.maxWidth - padding.left - padding.right;
    const maxHeight = layer.textBox.maxHeight - padding.top - padding.bottom;
    const minSize = layer.textBox.minFontSize || 12;

    if (layer.textBox.overflow !== 'shrink') {
      setComputedFontSize(layer.font.size);
      return;
    }

    // Binary search for optimal font size
    let low = minSize;
    let high = layer.font.size;
    let optimalSize = minSize;

    // Create temp element for measurement
    const temp = document.createElement('div');
    temp.style.cssText = `
      position: absolute;
      visibility: hidden;
      font-family: "${layer.font.family}";
      font-weight: ${layer.font.weight || 400};
      font-style: ${layer.font.style || 'normal'};
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
  }, [layer]);

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
            fontFamily: layer.alternateStyle?.font?.family || layer.font.family,
            fontSize: layer.alternateStyle?.font?.size || computedFontSize,
            fontWeight: layer.alternateStyle?.font?.weight || layer.font.weight,
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
          fontFamily: `"${layer.font.family}", sans-serif`,
          fontSize: layer.textBox?.enabled && layer.textBox.overflow === 'shrink' 
            ? computedFontSize 
            : layer.font.size,
          fontWeight: layer.font.weight || 400,
          fontStyle: layer.font.style || 'normal',
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