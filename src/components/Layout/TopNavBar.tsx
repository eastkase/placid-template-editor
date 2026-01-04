import React, { useState } from 'react';
import { 
  Edit2, 
  Download, 
  Undo, 
  Redo, 
  Clock,
  Play,
  Save,
  ChevronDown
} from 'lucide-react';
import useEditorStore from '../../store/editor';
import ExportModal from '../Modals/ExportModal';
import TemplateLibraryModal from '../Modals/TemplateLibraryModal';

const TopNavBar: React.FC = () => {
  const {
    template,
    hasUnsavedChanges,
    undo,
    redo,
    canUndo,
    canRedo,
    updateTemplate
  } = useEditorStore();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [templateName, setTemplateName] = useState(template.name);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);

  const handleSaveName = () => {
    updateTemplate({ name: templateName });
    setIsEditingName(false);
  };

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

          {/* Template Info */}
          <span className="text-purple-200 text-sm opacity-75">
            {template.width} × {template.height}px
          </span>
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
            <button className="btn btn-ghost text-white/90 hover:bg-white/10">
              <Clock size={16} />
              History
            </button>
            <button className="btn btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Play size={16} />
              Test
            </button>
            <button
              onClick={() => setShowLibraryModal(true)}
              className="btn btn-primary bg-white text-purple-900 hover:bg-purple-100"
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