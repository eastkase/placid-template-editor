import React from 'react';
import Canvas from './components/Canvas/Canvas';
import LayersPanel from './components/Layers/LayersPanel';
import PropertiesPanel from './components/Properties/PropertiesPanel';
import Toolbar from './components/Toolbar/Toolbar';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts();
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Layers */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-hidden">
          <LayersPanel />
        </div>

        {/* Main canvas area */}
        <div className="flex-1 overflow-hidden">
          <Canvas />
        </div>

        {/* Right sidebar - Properties */}
        <div className="w-80 border-l border-gray-200 bg-white overflow-hidden">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

export default App;