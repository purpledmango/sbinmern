import React, { useState } from 'react';
import { 
  Plus, 
  CloudUpload, 
  Loader2, 
  Server, 
  Database, 
  FileInput,
  ChevronDown
} from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';


const MigrationForm = ({ isDarkMode, isCreatingMigration, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    migrationStack: ''
  });
  const [creatingMigration, setIsCreatingMigration] = useState(false);

  const migrationStacks = [
    { value: 'wordpress', label: 'WordPress' },
    { value: 'magento', label: 'Magento' }
  ];

  const migrationTypes = [
    { id: 'wordpress', name: 'WordPress Site', description: 'Complete WordPress site migration including database and files' },
    { id: 'database', name: 'Database Only', description: 'WordPress database migration only' },
    { id: 'partial', name: 'Partial Migration', description: 'Specific components like plugins or themes' }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'wordpress':
        return <Server className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'partial':
        return <FileInput className="h-4 w-4" />;
      default:
        return <CloudUpload className="h-4 w-4" />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    createNewMigration();

  };


  const createNewMigration = async () => {
  try {
    setIsCreatingMigration(true);
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("uid");
    console.log("data captured from Form", formData)
    if (!token || !uid) {
      throw new Error("Authentication required");
    }

    const response = await axiosInstance.post(
      "/migrate/create",
      {...formData},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 201) {
      console.log("Migration created:", response.data);
      await fetchAllMigrations();  // Refresh the list
      setShowCreateForm(false);    // Close the form
      // Reset form states if needed
      // setMigrationName('');
      // setTargetInstance('');
    }

  } catch (error) {
    console.error("Migration error:", error.response?.data || error.message);
    // Simple error display (could use state or toast)
    
  } finally {
    setIsCreatingMigration(false);
  }
};

  return (
    <div className={`
      mb-6 p-5 rounded-xl border backdrop-blur-sm
      ${isDarkMode 
        ? 'bg-slate-700/30 border-slate-600/50' 
        : 'bg-purple-50/30 border-purple-200/50'
      }
    `}>
      <h4 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        <Plus className="h-4 w-4" />
        Create New Migration
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Migration Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Production to Staging"
            className={`
              w-full px-4 py-3 rounded-lg border text-sm backdrop-blur-sm transition-all duration-200
              ${isDarkMode 
                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500' 
                : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-indigo-500'
              }
            `}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Migration Stack
          </label>
          <div className="relative">
            <select
              name="migrationStack"
              value={formData.migrationStack}
              onChange={handleInputChange}
              className={`
                w-full px-4 py-3 rounded-lg border text-sm backdrop-blur-sm transition-all duration-200 appearance-none
                ${isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600 text-white focus:border-purple-500' 
                  : 'bg-white/50 border-slate-300 text-slate-900 focus:border-indigo-500'
                }
              `}
              required
            >
              <option value="">Select Migration Stack</option>
              {migrationStacks.map((stack) => (
                <option key={stack.value} value={stack.value}>
                  {stack.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* <div>
          <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Migration Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {migrationTypes.map((type) => (
              <label
                key={type.id}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
                  ${formData.migrationType === type.id
                    ? isDarkMode
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-indigo-500 bg-indigo-50/50'
                    : isDarkMode
                      ? 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                      : 'border-slate-300 bg-white/50 hover:border-slate-400'
                  }
                `}
              >
                <input
                  type="radio"
                  name="migrationType"
                  value={type.id}
                  checked={formData.migrationType === type.id}
                  onChange={handleInputChange}
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
        </div> */}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isCreatingMigration}
            className="
              flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 
              bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 
              text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-105
            "
          >
            {isCreatingMigration ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CloudUpload className="h-4 w-4" />
            )}
            {isCreatingMigration ? 'Creating Migration...' : 'Start Migration'}
          </button>
          <button
            type="button"
            onClick={onClose}
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
      </form>
    </div>
  );
};

export default MigrationForm;