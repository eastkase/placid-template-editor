import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useEditorStore from '../../store/editor';
import LayerItem from './LayerItem';
import { Plus, Layers } from 'lucide-react';

const LayersPanel: React.FC = () => {
  const {
    template,
    selectedLayerId,
    selectLayer,
    reorderLayers,
    toggleLayerVisibility,
    toggleLayerLock,
    deleteLayer,
    duplicateLayer,
    updateLayer
  } = useEditorStore();

  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = template.layers.findIndex(l => l.id === active.id);
      const newIndex = template.layers.findIndex(l => l.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderLayers(oldIndex, newIndex);
      }
    }
  };

  const handleRename = (layerId: string, newName: string) => {
    updateLayer(layerId, { name: newName });
    setEditingLayerId(null);
  };

  // Reverse the layers for display (top of list = front)
  const displayLayers = [...template.layers].reverse();

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={20} />
            <h2 className="font-semibold">Layers</h2>
          </div>
          <span className="text-sm text-gray-500">{template.layers.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {template.layers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No layers yet</p>
            <p className="text-xs mt-1">Add a layer to get started</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayLayers.map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="p-2">
                {displayLayers.map((layer) => (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    isSelected={layer.id === selectedLayerId}
                    isEditing={layer.id === editingLayerId}
                    onSelect={() => selectLayer(layer.id)}
                    onToggleVisibility={() => toggleLayerVisibility(layer.id)}
                    onToggleLock={() => toggleLayerLock(layer.id)}
                    onDelete={() => deleteLayer(layer.id)}
                    onDuplicate={() => duplicateLayer(layer.id)}
                    onStartEdit={() => setEditingLayerId(layer.id)}
                    onRename={handleRename}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;