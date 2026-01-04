import React from 'react';
import { ImageLayer } from '../../types';
import { Image } from 'lucide-react';

interface Props {
  layer: ImageLayer;
}

const ImageLayerPreview: React.FC<Props> = ({ layer }) => {
  const applyFilters = () => {
    const filters = [];
    if (layer.filters?.grayscale) filters.push('grayscale(100%)');
    if (layer.filters?.brightness !== undefined) filters.push(`brightness(${layer.filters.brightness})`);
    if (layer.filters?.contrast !== undefined) filters.push(`contrast(${layer.filters.contrast})`);
    if (layer.filters?.blur) filters.push(`blur(${layer.filters.blur}px)`);
    if (layer.filters?.sepia) filters.push('sepia(100%)');
    return filters.join(' ');
  };

  const getMaskStyle = () => {
    if (layer.mask === 'circle') {
      return { borderRadius: '50%' };
    } else if (layer.mask === 'rounded' || layer.borderRadius) {
      return { borderRadius: `${layer.borderRadius || 20}px` };
    }
    return {};
  };

  if (!layer.src) {
    return (
      <div 
        className="w-full h-full bg-gray-200 flex items-center justify-center flex-col gap-2"
        style={{
          ...getMaskStyle(),
          border: layer.border ? `${layer.border.width}px solid ${layer.border.color}` : undefined
        }}
      >
        <Image size={48} className="text-gray-400" />
        <span className="text-gray-500 text-sm">Click to add image</span>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative overflow-hidden"
      style={{
        ...getMaskStyle(),
        border: layer.border ? `${layer.border.width}px solid ${layer.border.color}` : undefined
      }}
    >
      <img
        src={layer.src}
        alt={layer.name}
        className="w-full h-full"
        style={{
          objectFit: layer.fit,
          filter: applyFilters() || undefined
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.innerHTML = `
              <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500 text-sm">Failed to load image</span>
              </div>
            `;
          }
        }}
      />
    </div>
  );
};

export default ImageLayerPreview;