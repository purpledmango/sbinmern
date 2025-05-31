import React, { useState } from 'react';
import { 
  Shield, 
  Download, 
  Upload,
  Calendar, 
  Clock, 
  HardDrive, 
  RefreshCw, 
  Trash2, 
  Plus, 
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Database,
  FileText,
  Archive,
  CloudDownload,
  CloudUpload
} from 'lucide-react';

const Backup = ({isDarkMode}) => {
//   const [isDarkMode] = useState(true);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupName, setBackupName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isRestoring, setIsRestoring] = useState(null);
  const [selectedBackupType, setSelectedBackupType] = useState('full');
  const [showSettings, setShowSettings] = useState(false);

  // Mock backup data
  const [backups, setBackups] = useState([
    {
      id: 1,
      name: 'Pre-migration full backup',
      type: 'full',
      size: '4.7 GB',
      createdAt: '2024-05-28T10:30:00Z',
      status: 'completed',
      location: 'cloud',
      retention: '30 days',
      includes: ['database', 'files', 'plugins', 'themes']
    },
    {
      id: 2,
      name: 'Daily database backup',
      type: 'database',
      size: '250 MB',
      createdAt: '2024-05-29T02:00:00Z',
      status: 'completed',
      location: 'local',
      retention: '7 days',
      includes: ['database']
    },
    {
      id: 3,
      name: 'Weekly files backup',
      type: 'files',
      size: '3.2 GB',
      createdAt: '2024-05-30T14:15:00Z',
      status: 'in_progress',
      location: 'cloud',
      retention: '90 days',
      includes: ['files', 'uploads']
    },
    {
      id: 4,
      name: 'Plugin update backup',
      type: 'incremental',
      size: '180 MB',
      createdAt: '2024-05-30T16:45:00Z',
      status: 'failed',
      location: 'local',
      retention: '14 days',
      includes: ['plugins', 'database']
    }
  ]);

  const backupTypes = [
    { id: 'full', name: 'Full Backup', description: 'Complete site backup including database and files' },
    { id: 'database', name: 'Database Only', description: 'WordPress database backup only' },
    { id: 'files', name: 'Files Only', description: 'Website files, themes, and plugins' },
    { id: 'incremental', name: 'Incremental', description: 'Only changes since last backup' }
  ];

  const handleCreateBackup = async () => {
    if (!backupName.trim()) return;
    
    setIsCreatingBackup(true);
    
    // Simulate API call
    setTimeout(() => {
      const newBackup = {
        id: backups.length + 1,
        name: backupName,
        type: selectedBackupType,
        size: selectedBackupType === 'full' ? '4.2 GB' : selectedBackupType === 'database' ? '240 MB' : '2.1 GB',
        createdAt: new Date().toISOString(),
        status: 'completed',
        location: 'cloud',
        retention: '30 days',
        includes: selectedBackupType === 'full' ? ['database', 'files', 'plugins', 'themes'] : [selectedBackupType]
      };
      
      setBackups([newBackup, ...backups]);
      setBackupName('');
      setShowCreateForm(false);
      setIsCreatingBackup(false);
    }, 3000);
  };

  const handleRestoreBackup = (backupId) => {
    setIsRestoring(backupId);
    
    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(null);
    }, 4000);
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
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-200';
      case 'in_progress':
        return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-200';
      case 'failed':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-200';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white border-slate-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'full':
        return <Archive className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'files':
        return <FileText className="h-4 w-4" />;
      case 'incremental':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getLocationIcon = (location) => {
    return location === 'cloud' ? <CloudDownload className="h-3 w-3" /> : <HardDrive className="h-3 w-3" />;
  };

  return (
    <div className={`
      p-6 rounded-xl border backdrop-blur-sm
      ${isDarkMode 
        ? 'bg-slate-800/90 border-slate-700/50 shadow-2xl shadow-purple-500/10' 
        : 'bg-white/90 border-slate-200/50 shadow-2xl shadow-indigo-500/10'
      }
    `}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Backup Management
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Secure your deployment data
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`
              p-2 rounded-lg transition-all duration-200 hover:scale-105
              ${isDarkMode 
                ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300' 
                : 'bg-slate-100/50 hover:bg-slate-200/50 text-slate-600'
              }
            `}
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
              bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 
              text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-105
            "
          >
            <Plus className="h-4 w-4" />
            Create Backup
          </button>
        </div>
      </div>

      {/* Backup Settings */}
      {showSettings && (
        <div className={`
          mb-6 p-4 rounded-xl border backdrop-blur-sm
          ${isDarkMode 
            ? 'bg-slate-700/30 border-slate-600/50' 
            : 'bg-indigo-50/30 border-indigo-200/50'
          }
        `}>
          <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Settings className="h-4 w-4" />
            Backup Settings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Automated Backups
              </label>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-600/20 to-slate-700/20">
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Daily at 2:00 AM UTC
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-purple-700"></div>
                </label>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Retention Policy
              </label>
              <select className={`
                w-full px-3 py-2 rounded-lg border text-sm
                ${isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600 text-white' 
                  : 'bg-white/50 border-slate-300 text-slate-900'
                }
              `}>
                <option value="7">Keep for 7 days</option>
                <option value="30" selected>Keep for 30 days</option>
                <option value="90">Keep for 90 days</option>
                <option value="365">Keep for 1 year</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Create Backup Form */}
      {showCreateForm && (
        <div className={`
          mb-6 p-5 rounded-xl border backdrop-blur-sm
          ${isDarkMode 
            ? 'bg-slate-700/30 border-slate-600/50' 
            : 'bg-purple-50/30 border-purple-200/50'
          }
        `}>
          <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Plus className="h-4 w-4" />
            Create New Backup
          </h4>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Backup Name
              </label>
              <input
                type="text"
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="Enter backup name"
                className={`
                  w-full px-4 py-3 rounded-lg border text-sm backdrop-blur-sm transition-all duration-200
                  ${isDarkMode 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500' 
                    : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-500'
                  }
                `}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Backup Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {backupTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`
                      flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
                      ${selectedBackupType === type.id
                        ? 'border-purple-500 bg-gradient-to-r from-indigo-600/10 to-purple-700/10'
                        : isDarkMode
                          ? 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                          : 'border-slate-300 bg-white/50 hover:border-slate-400'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="backupType"
                      value={type.id}
                      checked={selectedBackupType === type.id}
                      onChange={(e) => setSelectedBackupType(e.target.value)}
                      className="mt-1 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(type.id)}
                        <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {type.name}
                        </span>
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {type.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreateBackup}
                disabled={isCreatingBackup || !backupName.trim()}
                className="
                  flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 
                  bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 
                  text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed
                  hover:scale-105
                "
              >
                {isCreatingBackup ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                {isCreatingBackup ? 'Creating Backup...' : 'Create Backup'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setBackupName('');
                }}
                className={`
                  px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105
                  ${isDarkMode 
                    ? 'bg-slate-600/50 hover:bg-slate-500/50 text-white' 
                    : 'bg-slate-200/50 hover:bg-slate-300/50 text-slate-700'
                  }
                `}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backups List */}
      <div className="space-y-4">
        {backups.length === 0 ? (
          <div className={`
            text-center py-12 rounded-xl
            ${isDarkMode ? 'bg-slate-700/20' : 'bg-slate-50/50'}
          `}>
            <div className="p-4 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-700/20 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-indigo-500" />
            </div>
            <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              No backups created yet
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Create your first backup to secure your deployment data
            </p>
          </div>
        ) : (
          backups.map((backup) => (
            <div
              key={backup.id}
              className={`
                p-5 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.01]
                ${isDarkMode 
                  ? 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50' 
                  : 'bg-white/30 border-slate-200/50 hover:bg-white/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-600/20 to-purple-700/20">
                      {getTypeIcon(backup.type)}
                    </div>
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {backup.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium border
                          ${getStatusColor(backup.status)}
                        `}>
                          {backup.status === 'in_progress' ? 'Creating...' : backup.status}
                        </span>
                        <span className={`
                          px-2 py-1 rounded-md text-xs font-medium capitalize
                          ${isDarkMode 
                            ? 'bg-slate-600/50 text-slate-300' 
                            : 'bg-slate-100/50 text-slate-600'
                          }
                        `}>
                          {backup.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(backup.createdAt)}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <HardDrive className="h-3 w-3" />
                      <span>{backup.size}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {getLocationIcon(backup.location)}
                      <span className="capitalize">{backup.location}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Clock className="h-3 w-3" />
                      <span>{backup.retention}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {backup.includes.map((item, index) => (
                      <span
                        key={index}
                        className={`
                          px-2 py-1 rounded-md text-xs
                          ${isDarkMode 
                            ? 'bg-indigo-600/20 text-indigo-300' 
                            : 'bg-indigo-100/50 text-indigo-700'
                          }
                        `}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {backup.status === 'completed' && (
                    <>
                      <button
                        onClick={() => handleRestoreBackup(backup.id)}
                        disabled={isRestoring === backup.id}
                        className="
                          flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 
                          bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 
                          text-white shadow-lg shadow-emerald-500/25 hover:scale-105
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        {isRestoring === backup.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Upload className="h-3 w-3" />
                        )}
                        {isRestoring === backup.id ? 'Restoring...' : 'Restore'}
                      </button>
                      
                      <button className="
                        flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 
                        bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 
                        text-white shadow-lg shadow-purple-500/25 hover:scale-105
                      ">
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    </>
                  )}
                  
                  <button className="
                    flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 
                    bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 
                    text-white shadow-lg shadow-red-500/25 hover:scale-105
                  ">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Backup;