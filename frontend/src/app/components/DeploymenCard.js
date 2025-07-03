import {
  ArrowUpRight,
  Clock,
  Settings,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MagnetIcon,
  Server,
  ExternalLink,
  Calendar,
  Activity,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/utils/axiosInstance";
import ManageDeployment from "./ManageDeployment";
import Spinner from "@/app/components/Spinner.js";
import { FaWordpress, FaReact, FaVuejs, FaAngular } from "react-icons/fa";

const DeploymentCard = ({
  deployment,
  isDarkMode = false,
  onDelete,
  isDeleting,
}) => {
  const [currentDeployment, setCurrentDeployment] = useState(deployment);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(
    deployment.status !== "success" && deployment.status !== "failed"
  );
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const MAX_POLL_ATTEMPTS = 60; // Stop after 5 minutes (60 * 5 seconds)
  
  // Use ref to store interval ID for cleanup
  const intervalRef = useRef(null);

  // Premium color schemes
  const statusConfig = {
    success: {
      color: isDarkMode
        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        : "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: CheckCircle,
      label: "Live",
    },
    completed: {
      color: isDarkMode
        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        : "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: CheckCircle,
      label: "Live",
    },
    deployed: {
      color: isDarkMode
        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        : "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: CheckCircle,
      label: "Live",
    },
    active: {
      color: isDarkMode
        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        : "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: CheckCircle,
      label: "Live",
    },
    failed: {
      color: isDarkMode
        ? "text-red-400 bg-red-500/10 border-red-500/20"
        : "text-red-600 bg-red-50 border-red-200",
      icon: XCircle,
      label: "Failed",
    },
    error: {
      color: isDarkMode
        ? "text-red-400 bg-red-500/10 border-red-500/20"
        : "text-red-600 bg-red-50 border-red-200",
      icon: XCircle,
      label: "Failed",
    },
    "in-progress": {
      color: isDarkMode
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-amber-600 bg-amber-50 border-amber-200",
      icon: AlertCircle,
      label: "Building",
    },
    building: {
      color: isDarkMode
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-amber-600 bg-amber-50 border-amber-200",
      icon: AlertCircle,
      label: "Building",
    },
    deploying: {
      color: isDarkMode
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-amber-600 bg-amber-50 border-amber-200",
      icon: AlertCircle,
      label: "Deploying",
    },
    pending: {
      color: isDarkMode
        ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
        : "text-blue-600 bg-blue-50 border-blue-200",
      icon: Clock,
      label: "Pending",
    },
    waiting: {
      color: isDarkMode
        ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
        : "text-blue-600 bg-blue-50 border-blue-200",
      icon: Clock,
      label: "Waiting",
    },
  };

  // Platform configuration
  const platformConfig = {
    wordpress: {
      icon: FaWordpress,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      name: "WordPress",
    },
    react: {
      icon: FaReact,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      name: "React",
    },
    vue: {
      icon: FaVuejs,
      color: "text-green-600",
      bgColor: "bg-green-50",
      name: "Vue.js",
    },
    angular: {
      icon: FaAngular,
      color: "text-red-600",
      bgColor: "bg-red-50",
      name: "Angular",
    },
    static: {
      icon: Server,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      name: "Static",
    },
  };

  // Helper function to check if deployment is still in progress
  const isDeploymentInProgress = (status) => {
    const completedStatuses = ["success", "failed", "completed", "deployed", "active", "live"];
    return !completedStatuses.includes(status?.toLowerCase());
  };

  // Fetch deployment status
  const fetchDeploymentStatus = async () => {
    try {
      setLoadingStatus(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        `/deploy/${deployment.deploymentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add detailed logging for debugging
      console.log("=== DEPLOYMENT STATUS DEBUG ===");
      console.log("Deployment ID:", deployment.deploymentId);
      console.log("API Response:", response.data);
      console.log("Current Status:", response.data?.data?.status);
      console.log("Previous Status:", currentDeployment.status);
      console.log("===============================");
      
      // Update deployment data if response is valid
      if (response.data && response.data.data) {
        const updatedDeployment = response.data.data;
        setCurrentDeployment(updatedDeployment);
        
        // Stop loading if deployment is success or failed
        if (!isDeploymentInProgress(updatedDeployment.status)) {
          console.log("🎉 Deployment completed with status:", updatedDeployment.status);
          setIsLoading(false);
          // Clear interval when deployment is complete
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          console.log("⏳ Still in progress, continuing to poll...");
        }
      } else {
        console.warn("Invalid API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching deployment status:", error);
      console.log("Response data:", error.response?.data);
      console.log("Response status:", error.response?.status);
      setIsLoading(false);
      // Clear interval on error
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  // Fetch metrics for successful deployments
  const fetchMetrics = async () => {
    const successStatuses = ["success", "completed", "deployed", "active"];
    if (!successStatuses.includes(currentDeployment.status)) return;
    
    setLoadingMetrics(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        `/deploy/status/${deployment.deploymentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Deployment Card response to Status Check", response.data.data);
      
      if (response.data && response.data.data.status === "success") {
        setMetrics(response.data.data.status);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  // Main useEffect for polling deployment status
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Fetch metrics if deployment is successful
    const successStatuses = ["success", "completed", "deployed", "active"];
    if (successStatuses.includes(currentDeployment.status)) {
      fetchMetrics();
      return;
    }

    // Start polling only if deployment is still in progress
    if (isDeploymentInProgress(currentDeployment.status)) {
      // Fetch status immediately
      fetchDeploymentStatus();
      
      // Set up polling interval
      intervalRef.current = setInterval(() => {
        setPollCount(prev => {
          const newCount = prev + 1;
          if (newCount >= MAX_POLL_ATTEMPTS) {
            console.warn("Max polling attempts reached. Stopping polling.");
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsLoading(false);
            return newCount;
          }
          fetchDeploymentStatus();
          return newCount;
        });
      }, 5000); // Poll every 5 seconds
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentDeployment.status, deployment.deploymentId]);

  // Update loading state when deployment status changes
  useEffect(() => {
    setIsLoading(isDeploymentInProgress(currentDeployment.status));
  }, [currentDeployment.status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(deployment.deploymentId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get the current status configuration
  const currentStatus = statusConfig[currentDeployment.status] || statusConfig.waiting;
  const StatusIcon = currentStatus.icon;

  // Debug logging for status display
  console.log("Status Debug:", {
    currentDeploymentStatus: currentDeployment.status,
    isLoading,
    loadingStatus,
    currentStatusConfig: currentStatus,
    statusLabel: currentStatus.label
  });

  // Get platform configuration
  const platform = platformConfig[currentDeployment.platform?.toLowerCase()] || platformConfig.static;
  const PlatformIcon = platform.icon;

  return (
    <>
      <div className={`
        group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg
        ${isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50' 
          : 'bg-white border-gray-200 hover:border-gray-300'
        }
      `}>
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Platform Icon */}
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-lg
                ${isDarkMode ? 'bg-gray-700' : platform.bgColor}
              `}>
                <PlatformIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : platform.color}`} />
              </div>
              
              {/* Project Info */}
              <div>
                <h3 className={`font-semibold text-lg leading-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentDeployment.deploymentName || 'Untitled Project'}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {platform.name} • {currentDeployment.branch || 'main'}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
              ${currentStatus.color}
            `}>
              {(isLoading || loadingStatus) ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <StatusIcon className="h-3 w-3" />
              )}
              {loadingStatus ? "Checking..." : currentStatus.label}
            </div>
          </div>

          {/* Deployment URL */}
          {currentDeployment.url && (
            currentDeployment.status === "success" || 
            currentDeployment.status === "completed" || 
            currentDeployment.status === "deployed" || 
            currentDeployment.status === "active"
          ) && (
            <div className="mb-4">
              <Link 
                href={currentDeployment.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${isDarkMode 
                    ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }
                `}
              >
                <ExternalLink className="w-4 h-4" />
                Visit Site
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Metrics */}
          {(
            currentDeployment.status === "success" || 
            currentDeployment.status === "completed" || 
            currentDeployment.status === "deployed" || 
            currentDeployment.status === "active"
          ) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`
                p-3 rounded-lg border
                ${isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className={`w-4 h-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Uptime
                  </span>
                </div>
                <p className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {loadingMetrics ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    metrics?.uptime || '99.9%'
                  )}
                </p>
              </div>

              <div className={`
                p-3 rounded-lg border
                ${isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className={`w-4 h-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Response
                  </span>
                </div>
                <p className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {loadingMetrics ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    metrics?.responseTime || '120ms'
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Deployment Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {formatDate(currentDeployment.createdAt || currentDeployment.deployedAt)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                ID: {currentDeployment.deploymentId?.slice(-8) || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className={`
          px-6 py-4 border-t flex items-center justify-between
          ${isDarkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-100 bg-gray-50/50'}
        `}>
          <button
            onClick={() => setShowManageModal(true)}
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            <Settings className="w-4 h-4" />
            Manage
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${isDarkMode 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <div className={`
              flex items-center gap-3 px-4 py-2 rounded-lg
              ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
              shadow-lg border
            `}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">
                {loadingStatus ? "Checking status..." : "Deploying..."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Manage Modal */}
      {showManageModal && (
        <ManageDeployment
          deployment={currentDeployment}
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
          onUpdate={setCurrentDeployment}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default DeploymentCard;