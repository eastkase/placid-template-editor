import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit2, 
  Download, 
  Upload,
  Plus,
  Undo, 
  Redo, 
  Clock,
  Play,
  Save,
  ChevronDown,
  Maximize2
} from 'lucide-react';
import useEditorStore from '../../store/editor';
import ExportModal from '../Modals/ExportModal';
import TemplateLibraryModal from '../Modals/TemplateLibraryModal';

const TEMPLATE_PRESETS = [
  { name: 'Custom', width: 0, height: 0 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'Twitter Post', width: 1600, height: 900 },
  { name: 'LinkedIn Post', width: 1200, height: 1200 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'Pinterest Pin', width: 1000, height: 1500 },
  { name: 'TikTok Video', width: 1080, height: 1920 },
  { name: 'A4 Portrait', width: 2480, height: 3508 },
  { name: 'A4 Landscape', width: 3508, height: 2480 },
  { name: 'Web Banner', width: 1920, height: 480 },
];

const TopNavBar: React.FC = () => {
  const {
    template,
    hasUnsavedChanges,
    undo,
    redo,
    canUndo,
    canRedo,
    updateTemplate,
    loadTemplate
  } = useEditorStore();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [templateName, setTemplateName] = useState(template.name);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [customWidth, setCustomWidth] = useState(template.width.toString());
  const [customHeight, setCustomHeight] = useState(template.height.toString());
  const sizeDropdownRef = useRef<HTMLDivElement>(null);

  const handleSaveName = () => {
    updateTemplate({ name: templateName });
    setIsEditingName(false);
  };

  const handlePresetSelect = (preset: typeof TEMPLATE_PRESETS[0]) => {
    if (preset.width > 0 && preset.height > 0) {
      updateTemplate({ 
        width: preset.width, 
        height: preset.height 
      });
      setCustomWidth(preset.width.toString());
      setCustomHeight(preset.height.toString());
    }
    setShowSizeDropdown(false);
  };

  const handleCustomSizeApply = () => {
    const width = parseInt(customWidth) || 1080;
    const height = parseInt(customHeight) || 1080;
    updateTemplate({ width, height });
    setShowSizeDropdown(false);
  };

  const handleLoadTemplate = () => {
    const savedTemplates = localStorage.getItem('savedTemplates');
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      const templateKeys = Object.keys(templates);
      
      if (templateKeys.length === 0) {
        alert('No saved templates found');
        return;
      }
      
      // For simplicity, load the most recently saved template
      // In a real app, you'd show a modal to select which template to load
      const mostRecent = templateKeys[templateKeys.length - 1];
      const templateToLoad = templates[mostRecent];
      
      if (templateToLoad) {
        loadTemplate(templateToLoad);
        alert(`Loaded template: ${templateToLoad.name}`);
      }
    } else {
      alert('No saved templates found');
    }
  };

  const handleNewTemplate = () => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Create a new template anyway?')) {
        return;
      }
    }
    
    // Create a fresh template
    const newTemplate = {
      name: 'Untitled Template',
      width: 1080,
      height: 1080,
      backgroundColor: '#ffffff',
      layers: [],
      outputFormat: 'png' as const
    };
    
    loadTemplate(newTemplate);
    setTemplateName('Untitled Template');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
        setShowSizeDropdown(false);
      }
    };

    if (showSizeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSizeDropdown]);

  return (
    <>
      <nav className="top-nav">
        <div className="top-nav-left">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TE</span>
            </div>
          </div>

          {/* Template Name */}
          <div className="top-nav-title">
            {isEditingName ? (
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') {
                    setTemplateName(template.name);
                    setIsEditingName(false);
                  }
                }}
                className="bg-transparent text-white outline-none border-b border-white/30 px-1"
                autoFocus
              />
            ) : (
              <>
                {template.name}
                {hasUnsavedChanges && <span className="text-purple-300 ml-2">•</span>}
                <button
                  onClick={() => setIsEditingName(true)}
                  className="top-nav-title-edit"
                >
                  <Edit2 size={14} />
                </button>
              </>
            )}
          </div>

          {/* Template Size Selector */}
          <div className="relative" ref={sizeDropdownRef}>
            <button
              onClick={() => setShowSizeDropdown(!showSizeDropdown)}
              className="btn btn-ghost text-white/90 hover:bg-white/10 flex items-center gap-2"
            >
              <Maximize2 size={16} />
              <span>{template.width} × {template.height}px</span>
              <ChevronDown size={14} />
            </button>
            
            {showSizeDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">
                    Template Presets
                  </div>
                  {TEMPLATE_PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset)}
                      className={`w-full text-left px-3 py-2 hover:bg-purple-50 rounded transition-colors ${
                        preset.width === template.width && preset.height === template.height 
                          ? 'bg-purple-50 text-purple-700' 
                          : 'text-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">{preset.name}</div>
                      {preset.width > 0 && (
                        <div className="text-xs text-gray-500">
                          {preset.width} × {preset.height}px
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="p-4 bg-gray-50">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Custom Size
                  </div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      placeholder="Width"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-purple-400"
                    />
                    <span className="self-center text-gray-400">×</span>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      placeholder="Height"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <button
                    onClick={handleCustomSizeApply}
                    className="w-full btn btn-primary bg-purple-600 text-white hover:bg-purple-700 py-2 rounded-md text-sm"
                  >
                    Apply Custom Size
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="top-nav-right">
          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-icon btn-ghost text-white/80 hover:text-white hover:bg-white/10"
              title="Export"
            >
              <Download size={18} />
            </button>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <button
              onClick={() => undo()}
              disabled={!canUndo()}
              className="btn-icon btn-ghost text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button
              onClick={() => redo()}
              disabled={!canRedo()}
              className="btn-icon btn-ghost text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo size={18} />
            </button>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            <button 
              onClick={handleNewTemplate}
              className="btn btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Plus size={16} />
              New
            </button>
            <button
              onClick={handleLoadTemplate}
              className="btn btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Upload size={16} />
              Load
            </button>
            <button
              onClick={() => setShowLibraryModal(true)}
              className="btn btn-primary bg-purple-600 text-white hover:bg-purple-700"
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      </nav>

      {/* Modals */}
      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
      {showLibraryModal && (
        <TemplateLibraryModal onClose={() => setShowLibraryModal(false)} />
      )}
    </>
  );
};

export default TopNavBar;