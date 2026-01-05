import React, { useState, useEffect } from 'react';
import useEditorStore from '../../store/editor';
import { Template } from '../../types';
import { 
  X, 
  Save, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Copy, 
  Edit2,
  Check,
  Loader2
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

const TemplateLibraryModal: React.FC<Props> = ({ onClose }) => {
  const { 
    template, 
    loadTemplate, 
    setSavedTemplateId, 
    savedTemplateId,
    hasUnsavedChanges,
    setHasUnsavedChanges 
  } = useEditorStore();
  
  const [templates, setTemplates] = useState<{[key: string]: Template}>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [currentTemplateKey, setCurrentTemplateKey] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = () => {
    try {
      const savedTemplates = localStorage.getItem('savedTemplates');
      if (savedTemplates) {
        const templatesData = JSON.parse(savedTemplates);
        setTemplates(templatesData);
        
        // Find if current template matches any saved template
        const currentKey = Object.keys(templatesData).find(key => 
          templatesData[key].name === template.name
        );
        if (currentKey) {
          setCurrentTemplateKey(currentKey);
        }
      }
    } catch (err) {
      setError('Failed to load templates');
      console.error(err);
    }
  };

  const handleSave = () => {
    try {
      setSaving(true);
      
      const key = currentTemplateKey || `template_${Date.now()}`;
      
      // Save to localStorage
      const savedTemplates = localStorage.getItem('savedTemplates');
      const templatesData = savedTemplates ? JSON.parse(savedTemplates) : {};
      
      templatesData[key] = {
        ...template,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('savedTemplates', JSON.stringify(templatesData));
      
      setCurrentTemplateKey(key);
      setHasUnsavedChanges(false);
      fetchTemplates();
      
      // Show success message
      alert(`Template "${template.name}" saved successfully!`);
    } catch (err) {
      setError('Failed to save template');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAs = () => {
    const name = prompt('Enter name for new template:', `${template.name} (copy)`);
    if (!name) return;

    try {
      setSaving(true);
      
      const key = `template_${Date.now()}`;
      const savedTemplates = localStorage.getItem('savedTemplates');
      const templatesData = savedTemplates ? JSON.parse(savedTemplates) : {};
      
      templatesData[key] = {
        ...template,
        name,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('savedTemplates', JSON.stringify(templatesData));
      
      setCurrentTemplateKey(key);
      setHasUnsavedChanges(false);
      fetchTemplates();
      
      alert(`Template saved as "${name}"!`);
    } catch (err) {
      setError('Failed to save template');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = (templateKey: string, templateToLoad: Template) => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Do you want to discard them?')) {
        return;
      }
    }

    loadTemplate(templateToLoad);
    setCurrentTemplateKey(templateKey);
    setHasUnsavedChanges(false);
    onClose();
  };

  const handleDelete = (templateKey: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const savedTemplates = localStorage.getItem('savedTemplates');
      if (savedTemplates) {
        const templatesData = JSON.parse(savedTemplates);
        delete templatesData[templateKey];
        localStorage.setItem('savedTemplates', JSON.stringify(templatesData));
        
        if (currentTemplateKey === templateKey) {
          setCurrentTemplateKey(null);
        }
        
        fetchTemplates();
      }
    } catch (err) {
      setError('Failed to delete template');
      console.error(err);
    }
  };

  const handleDuplicate = (templateKey: string) => {
    try {
      const savedTemplates = localStorage.getItem('savedTemplates');
      if (savedTemplates) {
        const templatesData = JSON.parse(savedTemplates);
        const templateToDuplicate = templatesData[templateKey];
        
        if (templateToDuplicate) {
          const newKey = `template_${Date.now()}`;
          templatesData[newKey] = {
            ...templateToDuplicate,
            name: `${templateToDuplicate.name} (copy)`,
            updatedAt: new Date().toISOString()
          };
          
          localStorage.setItem('savedTemplates', JSON.stringify(templatesData));
          fetchTemplates();
        }
      }
    } catch (err) {
      setError('Failed to duplicate template');
      console.error(err);
    }
  };

  const handleRename = (templateKey: string) => {
    if (!editingName.trim()) return;

    try {
      const savedTemplates = localStorage.getItem('savedTemplates');
      if (savedTemplates) {
        const templatesData = JSON.parse(savedTemplates);
        if (templatesData[templateKey]) {
          templatesData[templateKey].name = editingName;
          templatesData[templateKey].updatedAt = new Date().toISOString();
          
          localStorage.setItem('savedTemplates', JSON.stringify(templatesData));
          fetchTemplates();
          setEditingId(null);
        }
      }
    } catch (err) {
      setError('Failed to rename template');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Template Library</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current template section */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Current Template</h3>
              <p className="text-sm text-gray-600">
                {template.name} 
                {hasUnsavedChanges && <span className="text-orange-600 ml-2">• Unsaved changes</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {currentTemplateKey ? 'Update' : 'Save New'}
              </button>
              {currentTemplateKey && (
                <button
                  onClick={handleSaveAs}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Copy size={16} />
                  Save As
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Templates list */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-4">{error}</div>
          ) : Object.keys(templates).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No saved templates yet</p>
              <button
                onClick={handleSave}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                Save Current Template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(templates).map(([key, tmpl]) => (
                <div
                  key={key}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    currentTemplateKey === key ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    {editingId === key ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(key);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="flex-1 px-2 py-1 border border-purple-500 rounded text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(key)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="font-medium">{tmpl.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {tmpl.width} × {tmpl.height}px • {tmpl.layers?.length || 0} layers
                          </p>
                          {tmpl.updatedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              Updated: {new Date(tmpl.updatedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {currentTemplateKey === key && (
                            <button
                              onClick={() => handleSave()}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Update this template"
                            >
                              <Save size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingId(key);
                              setEditingName(tmpl.name);
                            }}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="Rename"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(key)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="Duplicate"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(key)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleLoad(key, tmpl)}
                    className="w-full mt-3 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FolderOpen size={16} />
                    Load Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibraryModal;