import React, { useState } from 'react';
import useEditorStore from './store/editor';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import TopNavBar from './components/Layout/TopNavBar';
import LeftSidebar from './components/Layout/LeftSidebar';
import CanvasArea from './components/Layout/CanvasArea';
import RightPanel from './components/Layout/RightPanel';
import './styles/design-system.css';

function AppNew() {
  useKeyboardShortcuts();
  const [activePanel, setActivePanel] = useState<'properties' | 'layers'>('properties');
  
  return (
    <div className="app-layout">
      <TopNavBar />
      
      <div className="main-content">
        <LeftSidebar />
        <CanvasArea />
        <RightPanel activeTab={activePanel} onTabChange={setActivePanel} />
      </div>
    </div>
  );
}

export default AppNew;