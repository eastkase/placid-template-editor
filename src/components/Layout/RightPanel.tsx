import React, { useState } from 'react';
import PropertiesPanel from '../Panels/PropertiesPanel';
import LayersPanel from '../Panels/LayersPanel';

interface RightPanelProps {
  activeTab: 'properties' | 'layers';
  onTabChange: (tab: 'properties' | 'layers') => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="right-panel">
      <div className="panel-tabs">
        <button
          className={`panel-tab ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => onTabChange('properties')}
        >
          Properties
        </button>
        <button
          className={`panel-tab ${activeTab === 'layers' ? 'active' : ''}`}
          onClick={() => onTabChange('layers')}
        >
          Layers
        </button>
      </div>
      
      <div className="panel-content">
        {activeTab === 'properties' ? <PropertiesPanel /> : <LayersPanel />}
      </div>
    </div>
  );
};

export default RightPanel;