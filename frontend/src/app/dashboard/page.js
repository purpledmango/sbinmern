"use client"

import { useEffect, useState } from 'react';
import { 
  Home, 
  Server, 
  Monitor, 
  Settings, 
  LogOut, 
  Plus, 
  User, 
  ChevronDown,
  Bell,
  Trash,
  RefreshCw,
  Play,
  Pause,
  ExternalLink,
  Database,
  FileText,
  Terminal,
  Shield
} from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import Spinner from '../components/Spinner';
import Link from 'next/link';

export default function DeploymentDashboard() {
    
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deployments, setDeployments] = useState([
    { 
      id: 1, 
      name: 'Blog Site', 
      domain: 'blog.example.com', 
      status: 'Running', 
      lastUpdated: '2 hours ago',
      resources: { cpu: '25%', memory: '1.2GB/2GB', storage: '5.8GB/10GB' },
      type: 'WordPress',
      version: '6.4.2'
    },
    { 
      id: 2, 
      name: 'E-commerce Store', 
      domain: 'shop.example.com', 
      status: 'Stopped', 
      lastUpdated: '3 days ago',
      resources: { cpu: '0%', memory: '0.3GB/2GB', storage: '7.2GB/10GB' },
      type: 'WordPress',
      version: '6.3.1'
    },
    { 
      id: 3, 
      name: 'Portfolio', 
      domain: 'portfolio.example.com', 
      status: 'Deploying', 
      lastUpdated: 'Just now',
      resources: { cpu: '85%', memory: '1.5GB/2GB', storage: '2.1GB/10GB' },
      type: 'WordPress',
      version: '6.4.2'
    }
  ]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showDeployForm, setShowDeployForm] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // New deployment form state
  const [deploymentName, setDeploymentName] = useState('');
  const [wpVersion, setWpVersion] = useState('6.4.2');
  const [wpConfig, setWpConfig] = useState({
    databaseName: '',
    databaseUser: '',
    databasePassword: '',
    tablePrefix: 'wp_',
    adminEmail: '',
    siteTitle: '',
    siteUrl: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem("uid");
        
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await axiosInstance.get('/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });   

        console.log('User data:', response.data);
        setUser(response.data.data.name);
        
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle error (redirect to login, show message, etc.)
      }
    };

    fetchUser();

    // Also fetch deployments when component mounts
    fetchDeployments();
  }, []);

  // Function to fetch deployments from API
  const fetchDeployments = async () => {
    try {
    const token = localStorage.getItem("token")
      const response = await axiosInstance.get('/deploy/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }});

        console.log("All deployments", response.data.deployments)
      if (response.data && response.data.deployments) {
        setDeployments(response.data.deployments);
      }
    } catch (error) {
      console.error('Error fetching deployments:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load deployments. Please try again.'
      });
    }
  };


  const handleDeploy = async (e) => {
    e.preventDefault();
  
    try {
      setIsSubmitting(true);
  
      const token = localStorage.getItem("token");
      const uid = localStorage.getItem("uid");
  
      const deploymentPayload = {
        uid,
        nodeId: "67fffe6db4a2597fb5e05d3a",
        deploymentName,
        wpConfig: {
          databaseName: wpConfig.databaseName,
          databaseUser: wpConfig.databaseUser,
          databasePassword: wpConfig.databasePassword,
          tablePrefix: wpConfig.tablePrefix,
          adminEmail: wpConfig.adminEmail,
          siteTitle: wpConfig.siteTitle,
          siteUrl: wpConfig.siteUrl,
        },
        version: wpVersion,
      };
  
      console.log("deppoyment payload", deploymentPayload)
      // Make sure token exists before making the request
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
  
      // Send the API request
      const response = await axiosInstance.post(
        "/deploy/",
        
        deploymentPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
  
      if (response.status === 201 || response.status === 200) {
        const newDeployment = {
          id: response.data.id || crypto.randomUUID(),
          nodeId: "67fffe6db4a2597fb5e05d3a",
          name: wpConfig.siteTitle,
          domain: new URL(wpConfig.siteUrl).host,
          status: "Deploying",
          lastUpdated: "Just now",
          resources: { cpu: "0%", memory: "0GB/2GB", storage: "0GB/10GB" },
          type: "WordPress",
          version: wpVersion,
        };
  
        setDeployments((prev) => [...prev, newDeployment]);
  
        // Reset form state
        setDeploymentName("");
        setWpConfig({
          databaseName: "defaultdb",
          databaseUser: "dbadmin",
          databasePassword: "dbPassword@123@321",
          tablePrefix: "wp_",
          adminEmail: "",
          siteTitle: "",
          siteUrl: "",
        });
        setWpVersion("6.4.2");
  
        setShowDeployForm(false);
  
        setNotification({
          type: "success",
          message: "WordPress deployment initiated successfully!",
        });
      }
    } catch (error) {
      console.error("Deployment error:", error);
      setNotification({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create deployment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to check deployment status
  const checkDeploymentStatus = async (deploymentId) => {
    try {
      const response = await axiosInstance.get(`/deployments/${deploymentId}`);
      return response.data.status;
    } catch (error) {
      console.error('Error checking deployment status:', error);
      return null;
    }
  };
  
  const toggleStatus = async (id) => {
    try {
      const deployment = deployments.find(d => d.id === id);
      const newStatus = deployment.status === 'Running' ? 'Stopped' : 'Running';
      
      await axiosInstance.patch(`/deployments/${id}/status`, {
        status: newStatus
      });
      
      setDeployments(deployments.map(deployment => {
        if (deployment.id === id) {
          return {
            ...deployment,
            status: newStatus,
            lastUpdated: 'Just now'
          };
        }
        return deployment;
      }));
      
      setNotification({
        type: 'success',
        message: `Deployment ${newStatus === 'Running' ? 'started' : 'stopped'} successfully`
      });
    } catch (error) {
      console.error('Error toggling deployment status:', error);
      setNotification({
        type: 'error',
        message: 'Failed to update deployment status. Please try again.'
      });
    }
  };
  
  const deleteDeployment = async (id) => {
    try {
      await axiosInstance.delete(`/deployments/${id}`);
      
      setDeployments(deployments.filter(deployment => deployment.id !== id));
      if (selectedDeployment && selectedDeployment.id === id) {
        setSelectedDeployment(null);
      }
      
      setNotification({
        type: 'success',
        message: 'Deployment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting deployment:', error);
      setNotification({
        type: 'error',
        message: 'Failed to delete deployment. Please try again.'
      });
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4 flex items-center">
          <Server className="w-6 h-6 mr-2" />
          <h1 className="text-xl font-bold">WP Control</h1>
        </div>
        
        <nav className="mt-6">
          <SidebarItem 
            active={activeTab === 'dashboard'} 
            icon={<Home className="w-5 h-5" />} 
            label="Dashboard" 
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarItem 
            active={activeTab === 'deployments'} 
            icon={<Server className="w-5 h-5" />} 
            label="Deployments" 
            onClick={() => setActiveTab('deployments')}
          />
          <SidebarItem 
            active={activeTab === 'monitoring'} 
            icon={<Monitor className="w-5 h-5" />} 
            label="Monitoring" 
            onClick={() => setActiveTab('monitoring')}
          />
          <SidebarItem 
            active={activeTab === 'databases'} 
            icon={<Database className="w-5 h-5" />} 
            label="Databases" 
            onClick={() => setActiveTab('databases')}
          />
          <SidebarItem 
            active={activeTab === 'logs'} 
            icon={<FileText className="w-5 h-5" />} 
            label="Logs" 
            onClick={() => setActiveTab('logs')}
          />
          <SidebarItem 
            active={activeTab === 'terminal'} 
            icon={<Terminal className="w-5 h-5" />} 
            label="Terminal" 
            onClick={() => setActiveTab('terminal')}
          />
          <SidebarItem 
            active={activeTab === 'security'} 
            icon={<Shield className="w-5 h-5" />} 
            label="Security" 
            onClick={() => setActiveTab('security')}
          />
          <SidebarItem 
            active={activeTab === 'settings'} 
            icon={<Settings className="w-5 h-5" />} 
            label="Settings" 
            onClick={() => setActiveTab('settings')}
          />
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 bg-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user ? user.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="ml-2">
              <span className="text-sm font-medium">{user ? user : <Spinner/>}</span>
            </div>
            <div className="ml-auto relative">
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="text-gray-400 hover:text-white"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              
              {profileMenuOpen && (
                <div className="absolute bottom-10 right-0 bg-gray-700 rounded-md shadow-lg py-1 w-48">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">Billing</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600">API Keys</a>
                  <a href="#" 
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('uid');
                      window.location.href = '/login';
                    }}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'deployments' && 'WordPress Deployments'}
                {activeTab === 'monitoring' && 'Monitoring'}
                {activeTab === 'databases' && 'Databases'}
                {activeTab === 'logs' && 'Logs'}
                {activeTab === 'terminal' && 'Terminal Access'}
                {activeTab === 'security' && 'Security'}
                {activeTab === 'settings' && 'Settings'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowDeployForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Deploy WordPress
              </button>
            </div>
          </div>
        </header>
        
        {/* Notification */}
        {notification && (
          <div className={`p-4 ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center justify-between">
              <p>{notification.message}</p>
              <button 
                onClick={() => setNotification(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
          </div>
        )}
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <Dashboard deployments={deployments} />
          )}
          
          {activeTab === 'deployments' && (
            <div className="flex space-x-6">
              <div className="w-2/3">
                <DeploymentsList 
                  deployments={deployments} 
                  toggleStatus={toggleStatus}
                  deleteDeployment={deleteDeployment}
                  setSelectedDeployment={setSelectedDeployment}
                  selectedDeployment={selectedDeployment}
                />
              </div>
              <div className="w-1/3">
                {selectedDeployment ? (
                  <DeploymentDetails deployment={selectedDeployment} />
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium">No Deployment Selected</h3>
                      <p className="mt-2">Select a deployment to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* New Deployment Modal */}
      {showDeployForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Deploy New WordPress Site</h3>
                <button 
                  onClick={() => setShowDeployForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>
              
              <form
                onSubmit={handleDeploy}
                className="flex flex-col h-full max-h-screen"
                >
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deployment Name
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="my-wordpress-prod"
                        value={deploymentName}
                        onChange={(e) => setDeploymentName(e.target.value)}
                        required
                    />
                    </div>

                    {/* ... All your input fields here ... */}
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Table Prefix
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="wp_"
                        value={wpConfig.tablePrefix}
                        onChange={(e) => setWpConfig({ ...wpConfig, tablePrefix: e.target.value })}
                        required
                    />
                    </div>
                </div>

                {/* Sticky footer */}
                <div className="sticky bottom-0 bg-white pt-4 pb-2 mt-2 flex justify-end space-x-3 border-t border-gray-200">
                    <button
                    type="button"
                    onClick={() => setShowDeployForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? (
                        <>
                        <Spinner className="w-4 h-4 mr-2" /> Deploying...
                        </>
                    ) : (
                        'Deploy'
                    )}
                    </button>
                </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 ${
        active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Dashboard({ deployments }) {
  const running = deployments.filter(d => d.status === 'Running').length;
  const stopped = deployments.filter(d => d.status === 'Stopped').length;
  const deploying = deployments.filter(d => d.status === 'Deploying').length;
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard 
          title="Active Sites" 
          value={running} 
          color="green"
          description="WordPress sites currently running" 
        />
        <DashboardCard 
          title="Stopped Sites" 
          value={stopped} 
          color="gray"
          description="WordPress sites that are inactive" 
        />
        <DashboardCard 
          title="Deploying" 
          value={deploying} 
          color="blue"
          description="Sites currently being deployed" 
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="font-medium text-gray-700">Recent Deployments</h3>
  </div>
  <div className="p-6">
    <table className="w-full">
      <thead>
        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <th className="pb-3 px-4">Name</th>
          <th className="pb-3 px-4">Domain</th>
          <th className="pb-3 px-4">Status</th>
          <th className="pb-3 px-4">Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {deployments.slice(0, 5).map((deployment) => (
          <tr key={deployment._id} className="border-t border-gray-100 hover:bg-gray-50">
            <td className="py-3 px-4">
              <Link 
                href={`/deployments/${deployment._id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {deployment.deploymentName}
              </Link>
            </td>
            <td className="py-3 px-4">
              {deployment.wpConfig?.siteUrl ? (
                <a
                  href={deployment.wpConfig.siteUrl.startsWith('http') ? 
                        deployment.wpConfig.siteUrl : 
                        `https://${deployment.wpConfig.siteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {deployment.wpConfig.siteUrl}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </td>
            <td className="py-3 px-4">
              <StatusBadge status={deployment.status} />
            </td>
            {/* <td className="py-3 px-4 text-sm text-gray-500">
              {  Date(deployment.updatedAt || deployment.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">WordPress Versions</h3>
          </div>
          <div className="p-6">
            <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-500">Version distribution chart would go here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">System Status</h3>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">CPU Usage</span>
                <span className="text-sm text-gray-500">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">Memory Usage</span>
                <span className="text-sm text-gray-500">3.2GB/8GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">Storage Usage</span>
                <span className="text-sm text-gray-500">15.1GB/50GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function DashboardCard({ title, value, description, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-800"
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClasses[color]}`}>
          {color === 'green' ? 'Healthy' : color === 'blue' ? 'In Progress' : 'Inactive'}
        </span>
      </div>
      <div className="flex items-center">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="ml-4 text-sm text-gray-500">{description}</div>
      </div>
    </div>
  );
}

function DeploymentsList({ deployments, toggleStatus, deleteDeployment, setSelectedDeployment, selectedDeployment }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">WordPress Deployments</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search deployments..."
            className="px-3 py-1 text-sm border border-gray-300 rounded-md"
          />
          <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
            <option>All Status</option>
            <option>Running</option>
            <option>Stopped</option>
            <option>Deploying</option>
          </select>
        </div>
      </div>
      <div className="p-0">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Domain</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Version</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deployments.map(deployment => (
              <tr 
                key={deployment.id} 
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedDeployment && selectedDeployment.id === deployment.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedDeployment(deployment)}
              >
                <td className="px-6 py-4">{deployment.deploymentName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{deployment.wpConfig.siteUrl    }</td>
                <td className="px-6 py-4">
                  <StatusBadge status={deployment.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">WP {deployment.version}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{deployment.lastUpdated}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(deployment.id);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title={deployment.status === 'Running' ? 'Stop' : 'Start'}
                    >
                      {deployment.status === 'Running' ? 
                        <Pause className="w-4 h-4" /> : 
                        <Play className="w-4 h-4" />
                      }
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://${deployment.wpConfig.siteUrl}`, '_blank');
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Visit Site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDeployment(deployment.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeploymentDetails({ deployment }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700">{deployment.name}</h3>
          <StatusBadge status={deployment.status} />
        </div>
        <p className="text-sm text-gray-500 mt-1">{deployment.domain}</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Type</p>
            <p className="font-medium">{deployment.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Version</p>
            <p className="font-medium">{deployment.version}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
            <p className="font-medium">{deployment.lastUpdated}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
            <p className="font-medium">April 15, 2025</p>
          </div>
        </div>
        
        {/* <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Resource Usage</h4>
          
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">CPU</span>
              <span className="text-xs text-gray-500">{deployment.resources.cpu}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: deployment.resources.cpu }}
              ></div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">Memory</span>
              <span className="text-xs text-gray-500">{deployment.resources.memory}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: parseInt(deployment.resources.memory.split('/')[0]) / 
                  parseInt(deployment.resources.memory.split('/')[1].replace('GB', '')) * 100 + '%' }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">Storage</span>
              <span className="text-xs text-gray-500">{deployment.resources.storage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: parseInt(deployment.resources.storage.split('/')[0]) / 
                  parseInt(deployment.resources.storage.split('/')[1].replace('GB', '')) * 100 + '%' }}
              ></div>
            </div>
          </div>
        </div> */}
        
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Site
          </button>
          <button className="flex items-center justify-center py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
            <Terminal className="w-4 h-4 mr-2" />
            SSH Access
          </button>
          <button className="flex items-center justify-center py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
            <Database className="w-4 h-4 mr-2" />
            Database
          </button>
          <button className="flex items-center justify-center py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
            <FileText className="w-4 h-4 mr-2" />
            Logs
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
    const statusStyles = {
      'Running': 'bg-green-100 text-green-800',
      'Stopped': 'bg-gray-100 text-gray-800',
      'Deploying': 'bg-blue-100 text-blue-800',
      'Error': 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyles[status]}`}>
        {status}
      </span>
    );
  }