import React, { useState } from 'react';
import { 
  Type, 
  Image, 
  Square, 
  Video,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  Magnet,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Save,
  FolderOpen
} from 'lucide-react';
import useEditorStore, { 
  createDefaultTextLayer, 
  createDefaultImageLayer, 
  createDefaultShapeLayer 
} from '../../store/editor';
import ExportModal from '../Modals/ExportModal';
import TemplateSettingsModal from '../Modals/TemplateSettingsModal';
import TemplateLibraryModal from '../Modals/TemplateLibraryModal';

const Toolbar: React.FC = () => {
  const {
    template,
    hasUnsavedChanges,
    addLayer,
    undo,
    redo,
    canUndo,
    canRedo,
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
    snapToGrid,
    toggleSnap,
    updateTemplate,
    isAnimating,
    setAnimationState
  } = useEditorStore();

  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [templateName, setTemplateName] = useState(template.name);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleAddTextLayer = () => {
    addLayer(createDefaultTextLayer());
  };

  const handleAddImageLayer = () => {
    addLayer(createDefaultImageLayer());
  };

  const handleAddShapeLayer = () => {
    addLayer(createDefaultShapeLayer());
  };

  const handleZoomIn = () => {
    setZoom(Math.min(3, zoom + 0.25));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.25, zoom - 0.25));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  const handleSaveName = () => {
    updateTemplate({ name: templateName });
    setIsEditingName(false);
  };
  
  const handlePlayAnimations = () => {
    setAnimationState(true);
    
    // Calculate max animation duration
    const animatedLayers = template.layers.filter(l => 
      l.type === 'text' && l.animation && l.animation.type !== 'none'
    );
    
    if (animatedLayers.length === 0) {
      setAnimationState(false);
      return;
    }
    
    let maxDuration = 0;
    animatedLayers.forEach(layer => {
      if (layer.type === 'text' && layer.animation) {
        const anim = layer.animation;
        if (anim.typewriter) {
          maxDuration = Math.max(maxDuration, 
            (anim.typewriter.duration + anim.typewriter.startDelay) * 1000);
        } else if (anim.fade) {
          maxDuration = Math.max(maxDuration, 
            (anim.fade.duration + anim.fade.startDelay) * 1000);
        } else if (anim.slide) {
          maxDuration = Math.max(maxDuration, 
            (anim.slide.duration + anim.slide.startDelay) * 1000);
        }
      }
    });
    
    // Auto stop after max duration + 500ms buffer
    setTimeout(() => {
      setAnimationState(false);
    }, maxDuration + 500);
  };
  
  const handleStopAnimations = () => {
    setAnimationState(false);
  };

  return (
    <>
      <div className="toolbar bg-white shadow-lg border-b border-gray-200">
        {/* Template name */}
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveName();
                } else if (e.key === 'Escape') {
                  setTemplateName(template.name);
                  setIsEditingName(false);
                }
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm font-medium"
              autoFocus
            />
          ) : (
            <h1 
              className="font-semibold cursor-pointer hover:text-purple-600"
              onClick={() => setIsEditingName(true)}
            >
              {template.name}
              {hasUnsavedChanges && <span className="text-orange-600 ml-2 text-sm">•</span>}
            </h1>
          )}
          <span className="text-xs text-gray-500">
            {template.width} × {template.height}px
          </span>
        </div>

        {/* Add layer buttons */}
        <div className="toolbar-group border-l border-gray-200 pl-4">
          <button
            onClick={handleAddTextLayer}
            className="btn-icon group"
            title="Add text layer"
          >
            <Type size={20} className="group-hover:scale-110 transition-transform" />
            <span className="sr-only">Add Text</span>
          </button>
          <button
            onClick={handleAddImageLayer}
            className="btn-icon group"
            title="Add image layer"
          >
            <Image size={20} className="group-hover:scale-110 transition-transform" />
            <span className="sr-only">Add Image</span>
          </button>
          <button
            onClick={handleAddShapeLayer}
            className="btn-icon group"
            title="Add shape layer"
          >
            <Square size={20} className="group-hover:scale-110 transition-transform" />
            <span className="sr-only">Add Shape</span>
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="toolbar-group border-l border-gray-200 pl-4">
          <button
            onClick={() => undo()}
            disabled={!canUndo()}
            className={`p-2 rounded transition-colors ${
              canUndo() ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={() => redo()}
            disabled={!canRedo()}
            className={`p-2 rounded transition-colors ${
              canRedo() ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={20} />
          </button>
        </div>

        {/* Animation controls */}
        <div className="toolbar-group border-l border-gray-200 pl-4">
          {!isAnimating ? (
            <button
              onClick={handlePlayAnimations}
              className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
              title="Preview animations"
            >
              <Play size={20} />
              <span className="text-sm">Preview</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleStopAnimations}
                className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors flex items-center gap-2"
                title="Stop animations"
              >
                <Pause size={20} />
                <span className="text-sm">Stop</span>
              </button>
              <button
                onClick={handlePlayAnimations}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Restart animations"
              >
                <RotateCcw size={20} />
              </button>
            </>
          )}
        </div>
        
        {/* Canvas controls */}
        <div className="toolbar-group border-l border-gray-200 pl-4">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleZoomReset}
            className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded transition-colors min-w-[60px]"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={toggleGrid}
            className={`p-2 rounded transition-colors ${
              showGrid ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
            }`}
            title="Toggle grid"
          >
            <Grid size={20} />
          </button>
          <button
            onClick={toggleSnap}
            className={`p-2 rounded transition-colors ${
              snapToGrid ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
            }`}
            title="Toggle snap to grid"
          >
            <Magnet size={20} />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="toolbar-group">
          <button
            onClick={() => setShowLibraryModal(true)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Template library"
          >
            <FolderOpen size={20} />
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Template settings"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Modals */}
      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
      {showSettingsModal && (
        <TemplateSettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
      {showLibraryModal && (
        <TemplateLibraryModal onClose={() => setShowLibraryModal(false)} />
      )}
    </>
  );
};

export default Toolbar;