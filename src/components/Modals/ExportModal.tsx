import React, { useState } from 'react';
import useEditorStore from '../../store/editor';
import { Download, Copy, Check, X, Code, FileJson, Send } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const ExportModal: React.FC<Props> = ({ onClose }) => {
  const { template } = useEditorStore();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'json' | 'api'>('json');
  const [apiUrl, setApiUrl] = useState('http://localhost:3000');

  const exportJson = JSON.stringify(template, null, 2);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTestRender = async () => {
    try {
      const response = await fetch(`${apiUrl}/render`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template,
          data: {} // Empty data for test
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        alert('Failed to render template. Make sure the API is running.');
      }
    } catch (err) {
      alert('Failed to connect to API. Make sure it\'s running at ' + apiUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Export Template</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'json'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileJson size={16} />
              JSON Export
            </div>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'api'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Send size={16} />
              Test with API
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'json' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Template JSON
                </label>
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-[400px] border border-gray-200">
                    <code>{exportJson}</code>
                  </pre>
                  <button
                    onClick={handleCopyToClipboard}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download JSON
                </button>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Usage:</strong> This JSON can be sent to the API endpoint <code className="bg-blue-100 px-1 rounded">/render</code> along with dynamic data to generate images.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  API URL
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:3000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Test Data (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Add test data to replace dynamic fields. Leave empty for static preview.
                </p>
                <textarea
                  placeholder='{"title": "Test Title", "subtitle": "Test Subtitle"}'
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 font-mono text-sm"
                />
              </div>

              <button
                onClick={handleTestRender}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Test Render
              </button>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>API Integration:</strong>
                </p>
                <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-auto">
{`// Example API call
fetch('${apiUrl}/render', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    template: templateJson,
    data: { /* dynamic data */ }
  })
})`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;