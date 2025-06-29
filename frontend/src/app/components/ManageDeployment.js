import { 
  X, 
  Settings, 
  Globe, 
  Database, 
  Shield, 
  Activity, 
  Users, 
  BarChart3, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Save, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Copy,
  Loader2,
  ChevronDown,
  ChevronUp,
  Plus,
  Link,
  Lock,
  Unlock,
  Calendar,
  Info,
  MoreVertical,
  Clock,
  Repeat,
  ShieldCheck,
  Check,
  ShieldOff
} from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { FaWordpressSimple } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const ManageDeployment = ({ deployment, isDarkMode = false, onClose, metrics="NA" }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentData, setDeploymentData] = useState(deployment);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(deployment.deploymentName);
  const [copied, setCopied]= useState(false);
  
  // Domain binding states
  const [customDomain, setCustomDomain] = useState('');
  const [isBindingDomain, setIsBindingDomain] = useState(false);
  const [showDNSGuide, setShowDNSGuide] = useState(false);
  const [boundDomains, setBoundDomains] = useState([]);
  
  // SSL states
  const [sslStatus, setSSLStatus] = useState({
    enabled: true,
    issuer: 'Let\'s Encrypt',
    expiryDate: '2025-08-30',
    daysUntilExpiry: 92,
    autoRenewal: true
  });
  const [isCheckingSSL, setIsCheckingSSL] = useState(false);

  // Mock server IP - in real implementation, this would come from your backend
  const serverIP = '192.168.1.100';

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  useEffect(() => {
    // Mock bound domains - in real implementation, fetch from API
    setBoundDomains([
      { domain: 'example.com', status: 'active', sslEnabled: true },
      { domain: 'www.example.com', status: 'active', sslEnabled: true }
    ]);
  }, []);

  const handleCopyUrl = async () => {
    const url = deploymentData.wpConfig.url?.startsWith('http') 
      ? deploymentData.wpConfig.url 
      : `${deploymentData.wpConfig.url}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleCopyIP = async () => {
    try {
      await navigator.clipboard.writeText(serverIP);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy IP:', err);
    }
  };

  const handleBindDomain = async () => {
    if (!customDomain.trim()) return;
    
    setIsBindingDomain(true);
    try {
      const token = localStorage.getItem("token");
      // Mock API call - replace with actual endpoint
      const response = await axiosInstance.post(
        `/deploy/${deployment.deploymentId}/bind-domain`,
        { domain: customDomain },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBoundDomains([...boundDomains, { 
        domain: customDomain, 
        status: 'pending', 
        sslEnabled: false 
      }]);
      setCustomDomain('');
    } catch (error) {
      console.error("Error binding domain:", error);
    } finally {
      setIsBindingDomain(false);
    }
  };

  const handleCheckSSL = async () => {
    setIsCheckingSSL(true);
    try {
      const token = localStorage.getItem("token");
      // Mock API call - replace with actual endpoint
      const response = await axiosInstance.get(
        `/deploy/${deployment.deploymentId}/ssl-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update SSL status based on response
      // setSSLStatus(response.data);
    } catch (error) {
      console.error("Error checking SSL:", error);
    } finally {
      setIsCheckingSSL(false);
    }
  };

  const handleInstallSSL = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Mock API call - replace with actual endpoint
      await axiosInstance.post(
        `/deploy/${deployment.deploymentId}/install-ssl`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSSLStatus({ ...sslStatus, enabled: true });
    } catch (error) {
      console.error("Error installing SSL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveName = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.patch(
        `/deploy/${deployment.deploymentId}`,
        { deploymentName: editedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setDeploymentData({ ...deploymentData, deploymentName: editedName });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating deployment name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeployment = async () => {
    if (window.confirm('Are you sure you want to delete this deployment? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axiosInstance.delete(
          `/deploy/${deployment.deploymentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onClose();
      } catch (error) {
        console.error("Error deleting deployment:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRestart = async () => {
  try {
    // 1. Show loading toast with custom blue color
    const toastId = toast.loading("🔄 Restart Signal Sent", {
      style: {
        background: '#3B82F6',
        color: '#FFFFFF',
        border: '1px solid #2563EB'
      }
    });
    
    // 2. Get authentication token
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("Authentication token not found");
    }
    
    // 3. Make API call to restart deployment
    const response = await axiosInstance.post(
      `/deploy/restart/${deployment.deploymentId}`,
      {}, // Empty body if no data needed
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      }
    );
    
    // 4. Handle successful restart
    if (response.data.success) {
      toast.success("✅ Deployment restarted successfully", { 
        id: toastId,
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          border: '1px solid #059669'
        }
      });
      
      // 5. Refresh deployment status after a short delay
      setTimeout(() => {
        fetchDeploymentStatus();
      }, 3000); // Wait 3 seconds before checking new status
    } else {
      throw new Error(response.data.message || "Failed to restart deployment");
    }
  } catch (error) {
    console.error("Restart error:", error);
    
    // Handle different types of errors
    let errorMessage = "Failed to restart deployment";
    
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Network error: Please check your connection";
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage;
    }
    
    toast.error(`❌ ${errorMessage}`, {
      style: {
        background: '#EF4444',
        color: '#FFFFFF',
        border: '1px solid #DC2626'
      }
    });
  }
};
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Deployment Status */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={isDarkMode ? 'dark' : 'light'}
      />

      <div className={`
        p-6 rounded-xl border
        ${isDarkMode 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          
        </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-white/10 rounded-lg">
          {/* Status Card */}
          <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg shadow-sm">
            <div className="text-4xl font-bold mb-2">
              {deploymentData.status === 'completed' ? (
                <span className="text-[#07bc0c]">•</span>
              ) : (
                <span className="text-[#e24a3a] animate-pulse">•</span>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Status
              </div>
              <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {deploymentData.status === 'completed' ? 'Online' : 'Fetching...'}
              </div>
            </div>
          </div>

  {/* Uptime Card */}
  <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg shadow-sm">
    <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
      {metrics.uptime || '99.9%'}
    </div>
    <div className="flex flex-col items-center">
      <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        Uptime
      </div>
      <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
        Last 30 days
      </div>
    </div>
  </div>

  {/* Visitors Card */}
  <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg shadow-sm">
    <div className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
      {deploymentData.visitors || '1.2K'}
    </div>
    <div className="flex flex-col items-center">
      <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        Visitors
      </div>
      <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
        This month
      </div>
    </div>
  </div>

  {/* Platform Card */}
  <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg shadow-sm">
    <div className={`text-3xl mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
      {deploymentData.deploymentType === 'wordpress' ? <FaWordpressSimple /> : "N/A"}
    </div>
    <div className="flex flex-col items-center">
      <div className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        Platform
      </div>
      <div className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
        {deploymentData.deploymentType === 'wordpress' ? 'WordPress' : 'N/A'}
      </div>
    </div>
  </div>
</div>
      </div>

      {/* Quick Actions */}
      <div className={`
        p-6 rounded-xl border
        ${isDarkMode 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {deploymentData.wpUrl && (
            <button
              onClick={() => window.open(
                deploymentData.wpUrl.startsWith('http') 
                  ? deploymentData.wpUrl 
                  : `https://${deploymentData.wpUrl}`,
                '_blank'
              )}
              className={`
                flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors
                ${isDarkMode 
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border'
                }
              `}
            >
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </button>
          )}
          <button
            onClick={handleCopyUrl}
            className={`
              flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors
              ${isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border'
              }
            `}
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <button
            className={`
              flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors
              ${isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border'
              }
            `}
            onClick={handleRestart}
          >
            <RefreshCw className="h-4 w-4" />
            Restart
          </button>
          <button
            className={`
              flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors
              ${isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border'
              }
            `}
          >
            <Download className="h-4 w-4" />
            Backup
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
  {/* General Settings */}
  <div className={`
    p-6 rounded-xl border
    ${isDarkMode 
      ? 'bg-slate-800/50 border-slate-700/50' 
      : 'bg-white border-slate-200 shadow-sm'
    }
  `}>
    <div className="flex items-center gap-3 mb-6">
      <Settings className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        General Settings
      </h3>
    </div>
    
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Deployment Name
          </label>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className={`
                text-xs px-2 py-1 rounded-md transition-colors flex items-center gap-1
                ${isDarkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
                }
              `}
            >
              <Edit3 className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className={`
                  flex-1 px-4 py-2.5 rounded-lg border text-sm
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-white border-slate-300 text-slate-900 focus:ring-blue-500 focus:border-blue-500'
                  }
                  transition-all duration-200
                `}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveName}
                  disabled={isLoading}
                  className={`
                    px-3 py-2 rounded-lg transition-colors flex items-center gap-2
                    ${isDarkMode 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }
                  `}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(deploymentData.deploymentName);
                  }}
                  className={`
                    px-3 py-2 rounded-lg transition-colors flex items-center gap-2
                    ${isDarkMode 
                      ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }
                  `}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className={`
              w-full px-4 py-2.5 rounded-lg
              ${isDarkMode 
                ? 'bg-slate-700 text-white' 
                : 'bg-slate-100 text-slate-900'
              }
            `}>
              {deploymentData.deploymentName}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Domain Management */}
  <div className={`
    p-6 rounded-xl border
    ${isDarkMode 
      ? 'bg-slate-800/50 border-slate-700/50' 
      : 'bg-white border-slate-200 shadow-sm'
    }
  `}>
    <div className="flex items-center gap-3 mb-6">
      <Globe className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Domain Management
      </h3>
    </div>
    
    <div className="space-y-6">
      {/* Default Domain */}
      <div>
        <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Default Domain
        </label>
        <div className={`
          flex items-center gap-3 p-4 rounded-lg border
          ${isDarkMode 
            ? 'bg-slate-700 border-slate-600 text-slate-300' 
            : 'bg-slate-50 border-slate-300 text-slate-600'
          }
        `}>
          <Link className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {deploymentData.wpUrl || 'No domain configured'}
          </span>
        </div>
      </div>

      {/* Custom Domain Binding */}
      <div>
        <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Bind Custom Domain
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="example.com"
            className={`
              flex-1 px-4 py-2.5 rounded-lg border text-sm
              ${isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500'
              }
              transition-all duration-200
            `}
          />
          <button
            onClick={handleBindDomain}
            disabled={isBindingDomain || !customDomain.trim()}
            className={`
              px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50
              flex items-center gap-2
              ${isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            {isBindingDomain ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Link className="h-4 w-4" />
                Bind
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bound Domains List */}
      {boundDomains.length > 0 && (
        <div>
          <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Bound Domains
          </label>
          <div className="space-y-3">
            {boundDomains.map((domain, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-between p-4 rounded-lg border
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600' 
                    : 'bg-white border-slate-200'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {domain.domain}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${domain.status === 'active' 
                          ? (isDarkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700') 
                          : (isDarkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700')
                        }
                      `}>
                        {domain.status}
                      </span>
                      {domain.sslEnabled && (
                        <span className="flex items-center gap-1 text-xs">
                          <Lock className="h-3 w-3 text-emerald-500" />
                          <span className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}>SSL</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className={`
                  p-2 rounded-full transition-colors
                  ${isDarkMode 
                    ? 'hover:bg-slate-600 text-slate-300' 
                    : 'hover:bg-slate-100 text-slate-500'
                  }
                `}>
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DNS Configuration Guide */}
      <div>
        <button
          onClick={() => setShowDNSGuide(!showDNSGuide)}
          className={`
            flex items-center gap-2 text-sm font-medium transition-colors w-full
            ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}
          `}
        >
          <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-slate-700/20 w-full">
            <Info className="h-5 w-5" />
            <span>How to update DNS records</span>
            {showDNSGuide ? (
              <ChevronUp className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-auto" />
            )}
          </div>
        </button>
        
        {showDNSGuide && (
          <div className={`
            mt-2 p-5 rounded-lg border
            ${isDarkMode 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-blue-50 border-blue-200'
            }
          `}>
            <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              DNS Configuration Steps:
            </h4>
            <ol className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <li className="flex gap-3">
                <span className={`flex items-center justify-center h-6 w-6 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                  1
                </span>
                Login to your domain registrar's control panel
              </li>
              <li className="flex gap-3">
                <span className={`flex items-center justify-center h-6 w-6 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                  2
                </span>
                Navigate to DNS management or DNS settings
              </li>
              <li className="flex gap-3">
                <span className={`flex items-center justify-center h-6 w-6 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                  3
                </span>
                Create or update an A record with the following details:
              </li>
              <li className="ml-12 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Type:</span> A
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Name:</span> @ (for root domain) or www (for subdomain)
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Value/IP:</span> 
                  <code className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
                    {serverIP}
                  </code>
                  <button
                    onClick={handleCopyIP}
                    className={`p-1 rounded ${isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-slate-200'}`}
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </li>
              <li className="flex gap-3">
                <span className={`flex items-center justify-center h-6 w-6 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                  4
                </span>
                Save the changes and wait for DNS propagation (can take up to 48 hours)
              </li>
            </ol>
            <div className={`mt-4 p-4 rounded border-l-4 ${isDarkMode ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-400 bg-yellow-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                <strong>Note:</strong> DNS changes can take up to 48 hours to propagate globally. 
                You can check if your domain is pointing correctly using online DNS lookup tools.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Danger Zone */}
  <div className={`
    p-6 rounded-xl border
    ${isDarkMode ? 'border-red-900/50 bg-red-900/10' : 'border-red-200 bg-red-50'}
  `}>
    <div className="flex items-center gap-3 mb-6">
      <AlertTriangle className="h-5 w-5 text-red-500" />
      <h3 className="text-lg font-semibold text-red-600">
        Danger Zone
      </h3>
    </div>
    
    <div className="space-y-4">
      <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
        Once you delete a deployment, there is no going back. Please be certain.
      </p>
      <button
        onClick={handleDeleteDeployment}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            Delete Deployment
          </>
        )}
      </button>
    </div>
  </div>
</div>
  );

  const renderSecurityTab = () => (
   <div className="space-y-6">
  {/* SSL Certificate Status */}
  <div className={`
    p-6 rounded-xl border
    ${isDarkMode 
      ? 'bg-slate-800/50 border-slate-700/50' 
      : 'bg-white border-slate-200 shadow-sm'
    }
  `}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Lock className={`h-5 w-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          SSL Certificate
        </h3>
      </div>
      <button
        onClick={handleCheckSSL}
        disabled={isCheckingSSL}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${isDarkMode 
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }
        `}
      >
        {isCheckingSSL ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Check Status
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* SSL Status */}
      <div className={`
        p-4 rounded-lg border text-center
        ${isDarkMode 
          ? 'bg-slate-700/30 border-slate-600' 
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <div className={`
          mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-3
          ${sslStatus.enabled 
            ? isDarkMode ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            : isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600'
          }
        `}>
          {sslStatus.enabled ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
        </div>
        <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          SSL Status
        </div>
        <div className={`mt-1 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {sslStatus.enabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>

      {/* Issuer */}
      <div className={`
        p-4 rounded-lg border text-center
        ${isDarkMode 
          ? 'bg-slate-700/30 border-slate-600' 
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <div className={`
          mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-3
          ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-600'}
        `}>
          <Shield className="h-5 w-5" />
        </div>
        <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Issuer
        </div>
        <div className={`mt-1 text-lg font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {sslStatus.issuer || 'N/A'}
        </div>
      </div>

      {/* Expiry Date */}
      <div className={`
        p-4 rounded-lg border text-center
        ${isDarkMode 
          ? 'bg-slate-700/30 border-slate-600' 
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <div className={`
          mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-3
          ${isDarkMode ? 'bg-purple-900/20 text-purple-400' : 'bg-purple-100 text-purple-600'}
        `}>
          <Calendar className="h-5 w-5" />
        </div>
        <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Expires
        </div>
        <div className={`mt-1 text-lg font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          {sslStatus.expiryDate || 'N/A'}
        </div>
      </div>

      {/* Days Until Expiry */}
      <div className={`
        p-4 rounded-lg border text-center
        ${isDarkMode 
          ? 'bg-slate-700/30 border-slate-600' 
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <div className={`
          mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-3
          ${sslStatus.daysUntilExpiry > 30 
            ? isDarkMode ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            : sslStatus.daysUntilExpiry > 7
            ? isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
            : isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600'
          }
        `}>
          <Clock className="h-5 w-5" />
        </div>
        <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Until Expiry
        </div>
        <div className={`
          mt-1 text-lg font-semibold
          ${sslStatus.daysUntilExpiry > 30 
            ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
            : sslStatus.daysUntilExpiry > 7
            ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            : isDarkMode ? 'text-red-400' : 'text-red-600'
          }
        `}>
          {sslStatus.daysUntilExpiry || 0} days
        </div>
      </div>
    </div>

    {/* SSL Actions */}
    <div className="flex flex-wrap gap-3 mb-6">
      {!sslStatus.enabled ? (
        <button
          onClick={handleInstallSSL}
          disabled={isLoading}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${isDarkMode 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }
            disabled:opacity-50
          `}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Install SSL Certificate
        </button>
      ) : (
        <>
          <button
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            <RefreshCw className="h-4 w-4" />
            Renew Certificate
          </button>
          
          <button
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isDarkMode 
                ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                : 'bg-slate-500 hover:bg-slate-600 text-white'
              }
            `}
          >
            <Download className="h-4 w-4" />
            Download Certificate
          </button>
        </>
      )}
    </div>

    {/* Auto-renewal Status */}
    {sslStatus.enabled && (
      <div className={`
        p-4 rounded-lg border
        ${isDarkMode 
          ? 'bg-slate-700/30 border-slate-600' 
          : 'bg-blue-50 border-blue-200'
        }
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Repeat className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Auto-Renewal
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Automatically renew before expiry
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={sslStatus.autoRenewal}
              className="sr-only peer" 
              onChange={() => {}}
            />
            <div className={`
              w-11 h-6 rounded-full peer
              ${sslStatus.autoRenewal 
                ? 'bg-emerald-500' 
                : isDarkMode ? 'bg-slate-600' : 'bg-slate-300'
              }
              peer-focus:ring-2 peer-focus:ring-emerald-500/50
            `}>
              <div className={`
                absolute top-0.5 left-[2px] bg-white rounded-full h-5 w-5 transition-transform
                ${sslStatus.autoRenewal ? 'translate-x-5' : ''}
              `} />
            </div>
          </label>
        </div>
      </div>
    )}

    {/* SSL Certificate Expiry Warning */}
    {sslStatus.enabled && sslStatus.daysUntilExpiry <= 30 && (
      <div className={`
        mt-4 p-4 rounded-lg border-l-4 flex items-start gap-3
        ${sslStatus.daysUntilExpiry <= 7 
          ? isDarkMode ? 'border-red-500 bg-red-900/10' : 'border-red-400 bg-red-50' 
          : isDarkMode ? 'border-yellow-500 bg-yellow-900/10' : 'border-yellow-400 bg-yellow-50'
        }
      `}>
        <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${sslStatus.daysUntilExpiry <= 7 ? 'text-red-500' : 'text-yellow-500'}`} />
        <div>
          <h4 className={`
            font-medium mb-1
            ${sslStatus.daysUntilExpiry <= 7 
              ? isDarkMode ? 'text-red-400' : 'text-red-800' 
              : isDarkMode ? 'text-yellow-400' : 'text-yellow-800'
            }
          `}>
            SSL Certificate Expiring Soon
          </h4>
          <p className={`
            text-sm
            ${sslStatus.daysUntilExpiry <= 7 
              ? isDarkMode ? 'text-red-300' : 'text-red-700' 
              : isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
            }
          `}>
            Your SSL certificate will expire in {sslStatus.daysUntilExpiry} days. 
            {!sslStatus.autoRenewal && ' Please renew it manually or enable auto-renewal.'}
          </p>
        </div>
      </div>
    )}
  </div>

  {/* Security Headers */}
  <div className={`
    p-6 rounded-xl border
    ${isDarkMode 
      ? 'bg-slate-800/50 border-slate-700/50' 
      : 'bg-white border-slate-200 shadow-sm'
    }
  `}>
    <div className="flex items-center gap-3 mb-6">
      <Shield className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Security Headers
      </h3>
    </div>
    
    <div className="space-y-3">
      {[
        { name: 'HTTPS Redirect', status: true, description: 'Automatically redirect HTTP to HTTPS' },
        { name: 'HSTS', status: true, description: 'HTTP Strict Transport Security' },
        { name: 'Content Security Policy', status: false, description: 'Prevent XSS attacks' },
        { name: 'X-Frame-Options', status: true, description: 'Prevent clickjacking attacks' }
      ].map((header, index) => (
        <div
          key={index}
          className={`
            flex items-center justify-between p-4 rounded-lg border transition-colors
            ${isDarkMode 
              ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50' 
              : 'bg-white border-slate-200 hover:bg-slate-50'
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`
              flex items-center justify-center h-10 w-10 rounded-lg
              ${header.status 
                ? isDarkMode ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                : isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600'
              }
            `}>
              {header.status ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </div>
            <div>
              <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {header.name}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {header.description}
              </div>
            </div>
          </div>
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${header.status 
              ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
              : isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
            }
          `}>
            {header.status ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Firewall & Access Control */}
  <div className={`
    p-6 rounded-xl border
    ${isDarkMode 
      ? 'bg-slate-800/50 border-slate-700/50' 
      : 'bg-white border-slate-200 shadow-sm'
    }
  `}>
    <div className="flex items-center gap-3 mb-6">
      <ShieldOff className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Firewall & Access Control
      </h3>
    </div>
    
    <div className="space-y-4">
      {/* DDoS Protection */}
      <div className={`
        p-4 rounded-lg border transition-colors
        ${isDarkMode 
          ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50' 
          : 'bg-white border-slate-200 hover:bg-slate-50'
        }
      `}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${isDarkMode ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                DDoS Protection
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Automatic protection against distributed denial-of-service attacks
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
            Active
          </span>
        </div>
      </div>
      
      {/* IP Whitelist */}
      <div className={`
        p-4 rounded-lg border transition-colors
        ${isDarkMode 
          ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50' 
          : 'bg-white border-slate-200 hover:bg-slate-50'
        }
      `}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                IP Whitelist
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Restrict access to specific IP addresses
              </p>
            </div>
          </div>
          <button className={`
            px-3 py-1 rounded-lg text-sm font-medium transition-colors
            ${isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}>
            Configure
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  );

  const renderPlaceholderTab = (tabName) => (
    <div className={`
      p-12 text-center rounded-xl border
      ${isDarkMode 
        ? 'bg-slate-800/50 border-slate-700/50' 
        : 'bg-slate-50 border-slate-200'
      }
    `}>
      <div className={`text-4xl mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
        🚧
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        {tabName.charAt(0).toUpperCase() + tabName.slice(1)} Coming Soon
      </h3>
      <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        This section is under development and will be available soon.
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`
        w-full max-w-4xl max-h-auto overflow-y-scroll rounded-2xl border shadow-2xl
        ${isDarkMode 
        ? 'bg-slate-900 border-slate-700 relative z-50' 
        : 'bg-white border-slate-200 relative z-50'
      }
      `}>
        {/* Header */}
        
        <div className="relative ">
          <div className={`
            flex items-center justify-between p-6 border-b
            ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}
          `}>
            <div >
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Manage Deployment
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {deploymentData.deploymentName}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`
          flex overflow-x-auto border-b
          ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}
        `}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors
                  ${activeTab === tab.id
                    ? isDarkMode 
                      ? 'text-white border-b-2 border-blue-500 bg-slate-800/50' 
                      : 'text-slate-900 border-b-2 border-blue-500 bg-slate-50'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/30' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'settings' && renderSettingsTab()}
          {activeTab === 'database' && renderPlaceholderTab('database')}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'analytics' && renderPlaceholderTab('analytics')}
        </div>
      </div>
    </div>
  );
};

export default ManageDeployment;