import React, { useEffect, useState } from 'react';
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
  CloudUpload,
  Server,
  FileInput
} from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import MigrationCard from './MigrationCard';
import MigrationForm from './MigrationForm';
import { m } from 'framer-motion';
import Spinner from './Spinner';

const Migrate = ({ isDarkMode }) => {
  localStorage.setItem("currentPage", "migrate");
  const [isCreatingMigration, setIsCreatingMigration] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Changed to true initially
  const [migrations, setMigrations] = useState([]);

  useEffect(() => {
    fetchAllMigrations();
  }, []);

  const fetchAllMigrations = async () => {
    try {
      setIsLoading(true); // Set loading to true when fetching starts
      const uid = localStorage.getItem("uid");
      const token = localStorage.getItem("token");
      
      if (!uid || !token) {
        throw new Error("Authentication required - missing UID or token");
      }

      const response = await axiosInstance.get(`/migrate/all/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }           
      });
      
      if (response.data && response.data.data) {
        setMigrations(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }
      
    } catch (error) {
      console.error("Failed to fetch migrations:", error);
      // You might want to add error state handling here
    } finally {
      setIsLoading(false); // Set loading to false when done (success or error)
    }
  };

  const handleDownloadFile = async (migrationId, filename) => {
    setIsDownloading({ migrationId, filename });
    
    // Simulate API call
    setTimeout(() => {
      setIsDownloading(null);
      console.log(`Downloading ${filename} from migration ${migrationId}`);
    }, 2000);
  };

  const handleCreateMigration = async (formData) => {
    setIsCreatingMigration(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the new migration to the list
      const newMigration = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.migrationType,
        stack: formData.migrationStack,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        instanceName: 'new-instance',
        files: []
      };
      
      setMigrations(prev => [newMigration, ...prev]);
      setShowCreateForm(false);
      
    } catch (error) {
      console.error("Failed to create migration:", error);
    } finally {
      setIsCreatingMigration(false);
    }
  };

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

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
            <CloudUpload className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Site Migrations
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Transfer your WordPress sites between environments
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
            bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 
            text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-105
          "
        >
          <Plus className="h-4 w-4" />
          New Migration
        </button>
      </div>

      {/* Create Migration Form */}
      {showCreateForm && (
        <MigrationForm
          isDarkMode={isDarkMode}
          isCreatingMigration={isCreatingMigration}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateMigration}
        />
      )}

      {/* Migrations List */}
      <div className="space-y-4">
        {migrations.length === 0 ? (
          <div className={`
            text-center py-12 rounded-xl
            ${isDarkMode ? 'bg-slate-700/20' : 'bg-slate-50/50'}
          `}>
            <div className="p-4 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-700/20 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <CloudUpload className="h-8 w-8 text-indigo-500" />
            </div>
            <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              No migrations created yet
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Create your first migration to transfer your WordPress site
            </p>
          </div>
        ) : (
          migrations.map((migration) => (
            <MigrationCard
              key={migration.id}
              migration={migration}
              isDarkMode={isDarkMode}
              onDownloadFile={handleDownloadFile}
              isDownloading={isDownloading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Migrate;