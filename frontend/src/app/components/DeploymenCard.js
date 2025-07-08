import {
  ArrowUpRight,
  Clock,
  Settings,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Server,
  ExternalLink,
  Calendar,
  Activity,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axiosInstance from "@/utils/axiosInstance";
import ManageDeployment from "./ManageDeployment";
import Spinner from "@/app/components/Spinner.js";
import { FaWordpress, FaReact, FaVuejs, FaAngular } from "react-icons/fa";

// Constants moved outside component to prevent recreation
const MAX_POLL_ATTEMPTS = 60; // Stop after 5 minutes (60 * 5 seconds)
const POLL_INTERVAL = 5000; // 5 seconds

// Status configuration moved outside component for better performance
const createStatusConfig = (isDarkMode) => ({
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
  deleting: {
    color: isDarkMode
      ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
      : "text-orange-600 bg-orange-50 border-orange-200",
    icon: Loader2,
    label: "Deleting",
  },
});

// Platform configuration - static, doesn't need to be recreated
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

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  deploymentName, 
  isDarkMode,
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`
        w-full max-w-md rounded-xl shadow-xl border
        ${isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
        }
      `}>
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={`
              p-2 rounded-lg
              ${isDarkMode 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-red-100 text-red-600'
              }
            `}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Delete Deployment
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                This action cannot be undone
              </p>
            </div>
          </div>

          <div className={`
            p-4 rounded-lg border
            ${isDarkMode 
              ? 'bg-gray-700/50 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
            }
          `}>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {deploymentName || 'this deployment'}
              </span>
              ? This will permanently remove the deployment and all its associated data.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={`
          px-6 py-4 border-t flex items-center justify-end gap-3
          ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              bg-red-600 text-white hover:bg-red-700
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            `}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeploymentCard = ({
  deployment,
  isDarkMode = false,
  onDelete,
  isDeleting,
}) => {
  const [currentDeployment, setCurrentDeployment] = useState(deployment);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [localDeleting, setLocalDeleting] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [error, setError] = useState(null);
  
  // Use refs to store interval ID and auth data
  const intervalRef = useRef(null);
  const authRef = useRef({
    token: null,
    initialized: false
  });

  // Initialize auth data once
  useEffect(() => {
    if (!authRef.current.initialized) {
      authRef.current.token = localStorage.getItem("token");
      authRef.current.initialized = true;
    }
  }, []);

  // Update local deleting state when prop changes
  useEffect(() => {
    setLocalDeleting(isDeleting);
  }, [isDeleting]);

  // Memoized status configuration
  const statusConfig = useMemo(() => createStatusConfig(isDarkMode), [isDarkMode]);

  // Helper function to check if deployment is still in progress
  const isDeploymentInProgress = useCallback((status) => {
    const completedStatuses = ["success", "failed", "completed", "deployed", "active", "live"];
    return !completedStatuses.includes(status?.toLowerCase());
  }, []);

  // Check if deployment is currently in progress
  const isLoading = useMemo(() => 
    isDeploymentInProgress(currentDeployment.status), 
    [currentDeployment.status, isDeploymentInProgress]
  );

  // Fetch deployment status
  const fetchDeploymentStatus = useCallback(async () => {
    if (!authRef.current.token) {
      console.error("No authentication token available");
      return;
    }

    try {
      setLoadingStatus(true);
      setError(null);
      
      const response = await axiosInstance.get(
        `/deploy/${deployment.deploymentId}`,
        { headers: { Authorization: `Bearer ${authRef.current.token}` } }
      );
      
      if (response.data?.data) {
        const updatedDeployment = response.data.data;
        setCurrentDeployment(updatedDeployment);
        
        // Stop loading if deployment is complete
        if (!isDeploymentInProgress(updatedDeployment.status)) {
          console.log("🎉 Deployment completed with status:", updatedDeployment.status);
          // Clear interval when deployment is complete
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setPollCount(0); // Reset poll count
        }
      }
    } catch (error) {
      console.error("Error fetching deployment status:", error);
      setError(error.response?.data?.message || "Failed to fetch deployment status");
      
      // Clear interval on error
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setPollCount(0);
    } finally {
      setLoadingStatus(false);
    }
  }, [deployment.deploymentId, isDeploymentInProgress]);

  // Fetch metrics for successful deployments
  const fetchMetrics = useCallback(async () => {
    const successStatuses = ["success", "completed", "deployed", "active"];
    if (!successStatuses.includes(currentDeployment.status) || !authRef.current.token) {
      return;
    }
    
    setLoadingMetrics(true);
    try {
      const response = await axiosInstance.get(
        `/deploy/status/${deployment.deploymentId}`,
        { headers: { Authorization: `Bearer ${authRef.current.token}` } }
      );
      
      if (response.data?.data?.status === "success") {
        setMetrics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoadingMetrics(false);
    }
  }, [currentDeployment.status, deployment.deploymentId]);

  // Cleanup interval function
  const clearPollingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start polling function
  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling
    
    intervalRef.current = setInterval(() => {
      setPollCount(prev => {
        const newCount = prev + 1;
        if (newCount >= MAX_POLL_ATTEMPTS) {
          console.warn("Max polling attempts reached. Stopping polling.");
          clearPollingInterval();
          return 0;
        }
        fetchDeploymentStatus();
        return newCount;
      });
    }, POLL_INTERVAL);
  }, [fetchDeploymentStatus, clearPollingInterval]);

  // Main useEffect for handling deployment status changes
  useEffect(() => {
    clearPollingInterval();
    setPollCount(0);

    const successStatuses = ["success", "completed", "deployed", "active"];
    
    if (successStatuses.includes(currentDeployment.status)) {
      // Fetch metrics for successful deployments
      fetchMetrics();
    } else if (isDeploymentInProgress(currentDeployment.status)) {
      // Start polling for in-progress deployments
      fetchDeploymentStatus(); // Fetch immediately
      startPolling();
    }

    // Cleanup on unmount or status change
    return clearPollingInterval;
  }, [currentDeployment.status, deployment.deploymentId, fetchMetrics, isDeploymentInProgress, fetchDeploymentStatus, startPolling, clearPollingInterval]);

  // Handle delete confirmation
  const handleDeleteClick = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!onDelete) return;
    
    try {
      setLocalDeleting(true);
      await onDelete(deployment.deploymentId);
      setShowDeleteDialog(false);
      // Note: The parent component should handle removing this card from the list
    } catch (error) {
      console.error("Error deleting deployment:", error);
      setError("Failed to delete deployment");
      setLocalDeleting(false);
    }
  }, [onDelete, deployment.deploymentId]);

  // Memoized date formatter
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }, []);

  // Memoized modal handlers
  const handleOpenModal = useCallback(() => setShowManageModal(true), []);
  const handleCloseModal = useCallback(() => setShowManageModal(false), []);
  const handleUpdateDeployment = useCallback((updatedDeployment) => {
    setCurrentDeployment(updatedDeployment);
  }, []);

  // Get the current status and platform configuration
  const currentStatus = useMemo(() => {
    if (localDeleting) return statusConfig.deleting;
    return statusConfig[currentDeployment.status] || statusConfig.waiting;
  }, [statusConfig, currentDeployment.status, localDeleting]);

  const platform = useMemo(() => 
    platformConfig[currentDeployment.platform?.toLowerCase()] || platformConfig.static,
    [currentDeployment.platform]
  );

  const StatusIcon = currentStatus.icon;
  const PlatformIcon = platform.icon;

  // Check if deployment is live/accessible
  const isLive = useMemo(() => {
    if (localDeleting) return false;
    const liveStatuses = ["success", "completed", "deployed", "active"];
    return liveStatuses.includes(currentDeployment.status) && currentDeployment.url;
  }, [currentDeployment.status, currentDeployment.url, localDeleting]);

  return (
    <>
      <div className={`
        group relative overflow-hidden rounded-xl border transition-all duration-300
        ${localDeleting 
          ? 'opacity-75 pointer-events-none' 
          : 'hover:shadow-lg'
        }
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
                ${localDeleting ? 'opacity-50' : ''}
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
              {(isLoading || loadingStatus || localDeleting) ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <StatusIcon className="h-3 w-3" />
              )}
              {loadingStatus ? "Checking..." : currentStatus.label}
            </div>
          </div>

          {/* Error Display */}
          {error && !localDeleting && (
            <div className={`mb-4 p-3 rounded-lg border ${
              isDarkMode 
                ? 'bg-red-900/20 border-red-700 text-red-400' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Deployment URL */}
          {isLive && (
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
          {isLive && (
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
                    <Loader2 className="w-4 h-4 animate-spin" />
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
                    <Loader2 className="w-4 h-4 animate-spin" />
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
            onClick={handleOpenModal}
            disabled={localDeleting}
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Settings className="w-4 h-4" />
            Manage
          </button>

          <button
            onClick={handleDeleteClick}
            disabled={localDeleting}
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
            {localDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>

        {/* Loading Overlay */}
        {(isLoading || localDeleting) && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <div className={`
              flex items-center gap-3 px-4 py-2 rounded-lg
              ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
              shadow-lg border
            `}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">
                {localDeleting ? "Deleting deployment..." : 
                 loadingStatus ? "Checking status..." : "Deploying..."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        deploymentName={currentDeployment.deploymentName}
        isDarkMode={isDarkMode}
        isDeleting={localDeleting}
      />

      {/* Manage Modal */}
      {showManageModal && (
        <ManageDeployment
          deployment={currentDeployment}
          isOpen={showManageModal}
          onClose={handleCloseModal}
          onUpdate={handleUpdateDeployment}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default DeploymentCard;