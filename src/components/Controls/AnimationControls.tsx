import React from 'react';
import { TextLayer } from '../../types';
import { Play, Pause, RefreshCw, Type, Sparkles, MoveHorizontal } from 'lucide-react';

interface AnimationControlsProps {
  layer: TextLayer;
  onUpdate: (updates: Partial<TextLayer>) => void;
  onPreview?: () => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({ layer, onUpdate, onPreview }) => {
  const animation = layer.animation || { type: 'none' };
  
  const handleAnimationTypeChange = (type: 'none' | 'typewriter' | 'fade' | 'slide') => {
    const newAnimation = { ...animation, type };
    
    // Set default values for each animation type
    if (type === 'typewriter' && !animation.typewriter) {
      newAnimation.typewriter = {
        enabled: true,
        duration: 3,
        startDelay: 0,
        charDelay: 50,
        cursor: true,
        cursorChar: '|'
      };
    } else if (type === 'fade' && !animation.fade) {
      newAnimation.fade = {
        enabled: true,
        duration: 1,
        startDelay: 0
      };
    } else if (type === 'slide' && !animation.slide) {
      newAnimation.slide = {
        enabled: true,
        duration: 1,
        startDelay: 0,
        direction: 'left'
      };
    }
    
    onUpdate({ animation: newAnimation });
  };
  
  const updateTypewriterSettings = (settings: Partial<NonNullable<TextLayer['animation']>['typewriter']>) => {
    onUpdate({
      animation: {
        ...animation,
        typewriter: {
          enabled: true,
          duration: 3,
          startDelay: 0,
          ...animation.typewriter,
          ...settings
        } as NonNullable<TextLayer['animation']>['typewriter']
      }
    });
  };
  
  const updateFadeSettings = (settings: Partial<NonNullable<TextLayer['animation']>['fade']>) => {
    onUpdate({
      animation: {
        ...animation,
        fade: {
          enabled: true,
          duration: 1,
          startDelay: 0,
          ...animation.fade,
          ...settings
        } as NonNullable<TextLayer['animation']>['fade']
      }
    });
  };
  
  const updateSlideSettings = (settings: Partial<NonNullable<TextLayer['animation']>['slide']>) => {
    onUpdate({
      animation: {
        ...animation,
        slide: {
          enabled: true,
          duration: 1,
          startDelay: 0,
          direction: 'left' as const,
          ...animation.slide,
          ...settings
        } as NonNullable<TextLayer['animation']>['slide']
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Animation Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAnimationTypeChange('none')}
            className={`px-3 py-2 text-xs rounded border transition-colors ${
              animation.type === 'none'
                ? 'bg-purple-50 border-purple-500 text-purple-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            None
          </button>
          <button
            onClick={() => handleAnimationTypeChange('typewriter')}
            className={`px-3 py-2 text-xs rounded border transition-colors flex items-center justify-center gap-1 ${
              animation.type === 'typewriter'
                ? 'bg-purple-50 border-purple-500 text-purple-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Type size={14} />
            Typewriter
          </button>
          <button
            onClick={() => handleAnimationTypeChange('fade')}
            className={`px-3 py-2 text-xs rounded border transition-colors flex items-center justify-center gap-1 ${
              animation.type === 'fade'
                ? 'bg-purple-50 border-purple-500 text-purple-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Sparkles size={14} />
            Fade
          </button>
          <button
            onClick={() => handleAnimationTypeChange('slide')}
            className={`px-3 py-2 text-xs rounded border transition-colors flex items-center justify-center gap-1 ${
              animation.type === 'slide'
                ? 'bg-purple-50 border-purple-500 text-purple-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <MoveHorizontal size={14} />
            Slide
          </button>
        </div>
      </div>

      {animation.type === 'typewriter' && animation.typewriter && (
        <div className="space-y-3 p-3 bg-purple-50 rounded-lg">
          <h4 className="text-xs font-semibold text-purple-900">Typewriter Settings</h4>
          
          <div>
            <label className="block text-xs text-gray-700 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              min="0.1"
              max="30"
              step="0.1"
              value={animation.typewriter.duration}
              onChange={(e) => updateTypewriterSettings({ duration: parseFloat(e.target.value) })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Time for all {layer.text.length} characters to appear
            </p>
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">
              Start Delay (seconds)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={animation.typewriter.startDelay}
              onChange={(e) => updateTypewriterSettings({ startDelay: parseFloat(e.target.value) })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">
              Character Delay (ms)
            </label>
            <input
              type="number"
              min="0"
              max="500"
              step="10"
              value={animation.typewriter.charDelay || 50}
              onChange={(e) => updateTypewriterSettings({ charDelay: parseInt(e.target.value) })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Milliseconds between each character
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cursor"
              checked={animation.typewriter.cursor}
              onChange={(e) => updateTypewriterSettings({ cursor: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="cursor" className="text-xs text-gray-700">
              Show typing cursor
            </label>
          </div>

          {animation.typewriter.cursor && (
            <div>
              <label className="block text-xs text-gray-700 mb-1">
                Cursor Character
              </label>
              <input
                type="text"
                maxLength={1}
                value={animation.typewriter.cursorChar || '|'}
                onChange={(e) => updateTypewriterSettings({ cursorChar: e.target.value || '|' })}
                className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center"
              />
            </div>
          )}
        </div>
      )}

      {animation.type === 'fade' && animation.fade && (
        <div className="space-y-3 p-3 bg-purple-50 rounded-lg">
          <h4 className="text-xs font-semibold text-purple-900">Fade Settings</h4>
          
          <div>
            <label className="block text-xs text-gray-700 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={animation.fade.duration}
              onChange={(e) => updateFadeSettings({ duration: parseFloat(e.target.value) })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">
              Start Delay (seconds)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={animation.fade.startDelay}
              onChange={(e) => updateFadeSettings({ startDelay: parseFloat(e.target.value) })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            />
          </div>
        </div>
      )}

      {animation.type === 'slide' && animation.slide && (
        <div className="space-y-3 p-3 bg-purple-50 rounded-lg">
          <h4 className="text-xs font-semibold text-purple-900">Slide Settings</h4>
          
          <div>
            <label className="block text-xs text-gray-700 mb-1">
              Direction
            </label>
            <select
              value={animation.slide.direction}
              onChange={(e) => updateSlideSettings({ direction: e.target.value as 'left' | 'right' | 'top' | 'bottom' })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            >
              <option value="left">From Left</option>
              <option value="right">From Right</option>
              <option value="top">From Top</option>
              <option value="bottom">From Bottom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-700 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={animation.slide.duration}
              onChange={(e) => updateSlideSettings({ duration: parseFloat(e.target.value) })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">
              Start Delay (seconds)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={animation.slide.startDelay}
              onChange={(e) => updateSlideSettings({ startDelay: parseFloat(e.target.value) })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
            />
          </div>
        </div>
      )}

      {animation.type !== 'none' && onPreview && (
        <button
          onClick={onPreview}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <Play size={16} />
          Preview Animation
        </button>
      )}
    </div>
  );
};

export default AnimationControls;