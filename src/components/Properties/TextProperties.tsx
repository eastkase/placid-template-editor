import React from 'react';
import { TextLayer } from '../../types';
import useEditorStore from '../../store/editor';
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

interface Props {
  layer: TextLayer;
}

const TextProperties: React.FC<Props> = ({ layer }) => {
  const { updateLayer } = useEditorStore();

  const handleUpdate = (updates: Partial<TextLayer>) => {
    updateLayer(layer.id, updates);
  };

  const fontFamilies = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Merriweather',
    'Playfair Display',
    'Georgia'
  ];

  const fontWeights = [
    { label: 'Thin', value: '100' },
    { label: 'Light', value: '300' },
    { label: 'Normal', value: '400' },
    { label: 'Medium', value: '500' },
    { label: 'Semibold', value: '600' },
    { label: 'Bold', value: '700' },
    { label: 'Black', value: '900' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-700">Text Content</label>
        <textarea
          value={layer.text}
          onChange={(e) => handleUpdate({ text: e.target.value })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-vertical min-h-[60px]"
          rows={3}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700">Dynamic Field</label>
        <input
          type="text"
          value={layer.dynamicField || ''}
          onChange={(e) => handleUpdate({ dynamicField: e.target.value || undefined })}
          placeholder="e.g., {{title}}"
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-gray-700">Font Family</label>
          <select
            value={layer.fontFamily}
            onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {fontFamilies.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700">Font Weight</label>
          <select
            value={layer.fontWeight}
            onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {fontWeights.map(weight => (
              <option key={weight.value} value={weight.value}>{weight.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-gray-700">Font Size</label>
          <input
            type="number"
            value={layer.fontSize}
            onChange={(e) => handleUpdate({ fontSize: parseInt(e.target.value) || 16 })}
            min="8"
            max="200"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700">Line Height</label>
          <input
            type="number"
            value={layer.lineHeight || 1.5}
            onChange={(e) => handleUpdate({ lineHeight: parseFloat(e.target.value) || 1.5 })}
            min="0.5"
            max="3"
            step="0.1"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Text Alignment</label>
        <div className="flex gap-1">
          <button
            onClick={() => handleUpdate({ textAlign: 'left' })}
            className={`p-1.5 rounded ${layer.textAlign === 'left' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
            title="Align left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => handleUpdate({ textAlign: 'center' })}
            className={`p-1.5 rounded ${layer.textAlign === 'center' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
            title="Align center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => handleUpdate({ textAlign: 'right' })}
            className={`p-1.5 rounded ${layer.textAlign === 'right' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
            title="Align right"
          >
            <AlignRight size={16} />
          </button>
          <button
            onClick={() => handleUpdate({ textAlign: 'justify' })}
            className={`p-1.5 rounded ${layer.textAlign === 'justify' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
            title="Justify"
          >
            <AlignJustify size={16} />
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Text Style</label>
        <div className="flex gap-1">
          <button
            onClick={() => handleUpdate({ fontWeight: (layer.fontWeight || '400') === '700' ? '400' : '700' })}
            className={`p-1.5 rounded ${(layer.fontWeight || '400') >= '700' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => handleUpdate({ fontStyle: layer.fontStyle === 'italic' ? 'normal' : 'italic' })}
            className={`p-1.5 rounded ${layer.fontStyle === 'italic' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => handleUpdate({ textDecoration: layer.textDecoration === 'underline' ? 'none' : 'underline' })}
            className={`p-1.5 rounded ${layer.textDecoration === 'underline' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700">Text Color</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={layer.color}
            onChange={(e) => handleUpdate({ color: e.target.value })}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={layer.color}
            onChange={(e) => handleUpdate({ color: e.target.value })}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Text Box Behavior</label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={layer.textBox?.autoShrink || false}
            onChange={(e) => handleUpdate({ 
              textBox: { ...layer.textBox, autoShrink: e.target.checked }
            })}
            className="rounded"
          />
          <span className="text-sm">Auto-shrink text to fit</span>
        </label>
        {layer.textBox?.autoShrink && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Min Font Size</label>
              <input
                type="number"
                value={layer.textBox?.minFontSize || 8}
                onChange={(e) => handleUpdate({ 
                  textBox: { 
                    ...layer.textBox, 
                    minFontSize: parseInt(e.target.value) || 8 
                  }
                })}
                min="4"
                max="100"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Max Font Size</label>
              <input
                type="number"
                value={layer.textBox?.maxFontSize || layer.fontSize}
                onChange={(e) => handleUpdate({ 
                  textBox: { 
                    ...layer.textBox, 
                    maxFontSize: parseInt(e.target.value) || layer.fontSize 
                  }
                })}
                min="8"
                max="200"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700">Letter Spacing (px)</label>
        <input
          type="number"
          value={layer.letterSpacing || 0}
          onChange={(e) => handleUpdate({ letterSpacing: parseFloat(e.target.value) || 0 })}
          min="-5"
          max="20"
          step="0.5"
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
    </div>
  );
};

export default TextProperties;