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
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { FaWordpressSimple } from "react-icons/fa";

const ManageDeployment = ({ deployment, isDarkMode = false, onClose }) => {
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
    const url = deploymentData.wpUrl?.startsWith('http') 
      ? deploymentData.wpUrl 
      : `https://${deploymentData.wpUrl}`;
    
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

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Deployment Status */}
      <div className={`
        p-6 rounded-xl border
        ${isDarkMode 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Deployment Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {deploymentData.status === 'completed' ? '✓' : '⏳'}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Status
            </div>
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {deploymentData.status === 'completed' ? 'Live' : 'Building'}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {deploymentData.uptime || '99.9%'}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Uptime
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {deploymentData.visitors || '1.2K'}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Visitors
            </div>
          </div>
          <div className="text-center flex flex-col items-center gap-1">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {deploymentData.deploymentType === 'wordpress'? <FaWordpressSimple/>: "N/A"}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Platform
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
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          General Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Deployment Name
            </label>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className={`
                      flex-1 px-3 py-2 rounded-lg border text-sm
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                      }
                    `}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isLoading}
                    className={`
                      p-2 rounded-lg transition-colors
                      ${isDarkMode 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }
                    `}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(deploymentData.deploymentName);
                    }}
                    className={`
                      p-2 rounded-lg transition-colors
                      ${isDarkMode 
                        ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                        : 'bg-slate-400 hover:bg-slate-500 text-white'
                      }
                    `}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className={`flex-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {deploymentData.deploymentName}
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`
                      p-2 rounded-lg transition-colors
                      ${isDarkMode 
                        ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }
                    `}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </>
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
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Domain Management
        </h3>
        
        {/* Default Domain */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Default Domain
            </label>
            <div className={`
              p-3 rounded-lg border
              ${isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-slate-300' 
                : 'bg-slate-100 border-slate-300 text-slate-600'
              }
            `}>
              {deploymentData.wpUrl || 'No domain configured'}
            </div>
          </div>

          {/* Custom Domain Binding */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Bind Custom Domain
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="example.com"
                className={`
                  flex-1 px-3 py-2 rounded-lg border text-sm
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                  }
                `}
              />
              <button
                onClick={handleBindDomain}
                disabled={isBindingDomain || !customDomain.trim()}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50
                  ${isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }
                `}
              >
                {isBindingDomain ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Bound Domains List */}
          {boundDomains.length > 0 && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Bound Domains
              </label>
              <div className="space-y-2">
                {boundDomains.map((domain, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600' 
                        : 'bg-white border-slate-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {domain.domain}
                      </span>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${domain.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-yellow-100 text-yellow-700'
                        }
                      `}>
                        {domain.status}
                      </span>
                      {domain.sslEnabled && (
                        <Lock className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
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
                flex items-center gap-2 text-sm font-medium transition-colors
                ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}
              `}
            >
              <Info className="h-4 w-4" />
              How to update DNS records
              {showDNSGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {showDNSGuide && (
              <div className={`
                mt-3 p-4 rounded-lg border
                ${isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600' 
                  : 'bg-blue-50 border-blue-200'
                }
              `}>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  DNS Configuration Steps:
                </h4>
                <ol className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <li>1. Login to your domain registrar's control panel</li>
                  <li>2. Navigate to DNS management or DNS settings</li>
                  <li>3. Create or update an A record with the following details:</li>
                  <li className="ml-4">
                    • Type: A<br/>
                    • Name: @ (for root domain) or www (for subdomain)<br/>
                    • Value/IP: <code className={`px-1 py-0.5 rounded text-xs font-mono ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>{serverIP}</code>
                    <button
                      onClick={handleCopyIP}
                      className="ml-2 text-blue-500 hover:text-blue-600"
                    >
                      <Copy className="h-3 w-3 inline" />
                    </button>
                  </li>
                  <li>4. Save the changes and wait for DNS propagation (can take up to 48 hours)</li>
                </ol>
                <div className={`mt-3 p-3 rounded border-l-4 border-yellow-400 ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
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
        p-6 rounded-xl border border-red-200
        ${isDarkMode ? 'bg-red-900/10' : 'bg-red-50'}
      `}>
        <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </h3>
        <div className="space-y-4">
          <div>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Once you delete a deployment, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteDeployment}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Deployment
            </button>
          </div>
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
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            SSL Certificate
          </h3>
          <button
            onClick={handleCheckSSL}
            disabled={isCheckingSSL}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border'
              }
            `}
          >
            {isCheckingSSL ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Check Status
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className={`
              text-2xl font-bold mb-1
              ${sslStatus.enabled 
                ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                : isDarkMode ? 'text-red-400' : 'text-red-600'
              }
            `}>
              {sslStatus.enabled ? <Lock className="h-8 w-8 mx-auto" /> : <Unlock className="h-8 w-8 mx-auto" />}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              SSL Status
            </div>
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {sslStatus.enabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          <div className="text-center">
            <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {sslStatus.issuer || 'N/A'}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Issuer
            </div>
          </div>

          <div className="text-center">
            <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {sslStatus.expiryDate || 'N/A'}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Expires
            </div>
          </div>

          <div className="text-center">
            <div className={`
              text-lg font-bold mb-1
              ${sslStatus.daysUntilExpiry > 30 
                ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                : sslStatus.daysUntilExpiry > 7
                ? isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                : isDarkMode ? 'text-red-400' : 'text-red-600'
              }
            `}>
              {sslStatus.daysUntilExpiry || 0} days
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Until Expiry
            </div>
          </div>
        </div>

        {/* SSL Actions */}
        <div className="flex flex-wrap gap-3">
          {!sslStatus.enabled && (
            <button
              onClick={handleInstallSSL}
              disabled={isLoading}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${isDarkMode 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }
              `}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Install SSL Certificate
            </button>
          )}
          
          {sslStatus.enabled && (
            <>
              <button
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
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
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
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
            mt-4 p-4 rounded-lg border
            ${isDarkMode 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-blue-50 border-blue-200'
            }
          `}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Auto-Renewal
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Automatically renew SSL certificate before expiry
                </p>
              </div>
              <div className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${sslStatus.autoRenewal 
                  ? 'bg-emerald-500' 
                  : isDarkMode ? 'bg-slate-600' : 'bg-slate-300'
                }
              `}>
                <span className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${sslStatus.autoRenewal ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </div>
            </div>
          </div>
        )}

        {/* SSL Certificate Expiry Warning */}
        {sslStatus.enabled && sslStatus.daysUntilExpiry <= 30 && (
          <div className={`
            mt-4 p-4 rounded-lg border-l-4 
            ${sslStatus.daysUntilExpiry <= 7 
              ? 'border-red-400 bg-red-50' 
              : 'border-yellow-400 bg-yellow-50'
            }
          `}>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${sslStatus.daysUntilExpiry <= 7 ? 'text-red-500' : 'text-yellow-500'}`} />
              <div>
                <h4 className={`font-medium ${sslStatus.daysUntilExpiry <= 7 ? 'text-red-800' : 'text-yellow-800'}`}>
                  SSL Certificate Expiring Soon
                </h4>
                <p className={`text-sm ${sslStatus.daysUntilExpiry <= 7 ? 'text-red-700' : 'text-yellow-700'}`}>
                  Your SSL certificate will expire in {sslStatus.daysUntilExpiry} days. 
                  {!sslStatus.autoRenewal && ' Please renew it manually or enable auto-renewal.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Headers */}
      <div className={`
        p-6 rounded-xl border
        ${isDarkMode 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Security Headers
        </h3>
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
                flex items-center justify-between p-3 rounded-lg border
                ${isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600' 
                  : 'bg-white border-slate-200'
                }
              `}
            >
              <div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {header.name}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {header.description}
                </div>
              </div>
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${header.status 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
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
          : 'bg-slate-50 border-slate-200'
        }
      `}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Firewall & Access Control
        </h3>
        <div className="space-y-4">
          <div className={`
            p-4 rounded-lg border
            ${isDarkMode 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-white border-slate-200'
            }
          `}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                DDoS Protection
              </h4>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                Active
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Automatic protection against distributed denial-of-service attacks
            </p>
          </div>
          
          <div className={`
            p-4 rounded-lg border
            ${isDarkMode 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-white border-slate-200'
            }
          `}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                IP Whitelist
              </h4>
              <button className={`
                text-sm font-medium
                ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}
              `}>
                Configure
              </button>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Restrict access to specific IP addresses
            </p>
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
        w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl
        ${isDarkMode 
          ? 'bg-slate-900 border-slate-700' 
          : 'bg-white border-slate-200'
        }
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-6 border-b
          ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}
        `}>
          <div>
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