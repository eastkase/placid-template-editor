import React, { useState } from 'react';
import useEditorStore from '../../store/editor';
import { Settings, X, Upload } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const TemplateSettingsModal: React.FC<Props> = ({ onClose }) => {
  const { template, updateTemplate, loadTemplate } = useEditorStore();
  const [width, setWidth] = useState(template.width);
  const [height, setHeight] = useState(template.height);
  const [backgroundColor, setBackgroundColor] = useState(template.backgroundColor || '#ffffff');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const presets = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1200, height: 675 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Pinterest Pin', width: 1000, height: 1500 },
  ];

  const handleApply = () => {
    updateTemplate({
      width,
      height,
      backgroundColor
    });
    onClose();
  };

  const handlePresetClick = (preset: typeof presets[0]) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          loadTemplate(imported);
          onClose();
        } catch (err) {
          alert('Invalid JSON file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h2 className="text-lg font-semibold">Template Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Dimensions */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 800)}
                  min="100"
                  max="4000"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 600)}
                  min="100"
                  max="4000"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-gray-500">
                    {preset.width} × {preset.height}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Background Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Import */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Import Template
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              Import JSON Template
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSettingsModal;