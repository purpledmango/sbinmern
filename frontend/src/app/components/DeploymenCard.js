import { ArrowUpRight, Clock, Wrench, Loader2, Cloud, CloudOff, CloudLightning } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

const DeploymentCard = ({ deployment, isDarkMode = false }) => {
  const [currentDeployment, setCurrentDeployment] = useState(deployment);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [isLoading, setIsLoading] = useState(deployment.status !== 'completed');

  const statusColors = {
    online: isDarkMode ? 'bg-emerald-900/40 text-emerald-300 ring-emerald-800' : 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    offline: isDarkMode ? 'bg-rose-900/40 text-rose-300 ring-rose-800' : 'bg-rose-50 text-rose-700 ring-rose-200',
    maintenance: isDarkMode ? 'bg-amber-900/40 text-amber-300 ring-amber-800' : 'bg-amber-50 text-amber-700 ring-amber-200'
  };

  const platformColors = {
    WordPress: isDarkMode ? 'bg-blue-900/40 text-blue-300 ring-blue-800' : 'bg-blue-50 text-blue-700 ring-blue-200',
    Magento: isDarkMode ? 'bg-orange-900/40 text-orange-300 ring-orange-800' : 'bg-orange-50 text-orange-700 ring-orange-200',
    Custom: isDarkMode ? 'bg-purple-900/40 text-purple-300 ring-purple-800' : 'bg-purple-50 text-purple-700 ring-purple-200'
  };

  const fetchDeploymentStatus = async () => {
    try {
      setLoadingStatus(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/deploy/${deployment.deploymentId}`, {headers: {Authorization: `Bearer: ${token}`}});
      setCurrentDeployment(response.data.data);
      setLastChecked(new Date());
      
      if (response.data.data.status === 'completed') {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching deployment status:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (currentDeployment.status !== 'completed') {
      const interval = setInterval(fetchDeploymentStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [currentDeployment.status]);

  const handleManage = () => {
    console.log("Managing deployment:", currentDeployment);
  };

  // Status icon based on deployment state
  const StatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    switch (currentDeployment.status) {
      case 'completed':
        return <Cloud className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <CloudOff className="h-4 w-4 text-red-500" />;
      case 'in-progress':
        return <CloudLightning className="h-4 w-4 text-amber-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }
  };

  return (
    <div 
      className={`rounded-xl relative overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-800/70 border border-slate-700 shadow-lg shadow-slate-900/30' 
          : 'bg-white/70 border border-slate-200 shadow-md shadow-slate-200/50'
      } backdrop-blur-sm p-5 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl`}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center ${
          isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'
        } z-10`}>
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Deployment in progress...
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              This may take a few minutes
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          {currentDeployment.deploymentName}
        </h3>
        <span className={`capitalize text-xs font-medium px-2 py-1 rounded-full ring-1 ring-inset ${
          platformColors[currentDeployment.deploymentType] || 'bg-gray-100 text-gray-800'
        }`}>
          {currentDeployment.deploymentType}
        </span>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center">
          <StatusIcon />
          <span className='capitalize text-xs ml-1.5'>
            {loadingStatus ? 'Checking...' : currentDeployment.status}
          </span>
        </div>
        
        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} flex items-center`}>
          <Clock className="h-3 w-3 mr-1 inline" />
          {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : currentDeployment.lastUpdated}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className={`px-3 py-2 rounded-lg ${
          isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
        }`}>
          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Uptime</div>
          <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
            {currentDeployment.uptime || 'N/A'}
          </div>
        </div>
        <div className={`px-3 py-2 rounded-lg ${
          isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
        }`}>
          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Traffic</div>
          <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
            {currentDeployment.visitors || 'N/A'}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {currentDeployment.wpUrl && (
          <Link
            href={
              currentDeployment.wpUrl.startsWith('http') 
                ? currentDeployment.wpUrl 
                : `http://${currentDeployment.wpUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-medium ${
              isDarkMode 
                ? 'text-indigo-400 hover:text-indigo-300' 
                : 'text-indigo-600 hover:text-indigo-800'
            } flex items-center transition-colors`}
          >
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Visit Site
          </Link>
        )}

        <button 
          className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
            isDarkMode 
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          } flex items-center transition-colors`}
          onClick={handleManage}
          disabled={loadingStatus || isLoading}
        >
          {loadingStatus ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Wrench className="h-4 w-4 mr-1.5" />
          )}
          {loadingStatus ? 'Processing...' : 'Manage'}
        </button>
      </div>
    </div>
  );
};

export default DeploymentCard;