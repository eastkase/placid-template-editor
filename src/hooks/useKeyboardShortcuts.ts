import { useEffect } from 'react';
import useEditorStore from '../store/editor';

const useKeyboardShortcuts = () => {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    selectedLayerId,
    deleteLayer,
    duplicateLayer,
    template,
    selectLayer,
    toggleLayerVisibility,
    toggleLayerLock
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
      }

      // Delete selected layer: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId) {
        e.preventDefault();
        deleteLayer(selectedLayerId);
      }

      // Duplicate layer: Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedLayerId) {
        e.preventDefault();
        duplicateLayer(selectedLayerId);
      }

      // Select all: Ctrl/Cmd + A
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        // Select first layer if none selected
        if (!selectedLayerId && template.layers.length > 0) {
          selectLayer(template.layers[0].id);
        }
      }

      // Hide/Show layer: Ctrl/Cmd + H
      if ((e.ctrlKey || e.metaKey) && e.key === 'h' && selectedLayerId) {
        e.preventDefault();
        toggleLayerVisibility(selectedLayerId);
      }

      // Lock/Unlock layer: Ctrl/Cmd + L
      if ((e.ctrlKey || e.metaKey) && e.key === 'l' && selectedLayerId) {
        e.preventDefault();
        toggleLayerLock(selectedLayerId);
      }

      // Navigate layers: Arrow keys
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (!selectedLayerId || template.layers.length === 0) return;
        
        e.preventDefault();
        const currentIndex = template.layers.findIndex(l => l.id === selectedLayerId);
        
        if (e.key === 'ArrowUp' && currentIndex > 0) {
          selectLayer(template.layers[currentIndex - 1].id);
        } else if (e.key === 'ArrowDown' && currentIndex < template.layers.length - 1) {
          selectLayer(template.layers[currentIndex + 1].id);
        }
      }

      // Nudge selected layer position: Shift + Arrow keys
      if (e.shiftKey && selectedLayerId) {
        const selectedLayer = template.layers.find(l => l.id === selectedLayerId);
        if (!selectedLayer || selectedLayer.locked) return;

        const nudgeAmount = e.altKey ? 10 : 1; // Alt for larger nudges
        let newPosition = { ...selectedLayer.position };

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            newPosition.x -= nudgeAmount;
            break;
          case 'ArrowRight':
            e.preventDefault();
            newPosition.x += nudgeAmount;
            break;
          case 'ArrowUp':
            e.preventDefault();
            newPosition.y -= nudgeAmount;
            break;
          case 'ArrowDown':
            e.preventDefault();
            newPosition.y += nudgeAmount;
            break;
          default:
            return;
        }

        useEditorStore.getState().updateLayer(selectedLayerId, { position: newPosition });
      }

      // Deselect all: Escape
      if (e.key === 'Escape') {
        selectLayer(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    canUndo,
    canRedo,
    selectedLayerId,
    deleteLayer,
    duplicateLayer,
    template,
    selectLayer,
    toggleLayerVisibility,
    toggleLayerLock
  ]);
};

export default useKeyboardShortcuts;