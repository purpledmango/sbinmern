import { ArrowUpRight, Clock, Settings, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import ManageDeployment from "./ManageDeployment";
import { parseDockerMetrics } from "@/utils/parseMatrics.js";
import Spinner from "@/app/components/Spinner.js";

const DeploymentCard = ({ deployment, isDarkMode = false }) => {
  const [currentDeployment, setCurrentDeployment] = useState(deployment);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(
    deployment.status !== 'completed' && deployment.status !== 'failed'
  );
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);

  // Premium color schemes
  const statusConfig = {
    completed: {
      color: isDarkMode 
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
        : 'text-emerald-600 bg-emerald-50 border-emerald-200',
      icon: CheckCircle,
      label: 'Live'
    },
    failed: {
      color: isDarkMode 
        ? 'text-red-400 bg-red-500/10 border-red-500/20' 
        : 'text-red-600 bg-red-50 border-red-200',
      icon: XCircle,
      label: 'Failed'
    },
    'in-progress': {
      color: isDarkMode 
        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
        : 'text-amber-600 bg-amber-50 border-amber-200',
      icon: AlertCircle,
      label: 'Building'
    }
  };

  const platformConfig = {
    WordPress: {
      color: isDarkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50',
      label: 'WordPress'
    },
    Magento: {
      color: isDarkMode ? 'text-orange-400 bg-orange-500/10' : 'text-orange-600 bg-orange-50',
      label: 'Magento'
    },
    Custom: {
      color: isDarkMode ? 'text-violet-400 bg-violet-500/10' : 'text-violet-600 bg-violet-50',
      label: 'Custom'
    }
  };

  useEffect(() => {
    fetchMetrics();
    
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        fetchDeploymentStatus();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  
  const fetchDeploymentStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        `/deploy/${deployment.deploymentId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentDeployment(response.data.data || "NA");
      
      if (response.data.data.status === 'completed' || response.data.data.status === 'failed') {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching deployment status:", error);
      setIsLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        `/deploy/status/${deployment.deploymentId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Updated Metrics Data format", response.data.data.metrics);
      
      // Parse and set metrics here
      if (response.data.data.metrics) {
        setMetrics(response.data.data.metrics);
      }
      
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setMetrics(null);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const handleManageClick = () => {
    setShowManageModal(true);
  };

  const handleCloseManageModal = () => {
    setShowManageModal(false);
  };

  const currentStatus = statusConfig[currentDeployment.status] || statusConfig['in-progress'];
  const currentPlatform = platformConfig[currentDeployment.deploymentType] || platformConfig.Custom;
  const StatusIcon = currentStatus.icon;

  return (
    <>
      <div className={`
        group relative overflow-hidden rounded-2xl border transition-all duration-500 ease-out
        ${isDarkMode 
          ? 'bg-slate-900/50 border-slate-800/50 hover:bg-slate-900/70 hover:border-slate-700/50' 
          : 'bg-white/80 border-slate-200/50 hover:bg-white hover:border-slate-300/50'
        }
        backdrop-blur-xl shadow-lg hover:shadow-xl hover:-translate-y-1
      `}>
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1 w-full">
              <div className="w-full flex justify-between items-center py-4 px-2">
                <h3 className={`
                  text-lg font-semibold tracking-tight
                  ${isDarkMode ? 'text-white' : 'text-slate-900'}
                `}>
                  {currentDeployment.deploymentName}
                </h3>
                <span className="text-xs font-semibold">
                  Created at: {new Date(currentDeployment.createdAt).toLocaleString()}
                </span>              
              </div>
                      
              <div className="flex items-center gap-3">
                {/* Status Badge */}
                <div className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                  ${currentStatus.color}
                `}>
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <StatusIcon className="h-3 w-3" />
                  )}
                  {isLoading ? 'Deploying' : currentStatus.label}
                </div>
                
                {/* Platform Badge */}
                <div className={`
                  capitalize px-2.5 py-1 rounded-full text-xs font-medium
                  ${currentPlatform.color}
                `}>
                  {currentDeployment.deploymentType}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {/* CPU */}
            <div className={`
              p-3 rounded-xl border
              ${isDarkMode 
                ? 'bg-slate-800/30 border-slate-700/30' 
                : 'bg-slate-50/50 border-slate-200/30'
              }
            `}>
              <div className={`
                text-xs font-medium mb-1
                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
              `}>
                CPU
              </div>
              <div className={`
                text-sm font-semibold
                ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
              `}>
                {loadingMetrics ? (
                  <Spinner size="small" />
                ) : metrics?.cpu ? (
                  metrics.cpu.cores
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            {/* RAM */}
            <div className={`
              p-3 rounded-xl border
              ${isDarkMode 
                ? 'bg-slate-800/30 border-slate-700/30' 
                : 'bg-slate-50/50 border-slate-200/30'
              }
            `}>
              <div className={`
                text-xs font-medium mb-1
                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
              `}>
                RAM
              </div>
              <div className={`
                text-sm font-semibold
                ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
              `}>
                {loadingMetrics ? (
                  <Spinner size="small" />
                ) : metrics?.memory ? (
                  metrics.memory.total
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            {/* Memory Usage */}
            <div className={`
              p-3 rounded-xl border
              ${isDarkMode 
                ? 'bg-slate-800/30 border-slate-700/30' 
                : 'bg-slate-50/50 border-slate-200/30'
              }
            `}>
              <div className={`
                text-xs font-medium mb-1
                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
              `}>
                Memory Usage
              </div>
              <div className={`
                text-sm font-semibold
                ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}
              `}>
                {loadingMetrics ? (
                  <Spinner size="small" />
                ) : metrics?.memory ? (
                  metrics.memory.percentage
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`
          flex items-center justify-between px-6 py-4 border-t
          ${isDarkMode 
            ? 'border-slate-800/50 bg-slate-800/20' 
            : 'border-slate-200/50 bg-slate-50/30'
          }
        `}>
          {/* Visit Site Link */}
          {currentDeployment.wpUrl && (
            <Link
              href={
                currentDeployment.wpUrl.startsWith('http') 
                  ? currentDeployment.wpUrl 
                  : `https://${currentDeployment.wpUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center gap-1.5 text-sm font-medium transition-colors
                ${isDarkMode 
                  ? 'text-slate-300 hover:text-white' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <ArrowUpRight className="h-4 w-4" />
              Visit Site
            </Link>
          )}

          {/* Manage Button */}
          <button 
            onClick={handleManageClick}
            disabled={loadingStatus || isLoading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              ${isDarkMode 
                ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
              }
              ${(loadingStatus || isLoading) ? 'pointer-events-none opacity-50' : 'hover:scale-105'}
            `}
          >
            {loadingStatus ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                Manage
              </>
            )}
          </button>
        </div>

        {/* Premium gradient overlay on hover */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
          ${isDarkMode 
            ? 'bg-gradient-to-br from-slate-700/5 to-slate-600/5' 
            : 'bg-gradient-to-br from-slate-50/50 to-slate-100/50'
          }
        `} />
      </div>

      {/* ManageDeployment Modal */}
      {showManageModal && (
        <ManageDeployment 
          deployment={currentDeployment}
          isDarkMode={isDarkMode}
          onClose={handleCloseManageModal}
          metrics={metrics}
        />
      )}
    </>
  );
}; 

export default DeploymentCard;