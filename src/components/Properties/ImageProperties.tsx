import React, { useRef } from 'react';
import { ImageLayer } from '../../types';
import useEditorStore from '../../store/editor';
import { Upload, Image } from 'lucide-react';

interface Props {
  layer: ImageLayer;
}

const ImageProperties: React.FC<Props> = ({ layer }) => {
  const { updateLayer } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (updates: Partial<ImageLayer>) => {
    updateLayer(layer.id, updates);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleUpdate({ src: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const fitOptions = [
    { label: 'Cover', value: 'cover' },
    { label: 'Contain', value: 'contain' },
    { label: 'Fill', value: 'fill' },
    { label: 'None', value: 'none' },
    { label: 'Scale Down', value: 'scale-down' }
  ];

  const maskOptions = [
    { label: 'None', value: 'none' },
    { label: 'Circle', value: 'circle' },
    { label: 'Rounded', value: 'rounded' },
    { label: 'Rectangle', value: 'rectangle' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Image Source</label>
        <div className="space-y-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            Upload Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            type="text"
            value={layer.src || ''}
            onChange={(e) => handleUpdate({ src: e.target.value })}
            placeholder="Or enter image URL..."
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700">Dynamic Field</label>
        <input
          type="text"
          value={layer.dynamicField || ''}
          onChange={(e) => handleUpdate({ dynamicField: e.target.value || undefined })}
          placeholder="e.g., {{image}}"
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700">Object Fit</label>
        <select
          value={layer.fit || 'cover'}
          onChange={(e) => handleUpdate({ fit: e.target.value as any })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        >
          {fitOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700">Image Mask</label>
        <select
          value={layer.mask || 'none'}
          onChange={(e) => handleUpdate({ mask: e.target.value as any })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        >
          {maskOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {(layer.mask === 'rounded' || layer.mask === 'rectangle') && (
        <div>
          <label className="text-xs font-medium text-gray-700">Border Radius (px)</label>
          <input
            type="number"
            value={layer.borderRadius || 0}
            onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) || 0 })}
            min="0"
            max="100"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Filters</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={layer.filters?.grayscale || false}
              onChange={(e) => handleUpdate({ 
                filters: { ...layer.filters, grayscale: e.target.checked }
              })}
              className="rounded"
            />
            <span className="text-sm">Grayscale</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={layer.filters?.sepia || false}
              onChange={(e) => handleUpdate({ 
                filters: { ...layer.filters, sepia: e.target.checked }
              })}
              className="rounded"
            />
            <span className="text-sm">Sepia</span>
          </label>

          <div>
            <label className="text-xs text-gray-600">Brightness</label>
            <input
              type="range"
              value={layer.filters?.brightness || 1}
              onChange={(e) => handleUpdate({ 
                filters: { ...layer.filters, brightness: parseFloat(e.target.value) }
              })}
              min="0"
              max="2"
              step="0.1"
              className="w-full"
            />
            <span className="text-xs text-gray-500">{layer.filters?.brightness || 1}</span>
          </div>

          <div>
            <label className="text-xs text-gray-600">Contrast</label>
            <input
              type="range"
              value={layer.filters?.contrast || 1}
              onChange={(e) => handleUpdate({ 
                filters: { ...layer.filters, contrast: parseFloat(e.target.value) }
              })}
              min="0"
              max="2"
              step="0.1"
              className="w-full"
            />
            <span className="text-xs text-gray-500">{layer.filters?.contrast || 1}</span>
          </div>

          <div>
            <label className="text-xs text-gray-600">Blur (px)</label>
            <input
              type="range"
              value={layer.filters?.blur || 0}
              onChange={(e) => handleUpdate({ 
                filters: { ...layer.filters, blur: parseInt(e.target.value) }
              })}
              min="0"
              max="20"
              step="1"
              className="w-full"
            />
            <span className="text-xs text-gray-500">{layer.filters?.blur || 0}px</span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Border</label>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Width (px)</label>
              <input
                type="number"
                value={layer.border?.width || 0}
                onChange={(e) => {
                  const width = parseInt(e.target.value) || 0;
                  handleUpdate({ 
                    border: width > 0 ? { 
                      ...layer.border, 
                      width,
                      color: layer.border?.color || '#000000'
                    } : undefined
                  });
                }}
                min="0"
                max="20"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Color</label>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={layer.border?.color || '#000000'}
                  onChange={(e) => handleUpdate({ 
                    border: { 
                      ...layer.border, 
                      width: layer.border?.width || 1,
                      color: e.target.value 
                    }
                  })}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={layer.border?.color || '#000000'}
                  onChange={(e) => handleUpdate({ 
                    border: { 
                      ...layer.border, 
                      width: layer.border?.width || 1,
                      color: e.target.value 
                    }
                  })}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageProperties;