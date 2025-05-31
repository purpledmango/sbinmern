import React, { useState } from 'react';
import { 
  Camera, 
  Download, 
  Calendar, 
  Clock, 
  HardDrive, 
  Play, 
  Trash2, 
  Plus, 
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Snapshots = ({isDarkMode}) => {
//   const [isDarkMode] = useState(true);
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isRestoring, setIsRestoring] = useState(null);

  // Mock snapshot data
  const [snapshots, setSnapshots] = useState([
    {
      id: 1,
      name: 'Pre-update backup',
      description: 'Snapshot before WordPress 6.4 update',
      createdAt: '2024-05-28T10:30:00Z',
      size: '2.3 GB',
      status: 'completed',
      type: 'manual'
    },
    {
      id: 2,
      name: 'Daily automated backup',
      description: 'Automated daily snapshot',
      createdAt: '2024-05-29T02:00:00Z',
      size: '2.1 GB',
      status: 'completed',
      type: 'automated'
    },
    {
      id: 3,
      name: 'Theme customization checkpoint',
      description: 'Before major theme changes',
      createdAt: '2024-05-30T14:15:00Z',
      size: '2.4 GB',
      status: 'in_progress',
      type: 'manual'
    }
  ]);

  const handleCreateSnapshot = async () => {
    if (!snapshotName.trim()) return;
    
    setIsCreatingSnapshot(true);
    
    // Simulate API call
    setTimeout(() => {
      const newSnapshot = {
        id: snapshots.length + 1,
        name: snapshotName,
        description: 'Manual snapshot',
        createdAt: new Date().toISOString(),
        size: '2.2 GB',
        status: 'completed',
        type: 'manual'
      };
      
      setSnapshots([newSnapshot, ...snapshots]);
      setSnapshotName('');
      setShowCreateForm(false);
      setIsCreatingSnapshot(false);
    }, 2000);
  };

  const handleRestoreSnapshot = (snapshotId) => {
    setIsRestoring(snapshotId);
    
    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(null);
    }, 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`
      p-6 rounded-xl border
      ${isDarkMode 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-white border-slate-200'
      }
    `}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Deployment Snapshots
        </h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}
        >
          <Plus className="h-4 w-4" />
          Create Snapshot
        </button>
      </div>

      {/* Create Snapshot Form */}
      {showCreateForm && (
        <div className={`
          mb-6 p-4 rounded-lg border
          ${isDarkMode 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-slate-50 border-slate-200'
          }
        `}>
          <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Create New Snapshot
          </h4>
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Snapshot Name
              </label>
              <input
                type="text"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="Enter snapshot name"
                className={`
                  w-full px-3 py-2 rounded-lg border text-sm
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                  }
                `}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateSnapshot}
                disabled={isCreatingSnapshot || !snapshotName.trim()}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50
                  ${isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }
                `}
              >
                {isCreatingSnapshot ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {isCreatingSnapshot ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setSnapshotName('');
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isDarkMode 
                    ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }
                `}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snapshots List */}
      <div className="space-y-3">
        {snapshots.length === 0 ? (
          <div className={`
            text-center py-8
            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
          `}>
            <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No snapshots created yet</p>
            <p className="text-sm mt-1">Create your first snapshot to backup your deployment</p>
          </div>
        ) : (
          snapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className={`
                p-4 rounded-lg border transition-colors
                ${isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {snapshot.name}
                    </h4>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium border
                      ${getStatusColor(snapshot.status)}
                    `}>
                      {snapshot.status === 'in_progress' ? 'Creating...' : snapshot.status}
                    </span>
                    {snapshot.type === 'automated' && (
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${isDarkMode 
                          ? 'bg-slate-600 text-slate-300' 
                          : 'bg-slate-100 text-slate-600'
                        }
                      `}>
                        Auto
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {snapshot.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <div className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Calendar className="h-3 w-3" />
                      {formatDate(snapshot.createdAt)}
                    </div>
                    <div className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <HardDrive className="h-3 w-3" />
                      {snapshot.size}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {snapshot.status === 'completed' && (
                    <>
                      <button
                        onClick={() => handleRestoreSnapshot(snapshot.id)}
                        disabled={isRestoring === snapshot.id}
                        className={`
                          flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50
                          ${isDarkMode 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          }
                        `}
                      >
                        {isRestoring === snapshot.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                        {isRestoring === snapshot.id ? 'Restoring...' : 'Restore'}
                      </button>
                      
                      <button
                        className={`
                          flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                          ${isDarkMode 
                            ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          }
                        `}
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    </>
                  )}
                  
                  <button
                    className={`
                      flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                      ${isDarkMode 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                      }
                    `}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Snapshot Settings */}
      <div className={`
        mt-6 pt-6 border-t
        ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}
      `}>
        <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Automated Snapshots
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Automatically create daily snapshots at 2:00 AM UTC
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Keeps the last 7 automated snapshots
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Snapshots;