import React, { useState, useRef } from 'react';
import { 
  Calendar, HardDrive, Server, ChevronDown, ChevronUp, 
  Download, FileText, Loader2, Database, FileInput, CloudUpload, Upload 
} from 'lucide-react';
import { FaWordpress } from 'react-icons/fa';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

const MigrationCard = ({ 
  migration, 
  isDarkMode, 
  onDownloadFile, 
  isDownloading,
  onMigrationUpdate // New prop to handle migration updates
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({ sql: null, wp: null });
  const [localMigration, setLocalMigration] = useState(migration); // Local state for immediate updates
  const sqlFileInputRef = useRef(null);
  const wpFileInputRef = useRef(null);

  // Update local state when migration prop changes
  React.useEffect(() => {
    setLocalMigration(migration);
  }, [migration]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileChange = (type, e) => {
    setSelectedFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
  };

  const handleUpload = async () => {
    if (!selectedFiles.sql && !selectedFiles.wp) return;
    
    setUploading(true);
    try {
      const uploadResults = [];
      
      // Upload SQL file if selected
      if (selectedFiles.sql) {
        const result = await onUploadFile(localMigration.migrationId, selectedFiles.sql, 'sql');
        uploadResults.push({ type: 'sql', result });
      }
      
      // Upload WP file if selected
      if (selectedFiles.wp) {
        const result = await onUploadFile(localMigration.migrationId, selectedFiles.wp, 'wp');
        uploadResults.push({ type: 'wp', result });
      }
      
      // Update local migration state immediately with uploaded file info
      const updatedMigration = { ...localMigration };
      
      uploadResults.forEach(({ type, result }) => {
        if (result?.data?.files) {
          if (type === 'sql' && result.data.files.sql) {
            updatedMigration.sql_dump = result.data.files.sql.name;
            updatedMigration.originalFilenames = {
              ...updatedMigration.originalFilenames,
              sql_dump: result.data.files.sql.name
            };
            updatedMigration.fileSize = {
              ...updatedMigration.fileSize,
              sql_dump: selectedFiles.sql.size
            };
          }
          
          if (type === 'wp' && result.data.files.wpConfig) {
            updatedMigration.wp_archive = result.data.files.wpConfig.name;
            updatedMigration.originalFilenames = {
              ...updatedMigration.originalFilenames,
              wp_archive: result.data.files.wpConfig.name
            };
            updatedMigration.fileSize = {
              ...updatedMigration.fileSize,
              wp_archive: selectedFiles.wp.size
            };
          }
        }
      });
      
      // Update local state
      setLocalMigration(updatedMigration);
      
      // Notify parent component about the update
      if (onMigrationUpdate) {
        onMigrationUpdate(localMigration.migrationId, updatedMigration);
      }
      
      // Clear selected files and reset inputs
      setSelectedFiles({ sql: null, wp: null });
      if (sqlFileInputRef.current) sqlFileInputRef.current.value = '';
      if (wpFileInputRef.current) wpFileInputRef.current.value = '';
      
      toast.success('Files uploaded successfully! Migration updated.');
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onUploadFile = async (migrationId, file, type) => {
    const formData = new FormData();
    
    // Match the backend expected field names
    if (type === 'sql') {
      formData.append('sql_dump', file);
    } else {
      formData.append('wp_archives', file); // Changed from 'wp_archives' to 'wp_archive'
    }
    
    const fileTypeName = type === 'sql' ? 'SQL database' : 'WordPress files';
    let uploadToastId = null;

    try {
      const response = await axiosInstance.post(`/migrate/upload/${migrationId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          
          if (uploadToastId) {
            toast.loading(`Uploading ${fileTypeName}: ${percentCompleted}%`, { 
              id: uploadToastId 
            });
          } else {
            uploadToastId = toast.loading(`Uploading ${fileTypeName}: ${percentCompleted}%`);
          }
        },
      });

      // Dismiss the loading toast
      if (uploadToastId) {
        toast.dismiss(uploadToastId);
      }
      
      console.log(`${type.toUpperCase()} upload response:`, response.data);
      return response;
      
    } catch (error) {
      // Dismiss the loading toast on error
      if (uploadToastId) {
        toast.dismiss(uploadToastId);
      }
      
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-200';
      case 'in_progress': return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-200';
      case 'failed': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-200';
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-yellow-200';
      default: return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white border-slate-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'wordpress': return <FaWordpress className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'partial': return <FileInput className="h-4 w-4" />;
      default: return <CloudUpload className="h-4 w-4" />;
    }
  };

  // Use local migration state for rendering
  const hasSqlFile = localMigration.sql_dump;
  const hasWpFile = localMigration.wp_archive;
  const showUploadButton = (!hasSqlFile && selectedFiles.sql) || (!hasWpFile && selectedFiles.wp);

  return (
    <div className={`
      p-5 rounded-xl border backdrop-blur-sm transition-all duration-200
      ${isDarkMode 
        ? 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50' 
        : 'bg-white/30 border-slate-200/50 hover:bg-white/50'
      }
    `}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-600/20 to-purple-700/20">
              {getTypeIcon(localMigration.migrationStack)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {localMigration.name}
                </h4>
                <span className='text-sm'>ID: {localMigration.migrationId}</span>
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className={`
                    p-1 rounded-md
                    ${isDarkMode ? 'hover:bg-slate-600/50' : 'hover:bg-slate-200/50'}
                  `}
                >
                  {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(localMigration.status)}`}>
                  {localMigration.status === 'in_progress' ? 'In Progress...' : 
                   localMigration.status === 'pending' ? 'Files Ready' : 
                   localMigration.status}
                </span>
                {/* Show file status indicators */}
                {(hasSqlFile || hasWpFile) && (
                  <div className="flex gap-1">
                    {hasSqlFile && (
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 border border-green-200">
                        SQL ✓
                      </span>
                    )}
                    {hasWpFile && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 border border-blue-200">
                        WP ✓
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs mb-3">
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Calendar className="h-3 w-3" />
              <span>{formatDate(localMigration.createdAt)}</span>
            </div>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Database className="h-3 w-3" />
              <span className={hasSqlFile ? 'text-green-600 font-medium' : ''}>
                {hasSqlFile ? 'SQL available' : 'No SQL file'}
              </span>
            </div>
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <FaWordpress className="h-3 w-3" />
              <span className={hasWpFile ? 'text-blue-600 font-medium' : ''}>
                {hasWpFile ? 'WP files available' : 'No WP files'}
              </span>
            </div>
          </div>

          {showDetails && (
            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'}`}>
              <h5 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Migration Files
              </h5>
              
              {/* SQL File Section */}
              <div className="mb-4">
                <h6 className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Database SQL File
                </h6>
                {hasSqlFile ? (
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} border ${isDarkMode ? 'border-green-700/50' : 'border-green-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                        <FileText className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{localMigration.originalFilenames?.sql_dump || 'database.sql'}</div>
                          {localMigration.fileSize?.sql_dump && (
                            <div className="text-xs opacity-75">
                              {(localMigration.fileSize.sql_dump / 1024 / 1024).toFixed(2)} MB
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onDownloadFile(localMigration.id, localMigration.sql_dump, 'sql')}
                        disabled={isDownloading?.migrationId === localMigration.id && isDownloading?.type === 'sql'}
                        className={`
                          flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 
                          ${isDarkMode 
                            ? 'bg-green-600/50 hover:bg-green-700/50 text-white' 
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {isDownloading?.migrationId === localMigration.id && isDownloading?.type === 'sql' ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className={`
                      flex-1 p-3 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
                      ${isDarkMode 
                        ? 'border-slate-600 hover:border-indigo-500 bg-slate-700/30 hover:bg-slate-700/50' 
                        : 'border-slate-300 hover:border-indigo-400 bg-white/50 hover:bg-indigo-50/50'
                      }
                    `}>
                      <Upload className={`h-5 w-5 mb-2 ${selectedFiles.sql ? 'text-indigo-500' : ''}`} />
                      <span className="text-sm">
                        {selectedFiles.sql ? 'SQL file selected' : 'Select SQL file (.sql, .sql.gz)'}
                      </span>
                      <input 
                        type="file" 
                        ref={sqlFileInputRef}
                        onChange={(e) => handleFileChange('sql', e)}
                        className="hidden"
                        accept=".sql,.sql.gz,.gz,.dump,.db"
                      />
                    </label>
                    {selectedFiles.sql && (
                      <div className={`p-2 rounded ${isDarkMode ? 'bg-indigo-900/20 border border-indigo-700/50' : 'bg-indigo-50 border border-indigo-200'}`}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate font-medium">{selectedFiles.sql.name}</span>
                          <span className="text-xs opacity-75">{(selectedFiles.sql.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* WordPress Files Section */}
              <div>
                <h6 className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  WordPress Archive
                </h6>
                {hasWpFile ? (
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDarkMode ? 'border-blue-700/50' : 'border-blue-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        <FileText className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{localMigration.originalFilenames?.wp_archive || 'wordpress.zip'}</div>
                          {localMigration.fileSize?.wp_archive && (
                            <div className="text-xs opacity-75">
                              {(localMigration.fileSize.wp_archive / 1024 / 1024).toFixed(2)} MB
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onDownloadFile(localMigration.id, localMigration.wp_archive, 'wp')}
                        disabled={isDownloading?.migrationId === localMigration.id && isDownloading?.type === 'wp'}
                        className={`
                          flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 
                          ${isDarkMode 
                            ? 'bg-blue-600/50 hover:bg-blue-700/50 text-white' 
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {isDownloading?.migrationId === localMigration.id && isDownloading?.type === 'wp' ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className={`
                      flex-1 p-3 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
                      ${isDarkMode 
                        ? 'border-slate-600 hover:border-indigo-500 bg-slate-700/30 hover:bg-slate-700/50' 
                        : 'border-slate-300 hover:border-indigo-400 bg-white/50 hover:bg-indigo-50/50'
                      }
                    `}>
                      <Upload className={`h-5 w-5 mb-2 ${selectedFiles.wp ? 'text-indigo-500' : ''}`} />
                      <span className="text-sm">
                        {selectedFiles.wp ? 'WordPress archive selected' : 'Select WordPress archive (.zip)'}
                      </span>
                      <input 
                        type="file" 
                        ref={wpFileInputRef}
                        onChange={(e) => handleFileChange('wp', e)}
                        className="hidden"
                        accept=".zip,.tar.gz"
                      />
                    </label>
                    {selectedFiles.wp && (
                      <div className={`p-2 rounded ${isDarkMode ? 'bg-indigo-900/20 border border-indigo-700/50' : 'bg-indigo-50 border border-indigo-200'}`}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate font-medium">{selectedFiles.wp.name}</span>
                          <span className="text-xs opacity-75">{(selectedFiles.wp.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Combined Upload Button */}
              {showUploadButton && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`
                    w-full mt-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200
                    ${isDarkMode 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                  `}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading Files...
                    </>
                  ) : (
                    <>
                      <CloudUpload className="h-4 w-4" />
                      Upload Selected Files
                      {selectedFiles.sql && selectedFiles.wp ? ' (Both)' : 
                       selectedFiles.sql ? ' (SQL)' : ' (WordPress)'}
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <button className='p-4 bg-blue-400 rounded-xl'>Initiate Migration</button> 
    </div>
  );
};

export default MigrationCard;