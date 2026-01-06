import React from 'react';
import { X, Download, Upload, AlertCircle } from 'lucide-react';
import { templateService } from '../../services/templateService';

interface Props {
  onClose: () => void;
}

const BackupModal: React.FC<Props> = ({ onClose }) => {
  const handleExportAll = async () => {
    try {
      const templates = await templateService.listTemplates();
      const backup = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        templates: templates
      };
      
      const dataStr = JSON.stringify(backup, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `all_templates_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert(`Exported ${templates.length} templates successfully!`);
    } catch (error) {
      alert('Failed to export templates');
      console.error(error);
    }
  };

  const handleImportAll = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        try {
          const backup = JSON.parse(e.target.result);
          
          if (!backup.templates || !Array.isArray(backup.templates)) {
            alert('Invalid backup file format');
            return;
          }
          
          // Import each template
          for (const template of backup.templates) {
            await templateService.createTemplate(template);
          }
          
          alert(`Imported ${backup.templates.length} templates successfully!`);
          window.location.reload(); // Refresh to show new templates
        } catch (error) {
          alert('Failed to import templates. Please check the file format.');
          console.error(error);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Backup & Restore Templates</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="font-semibold text-yellow-900 mb-1">Important: Templates are stored locally</p>
              <p className="text-yellow-700">
                Your templates are saved in your browser's localStorage. They are NOT synced to the cloud.
                Use these backup options to save your work permanently:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Export All Templates</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download all your templates as a single JSON file for backup
            </p>
            <button
              onClick={handleExportAll}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export All Templates
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Import Templates</h3>
            <p className="text-sm text-gray-600 mb-4">
              Restore templates from a previously exported backup file
            </p>
            <button
              onClick={handleImportAll}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              Import from Backup
            </button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Tips for Not Losing Your Work:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Export your templates regularly as JSON backups</li>
            <li>• Save important templates to your computer</li>
            <li>• Templates persist in the same browser on the same device</li>
            <li>• Clearing browser data will delete all templates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BackupModal;