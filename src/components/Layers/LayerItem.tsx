import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  MoreVertical, 
  Trash2, 
  Copy, 
  GripVertical,
  Type,
  Image,
  Square,
  Video
} from 'lucide-react';
import { Layer } from '../../types';
import clsx from 'clsx';

interface Props {
  layer: Layer;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onStartEdit: () => void;
  onRename: (layerId: string, newName: string) => void;
}

const LayerItem: React.FC<Props> = ({
  layer,
  isSelected,
  isEditing,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onDelete,
  onDuplicate,
  onStartEdit,
  onRename
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [editName, setEditName] = useState(layer.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLayerIcon = () => {
    switch (layer.type) {
      case 'text':
        return <Type size={16} />;
      case 'image':
        return <Image size={16} />;
      case 'shape':
        return <Square size={16} />;
      case 'video':
        return <Video size={16} />;
      default:
        return null;
    }
  };

  const handleSubmitRename = () => {
    if (editName.trim() && editName !== layer.name) {
      onRename(layer.id, editName);
    } else {
      setEditName(layer.name);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'layer-item group',
        isSelected && 'selected',
        isDragging && 'dragging',
        'mb-1'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab hover:bg-gray-200 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>

        {/* Layer icon */}
        <div className="text-gray-600">
          {getLayerIcon()}
        </div>

        {/* Layer name */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSubmitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmitRename();
                } else if (e.key === 'Escape') {
                  setEditName(layer.name);
                  onRename(layer.id, layer.name);
                }
              }}
              className="w-full px-1 py-0 text-sm border border-purple-500 rounded outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className="text-sm truncate block cursor-pointer"
              onDoubleClick={(e) => {
                e.stopPropagation();
                onStartEdit();
              }}
            >
              {layer.name}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Visibility toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={layer.visible ? 'Hide layer' : 'Show layer'}
          >
            {layer.visible ? (
              <Eye size={16} className="text-gray-600" />
            ) : (
              <EyeOff size={16} className="text-gray-400" />
            )}
          </button>

          {/* Lock toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={layer.locked ? 'Unlock layer' : 'Lock layer'}
          >
            {layer.locked ? (
              <Lock size={16} className="text-gray-600" />
            ) : (
              <Unlock size={16} className="text-gray-400" />
            )}
          </button>

          {/* More menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[120px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Copy size={14} />
                  Duplicate
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic field indicator */}
      {layer.dynamicField && (
        <div className="ml-8 mt-1">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            {layer.dynamicField}
          </span>
        </div>
      )}
    </div>
  );
};

export default LayerItem;